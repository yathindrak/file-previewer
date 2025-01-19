import { Metadata } from 'next'
import Script from 'next/script'
import "./globals.css";

export const metadata: Metadata = {
  title: 'File Preview',
  description: 'Preview various file types',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
      <link rel="stylesheet" href="/ext-lib/pptx/css/pptxjs.css" />
        {children}
      </body>
    </html>
  )
}