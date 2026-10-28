import { useState } from 'react'
import { SCENARIO } from '../data/scenario.js'

// 학생 제출 화면 (태스크 A: UI만).
// Gemini 평가·Firestore 저장은 아직 연동하지 않는다 (태스크 B·C에서 추가).
export default function StudentView() {
  const [studentId, setStudentId] = useState('')
  const [opinion, setOpinion] = useState('')
  const [notice, setNotice] = useState('') // 빈 의견 등 입력 안내
  const [result, setResult] = useState(null) // 평가 결과 (B에서 실제 채움)

  // 학번이 비면 제출 불가 (수용기준: 제출 버튼 비활성화)
  const canSubmit = studentId.trim().length > 0

  function handleSubmit(event) {
    event.preventDefault()
    setNotice('')

    // 빈 의견 처리 (수용기준: 의견이 비면 제출되지 않고 안내)
    if (opinion.trim().length === 0) {
      setNotice('의견을 입력해 주세요.')
      return
    }

    // 태스크 A에서는 평가 연동이 없으므로 자리표시 결과만 보여준다.
    // (태스크 B에서 이 자리에 Gemini 평가 결과가 들어온다.)
    setResult({
      grade: '—',
      feedback: '평가 기능은 다음 단계(Gemini 연동)에서 동작합니다.',
      stub: true,
    })
  }

  return (
    <main className="card">
      <h1>정보윤리 서술형 평가</h1>

      <form onSubmit={handleSubmit}>
        <label className="field">
          <span className="field-label">학번</span>
          <input
            type="text"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="예: 10203"
            inputMode="numeric"
          />
        </label>

        <section className="passage" aria-label="제시문">
          <h2>제시문 · {SCENARIO.title}</h2>
          <p>{SCENARIO.passage}</p>
        </section>

        <section className="question" aria-label="질문">
          <h2>질문</h2>
          <p>{SCENARIO.question}</p>
        </section>

        <label className="field">
          <span className="field-label">내 의견</span>
          <textarea
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            rows={8}
            placeholder="입장을 밝히고, 그 근거를 서술하세요."
          />
        </label>

        {notice && <p className="notice" role="alert">{notice}</p>}

        <button type="submit" disabled={!canSubmit}>
          제출
        </button>
        {!canSubmit && (
          <p className="hint">학번을 입력하면 제출할 수 있습니다.</p>
        )}
      </form>

      {result && (
        <section className="result" aria-label="평가 결과">
          <h2>평가 결과</h2>
          <p className="grade">등급: <strong>{result.grade}</strong></p>
          <p className="feedback">{result.feedback}</p>
        </section>
      )}
    </main>
  )
}
