/**
 * File: src/components/upload/UploadPreview.tsx
 * Description: Small presentational component that displays file metadata and status badges.
 */

import React from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

/**
 * Props for UploadPreview
 * @interface UploadPreviewProps
 */
export interface UploadPreviewProps {
  /**
   * File name shown
   */
  name: string
  /**
   * Size in bytes
   */
  size: number
  /**
   * Status: 'ok' | 'partial' | 'missing'
   */
  status?: 'ok' | 'partial' | 'missing'
}

/**
 * UploadPreview component
 * Shows file metadata and a small status indicator
 */
export const UploadPreview: React.FC<UploadPreviewProps> = ({ name, size, status = 'ok' }) => {
  const sizeKB = (size / 1024).toFixed(1) + ' KB'

  return (
    <div className="flex items-center justify-between gap-3 w-full p-3 rounded bg-white border">
      <div className="flex items-start gap-3">
        <div className="text-sm font-medium text-slate-700">{name}</div>
        <div className="text-xs text-slate-400">{sizeKB}</div>
      </div>

      <div>
        {status === 'ok' && <CheckCircle className="text-green-500" />}
        {status === 'partial' && <svg width="18" height="18" className="text-orange-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" /></svg>}
        {status === 'missing' && <XCircle className="text-red-500" />}
      </div>
    </div>
  )
}

export default UploadPreview
