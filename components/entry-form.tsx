"use client"

import { useEffect, useRef, useState } from "react"
import { Leaf, Bone, ImagePlus, X, Loader2 } from "lucide-react"
import type { Category, Entry, FieldDef } from "@/lib/types"
import { getFields, ANATOMY_SUBTYPES } from "@/lib/types"
import { fileToResizedDataUrl } from "@/lib/image"
import { Modal } from "@/components/modal"
import { Button } from "@/components/ui/button"

interface EntryFormProps {
  open: boolean
  category: Category
  /** When editing, the entry being edited. Null for a new entry. */
  editing: Entry | null
  onClose: () => void
  onSave: (entry: Entry) => void | Promise<void>
}

function buildInitialValues(category: Category, editing: Entry | null): Record<string, string> {
  const fields = getFields(category)
  const values: Record<string, string> = {}
  for (const f of fields) {
    const existing = editing ? ((editing as Record<string, unknown>)[f.key] as string) : undefined
    if (existing != null && existing !== "") {
      values[f.key] = existing
    } else if (f.type === "select" && f.options?.length) {
      // Default a select to its first option (e.g. anatomy subtype -> 근육).
      values[f.key] = f.options[0].value
    } else {
      values[f.key] = ""
    }
  }
  return values
}

export function EntryForm({ open, category, editing, onClose, onSave }: EntryFormProps) {
  const activeCategory = editing?.category ?? category
  const fields = getFields(activeCategory)
  const titleField = fields.find((f) => f.isTitle)!

  const [values, setValues] = useState<Record<string, string>>(() =>
    buildInitialValues(activeCategory, editing),
  )
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setValues(buildInitialValues(activeCategory, editing))
      setUploading(false)
    }
  }, [open, activeCategory, editing])

  const handleImageChange = async (key: string, file: File | undefined) => {
    if (!file) return
    setUploading(true)
    try {
      const dataUrl = await fileToResizedDataUrl(file)
      setValues((v) => ({ ...v, [key]: dataUrl }))
    } catch {
      // ignore decode/resize failures
    } finally {
      setUploading(false)
    }
  }

  const isHerb = activeCategory === "herb"
  const canSave = values[titleField.key]?.trim().length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSave) return
    const now = Date.now()
    const base = {
      ...values,
      id: editing?.id ?? `${activeCategory}-${now}-${Math.random().toString(36).slice(2, 7)}`,
      category: activeCategory,
      createdAt: editing?.createdAt ?? now,
      updatedAt: now,
    }
    onSave(base as unknown as Entry)
  }

  const inputClass =
    "w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"

  function renderField(field: FieldDef) {
    const value = values[field.key] ?? ""

    if (field.type === "image") {
      return (
        <div className="space-y-2">
          {value ? (
            <div className="relative overflow-hidden rounded-lg border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value || "/placeholder.svg"} alt="첨부 사진 미리보기" className="max-h-64 w-full object-contain bg-muted" />
              <button
                type="button"
                onClick={() => setValues((v) => ({ ...v, [field.key]: "" }))}
                className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-foreground shadow hover:bg-background"
              >
                <X className="size-3.5" />
                제거
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/40 px-3 py-8 text-sm text-muted-foreground transition-colors hover:border-ring hover:text-foreground disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 className="size-6 animate-spin" />
                  이미지 처리 중...
                </>
              ) : (
                <>
                  <ImagePlus className="size-6" />
                  클릭하여 사진 업로드
                  <span className="text-xs">해부 도해, 약재 사진 등 (자동으로 크기 최적화)</span>
                </>
              )}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              void handleImageChange(field.key, e.target.files?.[0])
              e.target.value = ""
            }}
          />
        </div>
      )
    }

    if (field.type === "select") {
      return (
        <div className="flex flex-wrap gap-2">
          {(field.options ?? []).map((opt) => {
            const meta = ANATOMY_SUBTYPES.find((s) => s.value === opt.value)
            const Icon = meta?.icon
            const selected = value === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValues((v) => ({ ...v, [field.key]: opt.value }))}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                  selected
                    ? "border-anatomy bg-anatomy/12 text-anatomy"
                    : "border-input text-muted-foreground hover:text-foreground"
                }`}
                aria-pressed={selected}
              >
                {Icon ? <Icon className="size-4" /> : null}
                {opt.label}
              </button>
            )
          })}
        </div>
      )
    }

    if (field.isTitle) {
      return (
        <input
          id={field.key}
          value={value}
          onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
          placeholder={field.placeholder}
          className={inputClass}
        />
      )
    }

    return (
      <textarea
        id={field.key}
        value={value}
        onChange={(e) => setValues((v) => ({ ...v, [field.key]: e.target.value }))}
        placeholder={field.placeholder}
        rows={3}
        className={`${inputClass} resize-y leading-relaxed`}
      />
    )
  }

  return (
    <Modal
      open={open}
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
          <div>
            <p className="text-xs font-medium text-muted-foreground">{isHerb ? "본초학" : "해부학"}</p>
            <h2 className="font-serif text-xl font-semibold text-foreground">
              {editing ? "데이터 수정" : "새 데이터 추가"}
            </h2>
          </div>
        </div>
      }
      footer={
        <>
          <Button variant="outline" size="lg" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" form="entry-form" size="lg" disabled={!canSave}>
            {editing ? "저장" : "추가"}
          </Button>
        </>
      }
    >
      <form id="entry-form" onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label htmlFor={field.key} className="block text-sm font-medium text-foreground">
              {field.label}
              {field.isTitle ? <span className="ml-1 text-destructive">*</span> : null}
            </label>
            {renderField(field)}
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          줄바꿈은 그대로 저장되어 상세 보기에서 동일하게 표시됩니다.
        </p>
      </form>
    </Modal>
  )
}
