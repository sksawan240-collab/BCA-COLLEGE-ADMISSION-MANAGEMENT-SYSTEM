import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Award, Info, CheckCircle2 } from 'lucide-react';

export default function ScholarshipCalculator() {
  const [category, setCategory] = useState('General');
  const [marks, setMarks] = useState<number | ''>('');

  const BASE_FEE = 45000;

  // Calculation Logic
  const calculateScholarship = () => {
    let categoryDiscount = 0;
    let meritDiscount = 0;
    const currentMarks = Number(marks) || 0;

    // Category Logic
    if (category === 'SC/ST') {
      categoryDiscount = 22500; // 50% waiver
    } else if (category === 'OBC') {
      categoryDiscount = 11250; // 25% waiver
    }

    // Merit Logic
    if (currentMarks >= 95) {
      meritDiscount = 20000;
    } else if (currentMarks >= 90) {
      meritDiscount = 10000;
    } else if (currentMarks >= 85) {
      meritDiscount = 5000;
    }

    let totalDiscount = categoryDiscount + meritDiscount;
    if (totalDiscount > BASE_FEE) {
      totalDiscount = BASE_FEE;
    }

    return {
      categoryDiscount,
      meritDiscount,
      totalDiscount,
      finalFee: BASE_FEE - totalDiscount
    };
  };

  const results = calculateScholarship();
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString('en-IN')}`;

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      
      <div className="p-6 sm:p-8 relative z-10 text-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-md">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight">Scholarship Estimator</h3>
            <p className="text-sm text-indigo-200">Calculate your potential financial aid</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-2">Select Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 appearance-none [&>option]:text-gray-900"
              >
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC/ST">SC/ST</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-2">Previous Academic Marks (%)</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0" max="100"
                  value={marks}
                  onChange={(e) => setMarks(e.target.value === '' ? '' : (Number(e.target.value) > 100 ? 100 : Number(e.target.value)))}
                  placeholder="E.g. 88.5"
                  className="w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500 placeholder-indigo-300"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-300 font-medium">%</span>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-indigo-200 leading-relaxed">
              <Info className="h-4 w-4 inline-block mr-1 -mt-0.5 text-pink-400" />
              Estimates are indicative based on university guidelines. Final fee structure will be confirmed during the document verification process.
            </div>
          </div>

          {/* Results Display */}
          <div className="bg-white rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-pink-50 opacity-50"></div>
            
            <div className="relative z-10">
              <h4 className="text-gray-500 font-semibold text-sm uppercase tracking-wider mb-4">Estimated Breakdown</h4>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Standard Tuition Fee</span>
                  <span className="text-gray-900 font-bold">{formatCurrency(BASE_FEE)}</span>
                </div>

                <AnimatePresence>
                  {results.categoryDiscount > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-blue-600 flex items-center gap-1.5 font-medium">
                        <CheckCircle2 className="h-4 w-4" /> Category Waiver
                      </span>
                      <span className="text-blue-700 font-bold">-{formatCurrency(results.categoryDiscount)}</span>
                    </motion.div>
                  )}

                  {results.meritDiscount > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-pink-600 flex items-center gap-1.5 font-medium">
                        <Award className="h-4 w-4" /> Merit Scholarship
                      </span>
                      <span className="text-pink-700 font-bold">-{formatCurrency(results.meritDiscount)}</span>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <div className="pt-4 mt-2 border-t-2 border-dashed border-gray-200">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-gray-500 text-sm font-medium mb-1">Estimated Final Fee</p>
                      <p className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        {formatCurrency(results.finalFee)}
                      </p>
                    </div>
                    {results.totalDiscount > 0 && (
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        Save {formatCurrency(results.totalDiscount)}!
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
