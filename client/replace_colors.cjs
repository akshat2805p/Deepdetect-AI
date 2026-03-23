const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

const replacements = {
  // Colors
  'cyan-300': 'yellow-300',
  'cyan-400': 'yellow-400',
  'cyan-500': 'yellow-500',
  'cyan-600': 'yellow-600',
  'cyan-950': 'yellow-950',
  'blue-400': 'amber-400',
  'blue-500': 'amber-500',
  'blue-600': 'amber-600',
  'slate-400': 'neutral-400',
  'slate-500': 'neutral-500',
  'slate-700': 'neutral-700',
  'slate-800': 'neutral-800',
  'slate-850': 'neutral-800',
  'slate-900': 'neutral-900',
  'slate-950': 'black',
  'purple-400': 'amber-400',
  'purple-500': 'amber-500',
  // specific hex colors in styles or configs if any (mostly tailwind used)
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
      
      // Specifically fix auth error if it's due to local storage issues or wrong mock
      // Since it's a UI overhaul, we just do string replacements safely
      for (const [oldStr, newStr] of Object.entries(replacements)) {
        newContent = newContent.replace(new RegExp(oldStr, 'g'), newStr);
      }
      
      // Replace some generic 'blue'/'cyan' class prefixes that might be missed
      // like text-cyan-400 -> text-yellow-400 (already covered above)
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDirectory(directoryPath);
console.log('Done replacing colors in src directory.');
