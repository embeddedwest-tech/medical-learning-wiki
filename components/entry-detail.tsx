"use client"

import { Leaf, Bone, Pencil, Trash2 } from "lucide-react"
import type { Entry } from "@/lib/types"
import { getFields, getSubtypeMeta } from "@/lib/types"
import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"

interface EntryDetailProps {
  entry: Entry | null
  onClose: () => void
  onEdit: (entry: Entry) => void
  onDelete: (entry: Entry) => void
}

export function EntryDetail({ entry, onClose, onEdit, onDelete }: EntryDetailProps) {
  if (!entry) return null
  const isHerb = entry.category === "herb"
  const fields = getFields(entry.category)
  const subtypeMeta = !isHerb ? getSubtypeMeta((entry as { subtype: never }).subtype) : null
  const SubtypeIcon = subtypeMeta?.icon
  const image = (entry as Record<string, unknown>).image as string | undefined
  // Text rows: exclude title, image, and select (subtype) — those render specially.
  const bodyFields = fields.filter((f) => !f.isTitle && f.type !== "image" && f.type !== "select")

  return (
    <Modal
      open={!!entry}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex size-9 shrink-0 items-center justify-center rounded-lg ${
              isHerb ? "bg-herb/12 text-herb" : "bg-anatomy/12 text-anatomy"
            }`}
          >
            {isHerb ? <Leaf className="size-5" /> : <Bone className="size-5" />}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-xs font-medium text-muted-foreground">{isHerb ? "본초학" : "해부학"}</p>
              {subtypeMeta ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-anatomy/12 px-2 py-0.5 text-xs font-medium text-anatomy">
                  {SubtypeIcon ? <SubtypeIcon className="size-3" /> : null}
                  {subtypeMeta.label}
                </span>
              ) : null}
            </div>
            <h2 className="truncate font-serif text-xl font-semibold text-foreground">{entry.name}</h2>
          </div>
        </div>
      }
      footer={
        <>
          <Button variant="destructive" size="lg" onClick={() => onDelete(entry)}>
            <Trash2 />
            삭제
          </Button>
          <Button variant="default" size="lg" onClick={() => onEdit(entry)}>
            <Pencil />
            수정
          </Button>
        </>
      }
    >
      {image ? (
        <div className="mb-5 overflow-hidden rounded-lg border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image || "/placeholder.svg"}
            alt={`${entry.name} 첨부 사진`}
            className="max-h-96 w-full object-contain"
          />
        </div>
      ) : null}
      <dl className="space-y-5">
        {bodyFields.map((field) => {
          const value = (entry as Record<string, unknown>)[field.key] as string
          return (
            <div key={field.key} className="border-b border-border/60 pb-5 last:border-none last:pb-0">
              <dt
                className={`mb-1.5 text-sm font-semibold ${isHerb ? "text-herb" : "text-anatomy"}`}
              >
                {field.label}
              </dt>
              <dd className="whitespace-pre-wrap text-[0.95rem] leading-relaxed text-foreground">
                {value?.trim() ? value : <span className="text-muted-foreground">—</span>}
              </dd>
            </div>
          )
        })}
      </dl>
    </Modal>
  )
}
