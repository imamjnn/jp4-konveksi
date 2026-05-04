"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IconCalendar } from "@tabler/icons-react";
import { id } from "react-day-picker/locale";
import dayjs from "dayjs";

type Props = {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
};

export function RangeDatePicker({ value, onChange }: Props) {
  const [internal, setInternal] = React.useState<DateRange | undefined>(value);
  const [open, setOpen] = React.useState(false);

  const label =
    value?.from && value?.to
      ? `${dayjs(value.from).format("DD MMM YYYY")} - ${dayjs(value.to).format("DD MMM YYYY")}`
      : value?.from
        ? dayjs(value.from).format("DD MMM YYYY")
        : "Filter by Date";

  const handleSubmit = () => {
    onChange?.(internal);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!value?.from}
          className="w-auto justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {label}
          <IconCalendar />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={internal?.from}
          selected={internal}
          onSelect={setInternal}
          numberOfMonths={2}
          locale={id}
          disabled={{ after: new Date() }}
        />
        <div className="flex justify-end gap-2 border-t p-3">
          <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
            Batal
          </Button>
          <Button size="sm" onClick={handleSubmit}>
            Terapkan
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
