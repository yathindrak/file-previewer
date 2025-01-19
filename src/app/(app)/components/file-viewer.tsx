import React from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { DocxViewer } from './docx-viewer'
import { XlsxViewer } from './xlsx-viewer'

interface FileViewerProps {
  src: string
  fileType: string
}

export default function FileViewer({ src, fileType }: FileViewerProps) {
  const renderContent = () => {
    switch (fileType) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <div className="relative w-full h-96">
            <Image
              src={src}
              alt="Preview"
              fill
              className="object-contain"
            />
          </div>
        )
      
      case 'mp4':
      case 'webm':
        return (
          <video controls className="w-full">
            <source src={src} type={`video/${fileType}`} />
            Your browser does not support video playback.
          </video>
        )
      
      case 'pdf':
        return (
          <iframe 
            src={src}
            className="w-full h-screen"
            title="PDF Preview"
          />
        )
      
      case 'txt':
        return (
          <pre className="p-4 bg-gray-100 rounded-lg overflow-auto max-h-96">
            {src}
          </pre>
        )
      
        case 'docx':
            return <DocxViewer src={src} />
          case 'xlsx':
            return <XlsxViewer src={src} />
      
      default:
        return (
          <Card className="p-4">
            <p>Unsupported file type: {fileType}</p>
          </Card>
        )
    }
  }

  return (
    <div className="mt-4">
      {renderContent()}
    </div>
  )
}