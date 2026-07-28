"use client";

import { useEffect, useState, useTransition } from "react";
import { likeEntry, unlikeEntry } from "@/app/actions";

const STORAGE_KEY = "guestbook-liked-ids";

function getLikedIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

function saveLikedIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function LikeButton({ id, likes }: { id: string; likes: number }) {
  const [liked, setLiked] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setLiked(getLikedIds().has(id));
  }, [id]);

  function toggle() {
    const nextLiked = !liked;
    setLiked(nextLiked);

    const ids = getLikedIds();
    if (nextLiked) {
      ids.add(id);
    } else {
      ids.delete(id);
    }
    saveLikedIds(ids);

    startTransition(() => (nextLiked ? likeEntry(id) : unlikeEntry(id)));
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className={`flex items-center gap-1 text-xs transition-colors disabled:opacity-50 ${
        liked ? "text-[#1990FF]" : "text-gray-400 hover:text-[#1990FF]"
      }`}
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span>{likes}</span>
    </button>
  );
}
