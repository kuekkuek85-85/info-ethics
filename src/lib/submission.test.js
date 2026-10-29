import { describe, it, expect } from 'vitest'
import { buildSubmissionRecord } from './submission.js'

describe('buildSubmissionRecord', () => {
  it('필수 필드를 매핑한다', () => {
    expect(
      buildSubmissionRecord({ studentId: '10203', opinion: '책임 있다.', grade: '상', feedback: '근거 탄탄.' }),
    ).toEqual({ 학번: '10203', 의견: '책임 있다.', 등급: '상', 피드백: '근거 탄탄.' })
  })

  it('학번·의견의 앞뒤 공백을 다듬는다', () => {
    const r = buildSubmissionRecord({ studentId: ' 10203 ', opinion: '  의견  ', grade: '중', feedback: 'f' })
    expect(r.학번).toBe('10203')
    expect(r.의견).toBe('의견')
  })

  it('값이 없으면 빈 문자열로 처리한다', () => {
    const r = buildSubmissionRecord({ grade: '하', feedback: 'f' })
    expect(r.학번).toBe('')
    expect(r.의견).toBe('')
  })
})
