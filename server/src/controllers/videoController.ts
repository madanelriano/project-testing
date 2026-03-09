import { Request, Response } from "express";
import multer from "multer";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import AWS from "aws-sdk";

// Konfigurasi Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Konfigurasi AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Fungsi untuk mengunggah video
export const uploadVideo = upload.single("video");

// Fungsi untuk menangani unggahan video lokal
export const handleVideoUpload = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(201).json({
    success: true,
    videoUrl: `/uploads/${req.file.originalname}`,
  });
};

// Fungsi untuk menerapkan filter (contoh: grayscale)
export const applyFilter = (req: Request, res: Response) => {
  const { inputPath, outputPath, filter } = req.body;

  const command = ffmpeg(inputPath);

  switch (filter) {
    case "grayscale":
      command.videoFilters({ filter: "hue", options: { s: 0 } });
      break;
    case "sepia":
      command.videoFilters({ filter: "colorchannelmixer", options: { rr: 0.393, rg: 0.769, rb: 0.189, gr: 0.349, gg: 0.686, gb: 0.168, br: 0.272, bg: 0.534, bb: 0.131 } });
      break;
    case "blur":
      command.videoFilters({ filter: "boxblur", options: { lr: 5, cr: 0 } });
      break;
    default:
      return res.status(400).json({ error: "Unsupported filter" });
  }

  command
    .output(outputPath)
    .on("end", () => {
      res.status(200).json({ success: true, outputPath });
    })
    .on("error", (err) => {
      res.status(500).json({ error: err.message });
    })
    .run();
};

// Fungsi untuk menambahkan transisi (contoh: fade in/out)
export const applyTransition = (req: Request, res: Response) => {
  const { inputPath, outputPath, transition } = req.body;

  const command = ffmpeg();

  if (transition === "fadein") {
    command.input(inputPath).complexFilter([
      { filter: "fade", options: { t: "in", st: 0, d: 2 } }
    ]);
  } else if (transition === "fadeout") {
    command.input(inputPath).complexFilter([
      { filter: "fade", options: { t: "out", st: 5, d: 2 } }
    ]);
  } else {
    return res.status(400).json({ error: "Unsupported transition" });
  }

  command
    .output(outputPath)
    .on("end", () => {
      res.status(200).json({ success: true, outputPath });
    })
    .on("error", (err) => {
      res.status(500).json({ error: err.message });
    })
    .run();
};

// Fungsi untuk memotong video
export const trimVideo = (req: Request, res: Response) => {
  const { inputPath, outputPath, start, duration } = req.body;

  ffmpeg(inputPath)
    .setStartTime(start)
    .setDuration(duration)
    .output(outputPath)
    .on("end", () => {
      res.status(200).json({ success: true, outputPath });
    })
    .on("error", (err) => {
      res.status(500).json({ error: err.message });
    })
    .run();
};

// Fungsi untuk mengunggah video ke S3
export const uploadToS3 = (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: `videos/${Date.now()}_${req.file.originalname}`,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ success: true, url: data.Location });
  });
};

// Fungsi untuk menambahkan video (legacy)
export const addVideo = (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  res.status(201).json({ success: true, url });
};