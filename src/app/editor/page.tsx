"use client";
import { useState, ChangeEvent } from "react";
import { useVideoStore } from "../../store/videoStore";
import { api } from "../../lib/api";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../components/ui/dropdown-menu";
import { Slider } from "../../components/ui/slider";

export default function Editor() {
  const [videoUrl, setVideoUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filter, setFilter] = useState("");
  const [transition, setTransition] = useState("");
  const [trimStart, setTrimStart] = useState(0);
  const [trimDuration, setTrimDuration] = useState(10);
  const { addVideo } = useVideoStore();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await api.post("/videos/upload-s3", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setVideoUrl(response.data.url);
      addVideo(response.data.url);
      alert("Video uploaded to S3 successfully!");
    } catch (error) {
      alert("Upload failed");
    }
  };

  const handleApplyFilter = async () => {
    if (!videoUrl || !filter) return;

    try {
      const response = await api.post("/videos/filter", {
        inputPath: videoUrl,
        outputPath: "uploads/filtered-video.mp4",
        filter,
      });
      setVideoUrl(response.data.outputPath);
      alert(`Filter applied: ${filter}`);
    } catch (error) {
      alert("Failed to apply filter");
    }
  };

  const handleApplyTransition = async () => {
    if (!videoUrl || !transition) return;

    try {
      const response = await api.post("/videos/transition", {
        inputPath: videoUrl,
        outputPath: "uploads/transition-video.mp4",
        transition,
      });
      setVideoUrl(response.data.outputPath);
      alert(`Transition applied: ${transition}`);
    } catch (error) {
      alert("Failed to apply transition");
    }
  };

  const handleTrim = async () => {
    if (!videoUrl) return;

    try {
      const response = await api.post("/videos/trim", {
        inputPath: videoUrl,
        outputPath: "uploads/trimmed-video.mp4",
        start: trimStart,
        duration: trimDuration,
      });
      setVideoUrl(response.data.outputPath);
      alert(`Video trimmed from ${trimStart}s for ${trimDuration}s`);
    } catch (error) {
      alert("Trimming failed");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Video Editor</h1>

      {/* Upload Section */}
      <div className="mb-4">
        <input type="file" onChange={handleFileChange} accept="video/*" className="mb-2" />
        <Button onClick={handleUpload}>Upload to S3</Button>
      </div>

      {/* Filter Section */}
      <div className="mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Apply Filter</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilter("grayscale")}>Grayscale</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("sepia")}>Sepia</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilter("blur")}>Blur</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleApplyFilter} className="ml-2">
          Apply
        </Button>
      </div>

      {/* Transition Section */}
      <div className="mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Apply Transition</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setTransition("fadein")}>Fade In</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTransition("fadeout")}>Fade Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={handleApplyTransition} className="ml-2">
          Apply
        </Button>
      </div>

      {/* Trim Section */}
      <div className="mb-4">
        <div className="mb-2">
          <label>Start Time (s): {trimStart}</label>
          <Slider
            value={[trimStart]}
            onValueChange={(value) => setTrimStart(value[0])}
            max={100}
            step={1}
          />
        </div>
        <div className="mb-2">
          <label>Duration (s): {trimDuration}</label>
          <Slider
            value={[trimDuration]}
            onValueChange={(value) => setTrimDuration(value[0])}
            max={100}
            step={1}
          />
        </div>
        <Button onClick={handleTrim}>Trim Video</Button>
      </div>

      {/* Preview Section */}
      <div className="mt-4">
        {videoUrl && (
          <video controls width="500" src={videoUrl} className="mt-2" />
        )}
      </div>
    </div>
  );
}