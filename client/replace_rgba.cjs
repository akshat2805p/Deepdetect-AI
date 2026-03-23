const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = {
  // Hex strings to update if any
  '34,211,238': '250,204,21', // cyan-400 to yellow-400
  '6,182,212': '234,179,8',  // cyan-500 to yellow-500
  '8,145,178': '202,138,4',  // cyan-600 to yellow-600
  '59,130,246': '245,158,11', // blue-500 to amber-500
  '37,99,235': '217,119,6',   // blue-600 to amber-600
  // Handle some manual background strings
  'bg-cyan-950': 'bg-yellow-950', // missing from previous
  'from-cyan-300': 'from-yellow-300',
  'to-blue-500': 'to-amber-500',
  'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500': 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500'
};

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      
      for (const [oldStr, newStr] of Object.entries(replacements)) {
        newContent = newContent.replace(new RegExp(oldStr, 'g'), newStr);
      }
      
      // Additional targeted fixes
      // Make sure Military-Grade Security has gold text
      newContent = newContent.replace(/<span className="text-cyan-400">Security<\/span>/g, '<span className="text-yellow-400">Security</span>');
      // Fix background glow specifically if it has hardcoded blue/cyan styles missed
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Fixed additional styles in:', fullPath);
      }
    }
  }
}

processDirectory(directoryPath);
console.log('Done fixing RGBA colors in src directory.');
