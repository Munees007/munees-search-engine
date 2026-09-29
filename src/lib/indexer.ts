import fs from 'fs';
import path from 'path';

export interface IndexedPage {
  url: string;
  title: string;
  description: string;
  content: string;
  keywords: string[];
}

const DATA_FILE = path.join(process.cwd(), 'data.json');

export function getIndex(): IndexedPage[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data) as IndexedPage[];
  } catch (error) {
    console.error('Failed to read index:', error);
    return [];
  }
}

export function saveToIndex(page: IndexedPage) {
  const index = getIndex();
  // Check if already indexed
  const existingIndex = index.findIndex(p => p.url === page.url);
  
  if (existingIndex !== -1) {
    index[existingIndex] = page;
  } else {
    index.push(page);
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(index, null, 2), 'utf-8');
}
