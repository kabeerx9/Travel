import { NextResponse } from 'next/server'
import { renderToStream } from '@react-pdf/renderer'
import { ItineraryDocument } from '@/components/pdf/itinerary-template'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Generate PDF
    const pdfStream = await renderToStream(<ItineraryDocument data={data} />)
    
    // Convert stream to buffer
    const chunks: Uint8Array[] = []
    for await (const chunk of pdfStream) {
      chunks.push(chunk)
    }
    const pdfBuffer = Buffer.concat(chunks)
    
    // Return PDF as base64
    const base64Pdf = pdfBuffer.toString('base64')
    
    return NextResponse.json({ pdf: base64Pdf })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    )
  }
}