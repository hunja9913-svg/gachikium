# 가치키움 (GachiKium) — Claude 컨텍스트

**프로젝트**: 2~5세 유아 무료 교육 웹앱 | 순수 HTML/CSS/JS 단일파일 | 프레임워크 없음
**배포**: https://gachikium.pages.dev (Cloudflare Pages, git push → 자동배포)
**상세기획**: GACHIKIUM-PROJECT.md 참조

## 파일 구조
| 파일 | 역할 |
|------|------|
| index.html | 메인 허브 (2×2 카드) |
| hangul-touch.html | ㄱ~ㅎ 터치+따라쓰기 |
| number-touch.html | 1~9 터치+따라쓰기 |
| quiz-hint.html | 힌트퀴즈 122개 ⭐메인 |
| audio/ | MP3 478개 (edge-tts 생성) |
| generate-audio.py | TTS 재생성 스크립트 |

## 오디오 시스템
```js
playAudio(src, fallback?, onEnd?)  // MP3 우선 → speak() 폴백
stopAllAudio()                     // _curAudio + speechSynthesis 동시 정지
speak(text, onEnd?)                // Web Speech API, ko-KR, rate=0.85
```
- quiz 전환: `advance()` 패턴 (onEnd콜백 + 안전timeout 10s)
- DEV모드: `?dev=1` → 오디오스킵·즉시표시·타임아웃단축 (3개 파일 모두 지원)

## 설계 원칙 (수정 시 준수)
- 실패 없음, 긍정 강화만 / 광고 없음 / 큰 터치 타겟
- 다크모드 강제 방지: `color-scheme: light only !important`
- localStorage: `gk-lang`, `gk-quiz-history`

## TODO
- [ ] 카카오페이 후원 링크 (현재 href="#", display:none)
