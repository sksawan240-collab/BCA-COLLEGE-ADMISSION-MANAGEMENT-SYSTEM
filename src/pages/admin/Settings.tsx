import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { Loader2, Save, Settings as SettingsIcon, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState({
    academicYear: '2024-2025',
    admissionOpen: true,
    applicationFee: 500,
    eligibilityCriteria: ''
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await axios.get('/api/admin/config');
      setConfig({
        academicYear: res.data.academicYear || '',
        admissionOpen: res.data.admissionOpen,
        applicationFee: res.data.applicationFee || 500,
        eligibilityCriteria: res.data.eligibilityCriteria || ''
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put('/api/admin/config', config);
      toast.success('Configuration saved successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-blue-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
          <SettingsIcon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Configuration</h1>
          <p className="text-gray-600">Manage admission cycles, eligibility, and fees.</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSave} className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
              <input 
                type="text" 
                name="academicYear" 
                value={config.academicYear} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                placeholder="e.g., 2024-2025"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Application Fee (₹)</label>
              <input 
                type="number" 
                name="applicationFee" 
                value={config.applicationFee} 
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility Criteria</label>
            <textarea 
              name="eligibilityCriteria" 
              value={config.eligibilityCriteria} 
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Enter the eligibility criteria to be displayed to students..."
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">This text will be shown on the landing page and application instructions.</p>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center h-5">
              <input 
                id="admissionOpen" 
                name="admissionOpen" 
                type="checkbox" 
                checked={config.admissionOpen} 
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
              />
            </div>
            <div className="ml-3">
              <label htmlFor="admissionOpen" className="text-sm font-medium text-gray-900">
                Admissions Open
              </label>
              <p className="text-xs text-gray-500">Toggle this to allow or block new student registrations for the current cycle.</p>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-70 transition-colors"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Save Configuration
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
