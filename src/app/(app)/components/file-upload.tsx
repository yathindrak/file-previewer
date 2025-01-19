"use client"

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import FileViewer from './file-viewer'

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [fileType, setFileType] = useState<string>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setFileType(selectedFile.name.split('.').pop()?.toLowerCase() || '')
    
    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }

    if (selectedFile.type.startsWith('text/')) {
      reader.readAsText(selectedFile)
    } else {
      reader.readAsDataURL(selectedFile)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Input
          type="file"
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,.xlsx,.pptx,.txt,.jpg,.jpeg,.png,.gif,.mp4,.webm"
          className="mb-4"
        />
        {preview && (
          <div className="mt-4">
            <FileViewer src={preview} fileType={fileType} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}