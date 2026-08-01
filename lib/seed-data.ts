import type { Entry } from "./types"

const now = Date.now()

export const SEED_ENTRIES: Entry[] = [
  {
    id: "herb-insam",
    category: "herb",
    createdAt: now - 1000 * 60 * 60 * 24 * 5,
    updatedAt: now - 1000 * 60 * 60 * 24 * 5,
    name: "인삼 (人蔘)",
    properties: "미감미고(味甘微苦), 성미온(性微溫)\n귀경: 비경(脾), 폐경(肺), 심경(心)",
    efficacy:
      "대보원기(大補元氣) — 원기를 크게 보한다\n복맥고탈(復脈固脫) — 맥을 회복시키고 탈진을 막는다\n보비익폐(補脾益肺) — 비장과 폐를 보한다\n생진양혈(生津養血), 안신익지(安神益智)",
    components: "Ginsenoside (Rb1, Rg1, Re 등), 다당류(polysaccharide), 정유, 펩타이드",
    prescriptions: "독삼탕(獨蔘湯) — 단미로 대량 사용\n사군자탕(四君子湯) — 기허 기본방\n생맥산(生脈散) — 맥문동·오미자 배오",
    notes: "노두(蘆頭)는 제거하고 사용. 실증·열증에는 신중히. 여로(藜蘆)와 상반(相反).",
  },
  {
    id: "herb-hwanggi",
    category: "herb",
    createdAt: now - 1000 * 60 * 60 * 24 * 4,
    updatedAt: now - 1000 * 60 * 60 * 24 * 4,
    name: "황기 (黃芪)",
    properties: "미감(味甘), 성미온(性微溫)\n귀경: 비경(脾), 폐경(肺)",
    efficacy:
      "보기승양(補氣升陽) — 기를 보하고 양기를 끌어올린다\n익위고표(益衛固表) — 위기를 더해 표를 견고히 한다\n이수소종(利水消腫), 탁독생기(托毒生肌)",
    components: "Astragaloside, flavonoid, 다당류, 아미노산",
    prescriptions: "보중익기탕(補中益氣湯)\n옥병풍산(玉屛風散) — 표허 자한\n당귀보혈탕(當歸補血湯)",
    notes: "인삼이 원기를 보한다면 황기는 표(表)의 위기를 굳건히 하는 데 강점. 자한(自汗)에 활용.",
  },
  {
    id: "herb-gamcho",
    category: "herb",
    createdAt: now - 1000 * 60 * 60 * 24 * 3,
    updatedAt: now - 1000 * 60 * 60 * 24 * 3,
    name: "감초 (甘草)",
    properties: "미감(味甘), 성평(性平)\n귀경: 심(心), 폐(肺), 비(脾), 위(胃)",
    efficacy:
      "보비익기(補脾益氣), 청열해독(淸熱解毒)\n거담지해(祛痰止咳), 완급지통(緩急止痛)\n조화제약(調和諸藥) — 여러 약을 조화시킨다",
    components: "Glycyrrhizin, glycyrrhetinic acid, flavonoid",
    prescriptions: "작약감초탕(芍藥甘草湯)\n감맥대조탕(甘麥大棗湯)\n대부분의 처방에 좌사약으로 배오",
    notes: "장기·대량 복용 시 부종·고혈압 주의(가성 알도스테론증). 대극·감수·원화·해조와 상반.",
  },
  {
    id: "anatomy-biceps",
    category: "anatomy",
    subtype: "muscle",
    createdAt: now - 1000 * 60 * 60 * 24 * 5,
    updatedAt: now - 1000 * 60 * 60 * 24 * 5,
    name: "Biceps brachii (상완이두근)",
    location:
      "장두(long head): 견갑골 관절상결절(supraglenoid tubercle)\n단두(short head): 견갑골 오훼돌기(coracoid process)\n종지: 요골조면(radial tuberosity) 및 이두근건막",
    innervation: "근피신경 (Musculocutaneous nerve, C5–C6)",
    function: "전완의 굴곡(elbow flexion), 전완의 회외(supination)\n어깨 관절 굴곡 보조",
    clinical:
      "이두근 장두건염 호발. 회외 기능 검사에 유용.\n침구 관련: 척택(LU5), 협백(LU4) 부위와 인접.",
  },
  {
    id: "anatomy-deltoid",
    category: "anatomy",
    subtype: "muscle",
    createdAt: now - 1000 * 60 * 60 * 24 * 2,
    updatedAt: now - 1000 * 60 * 60 * 24 * 2,
    name: "Deltoid (삼각근)",
    location:
      "기시: 쇄골 외측 1/3, 견봉(acromion), 견갑극(scapular spine)\n종지: 상완골 삼각근 조면(deltoid tuberosity)",
    innervation: "액와신경 (Axillary nerve, C5–C6)",
    function:
      "전부섬유: 어깨 굴곡·내회전\n중부섬유: 어깨 외전(15°~90°)\n후부섬유: 어깨 신전·외회전",
    clinical:
      "액와신경 손상 시 외전 불능 및 견봉 부위 감각 소실.\n근육 주사 부위. 침구: 견우(LI15), 비노(LI14).",
  },
  {
    id: "anatomy-median-nerve",
    category: "anatomy",
    subtype: "nerve",
    createdAt: now - 1000 * 60 * 60 * 24 * 1,
    updatedAt: now - 1000 * 60 * 60 * 24 * 1,
    name: "Median nerve (정중신경)",
    location:
      "기원: 상완신경총 내·외측삭 (C6–T1)\n주행: 상완 내측 → 주와 → 원회내근 사이 → 수근관 통과",
    innervation: "— (신경 자체)",
    function:
      "전완 굴근 대부분 지배, 무지구근(LOAF 근육) 운동\n손바닥 요측 3.5지 감각",
    clinical:
      "수근관 증후군(Carpal tunnel syndrome)의 압박 신경.\n손목 부위: 대릉(PC7), 내관(PC6) 자침 시 해부학적 유의.",
  },
  {
    id: "anatomy-humerus",
    category: "anatomy",
    subtype: "bone",
    createdAt: now - 1000 * 60 * 60 * 20,
    updatedAt: now - 1000 * 60 * 60 * 20,
    name: "Humerus (상완골)",
    location:
      "상완 부위의 장골(long bone)\n근위부: 상완골두, 대·소결절 / 원위부: 활차, 소두, 내·외측상과",
    innervation: "— (요골신경이 요골신경구를 따라 주행)",
    function: "어깨·팔꿈치 관절 형성, 상지 근육의 부착 기반",
    clinical:
      "외과경(surgical neck) 골절 시 액와신경 손상 위험.\n중간부 골절 시 요골신경 손상(wrist drop) 주의.",
  },
  {
    id: "anatomy-brachial-artery",
    category: "anatomy",
    subtype: "vessel",
    createdAt: now - 1000 * 60 * 60 * 10,
    updatedAt: now - 1000 * 60 * 60 * 10,
    name: "Brachial artery (상완동맥)",
    location:
      "액와동맥의 연속 → 상완 내측 하행 → 주와에서 요골·척골동맥으로 분지",
    innervation: "— (혈관)",
    function: "상지 주요 혈류 공급, 혈압 측정 시 청진 부위",
    clinical:
      "주와(cubital fossa)에서 촉지 가능, 혈압 측정 기준 동맥.\n곡택(PC3) 자침 시 손상 주의.",
  },
]
