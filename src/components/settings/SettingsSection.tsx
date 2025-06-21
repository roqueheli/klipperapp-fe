"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { ReactNode, useState } from "react";

interface Props {
  title: string;
  children: ReactNode;
}

export default function SettingsSection({ title, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-[--electric-blue] rounded-xl mb-4">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center bg-[--cyber-gray] hover:bg-[--menu-hover-bg] text-[--electric-blue] font-bold px-6 py-4 rounded-t-xl text-lg transition-all"
      >
        {title}
        {open ? <ChevronUp /> : <ChevronDown />}
      </button>
      {open && <div className="bg-[--background]">{children}</div>}
    </div>
  );
}
