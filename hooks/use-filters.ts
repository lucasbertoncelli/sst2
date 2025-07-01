"use client"

import { useState, useMemo } from "react"

export function useFilters<T>(data: T[], filterConfig: Record<string, (item: T, value: string) => boolean>) {
  const [filters, setFilters] = useState<Record<string, string>>({})

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value || value === "todos") return true
        const filterFn = filterConfig[key]
        return filterFn ? filterFn(item, value) : true
      })
    })
  }, [data, filters, filterConfig])

  const updateFilter = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  return {
    filteredData,
    filters,
    updateFilter,
    clearFilters,
  }
}
