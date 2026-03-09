import { Router } from "express";
import {
  uploadVideo,
  handleVideoUpload,
  applyFilter,
  applyTransition,
  trimVideo,
  uploadToS3,
  addVideo,
} from "../controllers/videoController";

const router = Router();

router.post("/", addVideo);
router.post("/upload", uploadVideo, handleVideoUpload);
router.post("/upload-s3", uploadVideo, uploadToS3);
router.post("/filter", applyFilter);
router.post("/transition", applyTransition);
router.post("/trim", trimVideo);

export default router;