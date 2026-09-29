import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { User, MapPin, Phone, Camera, Loader2, Save } from 'lucide-react';

export default function StudentProfile() {
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/student/profile');
      setProfile(res.data);
      setMobile(res.data.mobile || '');
      setAddress(res.data.address || '');
      if (res.data.profilePicture) {
        setPreviewUrl(res.data.profilePicture);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePicture(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData();
    formData.append('mobile', mobile);
    formData.append('address', address);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      const res = await axios.put('/api/student/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(res.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Optionally update AuthContext user object if needed
      // login(res.data.token, res.data);
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-10 w-10 text-blue-600" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Profile Management</h1>
        <p className="text-gray-600">Update your personal contact details and profile picture.</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg text-sm border flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
          {message.text}
        </div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gray-100 border-2 border-white shadow-md overflow-hidden flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: previewUrl ? `url(${previewUrl})` : 'none' }}>
                {!previewUrl && <User className="h-10 w-10 text-gray-400" />}
              </div>
              <label htmlFor="profile-upload" className="absolute bottom-0 right-0 h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-blue-700 transition-colors shadow-sm">
                <Camera className="h-4 w-4" />
              </label>
              <input 
                id="profile-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900">{profile?.name}</h2>
              <p className="text-gray-500">{profile?.email}</p>
              <p className="text-xs text-gray-400 mt-1 uppercase tracking-wide font-semibold">{profile?.role}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <Phone className="h-4 w-4 mr-2 text-gray-400" /> Mobile Number
              </label>
              <input
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                <MapPin className="h-4 w-4 mr-2 text-gray-400" /> Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full residential address"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              type="submit" 
              disabled={saving}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
            >
              {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}