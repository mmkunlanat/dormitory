import { NextRequest, NextResponse } from "next/server";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import { DATABASE_URL } from "@/lib/env";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  let client: MongoClient | null = null;

  try {
    const fileId = params.id;

    // Validate ObjectId
    if (!ObjectId.isValid(fileId)) {
      return NextResponse.json({ error: "Invalid file ID" }, { status: 400 });
    }

    // Connect to MongoDB
    client = new MongoClient(DATABASE_URL!);
    await client.connect();
    const db = client.db();
    const bucket = new GridFSBucket(db, { bucketName: "payment-slips" });

    // Find the file
    const files = await bucket
      .find({ _id: new ObjectId(fileId) })
      .toArray();

    if (files.length === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const file = files[0];
    const readStream = bucket.openDownloadStream(new ObjectId(fileId));

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    
    for await (const chunk of readStream) {
      chunks.push(chunk);
    }

    const buffer = Buffer.concat(chunks);

    // Return the file with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.metadata?.contentType || "application/octet-stream",
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
      },
    });
  } catch (error: any) {
    console.error("Error serving file:", error);
    return NextResponse.json(
      { error: "Failed to serve file" },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
}