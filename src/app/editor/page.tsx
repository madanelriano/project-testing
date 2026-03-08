"use client";
import { useState } from "react";
import { useVideoStore } from "@/store/videoStore";

export default function Editor() {
  const [videoUrl, setVideoUrl] = useState("");
  const { addVideo } = useVideoStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addVideo(videoUrl);
    setVideoUrl("");
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Video Editor</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Enter video URL"
          className="border p-2 mr-2"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Add Video
        </button>
      </form>
    </div>
  );
}