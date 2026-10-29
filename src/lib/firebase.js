// Firebase/Firestore 연동 (외부 연동은 이 모듈로 격리 — CLAUDE.md 규칙).
// 설정값은 환경변수(VITE_FIREBASE_*)로만 다룬다. 미설정 시 앱이 죽지 않도록 가드한다.
import { initializeApp } from 'firebase/app'
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { buildSubmissionRecord } from './submission.js'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// Firebase 설정값이 들어와 있는가 (키 미설정 시 저장/조회를 건너뛰기 위함)
export function isConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId)
}

let dbInstance = null
function getDb() {
  if (!isConfigured()) {
    const err = new Error('Firebase 설정값이 없습니다. .env의 VITE_FIREBASE_*를 확인하세요.')
    err.code = 'NO_CONFIG'
    throw err
  }
  if (!dbInstance) {
    dbInstance = getFirestore(initializeApp(firebaseConfig))
  }
  return dbInstance
}

// 제출 1건 저장 (제출시각은 서버 시각). 수용기준: submissions에 1건 저장.
export async function saveSubmission({ studentId, opinion, grade, feedback }) {
  const db = getDb()
  const record = buildSubmissionRecord({ studentId, opinion, grade, feedback })
  await addDoc(collection(db, 'submissions'), { ...record, 제출시각: serverTimestamp() })
}

// 교사 조회: 전체 제출을 최신순으로. (접근 제어는 firestore.rules가 담당 — 인증은 범위 밖 한계)
export async function fetchSubmissions() {
  const db = getDb()
  const snap = await getDocs(query(collection(db, 'submissions'), orderBy('제출시각', 'desc')))
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}
