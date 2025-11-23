import { NextResponse } from "next/server";
import formidable from "formidable";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { runOcrOnLocalFile } from "@/lib/ocr";

export const runtime = "edge" // or 'nodejs' depending on libs (formidable requires nodejs)

export async function POST(req: Request) {
  // NOTE: In App Router edge environment may not support formidable.
  // Implementation below assumes Node runtime and Next.js route.
  const form = new formidable.IncomingForm();
  const promise: Promise<any> = new Promise((resolve, reject) => {
    form.parse(req as any, async (err, fields, files) => {
      if (err) return reject(err);
      const file = files.file as any;
      const localPath = file.filepath || file.path;
      // upload to cloudinary
      const result = await cloudinary.uploader.upload(localPath, { folder: "slips" });
      // run OCR
      const ocrText = await runOcrOnLocalFile(localPath);
      // cleanup local file if needed
      fs.unlinkSync(localPath);
      resolve({ url: result.secure_url, ocrText });
    });
  });

  const data = await promise;
  return NextResponse.json(data);
}
