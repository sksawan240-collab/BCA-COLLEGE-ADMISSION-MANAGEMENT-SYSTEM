import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';
import { Loader2, CheckCircle, XCircle, AlertCircle, FileText, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplicationReview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');
  const [remark, setRemark] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/api/admin/applications/${id}`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load application data');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (newStatus === 'Correction Required' || newStatus === 'Rejected') {
      if (!remark) {
        toast.error('Please provide a remark for this action.');
        return;
      }
    }
    setActionLoading(true);
    try {
      await axios.put(`/api/admin/applications/${id}/status`, { status: newStatus, remark });
      toast.success(`Application status updated to ${newStatus}`);
      setRemark('');
      await fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDocumentAction = async (docId: string, action: 'verify' | 'reject') => {
    try {
      const url = `/api/admin/documents/${docId}/${action}`;
      const payload = action === 'reject' ? { remark: prompt('Enter rejection reason:') } : {};
      
      if (action === 'reject' && !payload.remark) return; // cancelled

      await axios.put(url, payload);
      toast.success(`Document ${action === 'verify' ? 'verified' : 'rejected'} successfully`);
      await fetchData();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update document status');
    }
  };

  if (loading || !data) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-blue-600" /></div>;
  }

  const { app, docs, logs } = data;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application Review</h1>
          <p className="text-gray-600">No: {app.applicationNumber} • {app.studentId.name} ({app.studentId.mobile || 'No Mobile'})</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
            Current Status: <strong className="ml-1">{app.status}</strong>
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="flex border-b overflow-x-auto">
          {['details', 'documents', 'history'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap outline-none transition-colors ${activeTab === tab ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'details' && (
            <div className="space-y-8">
              <section>
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Personal Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-gray-500 block">First Name</span><span className="font-medium">{app.personalDetails.firstName || '-'}</span></div>
                  <div><span className="text-gray-500 block">Middle Name</span><span className="font-medium">{app.personalDetails.middleName || '-'}</span></div>
                  <div><span className="text-gray-500 block">Last Name</span><span className="font-medium">{app.personalDetails.lastName || '-'}</span></div>
                  <div><span className="text-gray-500 block">Father's Name</span><span className="font-medium">{app.personalDetails.fatherName}</span></div>
                  <div><span className="text-gray-500 block">Mother's Name</span><span className="font-medium">{app.personalDetails.motherName}</span></div>
                  <div><span className="text-gray-500 block">DOB</span><span className="font-medium">{app.personalDetails.dateOfBirth}</span></div>
                  <div><span className="text-gray-500 block">Gender</span><span className="font-medium">{app.personalDetails.gender}</span></div>
                  <div><span className="text-gray-500 block">Category</span><span className="font-medium">{app.personalDetails.category}</span></div>
                  <div><span className="text-gray-500 block">Aadhaar</span><span className="font-medium">{app.personalDetails.aadhaarNumber}</span></div>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2 mb-4">Academic Details</h3>
                <h4 className="font-medium mb-2">SSLC / 10th</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div><span className="text-gray-500 block">Board</span><span className="font-medium">{app.academicDetails.sslc.board}</span></div>
                  <div><span className="text-gray-500 block">Passing Year</span><span className="font-medium">{app.academicDetails.sslc.passingYear}</span></div>
                  <div><span className="text-gray-500 block">Percentage</span><span className="font-medium">{app.academicDetails.sslc.percentage}%</span></div>
                </div>
                
                <h4 className="font-medium mb-2">PUC / 12th</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div><span className="text-gray-500 block">Board</span><span className="font-medium">{app.academicDetails.puc.board}</span></div>
                  <div><span className="text-gray-500 block">Passing Year</span><span className="font-medium">{app.academicDetails.puc.passingYear}</span></div>
                  <div><span className="text-gray-500 block">Percentage</span><span className="font-medium">{app.academicDetails.puc.percentage}%</span></div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-4">
              {docs.length === 0 ? <p className="text-gray-500">No documents uploaded yet.</p> : docs.map((doc: any) => (
                <div key={doc._id} className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
                  <div className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div>
                      <h4 className="font-medium text-gray-900">{doc.documentType}</h4>
                      <div className="flex gap-2 items-center text-xs mt-1">
                        <span className="text-gray-500">{doc.originalName}</span>
                        <span className={`px-2 py-0.5 rounded-full font-medium ${doc.status === 'Verified' ? 'bg-green-100 text-green-700' : doc.status === 'Rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {doc.status}
                        </span>
                      </div>
                      {doc.adminRemark && <p className="text-xs text-red-500 mt-1">Remark: {doc.adminRemark}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a href={`/${doc.filePath}`} target="_blank" rel="noreferrer" className="p-2 text-blue-600 hover:bg-blue-100 rounded" title="View/Download">
                      <Download className="h-5 w-5" />
                    </a>
                    {doc.status !== 'Verified' && (
                      <button onClick={() => handleDocumentAction(doc._id, 'verify')} className="p-2 text-green-600 hover:bg-green-100 rounded" title="Verify">
                        <CheckCircle className="h-5 w-5" />
                      </button>
                    )}
                    {doc.status !== 'Rejected' && (
                      <button onClick={() => handleDocumentAction(doc._id, 'reject')} className="p-2 text-red-600 hover:bg-red-100 rounded" title="Reject">
                        <XCircle className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              {logs.map((log: any) => (
                <div key={log._id} className="p-4 border-l-4 border-blue-500 bg-gray-50 rounded-r-lg">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-gray-900">{log.action}</p>
                    <span className="text-xs text-gray-500">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">By: {log.actorRole} ({log.actorId.name})</p>
                  {log.remark && <p className="text-sm text-gray-800 mt-2 bg-white p-2 rounded border">Remark: {log.remark}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6">
        {/* Action Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Decision</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Add Remark (Required for Correction/Rejection)</label>
            <textarea 
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your feedback or reason here..."
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleStatusChange('Under Review')}
              disabled={actionLoading}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg font-medium hover:bg-yellow-600 disabled:opacity-50"
            >
              Mark Under Review
            </button>
            <button 
              onClick={() => handleStatusChange('Correction Required')}
              disabled={actionLoading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
            >
              Request Correction
            </button>
            <button 
              onClick={() => handleStatusChange('Approved')}
              disabled={actionLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50"
            >
              Approve App
            </button>
            <button 
              onClick={() => handleStatusChange('Rejected')}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
            >
              Reject App
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
