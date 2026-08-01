import type { AnatomyEntry, AnatomySubtype, Entry, HerbEntry } from "@/lib/types"
import type { EntryInsert, EntryRow } from "./database.types"
import { supabase } from "./client"

function rowToEntry(row: EntryRow): Entry {
  if (row.category === "herb") {
    const entry: HerbEntry = {
      id: row.id,
      category: "herb",
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      name: row.name,
      properties: row.properties,
      efficacy: row.efficacy,
      components: row.components,
      prescriptions: row.prescriptions,
      notes: row.notes,
    }
    if (row.image) entry.image = row.image
    return entry
  }

  const entry: AnatomyEntry = {
    id: row.id,
    category: "anatomy",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    subtype: (row.subtype ?? "muscle") as AnatomySubtype,
    name: row.name,
    location: row.location,
    innervation: row.innervation,
    function: row.function_text,
    clinical: row.clinical,
  }
  if (row.image) entry.image = row.image
  return entry
}

function entryToRow(entry: Entry): EntryInsert {
  const base: EntryInsert = {
    id: entry.id,
    category: entry.category,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt,
    name: entry.name,
    image: entry.image ?? null,
    properties: "",
    efficacy: "",
    components: "",
    prescriptions: "",
    notes: "",
    subtype: null,
    location: "",
    innervation: "",
    function_text: "",
    clinical: "",
  }

  if (entry.category === "herb") {
    return {
      ...base,
      properties: entry.properties,
      efficacy: entry.efficacy,
      components: entry.components,
      prescriptions: entry.prescriptions,
      notes: entry.notes,
    }
  }

  return {
    ...base,
    subtype: entry.subtype,
    location: entry.location,
    innervation: entry.innervation,
    function_text: entry.function,
    clinical: entry.clinical,
  }
}

function formatSupabaseError(error: { message: string; code?: string; details?: string; hint?: string }) {
  if (error.code === "PGRST205" || error.message.includes("Could not find the table")) {
    return "Supabase에 entries 테이블이 없습니다. supabase/schema.sql 파일의 SQL을 Supabase SQL Editor에서 실행해 주세요."
  }
  return error.message
}

export async function fetchAllEntries(): Promise<Entry[]> {
  const { data, error } = await supabase
    .from("entries")
    .select("*")
    .order("updated_at", { ascending: false })

  if (error) throw new Error(formatSupabaseError(error))
  return (data ?? []).map(rowToEntry)
}

export async function upsertEntryRemote(entry: Entry): Promise<Entry> {
  const { data, error } = await supabase
    .from("entries")
    .upsert(entryToRow(entry), { onConflict: "id" })
    .select("*")
    .single()

  if (error) throw new Error(formatSupabaseError(error))
  return rowToEntry(data)
}

export async function deleteEntryRemote(id: string): Promise<void> {
  const { error } = await supabase.from("entries").delete().eq("id", id)
  if (error) throw new Error(formatSupabaseError(error))
}

export async function replaceAllEntries(entries: Entry[]): Promise<Entry[]> {
  const { error: deleteError } = await supabase.from("entries").delete().neq("id", "")
  if (deleteError) throw new Error(formatSupabaseError(deleteError))

  if (entries.length === 0) return []

  const { data, error } = await supabase
    .from("entries")
    .insert(entries.map(entryToRow))
    .select("*")

  if (error) throw new Error(formatSupabaseError(error))
  return (data ?? []).map(rowToEntry)
}

export async function clearAllEntries(): Promise<void> {
  const { error } = await supabase.from("entries").delete().neq("id", "")
  if (error) throw new Error(formatSupabaseError(error))
}
