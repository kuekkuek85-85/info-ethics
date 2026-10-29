import { useEffect, useState } from 'react'
import StudentView from './components/StudentView.jsx'
import TeacherView from './components/TeacherView.jsx'

// 아주 단순한 해시 라우팅. #teacher 면 교사 화면, 아니면 학생 화면.
// (교사 화면의 '정식' 접근 제어는 인증 — 현재 범위 밖, 임시 방식)
function useHash() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const onChange = () => setHash(window.location.hash)
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return hash
}

export default function App() {
  const hash = useHash()
  return hash === '#teacher' ? <TeacherView /> : <StudentView />
}
