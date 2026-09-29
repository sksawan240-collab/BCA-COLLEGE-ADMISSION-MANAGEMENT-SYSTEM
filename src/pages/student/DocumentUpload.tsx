import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { DocumentData } from '../../types';
import { FileText, Upload, Trash2, CheckCircle, AlertCircle, Loader2, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DocumentUpload() {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  
  // Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<DocumentData | null>(null);
  
  const requiredDocs = ['Passport Photo', '10th Marks Card', '12th Marks Card', 'Aadhaar Card'];

  useEffect(() => {
    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get('/api/student/documents');
      setDocuments(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${docType} must be less than 5MB`);
      return;
    }

    setUploading(true);
    
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', docType);

    try {
      await axios.post('/api/student/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success(`${docType} uploaded successfully`);
      await fetchDocuments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error uploading document');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await axios.delete(`/api/student/documents/${id}`);
      toast.success('Document deleted');
      await fetchDocuments();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete document');
    }
  };

  const closePreview = () => setPreviewDoc(null);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Documents</h1>
        <p className="text-gray-600 dark:text-gray-400">Please provide clear copies of the following documents (PDF/JPG/PNG, max 5MB).</p>
      </div>

      <div className="grid gap-6">
        {requiredDocs.map(docType => {
          const uploadedDoc = documents.find(d => d.documentType === docType);
          
          return (
            <motion.div key={docType} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div 
                  className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${uploadedDoc ? 'cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all bg-gray-100 dark:bg-gray-800' : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'}`}
                  onClick={() => uploadedDoc && setPreviewDoc(uploadedDoc)}
                  title={uploadedDoc ? "Click to preview" : ""}
                >
                  {uploadedDoc ? (
                    uploadedDoc.filePath.toLowerCase().endsWith('.pdf') ? (
                      <div className="flex flex-col items-center justify-center text-red-500 dark:text-red-400">
                        <FileText className="h-6 w-6" />
                        <span className="text-[9px] font-bold mt-1">PDF</span>
                      </div>
                    ) : (
                      <img src={`/${uploadedDoc.filePath}`} alt={docType} className="w-full h-full object-cover" />
                    )
                  ) : (
                    <FileText className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{docType}</h3>
                  {uploadedDoc ? (
                    <div className="flex items-center gap-2 mt-1">
                      {uploadedDoc.status === 'Verified' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full"><CheckCircle className="h-3 w-3" /> Verified</span>
                      ) : uploadedDoc.status === 'Rejected' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full"><AlertCircle className="h-3 w-3" /> Rejected: {uploadedDoc.adminRemark}</span>
                      ) : (
                        <span className="inline-flex items-center text-xs font-medium text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 px-2 py-1 rounded-full">Pending Verification</span>
                      )}
                      <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{uploadedDoc.originalName}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-red-500 dark:text-red-400 mt-1">Required</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {uploadedDoc ? (
                  <>
                    <button onClick={() => setPreviewDoc(uploadedDoc)} className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="Preview Document">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button onClick={() => handleDelete(uploadedDoc._id)} className="p-2 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete Document" disabled={uploadedDoc.status === 'Verified'}>
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </>
                ) : (
                  <div>
                    <input type="file" id={`upload-${docType}`} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => handleUpload(e, docType)} disabled={uploading} />
                    <label htmlFor={`upload-${docType}`} className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors cursor-pointer ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload className="h-4 w-4" /> Upload
                    </label>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm transition-opacity" 
              onClick={closePreview} 
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="relative inline-block align-bottom bg-white dark:bg-gray-900 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle w-full max-w-4xl max-h-[90vh] flex flex-col"
            >
              <div className="bg-white dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{previewDoc.documentType}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{previewDoc.originalName}</p>
                </div>
                <button 
                  onClick={closePreview} 
                  className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6 bg-gray-50 dark:bg-gray-950 flex-1 overflow-auto flex items-center justify-center min-h-[50vh]">
                {previewDoc.filePath.toLowerCase().endsWith('.pdf') ? (
                  <iframe 
                    src={`/${previewDoc.filePath}`} 
                    className="w-full h-[60vh] rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm"
                    title={previewDoc.documentType}
                  />
                ) : (
                  <img 
                    src={`/${previewDoc.filePath}`} 
                    alt={previewDoc.documentType} 
                    className="max-w-full max-h-[70vh] rounded-lg shadow-md object-contain border border-gray-200 dark:border-gray-800"
                  />
                )}
              </div>
              
              <div className="bg-white dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-800 flex justify-end shrink-0">
                <a 
                  href={`/${previewDoc.filePath}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Open in New Tab
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}