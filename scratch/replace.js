const fs = require('fs');
let content = fs.readFileSync('src/app/profile/page.tsx', 'utf8');

content = content.replace(/w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold/g, 'w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold');
content = content.replace(/w-full px-3 py-2 bg-slate-50 border border-gray-200 rounded-lg text-xs font-semibold/g, 'w-full px-3.5 py-2.5 bg-slate-50 border border-gray-200 rounded-xl text-sm font-semibold');
content = content.replace(/w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold/g, 'w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold');

fs.writeFileSync('src/app/profil/page.tsx', content);
console.log('Replaced successfully');
