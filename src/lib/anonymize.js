// 외부 AI(Gemini)로 보내기 전, 의견 텍스트의 명백한 식별정보를 가린다.
// 순수 함수 → 단위 테스트 대상. (완전한 익명화는 불가능 — '명백한 패턴'만 가림, 한계는 문서화)
// ※ 학번은 애초에 Gemini 요청에 포함하지 않는다(gemini.js). 이 함수는 '의견 본문'을 위한 것.

export function anonymizeForLLM(text) {
  if (typeof text !== 'string') return ''
  let out = text

  // 이메일
  out = out.replace(/[\w.+-]+@[\w-]+\.[\w.-]+/g, '[이메일]')
  // 전화번호 (010-1234-5678 / 01012345678 / 010 1234 5678)
  out = out.replace(/\b01[016789][-\s]?\d{3,4}[-\s]?\d{4}\b/g, '[연락처]')
  // 5자리 이상 연속 숫자 (학번·학생증 번호 등). 연도(4자리)는 보존.
  out = out.replace(/\d{5,}/g, '[숫자]')

  return out
}
