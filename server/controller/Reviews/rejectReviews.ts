import ReviewModel from "../../model/ReviewModel";

const rejectReviews = async (req: any, res: any) => {
  try {
    const reviewId = req.params.id;
    const { reason } = req.body;
    
    const review = await ReviewModel.findByIdAndUpdate(
      reviewId,
      {
        status: "rejected",
        moderatorReason: reason || ""
      },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({
      message: "Review rejected successfully",
      data: review,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default rejectReviews;
