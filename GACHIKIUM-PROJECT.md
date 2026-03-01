# 가치키움 (GachiKium) - 프로젝트 기획서

_최종 업데이트: 2026-03-02_

## 프로젝트 개요
부모들이 함께 만들어가는 **무료 유아 교육 웹앱**.  
"가치 있는 키움 + 같이 키움"의 중의적 의미.

---

## 타겟 & 핵심 가치
- **타겟**: 2~5세 유아 + 부모 / 주 사용 환경: 태블릿/모바일 브라우저
- **핵심 가치**: 무료 (앱 내 광고 없음), 아이 화면은 깨끗하게, 부모 커뮤니티 참여형
- **수익 모델**: 유튜브 광고 + 후원(카카오페이) + 추후 프리미엄 콘텐츠팩

---

## 현재 프로젝트 구조

```
d:\gachikium\
├── index.html             ← 메인 허브 (게임 선택 화면)
├── hangul-touch.html      ← 한글 자음 터치놀이
├── number-touch.html      ← 숫자 터치놀이
├── quiz-hint.html         ← 힌트 퀴즈 (메인 콘텐츠)
├── generate-audio.py      ← TTS 오디오 사전 생성 스크립트
├── manifest.json          ← PWA 설정
├── service-worker.js      ← 오프라인 캐시
├── icons/
│   ├── icon-192.svg
│   └── icon-512.svg
└── audio/                 ← 사전 생성 MP3 (478개)
    ├── hangul/            ← combined-N, trace-N, praise-N
    ├── number/            ← word-N, count-N, trace-N, praise-N
    ├── hint/              ← hint-N, correct-N, wrong-N
    └── common/            ← again.mp3, correct-find.mp3
```

---

## 파일별 상세 분석

### 1. `index.html` — 메인 허브 (391줄)
- 2×2 그리드 카드 UI (한글 자음, 숫자 놀이, 힌트 퀴즈)
- 언어 전환 버튼 (ko/en) — 현재 숨김 처리 (`style="display:none"`)
- 카카오페이 후원 섹션 — 현재 숨김 처리
- PWA 서비스워커 등록
- 배경: `#FFF8F0` (따뜻한 크림색), Google Fonts (Jua + Gaegu)
- 애니메이션: `dropIn`, `popIn`, `floatA/B`

### 2. `hangul-touch.html` — 한글 자음 터치놀이 (1047줄)

**DATA** (14개 자음):
| 글자 | 단어 | 이모지 |
|------|------|--------|
| ㄱ | 기차 | 🚂 |
| ㄴ | 나비 | 🦋 |
| ㄷ | 도넛 | 🍩 |
| ㄹ | 로봇 | 🤖 |
| ㅁ | 멜론 | 🍈 |
| ㅂ | 별 | ⭐ |
| ㅅ | 사자 | 🦁 |
| ㅇ | 오리 | 🦆 |
| ㅈ | 자동차 | 🚗 |
| ㅊ | 치즈 | 🧀 |
| ㅋ | 코끼리 | 🐘 |
| ㅌ | 토끼 | 🐰 |
| ㅍ | 포도 | 🍇 |
| ㅎ | 하마 | 🦛 |

**핵심 기능**:
- 자음 버튼 탭 → 스파클 효과 + 오디오 재생 (`audio/hangul/combined-N.mp3`)
- 결과 카드 오버레이 (이모지, 자음, 단어 표시)
- **따라쓰기 모드**: Canvas 이중 레이어 (guideCanvas + drawCanvas)
  - 가이드: 점선 윤곽 + 연한 채움
  - 그리기: `pointerdown/move/up` 이벤트 (AbortController로 정리)
  - 완성 판정: 픽셀 커버리지 ≥ 30% → 칭찬 오버레이
  - 다음 글자로 자동 이동
- **칭찬 오버레이**: 5종 랜덤 메시지 + 컨페티(20개)
- **오디오**: MP3 우선, 실패 시 Web Speech API 폴백
- **네비**: 좌상단 홈 버튼 + 언어 토글 (숨김)
- 배경: `#FFF8E7` (노란 계열), 다크모드 강제 방지

