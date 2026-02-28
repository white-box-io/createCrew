"use client";

import { motion } from "framer-motion";
import { Play, Eye, Calendar } from "lucide-react";

interface Video {
  id: string;
  title: string;
  views: string;
  publishedAt: string;
  thumbnailColor: string;
  duration: string;
}

interface CreatorContentProps {
  videos: Video[];
  instagramPosts?: { id: string; color: string; likes: string }[];
}

export default function CreatorContent({ videos, instagramPosts }: CreatorContentProps) {
  return (
    <div className="space-y-10">
      {/* YouTube Videos */}
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Play className="h-4 w-4 text-red-500" />
          <h3 className="text-sm font-bold text-brand-dark">YouTube Videos</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="group cursor-pointer"
            >
              {/* Thumbnail placeholder */}
              <div
                className="relative mb-2.5 aspect-video rounded-lg"
                style={{ backgroundColor: video.thumbnailColor }}
              >
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90">
                    <Play className="h-4 w-4 text-brand-dark ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  {video.duration}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-brand-dark leading-snug line-clamp-2">
                {video.title}
              </h4>
              <div className="mt-1 flex items-center gap-3 text-[10px] text-brand-gray-light">
                <span className="flex items-center gap-0.5">
                  <Eye className="h-3 w-3" />
                  {video.views} views
                </span>
                <span className="flex items-center gap-0.5">
                  <Calendar className="h-3 w-3" />
                  {video.publishedAt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Instagram Posts */}
      {instagramPosts && instagramPosts.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-sm">📸</span>
            <h3 className="text-sm font-bold text-brand-dark">Instagram Posts</h3>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {instagramPosts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                className="group relative aspect-square cursor-pointer rounded-lg"
                style={{ backgroundColor: post.color }}
              >
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/20 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="text-xs font-semibold text-white">❤️ {post.likes}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
