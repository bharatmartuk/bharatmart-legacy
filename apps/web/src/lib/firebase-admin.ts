import { cert, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getFirestore, type Firestore } from 'firebase-admin/firestore'

let app: App | undefined
let db: Firestore | undefined

export function isFirebaseConfigured() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID?.trim() &&
      process.env.FIREBASE_CLIENT_EMAIL?.trim() &&
      process.env.FIREBASE_PRIVATE_KEY?.trim(),
  )
}

export function getFirebaseFirestore(): Firestore {
  if (db) return db

  if (!isFirebaseConfigured()) {
    throw new Error(
      'Firebase is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.',
    )
  }

  const projectId = process.env.FIREBASE_PROJECT_ID!.trim()
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!.trim()
  const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n')

  app =
    getApps()[0] ??
    initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    })

  db = getFirestore(app)
  return db
}
