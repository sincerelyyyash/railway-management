import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { z } from "zod";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";

const prisma = new PrismaClient();

const createTrainSchema = z.object({
  source: z.string().min(1, "Source is required"),
  destination: z.string().min(1, "Destination is required"),
  seats: z.number().int().positive("Seats must be a positive number"),
});

const bookSeatSchema = z.object({
  trainId: z.string().min(1, "Train ID is required"),
});

export const addTrain = asyncHandler(async (req: Request, res: Response) => {
  const { source, destination, seats } = createTrainSchema.parse(req.body);

  const train = await prisma.train.create({
    data: {
      source,
      destination,
      seats,
    },
  });

  const response = new ApiResponse({
    statusCode: 201,
    data: train,
    message: "Train created sucessfully"
  });

  return res.status(response.statusCode).json(response);
});

export const getSeatAvailability = asyncHandler(async (req: Request, res: Response) => {
  const { source, destination } = req.query;

  if (!source || !destination) {
    throw new ApiError({
      statusCode: 400,
      message: "Source and destination are required"
    });
  }

  const trains = await prisma.train.findMany({
    where: {
      source: String(source),
      destination: String(destination),
    },
  });

  const response = new ApiResponse({
    statusCode: 200,
    data: trains,
    message: "Trains retrived sucessfully"
  });

  return res.status(response.statusCode).json(response);
});

export const bookSeat = asyncHandler(async (req: Request, res: Response) => {
  const { trainId } = bookSeatSchema.parse(req.body);
  const { id, email, role } = req.user!;

  const train = await prisma.train.findUnique({
    where: {
      id: Number(trainId),
    }
  });

  if (!train) {
    throw new ApiError({
      statusCode: 400,
      message: 'Train not found'
    });
  }

  if (train.seats <= train.bookedSeats) {
    throw new ApiError({
      statusCode: 400,
      message: "No available seats on this train"
    });
  }

  const result = await prisma.$transaction(async (prisma) => {
    const booking = await prisma.booking.create({
      data: {
        userId: id,
        trainId: train.id,
      },
    });

    const updatedTrain = await prisma.train.update({
      where: { id: train.id },
      data: {
        bookedSeats: train.bookedSeats + 1,
      },
    });

    return { booking, updatedTrain };
  });

  const response = new ApiResponse({
    statusCode: 201,
    data: result.booking,
    message: "Seat Booked sucessfully",
  });

  return res.status(response.statusCode).json(response);
})

export const getBookingDetails = asyncHandler(async (req: Request, res: Response) => {
  const { bookingId } = req.params;

  const booking = await prisma.booking.findUnique({
    where: {
      id: Number(bookingId)
    },
    include: {
      Train: true,
      User: true,
    },
  });

  if (!booking) {
    throw new ApiError({
      statusCode: 404,
      message: "Booking not found"
    });
  }

  const response = new ApiResponse({
    statusCode: 200,
    data: booking,
    message: "Booking details retrived sucessfully"
  });

  return res.status(response.statusCode).json(response);
})


