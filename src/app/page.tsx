"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main>
        <div className="flex flex-col gap-4 items-center justify-center">
          <h1 className="text-2xl font-bold">JP4 Konveksi</h1>
          <Button onClick={() => router.push("/login")}>Login</Button>
        </div>
      </main>
    </div>
  );
}
