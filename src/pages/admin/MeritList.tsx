import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'motion/react';
import { Download, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function MeritList() {
  const [meritList, setMeritList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeritList();
  }, []);

  const fetchMeritList = async () => {
    try {
      const res = await axios.get('/api/admin/merit-list');
      setMeritList(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch merit list');
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Sharnbasva University - BCA Merit List', 14, 22);
      
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

      const tableColumn = ["Rank", "App No", "Name", "Category", "PUC (%)", "App Status", "Doc Status"];
      const tableRows = meritList.map(item => [
        item.rank,
        item.applicationNumber,
        item.studentName,
        item.category,
        `${item.pucPercentage}%`,
        item.status,
        item.documentStatus || 'Pending'
      ]);

      (doc as any).autoTable({
        startY: 35,
        head: [tableColumn],
        body: tableRows,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [79, 70, 229] } // Indigo-600
      });

      doc.save(`merit_list_${new Date().getTime()}.pdf`);
      toast.success('Merit list exported as PDF');
    } catch (error) {
      console.error('Error generating PDF', error);
      toast.error('Failed to export PDF');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-indigo-600" /></div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <Link to="/admin/dashboard" className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium mb-2 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Merit List</h1>
          <p className="text-gray-600">Automatically generated ranking based on PUC percentage.</p>
        </div>
        <button 
          onClick={exportPDF}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium shadow-md shadow-indigo-200 hover:bg-indigo-700 hover:shadow-lg transition-all"
        >
          <Download className="h-5 w-5" />
          Export to PDF
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-600">
                <th className="p-4 pl-6 text-center w-16">Rank</th>
                <th className="p-4">Application No</th>
                <th className="p-4">Student Name</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">PUC %</th>
                <th className="p-4">App Status</th>
                <th className="p-4">Doc Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {meritList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">No applications found in Submitted, Under Review, or Approved status.</td>
                </tr>
              ) : (
                meritList.map((item, index) => (
                  <motion.tr 
                    key={item.applicationId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="p-4 pl-6 text-center font-bold text-indigo-600">{item.rank}</td>
                    <td className="p-4 font-mono text-gray-500">{item.applicationNumber}</td>
                    <td className="p-4 font-medium text-gray-900">{item.studentName}</td>
                    <td className="p-4">{item.category}</td>
                    <td className="p-4 text-right font-bold text-gray-900">{item.pucPercentage}%</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold
                        ${item.status === 'Approved' ? 'bg-green-100 text-green-700' :
                          item.status === 'Under Review' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold
                        ${item.documentStatus === 'All Verified' ? 'bg-emerald-100 text-emerald-700' :
                          item.documentStatus === 'Correction Required' ? 'bg-red-100 text-red-700' :
                          item.documentStatus === 'Partially Verified' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {item.documentStatus || 'Pending'}
                      </span>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
