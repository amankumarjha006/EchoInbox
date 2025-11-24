import dbConnect from "@/lib/dbConnect";
import PostModel from "@/model/Post";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Find posts where isAcceptingMessages is true
    // Sort by createdAt descending (newest first)
    const posts = await PostModel.find({ isAcceptingMessages: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination metadata
    const totalPosts = await PostModel.countDocuments({ isAcceptingMessages: true });
    const totalPages = Math.ceil(totalPosts / limit);

    return NextResponse.json(
      {
        success: true,
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalPosts,
          hasMore: page < totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching feed:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}
