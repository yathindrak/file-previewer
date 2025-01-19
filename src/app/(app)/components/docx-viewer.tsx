import React, { useEffect, useState } from 'react'
import axios from 'axios'
import mammoth from 'mammoth'
import { Card } from '@/components/ui/card'

interface DocxViewerProps {
  src: string
}

const docxStyle = `
<style>
  body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
  h1 { color: #2d3748; }
  h2 { color: #4a5568; }
  p { margin-bottom: 1em; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 1em; }
  td, th { border: 1px solid #e2e8f0; padding: 8px; }
  th { background-color: #f7fafc; }
</style>
`

export function DocxViewer({ src }: DocxViewerProps) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(src, {
          responseType: 'arraybuffer',
        })
        const { value: htmlStr } = await mammoth.convertToHtml({
          arrayBuffer: data,
        })
        setHtml(htmlStr + docxStyle)
      } catch (error) {
        console.error('Error converting DOCX:', error)
      }
    }
    fetchData()
  }, [src])

  return (
    <Card className="w-full p-4">
      <iframe
        title="DOCX Preview"
        srcDoc={html}
        className="w-full min-h-[calc(100vh-200px)]"
        style={{ border: 'none' }}
      />
    </Card>
  )
}
