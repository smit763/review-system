import riskCalculate from "../../helper/riskCalculate";
import ReviewModel from "../../model/ReviewModel";

const createReviews = async (req: any, res: any) => {
  try {
    const { productId, rating, text, author } = req.body;
    if (!productId || !rating || !text || !author) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const riskScore = riskCalculate(text);

    const newReview = new ReviewModel({
      productId,
      author: author,
      rating,
      text,
      riskScore
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default createReviews;
