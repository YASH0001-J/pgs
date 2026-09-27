const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('ToastProvider')) {
  code = code.replace("import { QueryProvider } from './context/QueryContext';", "import { QueryProvider } from './context/QueryContext';\nimport { ToastProvider } from './context/ToastContext';");
  
  code = code.replace("<QueryProvider>", "<QueryProvider>\n      <ToastProvider>");
  code = code.replace("</QueryProvider>", "      </ToastProvider>\n    </QueryProvider>");
  
  fs.writeFileSync('src/App.tsx', code);
  console.log("Patched successfully");
} else {
  console.log("ToastProvider already present");
}
