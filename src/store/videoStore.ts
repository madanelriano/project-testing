import { create } from "zustand";

type VideoStore = {
  videos: string[];
  addVideo: (url: string) => void;
};

export const useVideoStore = create<VideoStore>((set) => ({
  videos: [],
  addVideo: (url) => set((state) => ({ videos: [...state.videos, url] })),
}));