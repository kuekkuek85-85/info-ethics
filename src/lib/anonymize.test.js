import { describe, it, expect } from 'vitest'
import { anonymizeForLLM } from './anonymize.js'

describe('anonymizeForLLM', () => {
  it('전화번호를 가린다', () => {
    expect(anonymizeForLLM('제 번호는 010-1234-5678이에요')).toBe('제 번호는 [연락처]이에요')
    expect(anonymizeForLLM('01012345678로 연락')).toBe('[연락처]로 연락')
  })

  it('학번 등 5자리 이상 숫자를 가린다', () => {
    expect(anonymizeForLLM('학번 20231234 입니다')).toBe('학번 [숫자] 입니다')
  })

  it('연도(4자리)는 보존한다', () => {
    expect(anonymizeForLLM('2024년에 있었던 일')).toBe('2024년에 있었던 일')
  })

  it('이메일을 가린다', () => {
    expect(anonymizeForLLM('hong@school.kr로 보냈다')).toBe('[이메일]로 보냈다')
  })

  it('식별정보 없는 일반 의견은 그대로 둔다', () => {
    const op = '책임이 있다. 방관은 동조이기 때문이다.'
    expect(anonymizeForLLM(op)).toBe(op)
  })

  it('문자열이 아니면 빈 문자열', () => {
    expect(anonymizeForLLM(null)).toBe('')
  })
})
