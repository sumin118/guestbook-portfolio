import { LikeButton } from "@/app/components/LikeButton";

type Entry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
  likes: number;
  image_url: string | null;
};

function formatDate(iso: string) {
  const date = new Date(iso);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${month}월 ${day}일 ${hours}:${minutes}`;
}

export function GuestbookList({ entries }: { entries: Entry[] }) {
  if (entries.length === 0) {
    return (
      <p className="rounded-2xl bg-white p-6 text-center text-sm text-gray-400">
        아직 방명록이 없어요
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl bg-white">
      {entries.map((entry) => (
        <div key={entry.id} className="flex flex-col gap-1 px-5 py-4">
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
          <div className="flex justify-end">
            <LikeButton id={entry.id} likes={entry.likes} />
          </div>
        </div>
      ))}
    </div>
  );
}
