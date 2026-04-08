import ReviewModel from "../../model/ReviewModel";

const getApprovedReviews = async (req: any, res: any) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const reviews = await ReviewModel.find({ status: "approved" })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalReviews = await ReviewModel.countDocuments({ status: "approved" });
    res.status(200).json({
      message: "Approved reviews fetched successfully",
      data: reviews,
      success: true,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalReviews,
      },
    });
  } catch (error) {
    console.error("Error fetching approved reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export default getApprovedReviews;
