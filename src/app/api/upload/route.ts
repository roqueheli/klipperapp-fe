import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function POST(req: NextRequest) {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    try {
        const res = await new Promise((resolve, reject) => {
            cloudinary.uploader
                .upload_stream({ folder: "klipperapp" }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                })
                .end(buffer);
        });

        return NextResponse.json(res);
    } catch (err) {
        return NextResponse.json({ error: "Upload failed" +err }, { status: 500 });
    }
}
