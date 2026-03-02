# 가치키움 (GachiKium) — Claude 컨텍스트

**프로젝트**: 2~5세 유아 무료 교육 웹앱 | 순수 HTML/CSS/JS 단일파일 | 프레임워크 없음  
**배포**: https://gachikium.pages.dev (Cloudflare Pages, git push → 자동배포)  
**GitHub**: https://github.com/hunja9913-svg/gachikium  
**상세기획**: GACHIKIUM-PROJECT.md 참조

## 파일 구조
| 파일 | 역할 |
|------|------|
| index.html | 메인 허브 (2×2 카드) |
| hangul-touch.html | ㄱ~ㅎ 터치+따라쓰기 (1047줄) |
| number-touch.html | 1~9 터치+따라쓰기 (1067줄) |
| quiz-hint.html | 힌트퀴즈 122개 ⭐메인 (1270줄) |
| audio/ | MP3 478개 (edge-tts 생성) |
| generate-audio.py | TTS 재생성 스크립트 (ko-KR-SunHiNeural) |
| service-worker.js | PWA 캐시 (navigate 요청 우회 처리) |

## 오디오 시스템
```js
playAudio(src, fallback?, onEnd?)  // MP3 우선 → speak() 폴백
stopAllAudio()                     // _curAudio + speechSynthesis 동시 정지
speak(text, onEnd?)                // Web Speech API, ko-KR, rate=0.85~1.0
```
- quiz 전환: `advance()` 패턴 (onEnd콜백 + 안전timeout 10s)
- 오디오 폴백: `a.onerror` + `a.play().catch()` → speak()
- ⚠️ 0바이트 파일 주의: 생성 실패 시 오디오 미재생. `generate-audio.py` 재실행 필요

## 따라쓰기 획 미리보기 애니메이션
따라쓰기 화면 진입 시 정해진 획순으로 애니메이션 후 사용자가 직접 그림:
- `STROKES` 객체: 각 자음/숫자의 획 좌표 (0~1 비율, catmull-rom 스플라인 보간)
- `animateStrokes(item, w, h, dpr, onDone)`: 획 순서대로 글로우 효과로 그림
- `drawGlowStroke(ctx, pts, color, lw, alpha)`: 글로우 이중 레이어 획 렌더링
- DEV 모드에서는 애니메이션 스킵 → 즉시 `onDone()` 호출
- 획 완료 후 번호 표시 (시작점에 숫자)

## DEV 모드 (3개 HTML 모두 지원)
URL에 `?dev=1` 추가 시 활성화:
- hangul/number: 따라쓰기 획 체크 스킵, 즉시 완료 처리
- quiz-hint: 힌트 오디오 스킵 → 선택지 즉시 표시, 타임아웃 1.5초
- 우측 상단 🛠 DEV MODE 뱃지 표시
- 배포 URL에서도 동작하나 숨겨진 기능

## quiz-hint.html 주요 로직
- `ALL_ITEMS` 배열: 122개 (food 31 / animals 39 / vehicles 21 / town 31)
- 출제: localStorage `gk-quiz-history`로 중복 방지 → 10문제 셔플
- 힌트 오디오 끝나면 선택지 등장, 정답/오답 각각 audio/hint/correct-N, wrong-N
- **결과 화면**: 계속하기 ▶ (남은 N개) / 처음으로 🔄 두 버튼
  - 계속하기: 같은 카테고리 유지, history 기반 새 문제 이어서
  - 남은 문제 0개 시: 히스토리 리셋 후 재시작

## service-worker.js 수정사항
- navigate 요청은 서비스워커가 가로채지 않음 (Cloudflare 리다이렉트 충돌 방지)
- 캐시 미스 시 `fetch(e.request.url)` 사용 (redirect:follow 보장)

## Git 워크플로
```bash
git add -A
git commit -m "설명"
git push   # → Cloudflare 자동 재배포 (약 1분)
```

## 설계 원칙 (수정 시 준수)
- 실패 없음, 긍정 강화만 / 광고 없음 / 큰 터치 타겟
- 다크모드 강제 방지: `color-scheme: light only !important` + inline style
- localStorage: `gk-lang`, `gk-quiz-history`
- 언어 토글 버튼: 코드 준비 완료, 현재 `display:none` (미공개)

## TODO
- [ ] 카카오페이 후원 링크 (현재 href="#", 섹션 display:none)
- [ ] quiz-hint.html DEV 모드 push (로컬만 적용 상태)
