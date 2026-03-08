import { Request, Response } from "express";

export const addVideo = (req: Request, res: Response) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  res.status(201).json({ success: true, url });
};