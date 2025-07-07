"use client"

import { ColumnDef } from "@tanstack/react-table"
import { FileEntry } from "../types"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

export const columns: ColumnDef<FileEntry>[] = [
    {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
  {
    accessorKey: "oldName",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Original Filename
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "newName",
    header: "New Filename",
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
        const tags: string[] = row.getValue("tags")
        return tags.join(', ')
      },
  },
  {
    accessorKey: "suffix",
    header: "Suffix",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
        const timestamp: number = row.getValue("date")
        return new Date(timestamp).toLocaleDateString()
    }
  },
]
