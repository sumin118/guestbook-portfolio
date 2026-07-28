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
      <p className="rounded-2xl bg-white/90 p-6 text-center text-sm text-gray-400 shadow-sm">
        아직 방명록이 없어요
      </p>
    );
  }

  return (
    <div className="-mx-5 overflow-x-auto px-5 pb-4">
      <div className="flex w-max gap-8 border-t-2 border-white/70 pt-4">
        {entries.map((entry) => (
          <GuestbookEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
