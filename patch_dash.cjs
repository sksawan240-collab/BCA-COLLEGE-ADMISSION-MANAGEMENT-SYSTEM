const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/AdminDashboard.tsx', 'utf8');

// 1. Wrap the return in a colorful gradient background
content = content.replace(
  /<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">/,
  `<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">`
);

// Close the new wrapper div at the end
content = content.replace(
  /    <\/div>\s*  \);\s*\}\s*$/,
  `    </div>\n    </div>\n  );\n}\n`
);

// 2. Enhance Header Text
content = content.replace(
  /<h1 className="text-2xl font-bold text-gray-900">Admin Dashboard<\/h1>/,
  `<motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Admin Dashboard</motion.h1>`
);

content = content.replace(
  /<p className="text-gray-600">Overview of admission applications<\/p>/,
  `<motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="text-gray-600 mt-1">Overview of admission applications</motion.p>`
);

// 3. Enhance Header Buttons with motion
content = content.replace(
  /<div className="flex gap-3">[\s\S]*?<\/div>/,
  `<div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/admin/settings" className="bg-white border-2 border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:border-purple-300 hover:text-purple-700 transition-colors flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/admin/merit-list" className="bg-white border-2 border-indigo-600 text-indigo-700 px-4 py-2 rounded-lg font-bold shadow-sm hover:bg-indigo-50 transition-colors flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Merit List
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/admin/applications" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 border-none">
              <Users className="h-5 w-5" />
              All Applications
            </Link>
          </motion.div>
        </div>`
);

// 4. Enhance Stat Cards
content = content.replace(
  /<motion\.div key=\{i\} initial=\{\{ opacity: 0, y: 10 \}\} animate=\{\{ opacity: 1, y: 0 \}\} transition=\{\{ delay: i \* 0\.1 \}\} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center gap-4">/g,
  `<motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.03, y: -5 }} transition={{ delay: i * 0.1, type: "spring", stiffness: 300 }} className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-xl hover:shadow-indigo-100/50 transition-shadow">`
);

// 5. Enhance Chart Containers
content = content.replace(
  /className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"/g,
  `whileHover={{ y: -4 }} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-xl hover:shadow-indigo-100/40 transition-all duration-300"`
);
content = content.replace(
  /className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2"/g,
  `whileHover={{ y: -4 }} className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm border border-gray-100 p-6 lg:col-span-2 hover:shadow-xl hover:shadow-indigo-100/40 transition-all duration-300"`
);

// Update colors in statCards array to be more vibrant
content = content.replace(
  /color: 'text-blue-600', bg: 'bg-blue-50'/g,
  `color: 'text-blue-600', bg: 'bg-blue-100'`
);
content = content.replace(
  /color: 'text-indigo-600', bg: 'bg-indigo-50'/g,
  `color: 'text-indigo-600', bg: 'bg-indigo-100'`
);
content = content.replace(
  /color: 'text-gray-600', bg: 'bg-gray-50'/g,
  `color: 'text-gray-600', bg: 'bg-gray-100'`
);
content = content.replace(
  /color: 'text-yellow-600', bg: 'bg-yellow-50'/g,
  `color: 'text-amber-600', bg: 'bg-amber-100'`
);
content = content.replace(
  /color: 'text-orange-600', bg: 'bg-orange-50'/g,
  `color: 'text-orange-600', bg: 'bg-orange-100'`
);
content = content.replace(
  /color: 'text-green-600', bg: 'bg-green-50'/g,
  `color: 'text-emerald-600', bg: 'bg-emerald-100'`
);

fs.writeFileSync('src/pages/admin/AdminDashboard.tsx', content);
