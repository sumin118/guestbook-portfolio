import { GuestbookEntry } from "@/app/components/GuestbookEntry";

type Entry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
  likes: number;
  image_url: string | null;
};

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
        <GuestbookEntry key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
