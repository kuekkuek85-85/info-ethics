import { describe, it, expect } from 'vitest'
import { parseEvaluation } from './parseEvaluation.js'

describe('parseEvaluation', () => {
  it('정상 JSON에서 등급·피드백을 뽑는다', () => {
    const raw = JSON.stringify({ grade: '중', feedback: '근거가 하나 있어 중입니다.' })
    expect(parseEvaluation(raw)).toEqual({ grade: '중', feedback: '근거가 하나 있어 중입니다.' })
  })

  it('앞뒤 공백을 다듬는다', () => {
    const raw = JSON.stringify({ grade: ' 상 ', feedback: '  탄탄한 근거 2개.  ' })
    expect(parseEvaluation(raw)).toEqual({ grade: '상', feedback: '탄탄한 근거 2개.' })
  })

  it('등급이 루브릭(상/중/하) 밖이면 오류', () => {
    const raw = JSON.stringify({ grade: 'A+', feedback: '좋음' })
    expect(() => parseEvaluation(raw)).toThrow('평가 등급이 올바르지 않습니다.')
  })

  it('피드백이 비면 오류', () => {
    const raw = JSON.stringify({ grade: '하', feedback: '   ' })
    expect(() => parseEvaluation(raw)).toThrow('평가 피드백이 비어 있습니다.')
  })

  it('JSON이 아니면 오류', () => {
    expect(() => parseEvaluation('등급은 상입니다')).toThrow('평가 응답을 해석할 수 없습니다.')
  })

  it('grade 필드가 없으면 오류', () => {
    const raw = JSON.stringify({ feedback: '등급 누락' })
    expect(() => parseEvaluation(raw)).toThrow('평가 등급이 올바르지 않습니다.')
  })
})
