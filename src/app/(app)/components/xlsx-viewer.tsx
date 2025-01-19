import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { read, utils } from 'xlsx'
import { Card } from '@/components/ui/card'

interface XlsxViewerProps {
  src: string
}

const xlsxStyle = `
<style>
  table { border-collapse: collapse; width: 100%; margin: 20px 0; }
  th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
  th { background-color: #f7fafc; font-weight: bold; }
  tr:nth-child(even) { background-color: #f7fafc; }
  tr:hover { background-color: #edf2f7; }
</style>
`

export function XlsxViewer({ src }: XlsxViewerProps) {
  const [html, setHtml] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(src, {
          responseType: 'arraybuffer',
        })
        const workbook = read(data)
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const htmlContent = utils.sheet_to_html(worksheet)
        setHtml(htmlContent + xlsxStyle)
      } catch (error) {
        console.error('Error converting XLSX:', error)
      }
    }
    fetchData()
  }, [src])

  return (
    <Card className="w-full p-4">
      <iframe
        title="XLSX Preview"
        srcDoc={html}
        className="w-full min-h-[calc(100vh-200px)]"
        style={{ border: 'none' }}
      />
    </Card>
  )
}