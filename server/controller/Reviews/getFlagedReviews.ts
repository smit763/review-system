import ReviewModel from "../../model/ReviewModel";

const getFlaggedReviews = async (req: any, res: any) => {
  try {
    const { score_gt } = req.query;
    const flaggedReviews = await ReviewModel.find({
      riskScore: { $gt: score_gt }
    });
    res.status(200).json({
      message: "Flagged reviews retrieved successfully",
      data: flaggedReviews,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default getFlaggedReviews;