### 3. `number-touch.html` — 숫자 터치놀이 (1067줄)
`hangul-touch.html`과 거의 동일한 구조, 색상만 민트 계열(`#EEFBF5`)로 변경

**DATA** (9개 숫자):
- 1~9, 한국어 수사: 하나~아홉
- 탭 시 → 이모지 N개 표시 + 카운팅 오디오 (`audio/number/count-N.mp3`)
- 따라쓰기, 칭찬 동일 구조

### 4. `quiz-hint.html` — 힌트 퀴즈 (1225줄) ⭐ 메인 콘텐츠

#### 아이템 현황 — `ALL_ITEMS` 배열: **122개**

| 카테고리 | 아이템 수 | 주요 항목 |
|----------|-----------|-----------|
| 🍎 food (먹거리) | 31개 | 과일 10, 음식 6, 채소/기타 15 |
| 🦁 animals (동물) | 39개 | 기본 15, 추가 14, 농장동물 등 |
| 🚒 vehicles (탈것) | 21개 | 기본 8, 추가 13 |
| 🏡 town (우리 동네) | 31개 | 자연 6, 물건 7, 장소 3, 사람 3, 악기 3, 기타 9 |

#### 게임 흐름:
1. **시작 화면**: 카테고리 선택 (개별 or 전체), 각 카테고리별 문제 수 표시
2. **퀴즈 화면**: 10문제 / 힌트 TTS → 선택지 3개 표시 (힌트 끝난 후 등장)
3. **결과 화면**: 점수에 따라 4단계 피드백

#### 핵심 로직:
- **출제 방식**: 카테고리 필터 → `localStorage` 히스토리로 중복 방지 → 셔플 후 10문제
- **오디오 순서**: `audio/hint/hint-N.mp3` 재생 → 음성 끝나면 선택지 등장
- 정답 시: `correct-N.mp3` + 눈 스파클(28개) + `⭕` 오버레이 → 자동 다음 문제
- 오답 시: `wrong-N.mp3` + `❌` 오버레이 + 정답 강조 → 자동 다음 문제
- 안전 타임아웃: 10초 (오디오 onended 미발동 대비)

### 5. `generate-audio.py` — TTS 오디오 생성 스크립트 (293줄)
- **의존성**: `edge-tts` (`pip install edge-tts`)
- **음성**: `ko-KR-SunHiNeural` (Microsoft Edge Neural TTS, 무료)
- **배치 실행**: 10개씩 (rate limit 방지)
- **생성 파일 구조**:

| 폴더 | 파일 패턴 | 개수 |
|------|-----------|------|
| `audio/hangul/` | `combined-N`, `trace-N`, `praise-N`, `letter-N`, `word-N`, `sound-N` | 14×5 + 5 = 75 |
| `audio/number/` | `word-N`, `count-N`, `trace-N`, `praise-N` | 9×3 + 5 = 32 |
| `audio/hint/` | `hint-N`, `correct-N`, `wrong-N` | 122×3 = 366 |
| `audio/common/` | `again.mp3`, `correct-find.mp3` | 2 |

> ⚠️ `audio/` 폴더 현재 478개 파일 존재 (이미 생성됨)

### 6. `manifest.json` — PWA 설정
```json
{
  "name": "가치키움",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#FFA726",
  "background_color": "#FFF8F0"
}
```

### 7. `service-worker.js` — 오프라인 캐시
- 캐시명: `gachikium-v1`
- 캐시 대상: 주요 HTML 파일 + manifest + icons
- 전략: Cache-First (캐시 없으면 네트워크)

---

## 기술 스택

