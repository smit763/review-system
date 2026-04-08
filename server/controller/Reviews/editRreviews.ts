import riskCalculate from "../../helper/riskCalculate";
import ReviewModel from "../../model/ReviewModel";

const editReviews = async (req: any, res: any) => {
  try {
    const { text, rating } = req.body;
    const reviewId = req.params.id;

    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    let reviewScore = review.riskScore;
    if (text && text !== review.text) {
      reviewScore = riskCalculate(text);
    }

    const updatedReview = await ReviewModel.findByIdAndUpdate(
      reviewId,
      {
        text: text || review.text,
        rating: rating || review.rating,
        riskScore: reviewScore
      },
      { new: true }
    );

    res.status(200).json({
      message: "Review updated successfully",
      data: updatedReview,
      success: true
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export default editReviews;
