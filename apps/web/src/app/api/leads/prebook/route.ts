import { FieldValue } from 'firebase-admin/firestore'
import { NextResponse } from 'next/server'
import { getFirebaseFirestore, isFirebaseConfigured } from '@/lib/firebase-admin'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function parseQty(value: unknown) {
  const n = Number.parseInt(String(value ?? '0'), 10)
  return Number.isFinite(n) && n >= 0 ? n : 0
}

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

  const bookingType = String(body.booking_type ?? body.bookingType ?? 'enquiry').trim()
  const campaign = String(body.campaign ?? 'general').trim()
  const name = String(body.name ?? '').trim()
  const email = String(body.email ?? '').trim().toLowerCase()
  const phone = String(body.phone ?? '').trim()
  const city = String(body.city ?? '').trim()
  const notes = String(body.notes ?? '').trim()

  if (!name || !email || !phone) {
    return NextResponse.json(
      { error: 'Name, email and phone are required.' },
      { status: 400 },
    )
  }

  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 })
  }

  const payload: Record<string, unknown> = {
    booking_type: bookingType,
    campaign,
    name,
    email,
    phone,
    city: city || null,
    notes: notes || null,
    source: String(body.source ?? 'web-form'),
    timestamp: FieldValue.serverTimestamp(),
  }

  if (bookingType === 'distributor_mango') {
    const fromLocation = String(body.from_location ?? body.fromLocation ?? '').trim()
    const mangoTypes = String(body.mango_types ?? body.mangoTypes ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    const qtyBanganapally2kg = parseQty(body.qty_banganapally_2kg)
    const qtyBanganapally3kg = parseQty(body.qty_banganapally_3kg)
    const qtyRatnagiri2kg = parseQty(body.qty_ratnagiri_2kg)
    const qtyRatnagiri3kg = parseQty(body.qty_ratnagiri_3kg)
    const totalBoxes =
      qtyBanganapally2kg + qtyBanganapally3kg + qtyRatnagiri2kg + qtyRatnagiri3kg

    if (mangoTypes.length < 1) {
      return NextResponse.json(
        { error: 'Select at least one mango category.' },
        { status: 400 },
      )
    }
    if (totalBoxes < 100) {
      return NextResponse.json(
        {
          error: `Distributor orders require a minimum of 100 boxes total. You selected ${totalBoxes}.`,
        },
        { status: 400 },
      )
    }
    if (!fromLocation) {
      return NextResponse.json(
        { error: 'Please enter your location (Where are you from?).' },
        { status: 400 },
      )
    }
    if (!city) {
      return NextResponse.json({ error: 'City is required.' }, { status: 400 })
    }

    payload.from_location = fromLocation
    payload.mango_types = mangoTypes.join(',')
    payload.qty_banganapally_2kg = qtyBanganapally2kg
    payload.qty_banganapally_3kg = qtyBanganapally3kg
    payload.qty_ratnagiri_2kg = qtyRatnagiri2kg
    payload.qty_ratnagiri_3kg = qtyRatnagiri3kg
    payload.total_boxes = totalBoxes
    payload.business_name = String(body.business_name ?? body.businessName ?? '').trim() || null
    // Compatibility fields used by the old Ganesh/mango API
    payload.idol_type = 'mango_distributor'
    payload.size = `${totalBoxes}_boxes`
  }

  if (bookingType === 'diwali_enquiry') {
    payload.interest = String(body.interest ?? '').trim() || null
    payload.idol_type = 'diwali'
    payload.size = String(body.interest ?? 'general').trim() || 'general'
  }

  try {
    const firestore = getFirebaseFirestore()
    const doc = await firestore.collection('prebook_leads').add(payload)
    return NextResponse.json({ ok: true, id: doc.id })
  } catch (error) {
    console.error('[leads/prebook]', error)
    return NextResponse.json({ error: 'Failed to save your booking.' }, { status: 500 })
  }
}
