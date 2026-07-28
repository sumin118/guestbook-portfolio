import { supabase } from "@/lib/supabase";
import { GuestbookForm } from "@/app/components/GuestbookForm";
import { GuestbookList } from "@/app/components/GuestbookList";
import { MailboxIllustration } from "@/app/components/MailboxIllustration";
import { SeaBackground } from "@/app/components/SeaBackground";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: entries } = await supabase
    .from("guestbook")
    .select("id, name, message, created_at, likes, image_url")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen px-5 py-10">
      <SeaBackground />
      <div className="relative mx-auto flex max-w-md flex-col gap-6">
        <header className="flex flex-col items-center gap-1 text-center">
          <MailboxIllustration />
          <h1 className="text-xl font-bold text-[#1F2033]">나의 방명록</h1>
          <p className="text-sm text-gray-400">10초 안에 흔적을 남겨주세요</p>
        </header>

        <GuestbookForm />

        <GuestbookList entries={entries ?? []} />
      </div>
    </div>
  );
}
