import React from 'react';
import { Link } from 'react-router';
import { DocumentData } from '../types';
import { FileText, CheckCircle, Clock, AlertCircle, UploadCloud } from 'lucide-react';

interface Props {
  documents: DocumentData[];
  onPreview: (doc: DocumentData) => void;
}

export default function RequiredDocumentChecklist({ documents, onPreview }: Props) {
  const requiredDocs = ['Passport Photo', '10th Marks Card', '12th Marks Card', 'Aadhaar Card'];
  const uploadedCount = requiredDocs.filter(docType => documents.some(d => d.documentType === docType)).length;
  const progress = Math.round((uploadedCount / requiredDocs.length) * 100);

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 sm:p-8 flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Required Documents</h3>
        <Link to="/student/documents" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
          Manage
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Upload Progress</span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">{uploadedCount} of {requiredDocs.length}</span>
        </div>
        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-500 rounded-full ${progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="space-y-3 flex-grow overflow-y-auto pr-1">
        {requiredDocs.map((docType, idx) => {
          const uploaded = documents.find(d => d.documentType === docType);
          const isMissing = !uploaded;
          
          return (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-3.5 rounded-xl border ${
                isMissing 
                  ? 'border-orange-200 bg-orange-50 dark:border-orange-900/30 dark:bg-orange-900/10' 
                  : 'border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-950/50'
              } transition-colors`}
            >
              <div className="flex items-center gap-4">
                <div 
                  className={`w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center shrink-0 ${
                    uploaded 
                      ? 'cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all bg-white dark:bg-gray-900 shadow-sm border border-gray-200 dark:border-gray-700' 
                      : 'bg-orange-100 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400'
                  }`}
                  onClick={() => uploaded && onPreview(uploaded)}
                  title={uploaded ? "Click to preview" : ""}
                >
                  {uploaded ? (
                    uploaded.filePath?.toLowerCase().endsWith('.pdf') ? (
                      <div className="flex flex-col items-center justify-center text-red-500 dark:text-red-400">
                        <FileText className="h-4 w-4" />
                        <span className="text-[7px] font-bold mt-0.5">PDF</span>
                      </div>
                    ) : (
                      <img src={`/${uploaded.filePath}`} alt={docType} className="w-full h-full object-cover" />
                    )
                  ) : (
                    <UploadCloud className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <span className={`font-medium text-sm block ${
                    uploaded ? 'text-gray-900 dark:text-white' : 'text-orange-800 dark:text-orange-300'
                  }`}>
                    {docType}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {uploaded ? (
                      <>
                        {uploaded.status === 'Verified' ? <CheckCircle className="h-3.5 w-3.5 text-green-500" /> :
                         uploaded.status === 'Rejected' ? <AlertCircle className="h-3.5 w-3.5 text-red-500" /> :
                         <Clock className="h-3.5 w-3.5 text-yellow-500" />}
                        <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {uploaded.status}
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="h-3.5 w-3.5 text-orange-500 dark:text-orange-400" />
                        <span className="text-[11px] font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">Missing</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {!uploaded && (
                <Link 
                  to="/student/documents" 
                  className="shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/60 transition-colors"
                >
                  Upload
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
