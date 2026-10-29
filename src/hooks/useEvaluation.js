import { useState } from 'react'
import { requestEvaluation } from '../lib/gemini.js'

// 평가 요청의 상태(로딩/에러/결과)를 관리하는 훅.
// StudentView에서 제출·평가 로직을 분리 (A 리뷰 피드백 반영: 컴포넌트 비대화 방지).
export function useEvaluation() {
  const [status, setStatus] = useState('idle') // idle | loading | error | done
  const [result, setResult] = useState(null) // { grade, feedback }
  const [error, setError] = useState('')

  async function evaluate(opinion) {
    setStatus('loading')
    setError('')
    try {
      const evaluation = await requestEvaluation(opinion)
      setResult(evaluation)
      setStatus('done')
    } catch (e) {
      setError(e?.message || '평가에 실패했습니다.')
      setStatus('error')
    }
  }

  function reset() {
    setStatus('idle')
    setResult(null)
    setError('')
  }

  return { status, result, error, evaluate, reset }
}
