"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addEntry, type GuestbookFormState } from "@/app/actions";

const initialState: GuestbookFormState = {};

export function GuestbookForm() {
  const [state, formAction, pending] = useActionState(addEntry, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      setPreview(null);
    }
  }, [state]);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm"
    >
      <div className="flex flex-col gap-1">
        <input
          name="name"
          placeholder="이름"
          className="rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1F2033] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1990FF]/30"
        />
        {state.errors?.name && (
          <p className="px-1 text-xs text-red-500">{state.errors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <textarea
          name="message"
          placeholder="메시지를 남겨주세요"
          rows={4}
          className="resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#1F2033] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1990FF]/30"
        />
        {state.errors?.message && (
          <p className="px-1 text-xs text-red-500">{state.errors.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <label className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-500 transition-colors hover:border-[#1990FF] hover:text-[#1990FF]">
            <span>📷 사진 추가</span>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="첨부한 사진 미리보기"
              className="h-12 w-12 rounded-lg object-cover"
            />
          )}
        </div>
        {state.errors?.photo && (
          <p className="px-1 text-xs text-red-500">{state.errors.photo}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-[#1990FF] py-3 text-sm font-bold text-white transition-opacity disabled:opacity-60"
      >
        {pending ? "남기는 중..." : "남기기"}
      </button>
    </form>
  );
}
