/**
 * File: src/pages/Home.tsx
 * Description: Home page that provides the upload UI for Resume and Job Description.
 */

import React, { useState } from 'react'
import FileUpload from '../components/upload/FileUpload'
import UploadPreview from '../components/upload/UploadPreview'
import { FileText, Search } from 'lucide-react'

/**
 * Interface representing an uploaded file with optional preview text
 */
interface Uploaded {
  file: File | null
  previewText: string | null
}

/**
 * Home page component
 * Lets users upload a resume and a job description and shows a Compare CTA.
 */
export default function Home() {
  // State for resume and job description
  const [resume, setResume] = useState<Uploaded>({ file: null, previewText: null })
  const [jobDesc, setJobDesc] = useState<Uploaded>({ file: null, previewText: null })
  const [isComparing, setIsComparing] = useState(false)

  /**
   * Handler when Compare button is clicked
   * Currently just flips a loading state to indicate action (future: call NLP backend)
   */
  const handleCompare = async () => {
    if (!resume.file || !jobDesc.file) return
    setIsComparing(true)
    // Simulate brief loading — in future, replace with actual API calls to backend
    await new Promise((res) => setTimeout(res, 800))
    setIsComparing(false)
    // Next step: navigate to comparison UI / show analysis results
    // For now we will keep user on the same page; the next task will add analysis components.
    alert('Files registered. Next step: run skill extraction and comparison (to be implemented).')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-slate-800 flex items-center gap-3">
            <Search className="text-indigo-500" />
            AI-Powered Skill Gap Analyzer
          </h1>
          <p className="mt-2 text-slate-500">Upload a resume and a job description to start skill gap analysis.</p>
        </header>

        <main className="bg-white shadow-lg rounded-lg p-6">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <FileUpload
                label="Upload Resume"
                accept=".pdf,.docx,.txt"
                file={resume.file ?? undefined}
                onFileSelected={(file, preview) => setResume({ file: file, previewText: preview ?? null })}
              />
              {resume.file ? (
                <div className="mt-4">
                  <UploadPreview name={resume.file.name} size={resume.file.size} status="ok" />
                </div>
              ) : null}
            </div>

            <div>
              <FileUpload
                label="Upload Job Description"
                accept=".pdf,.docx,.txt"
                file={jobDesc.file ?? undefined}
                onFileSelected={(file, preview) => setJobDesc({ file: file, previewText: preview ?? null })}
              />
              {jobDesc.file ? (
                <div className="mt-4">
                  <UploadPreview name={jobDesc.file.name} size={jobDesc.file.size} status="ok" />
                </div>
              ) : null}
            </div>
          </section>

          <section className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              Once both files are uploaded, click Compare to extract and analyze skills (next step).
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCompare}
                disabled={!resume.file || !jobDesc.file || isComparing}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-white ${
                  resume.file && jobDesc.file && !isComparing ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-300 cursor-not-allowed'
                }`}
              >
                <FileText className="w-4 h-4" />
                {isComparing ? 'Comparing...' : 'Compare'}
              </button>
            </div>
          </section>

          <section className="mt-6">
            <h2 className="text-sm font-semibold text-slate-700 mb-2">Selected files</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border rounded bg-slate-50">
                <div className="text-xs text-slate-500 mb-2">Resume</div>
                {resume.file ? (
                  <>
                    <div className="text-sm font-medium text-slate-700">{resume.file.name}</div>
                    <div className="text-xs text-slate-400">{(resume.file.size / 1024).toFixed(1)} KB • {resume.file.type || 'unknown'}</div>
                    {resume.previewText ? (
                      <pre className="mt-3 text-xs text-slate-600 whitespace-pre-wrap max-h-40 overflow-auto bg-white p-2 rounded border">{resume.previewText}</pre>
                    ) : (
                      <div className="mt-3 text-xs text-slate-500">Preview not available for this file type.</div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-slate-400">No resume uploaded yet.</div>
                )}
              </div>

              <div className="p-4 border rounded bg-slate-50">
                <div className="text-xs text-slate-500 mb-2">Job Description</div>
                {jobDesc.file ? (
                  <>
                    <div className="text-sm font-medium text-slate-700">{jobDesc.file.name}</div>
                    <div className="text-xs text-slate-400">{(jobDesc.file.size / 1024).toFixed(1)} KB • {jobDesc.file.type || 'unknown'}</div>
                    {jobDesc.previewText ? (
                      <pre className="mt-3 text-xs text-slate-600 whitespace-pre-wrap max-h-40 overflow-auto bg-white p-2 rounded border">{jobDesc.previewText}</pre>
                    ) : (
                      <div className="mt-3 text-xs text-slate-500">Preview not available for this file type.</div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-slate-400">No job description uploaded yet.</div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
