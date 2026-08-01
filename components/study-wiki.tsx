"use client"

import { useMemo, useState } from "react"
import { Leaf, Bone, Settings, Search, Plus, BookOpen, X, AlertCircle } from "lucide-react"
import type { Category, Entry, AnatomySubtype } from "@/lib/types"
import { getSearchFields, ANATOMY_SUBTYPES } from "@/lib/types"
import { useEntries } from "@/hooks/use-entries"
import { Button } from "@/components/ui/button"
import { EntryCard } from "@/components/entry-card"
import { EntryDetail } from "@/components/entry-detail"
import { EntryForm } from "@/components/entry-form"
import { SettingsView } from "@/components/settings-view"
import { Modal } from "@/components/modal"

type Tab = Category | "settings"

const TABS: { id: Tab; label: string; icon: typeof Leaf }[] = [
  { id: "herb", label: "본초학", icon: Leaf },
  { id: "anatomy", label: "해부학", icon: Bone },
  { id: "settings", label: "설정", icon: Settings },
]

/** scope = "all" searches every text field; otherwise only the given field key. */
function matchesQuery(entry: Entry, query: string, scope: string): boolean {
  if (!query) return true
  const q = query.toLowerCase()
  const searchFields = getSearchFields(entry.category)
  const fields = scope === "all" ? searchFields : searchFields.filter((f) => f.key === scope)
  return fields.some((f) => {
    const value = (entry as Record<string, unknown>)[f.key]
    return typeof value === "string" && value.toLowerCase().includes(q)
  })
}