### 현재 구현
- **프론트엔드**: 순수 HTML/CSS/JS (단일 파일, 프레임워크 없음)
- **폰트**: Google Fonts — Jua (제목), Gaegu (부제목)
- **음성**: MP3 파일 우선 → Web Speech API 폴백 (ko-KR, rate 0.85~1.0, pitch 1.1~1.3)
- **그리기**: HTML5 Canvas (DPR 대응, AbortController 패턴)
- **상태관리**: localStorage (`gk-lang`, `gk-quiz-history`)
- **PWA**: manifest.json + service-worker.js
- **다크모드 방지**: `color-scheme: light only !important` + inline 스타일

### 배포
- **계획**: Cloudflare Pages (무료, 대역폭 무제한)
- **버전관리**: Git + GitHub

---

## 설계 원칙 (유아 UX)
- **레벨/진도 없음** — 오픈월드, 자유 탐색
- **큰 터치 타겟** — `aspect-ratio: 1`, 반응형 clamp()
- **즉각적 피드백** — 소리 + 이펙트 (tap → 400ms 내 오버레이)
- **긍정 강화만** — 실패 없음, 칭찬만 (따라쓰기 30% 이상이면 OK)
- **반복 가능** — 퀴즈 히스토리로 새 문제 우선 출제

---

## 로드맵

### Phase 1 - 배포 준비 (현재 단계)
- [x] 프로젝트 폴더 구조 잡기
- [x] 메인 홈페이지 (놀이 목록 선택 화면)
- [x] PWA 설정 (manifest.json, service-worker.js)
- [x] 다국어 구조 (한국어/영어) — 코드 완성, 버튼 숨김 처리
- [ ] Cloudflare Pages 배포
- [ ] 카카오페이 후원 링크 (버튼 표시 처리)

### Phase 2 - 콘텐츠 확장
- [ ] 영어 알파벳 터치 + 따라쓰기
- [ ] 한글 모음 (ㅏㅑㅓㅕ...)
- [ ] 단어 조합 놀이 (ㄱ+ㅏ=가)
- [ ] 숫자 확장 (10~20, 덧셈뺄셈)
- [ ] 색깔/모양 맞추기
- [ ] AI 일러스트 이미지 교체 (이모지 → Gemini API 생성)

### Phase 3 - 기능 고도화
- [ ] 스티커 모으기 시스템 (재방문 동기)
- [ ] 오늘의 놀이 (매일 다른 퀴즈 3문제)
- [ ] 학습 기록 (부모용)
- [ ] 난이도 자동 조절
- [ ] 오리지널 마스코트 캐릭터

### Phase 4 - 수익화/성장
- [ ] 유튜브 채널 운영 (쇼츠 중심)
- [ ] 프리미엄 콘텐츠팩 (토스 페이먼츠)
- [ ] 부모용 대시보드 (주간 리포트)
- [ ] 다른 언어 확장 (일본어, 중국어)

---

## 알려진 이슈 & TODO

| 항목 | 내용 |
|------|------|
| `service-worker.js` | `quiz-find.html` 캐시 포함되어 있으나 해당 파일 미존재 |
| 언어 버튼 | 모든 페이지에서 `display:none` 처리 → 다국어 준비는 완료 |
| 카카오페이 | 후원 버튼 `href="#"` — 실제 링크 미설정 |
| 오디오 파일 | 이미 478개 생성 완료, 새 아이템 추가 시 `generate-audio.py` 재실행 필요 |

---

## 저작권 정책
- **이모지**: 유니코드 표준, 상업 사용 가능
- **힌트 문구**: 자체 작성, 고유명사 최소화
- **백설공주/신데렐라**: 원작 퍼블릭 도메인, 텍스트 언급 OK
- **디즈니 오리지널(엘사, 라푼젤 등)**: 사용 금지
- **캐릭터(뽀로로 등)**: 사용 금지
- **AI 생성 이미지**: 자체 생성 → 저작권 깔끔

---

## 개발자 참고
- **개발자**: UE5 게임 개발자 (웹 초보)
- **IDE**: VS Code + Antigravity AI Agent
- **버전관리**: Git + GitHub (Perforce 경험 있음)
- **배포 목표**: Cloudflare Pages
