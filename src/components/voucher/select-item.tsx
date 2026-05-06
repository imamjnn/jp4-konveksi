/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconCaretUpDown, IconCheck } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "@/services/item.service";

type Props = {
  onSelect: (item: { id: number; name: string; currentStock: number }) => void;
  selected?: { id: number; name: string } | null;
};

export default function SelectItem({
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

  const { data, isFetching } = useQuery({
    queryKey: ["items", search],
    queryFn: () => getItems(search, 1),
    enabled: open,
  });

  const items = data?.data ?? [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selected ? selected.name : "Pilih item"}
          <IconCaretUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="min-w-sm p-0">
        <Command>
          <CommandInput
            placeholder="Cari item..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>
            {isFetching ? "Loading..." : "Tidak ditemukan"}
          </CommandEmpty>
          <CommandGroup>
            {items.map((item) => (
              <CommandItem
                key={item.id}
                value={item.name}
                onSelect={() => {
                  setSelected(item);
                  onSelect(item);
                  setOpen(false);
                }}
              >
                <span className="flex-1">{item.name}</span>
                <span
                  className={`text-xs mr-2 ${
                    item.currentStock === 0
                      ? "text-red-500"
                      : item.currentStock <= 5
                        ? "text-yellow-500"
                        : "text-muted-foreground"
                  }`}
                >
                  Stok: {item.currentStock}
                </span>
                <IconCheck
                  className={`ml-auto ${
                    selected?.id === item.id ? "opacity-100" : "opacity-0"
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
