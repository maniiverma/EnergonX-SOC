import fs from 'fs';
import path from 'path';

// Storage file locations parameters set matching configurations
const getFilePath = (fileName) => {
  return path.join(process.cwd(), 'data', fileName);
};

// Ensure data folder directory exists safely standard
const ensureDirectoryExists = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Named Export standard for read JSON arrays
export const readJSON = (fileName) => {
  const filePath = getFilePath(fileName);
  try {
    if (!fs.existsSync(filePath)) return [];
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err);
    return [];
  }
};

// Named Export standard for write JSON configurations strings
export const writeJSON = (fileName, data) => {
  const filePath = getFilePath(fileName);
  try {
    ensureDirectoryExists(filePath);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error(`Error writing to ${fileName}:`, err);
    return false;
  }
};
