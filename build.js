import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read individual source files
const mockDataContent = fs.readFileSync(path.join(__dirname, 'src/data/mockData.js'), 'utf8');
const engineContent = fs.readFileSync(path.join(__dirname, 'src/utils/engine.js'), 'utf8');
const mapHelperContent = fs.readFileSync(path.join(__dirname, 'src/utils/mapHelper.js'), 'utf8');
const appContent = fs.readFileSync(path.join(__dirname, 'src/app.js'), 'utf8');

// Strip export/import statements to make a clean browser-executable script
function stripEsm(code) {
  return code
    .replace(/^import\s+[\s\S]*?from\s+['"][^'"]+['"];?/gm, '')
    .replace(/^export\s+(const|let|var|function|class)\s+/gm, '$1 ');
}

const bundledCode = `
// LastBite Web Application - Standalone Unified Bundle
(function() {
  'use strict';

  // --- MOCK DATA ---
  ${stripEsm(mockDataContent)}

  // --- ENGINE ---
  ${stripEsm(engineContent)}

  // --- MAP HELPER ---
  ${stripEsm(mapHelperContent)}

  // --- APP LOGIC ---
  ${stripEsm(appContent)}

})();
`;

fs.writeFileSync(path.join(__dirname, 'src/bundle.js'), bundledCode, 'utf8');
console.log('Successfully bundled to src/bundle.js');
