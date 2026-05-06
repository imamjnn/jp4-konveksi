/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import { IconCaretUpDown, IconCheck } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getMembers } from "@/services/member.service";

type Props = {
  onSelect: (member: { id: number; name: string }) => void;
  selected?: { id: number; name: string } | null;
};

export default function SelectMember({
  onSelect,
  selected: selectedProp,
}: Props) {
  const [open, setOpen] = React.useState(false);

  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<{
    id: number;
    name: string;
  } | null>(selectedProp ?? null);

  React.useEffect(() => {
    setSelected(selectedProp ?? null);
  }, [selectedProp]);

  // 🔥 query ke API
  const { data, isFetching } = useQuery({
    queryKey: ["members", search],
    queryFn: () => getMembers(search, 1),
    enabled: open, // hanya fetch saat dropdown dibuka
  });

  const members = data?.data || []; // sesuaikan dengan response API kamu

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selected ? selected.name : "Pilih member"}
          <IconCaretUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="min-w-md p-0">
        <Command>
          {/* 🔍 SEARCH */}
          <CommandInput
            placeholder="Cari member..."
            value={search}
            onValueChange={setSearch} // 🔥 trigger search
          />

          <CommandEmpty>
            {isFetching ? "Loading..." : "Tidak ditemukan"}
          </CommandEmpty>

          <CommandGroup>
            {members.map((member) => (
              <CommandItem
                key={member.id}
                value={member.name}
                onSelect={() => {
                  setSelected(member);
                  onSelect(member); // 🔥 callback ke parent
                  setOpen(false);
                }}
              >
                {member.name}

                <IconCheck
                  className={`ml-auto ${
                    selected?.id === member.id ? "opacity-100" : "opacity-0"
                  }`}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
