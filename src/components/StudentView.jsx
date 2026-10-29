import { useState } from 'react'
import { SCENARIO } from '../data/scenario.js'
import { useEvaluation } from '../hooks/useEvaluation.js'

const MAX_OPINION = 1000 // 과도한 입력 방지 (A 리뷰 피드백 반영: Gemini 토큰·비용 보호)

// 학생 제출 화면. 제출 시 Gemini로 의견을 평가한다 (저장은 태스크 C).
export default function StudentView() {
  const [studentId, setStudentId] = useState('')
  const [opinion, setOpinion] = useState('')
  const [notice, setNotice] = useState('') // 빈 의견 등 입력 안내
  const { status, result, error, evaluate, reset } = useEvaluation()

  // 학번이 비면 제출 불가 (수용기준: 제출 버튼 비활성화)
  const canSubmit = studentId.trim().length > 0 && status !== 'loading'

  function handleSubmit(event) {
    event.preventDefault()
    setNotice('')

    // 빈 의견 처리 (수용기준: 의견이 비면 제출되지 않고 안내)
    if (opinion.trim().length === 0) {
      setNotice('의견을 입력해 주세요.')
      return
    }

    evaluate(opinion.trim())
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
          <span className="field-label">
            내 의견 <span className="counter">{opinion.length}/{MAX_OPINION}</span>
          </span>
          <textarea
            value={opinion}
            onChange={(e) => setOpinion(e.target.value)}
            rows={8}
            maxLength={MAX_OPINION}
            placeholder="입장을 밝히고, 그 근거를 서술하세요."
          />
        </label>

        {notice && <p className="notice" role="alert">{notice}</p>}

        <p className="privacy-notice">
          제출한 의견은 AI 채점을 위해 외부(Google Gemini)로 전송됩니다.
          이름·연락처 등 개인정보는 쓰지 마세요. (학번은 전송되지 않습니다)
        </p>

        <button type="submit" disabled={!canSubmit}>
          {status === 'loading' ? '평가 중…' : '제출'}
        </button>
        {studentId.trim().length === 0 && (
          <p className="hint">학번을 입력하면 제출할 수 있습니다.</p>
        )}
      </form>

      {status === 'loading' && (
        <p className="loading" role="status">AI가 의견을 평가하고 있습니다…</p>
      )}

      {status === 'error' && (
        <section className="result error-box" aria-label="평가 오류">
          <p className="notice" role="alert">{error}</p>
          <button type="button" onClick={() => evaluate(opinion.trim())}>
            재시도
          </button>
        </section>
      )}

      {status === 'done' && result && (
        <section className="result" aria-label="평가 결과">
          <h2>평가 결과</h2>
          <p className="grade">등급: <strong>{result.grade}</strong></p>
          <p className="feedback">{result.feedback}</p>
          <button type="button" className="ghost" onClick={reset}>
            다시 쓰기
          </button>
        </section>
      )}
    </main>
  )
}
