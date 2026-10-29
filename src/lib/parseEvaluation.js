// Gemini가 돌려준 평가 텍스트(JSON)를 { grade, feedback }로 파싱하는 순수 함수.
// 네트워크·DOM 의존이 없어 단위 테스트의 핵심 대상 (가벼운 절충 테스트).

export const VALID_GRADES = ['상', '중', '하']

/**
 * @param {string} rawText - Gemini 응답 본문(JSON 문자열)
 * @returns {{ grade: string, feedback: string }}
 * @throws {Error} JSON이 아니거나, 등급이 루브릭(상/중/하) 밖이거나, 피드백이 비면
 */
export function parseEvaluation(rawText) {
  let data
  try {
    data = JSON.parse(rawText)
  } catch {
    throw new Error('평가 응답을 해석할 수 없습니다.')
  }

  const grade = typeof data?.grade === 'string' ? data.grade.trim() : ''
  const feedback = typeof data?.feedback === 'string' ? data.feedback.trim() : ''

  // 수용기준: 상/중/하 중 하나를 반드시 반환
  if (!VALID_GRADES.includes(grade)) {
    throw new Error('평가 등급이 올바르지 않습니다.')
  }
  // 수용기준: '왜 그 등급인지' 피드백 문장 제시
  if (feedback.length === 0) {
    throw new Error('평가 피드백이 비어 있습니다.')
  }

  return { grade, feedback }
}
