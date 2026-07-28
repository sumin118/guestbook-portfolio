"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

export type GuestbookFormState = {
  ok?: boolean;
  errors?: {
    name?: string;
    message?: string;
    photo?: string;
  };
};

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

export async function addEntry(
  _prevState: GuestbookFormState,
  formData: FormData
): Promise<GuestbookFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const photo = formData.get("photo");
  const hasPhoto = photo instanceof File && photo.size > 0;

  const errors: GuestbookFormState["errors"] = {};
  if (!name) errors.name = "이름을 입력해주세요";
  if (!message) errors.message = "메시지를 입력해주세요";
  if (hasPhoto && photo.size > MAX_PHOTO_SIZE) {
    errors.photo = "사진은 5MB 이하로 올려주세요";
  }

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  let image_url: string | null = null;

  if (hasPhoto) {
    const ext = photo.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("guestbook-photos")
      .upload(path, photo, { contentType: photo.type });

    if (uploadError) {
      return { errors: { photo: "사진 업로드에 실패했어요. 다시 시도해주세요." } };
    }

    image_url = supabase.storage.from("guestbook-photos").getPublicUrl(path)
      .data.publicUrl;
  }

  const { error } = await supabase
    .from("guestbook")
    .insert({ name, message, image_url });

  if (error) {
    return { errors: { message: "저장에 실패했어요. 다시 시도해주세요." } };
  }

  revalidatePath("/");
  return { ok: true };
}

export async function likeEntry(id: string) {
  await supabase.rpc("increment_likes", { row_id: id });
  revalidatePath("/");
}

export async function unlikeEntry(id: string) {
  await supabase.rpc("decrement_likes", { row_id: id });
  revalidatePath("/");
}
