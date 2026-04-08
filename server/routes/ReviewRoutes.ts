import express from "express";
import createReviews from "../controller/Reviews/createReviews";
import getReviews from "../controller/Reviews/getReviews";
import getApprovedReviews from "../controller/Reviews/getApprovedReviews";
import editReviews from "../controller/Reviews/editRreviews";
import approveReviews from "../controller/Reviews/approveReviews";
import rejectReviews from "../controller/Reviews/rejectReviews";
import authTokenMiddleware from "../middelware/authToken";

const router = express.Router();

router.post("/reviews", createReviews);
router.get("/reviews/approved", getApprovedReviews);
router.get("/reviews", authTokenMiddleware, getReviews);
router.put("/reviews/:id", authTokenMiddleware, editReviews);
router.put("/reviews/:id/approve", authTokenMiddleware, approveReviews);
router.put("/reviews/:id/reject", authTokenMiddleware, rejectReviews);

export default router;
