import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);
      const slug = searchParams.get("slug");
  
      const client = await clientPromise;
      const db = client.db("quixmade");
  
      const query = slug ? { slug: slug } : {};
      const news = await db.collection("news").find(query).toArray();
  
      return NextResponse.json(news);
    } catch (error) {
      console.error("Ошибка при получении матчей:", error);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }