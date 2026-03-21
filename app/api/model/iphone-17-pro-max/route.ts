import { promises as fs } from 'node:fs'
import path from 'node:path'

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'iphone_17_pro_max.glb')
    const file = await fs.readFile(filePath)

    return new Response(file, {
      headers: {
        'Content-Type': 'model/gltf-binary',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch {
    return new Response('Model not found', { status: 404 })
  }
}

