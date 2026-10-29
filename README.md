# 정보윤리 단원 서술형 평가 도구 (연수용 완성 레포)

정보 교사 대상 실전 연수 **「정보 교사의 바이브 코딩 — 딸깍을 넘어, 빌더를 기르는 워크플로우」**의
공통 실습 예제를 SDD(명세 주도 개발) 워크플로우로 빌드한 **완성(정답) 레포**다.

> 사이버폭력 제시문을 읽고 학생이 의견을 서술하면, Gemini가 루브릭(상/중/하)으로 채점·피드백하고
> Firestore에 저장, 교사가 조회하는 단일 페이지 도구.

## 스택
React (Vite) · Google Gemini API · Firebase Firestore · Vercel · GitHub

## SDD 워크플로우 = 커밋 체크포인트

이 레포는 연수의 진도 편차 대응을 위해 **각 단계 끝에 커밋**을 찍는다.
뒤처진 참가자는 해당 커밋으로 `checkout`해 다음 단계에 합류한다.

| 단계 | 산출물 |
|------|--------|
| 1. 하네스 | `CLAUDE.md`, `review.md`, `.gitignore` |
| 2. 명세① 문제정의(PRD) | `spec.md` |
| 3. 명세② 설계 | `spec.md` (와이어프레임·순서도·데이터구조·루브릭) |
| 4. 명세③ 수용기준 | `spec.md` (검증 가능한 체크리스트) |
| 5. 생성 | 태스크 A(UI) → B(Gemini) → C(Firebase) |
| 6. 검증 | 수용기준 대조 |
| 7. 코드 리뷰 | AI 1차 + 사람 2차 |
| 8. 피드백 반영 + 배포 | spec/CLAUDE.md 교정 → Vercel |

## 환경변수 (API 키) 설정 — 외부 서비스 태스크 전 필수

태스크 B(Gemini)·C(Firebase)는 **코드 작성 전에 키 발급·설정 단계**를 먼저 거친다.
키는 **코드에 하드코딩·채팅/공유문서에 붙여넣기 금지**(CLAUDE.md 보안). `.env`에만 둔다.

1. **발급**
   - Gemini: Google AI Studio에서 API 키 생성 (태스크 B)
   - Firebase: 콘솔에서 프로젝트 생성 → 웹 앱 등록 → 설정값 확보 (태스크 C)
2. **설정**: 루트에 `.env` 생성, `.env.example`을 복사해 값 채우기
   ```
   cp .env.example .env
   # .env 안의 VITE_GEMINI_API_KEY=... 등에 발급받은 값 입력
   ```
3. **확인**: `.env`가 `.gitignore`에 포함돼 커밋되지 않는지 확인 → 앱 재시작

> `.env`가 없거나 키가 비면 해당 기능은 "키 미설정" 안내로 처리된다(앱이 죽지 않음).

### ⚠️ 보안 한계·정책 (연수 교훈)
- **클라이언트 키 노출(데모 수용):** Vite의 `VITE_` 키는 빌드 시 **브라우저 번들에 인라인**되어
  배포 앱에서 노출된다. git 소스엔 없지만 실제론 노출 — **데모로 수용**하되 교훈으로 다룬다.
  근본 해결은 **서버리스 프록시**(Vercel Functions 등)로 키를 서버에 두는 것(심화).
- **학생 의견 외부 전송(익명화 적용):** 의견은 AI 채점을 위해 Google Gemini로 전송된다.
  전송 전 `src/lib/anonymize.js`로 연락처·이메일·학번류 숫자를 마스킹하고, **학번은 전송하지 않는다.**
  화면에도 전송 고지를 둔다. (완전 익명화는 불가 — 자유서술 속 이름 등은 고지로 보완.)

## 배포 (Vercel)

GitHub에 push하면 Vercel이 자동 배포한다. `vercel.json`에 빌드 설정(Vite·`npm run build`·`dist`)이 있다.

0. **Production 브랜치 지정**: 프로젝트 → **Environments → Branch Tracking**에서 Production이
   추적할 브랜치를 `main`으로. (이러면 `main`=Production, 나머지 브랜치=Preview)
1. **레포 연결**: Vercel에서 **New Project → 이 GitHub 레포 import** (프레임워크는 Vite 자동 인식).
2. **환경변수 등록** (Project → Settings → Environment Variables): `.env`의 값을 그대로 등록.
   - `VITE_GEMINI_API_KEY`
   - `VITE_FIREBASE_API_KEY` / `VITE_FIREBASE_AUTH_DOMAIN` / `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET` / `VITE_FIREBASE_MESSAGING_SENDER_ID` / `VITE_FIREBASE_APP_ID`
   > `.env`는 커밋되지 않으므로, Vercel에는 **직접 등록**해야 한다. (등록 후 재배포)
3. **배포**: Deploy → 발급된 URL로 접속. 교사 화면은 `URL/#teacher`.

> ⚠️ **공개 배포 주의:** 현재 데모 설정은 (a) `VITE_` 키가 번들에 노출되고 (b) Firestore
> `read:true`라 **저장된 제출을 누구나 조회**할 수 있다. 공개 URL로 배포하면 실제 노출되므로,
> 실제 교실 투입 전에는 인증 기반 규칙·서버리스 프록시로 닫아야 한다. (리뷰_로그 Round 4 참조)

## 하네스 파일
- **`CLAUDE.md`** — Claude Code가 세션마다 자동으로 읽는 상시 규율(스택·보안·컨벤션·작업 방식).
- **`review.md`** — 코드 리뷰 체크리스트. AI 1차 리뷰의 근거.
- **`spec.md`** — 이번에 무엇을 만들지(명세 ①②③). *(2~4단계에서 작성)*
