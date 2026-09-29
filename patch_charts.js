const fs = require('fs');
const content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf8');

const replacement = `
      {/* Visualizations Section */}
      {stats.weeklyData && (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Application Trends</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                  <Tooltip 
                    cursor={{ fill: '#F3F4F6' }}
                    contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="applications" name="Total Applications" fill="#4F46E5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  <Bar dataKey="pendingVerifications" name="Pending Verifications" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Revenue Generation</h3>
              <div className="bg-emerald-50 p-2 rounded-lg flex items-center gap-2">
                <IndianRupee className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-emerald-700 text-sm">
                  Total: ₹{stats.weeklyData.reduce((acc: number, curr: any) => acc + curr.revenue, 0).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.weeklyData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6B7280' }} 
                    tickFormatter={(value) => \`₹\${value}\`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    formatter={(value: number) => [\`₹\${value.toLocaleString()}\`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Status Distribution</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Draft', value: stats.draft },
                      { name: 'Submitted', value: stats.submitted },
                      { name: 'Under Review', value: stats.underReview },
                      { name: 'Correction Req.', value: stats.correctionRequired || 0 },
                      { name: 'Approved', value: stats.approved },
                      { name: 'Rejected', value: stats.rejected || 0 },
                    ].filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {[
                      { name: 'Draft', value: stats.draft },
                      { name: 'Submitted', value: stats.submitted },
                      { name: 'Under Review', value: stats.underReview },
                      { name: 'Correction Req.', value: stats.correctionRequired || 0 },
                      { name: 'Approved', value: stats.approved },
                      { name: 'Rejected', value: stats.rejected || 0 },
                    ].filter(item => item.value > 0).map((entry, index) => {
                      const colors: any = {
                        'Draft': '#9CA3AF',
                        'Submitted': '#3B82F6',
                        'Under Review': '#F59E0B',
                        'Correction Req.': '#F97316',
                        'Approved': '#10B981',
                        'Rejected': '#EF4444'
                      };
                      return <Cell key={\`cell-\${index}\`} fill={colors[entry.name]} />;
                    })}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Legend iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-6">Demographics (Category & Gender)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.demographics || []} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#4B5563', fontWeight: 500 }} width={80} />
                  <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                  <Bar dataKey="value" name="Applicants" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={24} />
                </BarChart>
              </ResponsiveContainer>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.genderDistribution || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => \`\${name} \${(percent * 100).toFixed(0)}%\`}
                  >
                    {(stats.genderDistribution || []).map((entry: any, index: number) => {
                      const colors = ['#3B82F6', '#EC4899', '#10B981', '#F59E0B'];
                      return <Cell key={\`cell-\${index}\`} fill={colors[index % colors.length]} />;
                    })}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '0.5rem', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
        </>
`;

const updatedContent = content.replace(/\{\/\* Visualizations Section \*\/\}[\s\S]*?\)\}/, replacement + "\n      )}");

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', updatedContent);
