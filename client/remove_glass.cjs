const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function processDirectory(directory) {
  const files = fs.readdirSync(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let newContent = content;
      
      // Remove backdrop-blur utilities
      newContent = newContent.replace(/\bbackdrop-blur-(sm|md|lg|xl|2xl|3xl|none)\b/g, '');
      newContent = newContent.replace(/\bbackdrop-blur\b/g, '');
      
      // Remove background opacities (bg-opacity-*/ bg-*/50) modifying to solid
      newContent = newContent.replace(/\bbg-neutral-900\/[0-9]+\b/g, 'bg-neutral-900');
      newContent = newContent.replace(/\bbg-neutral-800\/[0-9]+\b/g, 'bg-neutral-800');
      newContent = newContent.replace(/\bbg-black\/[0-9]+\b/g, 'bg-neutral-950');
      newContent = newContent.replace(/\bbg-yellow-500\/10\b/g, 'bg-neutral-900 border border-yellow-500/20');
      newContent = newContent.replace(/\bbg-amber-500\/10\b/g, 'bg-neutral-900 border border-amber-500/20');
      newContent = newContent.replace(/\bbg-white\/5\b/g, 'bg-neutral-800');
      newContent = newContent.replace(/\bborder-white\/[0-9]+\b/g, 'border-yellow-600/30');

      // Clean multiple spaces horizontally only to avoid eating newlines
      newContent = newContent.replace(/ {2,}/g, ' ').replace(/className=" /g, 'className="').replace(/ "/g, '"');
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Removed glassmorphism safely from:', fullPath);
      }
    }
  }
}

processDirectory(directoryPath);
console.log('Done scrubbing inline glass safely.');
