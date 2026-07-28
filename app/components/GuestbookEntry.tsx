"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import {
  deleteEntry,
  updateEntry,
  type GuestbookFormState,
} from "@/app/actions";
import { LikeButton } from "@/app/components/LikeButton";
import { isMyEntry, removeMyEntry } from "@/lib/ownership";

type Entry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
  likes: number;
  image_url: string | null;
};

function formatDate(iso: string) {
  // Fixed KST (UTC+9) offset via UTC getters so server and client render
  // the same string regardless of each runtime's local timezone.
  const kst = new Date(new Date(iso).getTime() + 9 * 60 * 60 * 1000);
  const month = kst.getUTCMonth() + 1;
  const day = kst.getUTCDate();
  const hours = String(kst.getUTCHours()).padStart(2, "0");
  const minutes = String(kst.getUTCMinutes()).padStart(2, "0");
  return `${month}월 ${day}일 ${hours}:${minutes}`;
}

const initialState: GuestbookFormState = {};

export function GuestbookEntry({ entry }: { entry: Entry }) {
  const [isOwner, setIsOwner] = useState(false);
  const [editing, setEditing] = useState(false);
  const [deleting, startDeleteTransition] = useTransition();
  const updateEntryWithId = updateEntry.bind(null, entry.id);
  const [state, formAction, pending] = useActionState(
    updateEntryWithId,
    initialState
  );

  useEffect(() => {
    setIsOwner(isMyEntry(entry.id));
  }, [entry.id]);

  useEffect(() => {
    if (state.ok) setEditing(false);
  }, [state]);

  function handleDelete() {
    if (!confirm("이 방명록을 삭제할까요?")) return;
    removeMyEntry(entry.id);
    startDeleteTransition(() => deleteEntry(entry.id));
  }

  if (editing) {
    return (
      <form action={formAction} className="flex flex-col gap-2 px-5 py-4">
        <input
          name="name"
          defaultValue={entry.name}
          className="rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#1F2033] focus:outline-none focus:ring-2 focus:ring-[#1990FF]/30"
        />
        {state.errors?.name && (
          <p className="text-xs text-red-500">{state.errors.name}</p>
        )}

        <textarea
          name="message"
          defaultValue={entry.message}
          rows={3}
          className="resize-none rounded-xl border border-gray-200 px-3 py-2 text-sm text-[#1F2033] focus:outline-none focus:ring-2 focus:ring-[#1990FF]/30"
        />
        {state.errors?.message && (
          <p className="text-xs text-red-500">{state.errors.message}</p>
        )}

        <label className="w-fit cursor-pointer text-xs text-gray-400 hover:text-[#1990FF]">
          📷 사진 교체
          <input type="file" name="photo" accept="image/*" className="hidden" />
        </label>
        {state.errors?.photo && (
          <p className="text-xs text-red-500">{state.errors.photo}</p>
        )}

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-[#1990FF] px-3 py-1.5 text-xs font-bold text-white disabled:opacity-60"
          >
            {pending ? "저장 중..." : "저장"}
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-500"
          >
            취소
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-1 px-5 py-4">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-bold text-[#1F2033]">{entry.name}</span>
        <span className="shrink-0 text-xs text-gray-400">
          {formatDate(entry.created_at)}
        </span>
      </div>
      <p className="text-sm text-[#1F2033]/80">{entry.message}</p>
      {entry.image_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entry.image_url}
          alt=""
          className="mt-1 max-h-64 w-full rounded-xl object-cover"
        />
      )}
      <div className="flex items-center justify-between gap-3 pt-1">
        {isOwner ? (
          <div className="flex gap-3 text-xs text-gray-400">
            <button
              onClick={() => setEditing(true)}
              className="hover:text-[#1990FF]"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="hover:text-red-500 disabled:opacity-50"
            >
              삭제
            </button>
          </div>
        ) : (
          <span />
        )}
        <LikeButton id={entry.id} likes={entry.likes} />
      </div>
    </div>
  );
}