export function StudyWiki() {
  const { loaded, error, saving, upsertEntry, deleteEntry, resetToSeed, clearAll, byCategory, clearError } =
    useEntries()

  const [tab, setTab] = useState<Tab>("herb")
  const [query, setQuery] = useState("")
  const [scope, setScope] = useState<string>("all")
  const [subtypeFilter, setSubtypeFilter] = useState<AnatomySubtype | "all">("all")
  const [detail, setDetail] = useState<Entry | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Entry | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Entry | null>(null)

  const activeCategory: Category = tab === "settings" ? "herb" : tab

  // Switching primary tab resets category-specific search scope and sub-filter.
  const switchTab = (next: Tab) => {
    setTab(next)
    setScope("all")
    setSubtypeFilter("all")
    setQuery("")
  }

  const searchFields = useMemo(() => getSearchFields(activeCategory), [activeCategory])

  const list = useMemo(() => {
    if (tab === "settings") return []
    return byCategory(tab).filter((e) => {
      if (tab === "anatomy" && subtypeFilter !== "all") {
        if ((e as { subtype: AnatomySubtype }).subtype !== subtypeFilter) return false
      }
      return matchesQuery(e, query, scope)
    })
  }, [tab, byCategory, query, scope, subtypeFilter])

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (entry: Entry) => {
    setDetail(null)
    setEditing(entry)
    setFormOpen(true)
  }

  const handleSave = async (entry: Entry) => {
    try {
      await upsertEntry(entry)
      setFormOpen(false)
      setEditing(null)
    } catch {
      // error state is handled in useEntries
    }
  }

  const confirmDelete = async () => {
    if (!pendingDelete) return
    try {
      await deleteEntry(pendingDelete.id)
      setPendingDelete(null)
      setDetail(null)
    } catch {
      // error state is handled in useEntries
    }
  }

  const isHerb = activeCategory === "herb"

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <BookOpen className="size-5" />
            </span>
            <div className="leading-tight">
              <h1 className="font-serif text-lg font-bold text-foreground">학습 위키</h1>
              <p className="text-xs text-muted-foreground">본초학 · 해부학 노트</p>
            </div>
          </div>
        </div>

        {/* Nav tabs */}
        <nav className="mx-auto max-w-5xl px-4">
          <div className="flex gap-1">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => switchTab(id)}
                  className={`-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              )
            })}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        {error ? (
          <div
            role="alert"
            className="mb-4 flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">데이터베이스 오류</p>
              <p className="mt-0.5 text-destructive/90">{error}</p>
            </div>
            <button
              type="button"
              onClick={clearError}
              className="shrink-0 rounded-md p-1 hover:bg-destructive/10"
              aria-label="오류 메시지 닫기"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : null}

        {tab === "settings" ? (
          <SettingsView
            herbCount={byCategory("herb").length}
            anatomyCount={byCategory("anatomy").length}
            saving={saving}
            onReset={resetToSeed}
            onClearAll={clearAll}
          />
        ) : (
          <>
            {/* Anatomy sub-tabs */}
            {tab === "anatomy" ? (
              <div className="mb-4 flex flex-wrap gap-2">
                <SubTab
                  label="전체"
                  active={subtypeFilter === "all"}
                  onClick={() => setSubtypeFilter("all")}
                />
                {ANATOMY_SUBTYPES.map(({ value, label, icon: Icon }) => (
                  <SubTab
                    key={value}
                    label={label}
                    icon={<Icon className="size-3.5" />}
                    active={subtypeFilter === value}
                    onClick={() => setSubtypeFilter(value)}
                  />
                ))}
              </div>
            ) : null}

            {/* Toolbar */}
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    scope === "all"
                      ? isHerb
                        ? "약재명, 효능, 처방 등 전체 검색..."
                        : "구조물명, 신경, 기능 등 전체 검색..."
                      : `${searchFields.find((f) => f.key === scope)?.label ?? ""}에서 검색...`
                  }
                  className="w-full rounded-lg border border-input bg-card py-2.5 pl-9 pr-9 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="검색어 지우기"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>
              <Button size="lg" onClick={openNew} className="shrink-0" disabled={saving}>
                <Plus />새 데이터 추가
              </Button>
            </div>

            {/* Search scope selector */}
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">검색 범위</span>
              <ScopeChip label="전체" active={scope === "all"} onClick={() => setScope("all")} />
              {searchFields.map((f) => (
                <ScopeChip
                  key={f.key}
                  label={f.label}
                  active={scope === f.key}
                  onClick={() => setScope(f.key)}
                />
              ))}
            </div>

            {/* List */}
            {!loaded ? (
              <p className="py-16 text-center text-sm text-muted-foreground">불러오는 중...</p>
            ) : list.length === 0 ? (
              <EmptyState hasQuery={!!query} isHerb={isHerb} onAdd={openNew} />
            ) : (
              <>
                <p className="mb-3 text-sm text-muted-foreground">
                  총 <span className="font-semibold text-foreground">{list.length}</span>건
                  {query
                    ? ` · ${scope === "all" ? "" : (searchFields.find((f) => f.key === scope)?.label ?? "") + " "}"${query}" 검색 결과`
                    : ""}
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((entry) => (
                    <EntryCard key={entry.id} entry={entry} onOpen={setDetail} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </main>

      {/* Detail modal */}
      <EntryDetail
        entry={detail}
        onClose={() => setDetail(null)}
        onEdit={openEdit}
        onDelete={(e) => setPendingDelete(e)}
      />

      {/* Add / edit form */}
      <EntryForm
        open={formOpen}
        category={activeCategory}
        editing={editing}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSave={handleSave}
      />

      {/* Delete confirmation */}
      <Modal
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        title={<h2 className="font-serif text-lg font-semibold text-foreground">삭제 확인</h2>}
        footer={
          <>
            <Button variant="outline" size="lg" onClick={() => setPendingDelete(null)}>
              취소
            </Button>
            <Button variant="destructive" size="lg" onClick={() => void confirmDelete()} disabled={saving}>
              삭제
            </Button>
          </>
        }
      >
        <p className="text-sm leading-relaxed text-foreground">
          <span className="font-semibold">{pendingDelete?.name}</span> 항목을 삭제하시겠습니까? 이 작업은
          되돌릴 수 없습니다.
        </p>
      </Modal>
    </div>
  )
}

function SubTab({
  label,
  icon,
  active,
  onClick,
}: {
  label: string
  icon?: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
        active
          ? "border-anatomy bg-anatomy text-anatomy-foreground"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
      aria-pressed={active}
    >
      {icon}
      {label}
    </button>
  )
}

function ScopeChip({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
        active
          ? "border-primary bg-primary/10 text-primary"
          : "border-border bg-card text-muted-foreground hover:text-foreground"
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  )
}

function EmptyState({
  hasQuery,
  isHerb,
  onAdd,
}: {
  hasQuery: boolean
  isHerb: boolean
  onAdd: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 py-16 text-center">
      <span
        className={`mb-3 inline-flex size-12 items-center justify-center rounded-2xl ${
          isHerb ? "bg-herb/12 text-herb" : "bg-anatomy/12 text-anatomy"
        }`}
      >
        {isHerb ? <Leaf className="size-6" /> : <Bone className="size-6" />}
      </span>
      {hasQuery ? (
        <>
          <p className="font-medium text-foreground">검색 결과가 없습니다</p>
          <p className="mt-1 text-sm text-muted-foreground">다른 검색어로 시도해 보세요.</p>
        </>
      ) : (
        <>
          <p className="font-medium text-foreground">아직 저장된 데이터가 없습니다</p>
          <p className="mt-1 text-sm text-muted-foreground">첫 학습 노트를 추가해 보세요.</p>
          <Button size="lg" onClick={onAdd} className="mt-4">
            <Plus />새 데이터 추가
          </Button>
        </>
      )}
    </div>
  )
}
