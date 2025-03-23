/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const userId = searchParams.get("userId");

  // Проверяем, что хотя бы один параметр передан
  if (!productId && !userId) {
    return NextResponse.json(
      { error: "At least one of productId or userId is required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("quixmade");

    let query: any = {};
    if (productId) {
      query.product_id = new ObjectId(productId);
    }
    if (userId) {
      query.user_id = new ObjectId(userId);
    }

    const reviews = await db.collection("reviews").find(query).toArray();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { review, stars, product_id, images } = body;

  if (!review || !stars || !product_id) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("quixmade");

    // Проверяем, есть ли уже отзыв от этого пользователя на этот товар
    const existingReview = await db.collection("reviews").findOne({
      user_id: new ObjectId(session.user.id),
      product_id: new ObjectId(product_id),
    });

    if (existingReview) {
      return NextResponse.json(
        { error: "You have already reviewed this product" },
        { status: 400 }
      );
    }

    const newReview = {
      _id: new ObjectId(),
      review,
      date: new Date().toISOString(),
      user_id: new ObjectId(session.user.id),
      stars,
      product_id: new ObjectId(product_id),
      images: images || [],
    };

    const result = await db.collection("reviews").insertOne(newReview);

    if (!result.acknowledged) {
      throw new Error("Failed to insert review");
    }

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { reviewId, review, stars, images } = body;

  if (!reviewId || !review || !stars) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("quixmade");

    const result = await db.collection("reviews").updateOne(
      {
        _id: new ObjectId(reviewId),
        user_id: new ObjectId(session.user.id),
      },
      {
        $set: {
          review,
          stars,
          images: images || [],
          date: new Date().toISOString(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Review not found or you are not authorized to edit it" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const reviewId = searchParams.get("reviewId");

  if (!reviewId) {
    return NextResponse.json(
      { error: "reviewId is required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("quixmade");
    const result = await db.collection("reviews").deleteOne({
      _id: new ObjectId(reviewId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Review not found or you are not authorized to delete it" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
