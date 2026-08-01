"use client"

import { Leaf, Bone, ChevronRight, ImageIcon } from "lucide-react"
import type { Entry } from "@/lib/types"
import { getFields, getSubtypeMeta } from "@/lib/types"

interface EntryCardProps {
  entry: Entry
  onOpen: (entry: Entry) => void
}

export function EntryCard({ entry, onOpen }: EntryCardProps) {
  const isHerb = entry.category === "herb"
  const fields = getFields(entry.category)
  // First text body field (not title / image / select) as the card preview line.
  const previewField = fields.find((f) => !f.isTitle && f.type !== "image" && f.type !== "select")
  const previewValue = previewField
    ? ((entry as Record<string, unknown>)[previewField.key] as string)
    : ""
  const image = (entry as Record<string, unknown>).image as string | undefined
  const subtypeMeta = !isHerb ? getSubtypeMeta((entry as { subtype: never }).subtype) : null
  const SubtypeIcon = subtypeMeta?.icon

  return (
    <button
      type="button"
      onClick={() => onOpen(entry)}
      className="group flex w-full flex-col gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
    >
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg ${
            isHerb ? "bg-herb/12 text-herb" : "bg-anatomy/12 text-anatomy"
          }`}
        >
          {isHerb ? <Leaf className="size-4" /> : <Bone className="size-4" />}
        </span>
        {subtypeMeta ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-anatomy/12 px-2 py-0.5 text-xs font-medium text-anatomy">
            {SubtypeIcon ? <SubtypeIcon className="size-3" /> : null}
            {subtypeMeta.label}
          </span>
        ) : (
          <span className="rounded-full bg-herb/12 px-2 py-0.5 text-xs font-medium text-herb">본초</span>
        )}
        {image ? <ImageIcon className="size-3.5 text-muted-foreground" /> : null}
        <ChevronRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>

      {image ? (
        <div className="overflow-hidden rounded-lg border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image || "/placeholder.svg"}
            alt=""
            className="h-32 w-full object-cover"
          />
        </div>
      ) : null}

      <div className="min-w-0">
        <h3 className="font-serif text-lg font-semibold leading-snug text-balance text-foreground">
          {entry.name || "제목 없음"}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {previewValue?.trim() ? previewValue : "내용이 없습니다."}
        </p>
      </div>
    </button>
  )
}
