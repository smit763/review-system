import config from "../../config/config";
import UserModel from "../../model/UserModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const loginAdmin = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ foo: "bar" }, config.JWT_SECRET);

    res.status(200).json({ message: "Login successful", success: true, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default loginAdmin;
