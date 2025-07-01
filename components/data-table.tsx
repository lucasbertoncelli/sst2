import type React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface DataTableProps {
  data: any[]
  columns: { key: string; label: string; render?: (value: any, row: any) => React.ReactNode }[]
}

// Helper function to get nested property value
function getNestedValue(obj: any, path: string) {
  return path.split(".").reduce((current, key) => current?.[key], obj)
}

export function DataTable({ data, columns }: DataTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => {
                const value = getNestedValue(row, column.key)
                return (
                  <TableCell key={column.key}>{column.render ? column.render(value, row) : value || "-"}</TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
