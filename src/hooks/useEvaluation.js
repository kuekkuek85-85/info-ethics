import { useState } from 'react'
import { requestEvaluation } from '../lib/gemini.js'
import { saveSubmission } from '../lib/firebase.js'

// 평가(Gemini) + 저장(Firestore)을 오케스트레이션하는 훅.
// 저장은 '최선 노력(best-effort)' — 실패해도 평가 결과는 유지한다 (수용기준).
export function useEvaluation() {
  const [status, setStatus] = useState('idle') // idle | loading | error | done
  const [result, setResult] = useState(null) // { grade, feedback }
  const [error, setError] = useState('') // 평가 실패
  const [saveNotice, setSaveNotice] = useState('') // 저장 건너뜀/실패 안내

  async function evaluate(studentId, opinion) {
    setStatus('loading')
    setError('')
    setSaveNotice('')
    try {
      const evaluation = await requestEvaluation(opinion)
      setResult(evaluation)
      setStatus('done')

      // 평가 성공 후 저장 (실패해도 결과는 유지)
      try {
        await saveSubmission({
          studentId,
          opinion,
          grade: evaluation.grade,
          feedback: evaluation.feedback,
        })
      } catch (saveErr) {
        setSaveNotice(
          saveErr?.code === 'NO_CONFIG'
            ? '저장소(Firebase) 미설정 — 저장은 건너뛰었습니다. (평가 결과는 유지)'
            : '저장에 실패했습니다. (평가 결과는 유지)',
        )
      }
    } catch (e) {
      setError(e?.message || '평가에 실패했습니다.')
      setStatus('error')
    }
  }

  function reset() {
    setStatus('idle')
    setResult(null)
    setError('')
    setSaveNotice('')
  }

  return { status, result, error, saveNotice, evaluate, reset }
}
