"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Row } from "@tanstack/react-table"
import { FileEntry } from "../types"

interface DatePickerWithInputProps {
  row: Row<FileEntry>
  onDateChange: (entry: FileEntry, date: Date) => void
}

export function DatePickerWithInput({ row, onDateChange }: DatePickerWithInputProps): React.ReactElement {
  const { date: timestamp } = row.original
  const [date, setDate] = React.useState<Date | undefined>(new Date(timestamp))
  const [inputValue, setInputValue] = React.useState<string>(format(new Date(timestamp), "PPP"))

  const handleDateSelect = (newDate: Date | undefined): void => {
    if (newDate) {
      setDate(newDate)
      setInputValue(format(newDate, "PPP"))
      onDateChange(row.original, newDate)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value)
    try {
      const parsedDate = new Date(e.target.value)
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate)
        onDateChange(row.original, parsedDate)
      }
    } catch (error) {
      // Ignore invalid date strings
      console.error(error);
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          initialFocus
        />
        <div className="p-2">
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="e.g., next Tuesday"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
