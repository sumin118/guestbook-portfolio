"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

type FieldErrors = {
  name?: string;
  message?: string;
  photo?: string;
};

export type GuestbookFormState = {
  ok?: boolean;
  id?: string;
  errors?: FieldErrors;
};

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

async function uploadPhoto(photo: File): Promise<string> {
  const ext = photo.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage
    .from("guestbook-photos")
    .upload(path, photo, { contentType: photo.type });

  if (error) throw error;

  return supabase.storage.from("guestbook-photos").getPublicUrl(path).data
    .publicUrl;
}

function validate(
  name: string,
  message: string,
  photo: FormDataEntryValue | null
): { errors: FieldErrors; hasPhoto: boolean } {
  const hasPhoto = photo instanceof File && photo.size > 0;
  const errors: FieldErrors = {};

  if (!name) errors.name = "이름을 입력해주세요";
  if (!message) errors.message = "메시지를 입력해주세요";
  if (hasPhoto && (photo as File).size > MAX_PHOTO_SIZE) {
    errors.photo = "사진은 5MB 이하로 올려주세요";
  }

  return { errors, hasPhoto };
}

export async function addEntry(
  _prevState: GuestbookFormState,
  formData: FormData
): Promise<GuestbookFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const photo = formData.get("photo");

  const { errors, hasPhoto } = validate(name, message, photo);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  let image_url: string | null = null;

  if (hasPhoto) {
    try {
      image_url = await uploadPhoto(photo as File);
    } catch {
      return { errors: { photo: "사진 업로드에 실패했어요. 다시 시도해주세요." } };
    }
  }

  const { data, error } = await supabase
    .from("guestbook")
    .insert({ name, message, image_url })
    .select("id")
    .single();

  if (error) {
    return { errors: { message: "저장에 실패했어요. 다시 시도해주세요." } };
  }

  revalidatePath("/");
  return { ok: true, id: data.id };
}

export async function likeEntry(id: string) {
  await supabase.rpc("increment_likes", { row_id: id });
  revalidatePath("/");
}

export async function unlikeEntry(id: string) {
  await supabase.rpc("decrement_likes", { row_id: id });
  revalidatePath("/");
}

export async function updateEntry(
  id: string,
  _prevState: GuestbookFormState,
  formData: FormData
): Promise<GuestbookFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const photo = formData.get("photo");

  const { errors, hasPhoto } = validate(name, message, photo);
  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  let image_url: string | null = null;

  if (hasPhoto) {
    try {
      image_url = await uploadPhoto(photo as File);
    } catch {
      return { errors: { photo: "사진 업로드에 실패했어요. 다시 시도해주세요." } };
    }
  }

  const { error } = await supabase.rpc("update_entry", {
    row_id: id,
    new_name: name,
    new_message: message,
    new_image_url: image_url,
  });

  if (error) {
    return { errors: { message: "수정에 실패했어요. 다시 시도해주세요." } };
  }

  revalidatePath("/");
  return { ok: true };
}

export async function deleteEntry(id: string) {
  await supabase.rpc("delete_entry", { row_id: id });
  revalidatePath("/");
}
