import * as React from "react"
import { UploadCloud, FileText, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"

type FileUploadProps = {
  label: string
  accept?: string
  file?: File
  onFileSelected: (file: File | null, preview?: string | null) => void
}

const TEXT_EXTENSIONS = /\.(txt|md|csv|json)$/i
const MAX_TEXT_PREVIEW_BYTES = 200 * 1024 // 200 KB

const formatBytes = (bytes: number) => {
  if (!Number.isFinite(bytes)) return "0 B"
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const readPreview = async (file: File) => {
  const isTextFile = file.type.startsWith("text/") || TEXT_EXTENSIONS.test(file.name)
  const canRead = isTextFile && file.size <= MAX_TEXT_PREVIEW_BYTES

  if (!canRead) {
    return null
  }

  return new Promise<string | null>((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      resolve(result.slice(0, 2_000))
    }
    reader.onerror = () => resolve(null)
    reader.readAsText(file)
  })
}

const FileUpload: React.FC<FileUploadProps> = ({ label, accept, file, onFileSelected }) => {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = React.useState(false)
  const [isReading, setIsReading] = React.useState(false)

  const handleFiles = React.useCallback(
    async (files: FileList | null) => {
      const nextFile = files?.item(0)

      if (!nextFile) {
        onFileSelected(null, null)
        return
      }

      setIsReading(true)
      const preview = await readPreview(nextFile)
      setIsReading(false)
      onFileSelected(nextFile, preview)
    },
    [onFileSelected]
  )

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    void handleFiles(event.target.files)
    // Reset the value so the same file can be selected again.
    event.target.value = ""
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    setDragOver(false)
    void handleFiles(event.dataTransfer.files)
  }

  const clearFile = () => {
    onFileSelected(null, null)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        {file ? (
          <button
            type="button"
            onClick={clearFile}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Remove
          </button>
        ) : null}
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "rounded-lg border border-dashed border-slate-300 bg-white p-6 transition ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
          dragOver && "border-indigo-400 bg-indigo-50",
          file && "border-solid"
        )}
        role="button"
        tabIndex={0}
      >
        {file ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-indigo-500" />
              <div>
                <p className="text-sm font-medium text-slate-800">{file.name}</p>
                <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
              </div>
            </div>
            {isReading ? (
              <p className="text-xs text-slate-500">Generating preview…</p>
            ) : (
              <p className="text-xs text-slate-500">
                Click to replace the file or drag a new one here.
              </p>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3 text-center text-slate-500">
            <UploadCloud className="h-8 w-8 text-indigo-500" />
            <div>
              <p className="text-sm font-medium text-slate-700">Drag & drop a file</p>
              <p className="text-xs">or click to browse from your computer</p>
            </div>
            {accept ? <p className="text-[11px] uppercase tracking-wide text-slate-400">{accept}</p> : null}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

    </div>
  )
}

export default FileUpload
