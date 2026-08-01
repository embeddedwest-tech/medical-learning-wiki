"use client"

import { useCallback, useEffect, useState } from "react"
import type { Category, Entry } from "@/lib/types"
import { SEED_ENTRIES } from "@/lib/seed-data"
import {
  clearAllEntries,
  deleteEntryRemote,
  fetchAllEntries,
  replaceAllEntries,
  upsertEntryRemote,
} from "@/lib/supabase/entries"

export function useEntries() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const loadEntries = useCallback(async () => {
    setError(null)
    try {
      let data = await fetchAllEntries()
      if (data.length === 0) {
        data = await replaceAllEntries(SEED_ENTRIES)
      }
      setEntries(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "데이터를 불러오지 못했습니다.")
      setEntries([])
    } finally {
      setLoaded(true)
    }
  }, [])

  useEffect(() => {
    void loadEntries()
  }, [loadEntries])

  const upsertEntry = useCallback(async (entry: Entry) => {
    setSaving(true)
    setError(null)
    try {
      const saved = await upsertEntryRemote(entry)
      setEntries((prev) => {
        const exists = prev.some((e) => e.id === saved.id)
        if (exists) {
          return prev.map((e) => (e.id === saved.id ? saved : e))
        }
        return [saved, ...prev]
      })
      return saved
    } catch (err) {
      const message = err instanceof Error ? err.message : "저장에 실패했습니다."
      setError(message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const deleteEntry = useCallback(async (id: string) => {
    setSaving(true)
    setError(null)
    try {
      await deleteEntryRemote(id)
      setEntries((prev) => prev.filter((e) => e.id !== id))
    } catch (err) {
      const message = err instanceof Error ? err.message : "삭제에 실패했습니다."
      setError(message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const resetToSeed = useCallback(async () => {
    setSaving(true)
    setError(null)
    try {
      const data = await replaceAllEntries(SEED_ENTRIES)
      setEntries(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : "초기화에 실패했습니다."
      setError(message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const clearAll = useCallback(async () => {
    setSaving(true)
    setError(null)
    try {
      await clearAllEntries()
      setEntries([])
    } catch (err) {
      const message = err instanceof Error ? err.message : "전체 삭제에 실패했습니다."
      setError(message)
      throw err
    } finally {
      setSaving(false)
    }
  }, [])

  const byCategory = useCallback(
    (category: Category) => entries.filter((e) => e.category === category),
    [entries],
  )

  return {
    entries,
    loaded,
    error,
    saving,
    upsertEntry,
    deleteEntry,
    resetToSeed,
    clearAll,
    byCategory,
    reload: loadEntries,
    clearError: () => setError(null),
  }
}
