import type { LucideIcon } from "lucide-react"
import { Dumbbell, Zap, Bone, HeartPulse } from "lucide-react"

export type Category = "herb" | "anatomy"

/** Anatomy sub-classifications shown as secondary tabs. */
export type AnatomySubtype = "muscle" | "nerve" | "bone" | "vessel"

export const ANATOMY_SUBTYPES: { value: AnatomySubtype; label: string; icon: LucideIcon }[] = [
  { value: "muscle", label: "근육", icon: Dumbbell },
  { value: "nerve", label: "신경", icon: Zap },
  { value: "bone", label: "뼈", icon: Bone },
  { value: "vessel", label: "혈관", icon: HeartPulse },
]

export function getSubtypeMeta(subtype: AnatomySubtype) {
  return ANATOMY_SUBTYPES.find((s) => s.value === subtype) ?? ANATOMY_SUBTYPES[0]
}

export interface HerbEntry {
  id: string
  category: "herb"
  createdAt: number
  updatedAt: number
  /** 약재명 */
  name: string
  /** 성미 및 귀경 */
  properties: string
  /** 효능주치 */
  efficacy: string
  /** 주요성분 */
  components: string
  /** 대표처방 */
  prescriptions: string
  /** 메모/기타 */
  notes: string
  /** 첨부 사진 (data URL) */
  image?: string
}

export interface AnatomyEntry {
  id: string
  category: "anatomy"
  createdAt: number
  updatedAt: number
  /** 세부 분류 */
  subtype: AnatomySubtype
  /** 구조물명 */
  name: string
  /** 위치 / 기시·종지 */
  location: string
  /** 신경 지배 */
  innervation: string
  /** 주요 기능 */
  function: string
  /** 임상적 의의 */
  clinical: string
  /** 첨부 사진 (data URL) */
  image?: string
}

export type Entry = HerbEntry | AnatomyEntry

export type FieldType = "input" | "textarea" | "image" | "select"

/** A single field descriptor used to render forms and detail views generically. */
export interface FieldDef {
  key: string
  label: string
  placeholder?: string
  /** Whether this field is the primary title of the entry. */
  isTitle?: boolean
  /** Rendering type. Defaults: title -> input, others -> textarea. */
  type?: FieldType
  /** Options for select fields. */
  options?: { value: string; label: string }[]
  /** Whether this field can be used as a search scope. Defaults to true for text fields. */
  searchable?: boolean
}

export const HERB_FIELDS: FieldDef[] = [
  { key: "name", label: "약재명", placeholder: "예: 인삼 (人蔘)", isTitle: true },
  { key: "properties", label: "성미 및 귀경", placeholder: "예: 미감미고(味甘微苦), 성미온(性微溫), 비·폐경(脾·肺經)" },
  { key: "efficacy", label: "효능주치", placeholder: "예: 대보원기(大補元氣), 복맥고탈(復脈固脫), 보비익폐(補脾益肺)" },
  { key: "components", label: "주요성분", placeholder: "예: Ginsenoside(Rb1, Rg1), 다당류, 정유 성분" },
  { key: "prescriptions", label: "대표처방", placeholder: "예: 독삼탕(獨蔘湯), 사군자탕(四君子湯)" },
  { key: "notes", label: "메모 / 기타", placeholder: "추가로 기억할 내용, 비교 약재, 시험 포인트 등" },
  { key: "image", label: "사진", type: "image", searchable: false },
]

export const ANATOMY_FIELDS: FieldDef[] = [
  { key: "name", label: "구조물명", placeholder: "예: Biceps brachii (상완이두근)", isTitle: true },
  {
    key: "subtype",
    label: "세부 분류",
    type: "select",
    searchable: false,
    options: ANATOMY_SUBTYPES.map((s) => ({ value: s.value, label: s.label })),
  },
  { key: "location", label: "위치 / 기시·종지", placeholder: "예: 기시 - 견갑골 관절상결절 및 오훼돌기 / 종지 - 요골조면" },
  { key: "innervation", label: "신경 지배", placeholder: "예: 근피신경 (Musculocutaneous nerve, C5-C6)" },
  { key: "function", label: "주요 기능", placeholder: "예: 전완의 굴곡 및 회외, 어깨 관절 굴곡 보조" },
  { key: "clinical", label: "임상적 의의", placeholder: "예: 이두근 건염, 침술 타겟(척택 LU5 인접), 관련 질환 등" },
  { key: "image", label: "사진", type: "image", searchable: false },
]

export function getFields(category: Category): FieldDef[] {
  return category === "herb" ? HERB_FIELDS : ANATOMY_FIELDS
}

/** Text fields usable as search scopes (excludes title, image, and select fields). */
export function getSearchFields(category: Category): FieldDef[] {
  return getFields(category).filter(
    (f) => !f.isTitle && f.type !== "image" && f.type !== "select" && f.searchable !== false,
  )
}
