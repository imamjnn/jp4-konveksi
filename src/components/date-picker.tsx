"use client";

import * as React from "react";
import { format } from "date-fns";

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
  defaultDate?: Date;
  onDateChange?: (date: Date) => void;
};

export function DatePicker({ defaultDate, onDateChange }: Props) {
  const [date, setDate] = React.useState<Date | undefined>(defaultDate);

  React.useEffect(() => {
    if (date && onDateChange) {
      onDateChange(date);
    }
  }, [date, onDateChange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!date}
          className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? dayjs(date).format("DD MMM YYYY") : <span>Pick a date</span>}
          <IconCalendar />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={date}
          locale={id}
          disabled={{ after: new Date() }}
        />
      </PopoverContent>
    </Popover>
  );
}
