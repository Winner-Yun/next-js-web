"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { useSidebar } from "@/components/ui/sidebar";
import { useKeypress } from "@/hooks/use-keypress";
import { SearchIcon } from "lucide-react";
import { useRef } from "react";

interface AppSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function AppSearch({ value, onChange }: AppSearchProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const { setOpen } = useSidebar();

  useKeypress({
    combo: ["meta+k", "ctrl+k", "k", "K"], // Added standard "k" keypress
    callback: (e) => {
      e?.preventDefault(); // Prevent typing 'k' into the input field immediately
      const input = groupRef.current?.querySelector<HTMLInputElement>(
        "[data-slot=input-group-control]",
      );
      input?.focus({ preventScroll: true });
      setOpen(true);
    },
  });

  return (
    <InputGroup ref={groupRef}>
      <InputGroupAddon align="inline-start" className="pl-1.75">
        <SearchIcon />
      </InputGroupAddon>
      <InputGroupInput
        aria-label="Search"
        name="q"
        placeholder="Search..."
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <InputGroupAddon align="inline-end">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </InputGroupAddon>
    </InputGroup>
  );
}
