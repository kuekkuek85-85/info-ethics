// Gemini 연동 (외부 호출은 이 모듈로 격리 — CLAUDE.md 규칙).
// API 키는 환경변수(VITE_GEMINI_API_KEY)로만 다룬다.
import { SCENARIO } from '../data/scenario.js'
import { parseEvaluation, VALID_GRADES } from './parseEvaluation.js'

const MODEL = 'gemini-flash-latest' // 교체 가능. 루브릭 채점엔 flash로 충분.
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`

// 루브릭 프롬프트 — 의견엔 정답 없음 → 논리·근거로만 평가 (spec.md ② 루브릭)
export function buildPrompt(opinion) {
  return [
    '당신은 정보윤리 서술형 평가를 돕는 보조교사입니다.',
    '',
    '[질문]',
    SCENARIO.question,
    '',
    '[학생 의견]',
    opinion,
    '',
    '[평가 루브릭] (의견엔 정답이 없다 → 논리·근거의 충실성으로만 평가)',
    '- 상: 입장이 분명하고 타당한 근거가 2개 이상',
    '- 중: 입장이 있고 근거 1개',
    '- 하: 입장만 있고 근거가 빈약',
    '',
    '[규칙]',
    '- 찬성/반대 등 "입장" 자체로 불이익을 주지 말 것. 오직 논리·근거로만 평가한다.',
    '- 피드백은 학생을 존중하는 톤으로, 왜 그 등급인지 + 보완점 1가지를 담는다.',
  ].join('\n')
}

// 응답을 강제로 { grade, feedback } JSON으로 받기 위한 스키마
const RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    grade: { type: 'string', enum: VALID_GRADES },
    feedback: { type: 'string' },
  },
  required: ['grade', 'feedback'],
}

/**
 * 학생 의견을 평가해 { grade, feedback } 반환.
 * @throws {Error} 키 미설정(code='NO_KEY') / 네트워크·API 실패 / 파싱 실패
 */
export async function requestEvaluation(opinion) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey) {
    const err = new Error('Gemini API 키가 설정되지 않았습니다. .env의 VITE_GEMINI_API_KEY를 확인하세요.')
    err.code = 'NO_KEY'
    throw err
  }

  let response
  try {
    response = await fetch(`${ENDPOINT}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildPrompt(opinion) }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    })
  } catch {
    throw new Error('네트워크 오류로 평가에 실패했습니다. 잠시 후 다시 시도해 주세요.')
  }

  if (!response.ok) {
    throw new Error(`평가 요청에 실패했습니다. (오류 ${response.status})`)
  }

  const data = await response.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('평가 응답이 비어 있습니다. 다시 시도해 주세요.')
  }

  return parseEvaluation(text)
}
