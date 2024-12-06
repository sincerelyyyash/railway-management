import { Router } from "express";
import { verifyAdmin, verifyJWT } from "../middlewares/authMiddleware";
import { addTrain, bookSeat, getBookingDetails, getSeatAvailability } from "../controllers/train.controller";


const router = Router();

router.route("/create-train").post(verifyJWT, verifyAdmin, addTrain);

router.route("/seat-availability").get(verifyJWT, getSeatAvailability);

router.route("/book-seat").post(verifyJWT, bookSeat);

router.route("/booking-details/:bookingId").get(verifyJWT, getBookingDetails);

export default router;
