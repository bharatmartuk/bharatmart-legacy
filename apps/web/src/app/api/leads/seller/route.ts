import { FieldValue } from 'firebase-admin/firestore'
import { NextResponse } from 'next/server'
import { getFirebaseFirestore, isFirebaseConfigured } from '@/lib/firebase-admin'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  if (!isFirebaseConfigured()) {
    return NextResponse.json(
      { error: 'Lead capture is not configured yet. Please try again later.' },
      { status: 503 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = (await request.json()) as Record<string, unknown>
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  const phone = String(body.phone ?? '').trim()
  const businessName = String(body.businessName ?? '').trim()
  const postcode = String(body.postcode ?? '').trim().toUpperCase()
  const message = String(body.message ?? '').trim()

  if (!name || !email || !phone || !businessName || !postcode) {
    return NextResponse.json(
      { error: 'Name, email, phone, business name and postcode are required.' },
      { status: 400 },
    )
  }

  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 })
  }

  try {
    const firestore = getFirebaseFirestore()
    const doc = await firestore.collection('seller_leads').add({
      name,
      email,
      phone,
      businessName,
      postcode,
      message: message || null,
      source: 'become-a-seller-dialog',
      timestamp: FieldValue.serverTimestamp(),
    })

    return NextResponse.json({ ok: true, id: doc.id })
  } catch (error) {
    console.error('[leads/seller]', error)
    return NextResponse.json({ error: 'Failed to save your enquiry.' }, { status: 500 })
  }
}
