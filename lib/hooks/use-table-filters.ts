"use client";

import { useState, useCallback } from "react";
import type { FilterConfig, SortConfig } from "@/lib/types";

const DEFAULT_PAGE_SIZE = 10;

export function useTableFilters(defaults?: Partial<FilterConfig>) {
  const [filters, setFilters] = useState<FilterConfig>({
    page: defaults?.page ?? 1,
    pageSize: defaults?.pageSize ?? DEFAULT_PAGE_SIZE,
    search: defaults?.search ?? "",
    role: defaults?.role,
    status: defaults?.status,
    category: defaults?.category,
    sort: defaults?.sort,
  });

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setFilters((prev) => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const setSort = useCallback((sort: SortConfig | undefined) => {
    setFilters((prev) => ({ ...prev, sort }));
  }, []);

  const setFilter = useCallback((key: keyof FilterConfig, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      pageSize: defaults?.pageSize ?? DEFAULT_PAGE_SIZE,
      search: "",
      role: undefined,
      status: undefined,
      category: undefined,
      sort: undefined,
    });
  }, [defaults?.pageSize]);

  return {
    filters,
    setSearch,
    setPage,
    setPageSize,
    setSort,
    setFilter,
    resetFilters,
  };
}
