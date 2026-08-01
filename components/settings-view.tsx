"use client"

import { Database, RotateCcw, Trash2, Info } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SettingsViewProps {
  herbCount: number
  anatomyCount: number
  saving?: boolean
  onReset: () => Promise<void>
  onClearAll: () => Promise<void>
}

export function SettingsView({ herbCount, anatomyCount, saving = false, onReset, onClearAll }: SettingsViewProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Database className="size-5 text-primary" />
          <h2 className="font-serif text-lg font-semibold text-foreground">저장된 데이터</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-herb/10 p-4">
            <p className="text-sm text-muted-foreground">본초학</p>
            <p className="mt-1 font-serif text-2xl font-bold text-herb">{herbCount}건</p>
          </div>
          <div className="rounded-lg bg-anatomy/10 p-4">
            <p className="text-sm text-muted-foreground">해부학</p>
            <p className="mt-1 font-serif text-2xl font-bold text-anatomy">{anatomyCount}건</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-1 font-serif text-lg font-semibold text-foreground">데이터 관리</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          모든 데이터는 Supabase 클라우드 데이터베이스에 저장됩니다.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="outline"
            size="lg"
            onClick={() => void onReset()}
            disabled={saving}
            className="flex-1"
          >
            <RotateCcw />
            예시 데이터로 초기화
          </Button>
          <Button
            variant="destructive"
            size="lg"
            onClick={() => void onClearAll()}
            disabled={saving}
            className="flex-1"
          >
            <Trash2 />
            전체 삭제
          </Button>
        </div>
      </section>

      <section className="flex gap-3 rounded-xl border border-border bg-muted/40 p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          데이터는 Supabase DB에 영구 저장되며, 브라우저를 바꿔도 동일한 데이터를 불러올 수 있습니다. 처음
          연결 시 DB가 비어 있으면 예시 데이터가 자동으로 등록됩니다.
        </p>
      </section>
    </div>
  )
}
