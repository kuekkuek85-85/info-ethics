// 제출 레코드를 만드는 순수 함수 (제출시각 제외 — 저장 시 서버 시각이 붙는다).
// Firestore 필드 스키마: { 학번, 의견, 등급, 피드백, (제출시각) } — spec.md ② 데이터 구조.

export function buildSubmissionRecord({ studentId, opinion, grade, feedback }) {
  return {
    학번: String(studentId ?? '').trim(),
    의견: String(opinion ?? '').trim(),
    등급: grade,
    피드백: feedback,
  }
}
