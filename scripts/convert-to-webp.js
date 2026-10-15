const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) {
      getFiles(full, files);
    } else if (item.toLowerCase().endsWith('.png')) {
      files.push(full);
    }
  }
  return files;
}

const pngFiles = getFiles(path.join(__dirname, '..', 'public'));
console.log('Found PNG files to convert:', pngFiles.length);

async function convertAll() {
  let totalSaved = 0;
  for (const file of pngFiles) {
    const webpPath = file.replace(/\.png$/i, '.webp');
    try {
      const origSize = fs.statSync(file).size;
      const info = await sharp(file).webp({ quality: 90, effort: 6 }).toFile(webpPath);
      const saved = origSize - info.size;
      totalSaved += saved;
      console.log(
        path.basename(file) + ': ' +
        (origSize / 1024).toFixed(1) + ' KB -> ' +
        (info.size / 1024).toFixed(1) + ' KB (' +
        ((saved / origSize) * 100).toFixed(0) + '% saved)'
      );
    } catch (e) {
      console.error('Failed ' + file + ':', e.message);
    }
  }
  console.log('Total storage / bandwidth saved:', (totalSaved / 1024).toFixed(1), 'KB');
}

convertAll();
