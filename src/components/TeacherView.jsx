import { useEffect, useState } from 'react'
import { fetchSubmissions, isConfigured } from '../lib/firebase.js'

// 제출시각(Firestore Timestamp)을 읽기 좋은 문자열로. 값이 없으면 '—'.
function formatTime(ts) {
  try {
    const date = ts?.toDate ? ts.toDate() : ts ? new Date(ts) : null
    return date ? date.toLocaleString('ko-KR') : '—'
  } catch {
    return '—'
  }
}

// 교사 조회 화면. 저장된 제출을 최신순으로 표로 보여준다.
export default function TeacherView() {
  const [rows, setRows] = useState([])
  const [status, setStatus] = useState('loading') // loading | done | error | noconfig

  useEffect(() => {
    let alive = true
    if (!isConfigured()) {
      setStatus('noconfig')
      return
    }
    ;(async () => {
      try {
        const data = await fetchSubmissions()
        if (alive) {
          setRows(data)
          setStatus('done')
        }
      } catch {
        if (alive) setStatus('error')
      }
    })()
    return () => {
      alive = false
    }
  }, [])

  return (
    <main className="card">
      <div className="topbar">
        <h1>제출 현황 (교사용)</h1>
        <a className="switch" href="#">← 학생 화면</a>
      </div>

      <p className="teacher-note">
        ※ 임시 접근 방식: 지금은 주소 <code>#teacher</code>로만 구분합니다.
        실제 적용 시 인증(교사 로그인/패스코드)으로 교체해야 합니다.
      </p>

      {status === 'noconfig' && (
        <p className="notice">Firebase 미설정 — 저장·조회가 비활성화되어 있습니다. (.env의 VITE_FIREBASE_* 확인)</p>
      )}
      {status === 'loading' && <p className="loading" role="status">불러오는 중…</p>}
      {status === 'error' && <p className="notice">제출 내역을 불러오지 못했습니다.</p>}

      {status === 'done' && (
        rows.length === 0 ? (
          <p className="hint">아직 제출된 내역이 없습니다.</p>
        ) : (
          <table className="submissions">
            <thead>
              <tr>
                <th>학번</th>
                <th>의견</th>
                <th>등급</th>
                <th>피드백</th>
                <th>제출시각</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.학번}</td>
                  <td className="opinion-cell">{r.의견}</td>
                  <td>{r.등급}</td>
                  <td className="feedback-cell">{r.피드백}</td>
                  <td>{formatTime(r.제출시각)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </main>
  )
}
