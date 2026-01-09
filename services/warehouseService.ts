import { Warehouse, WarehouseRawRow } from '../types';

// ==========================================
// ☁️ GOOGLE SHEET CONFIGURATION
// ==========================================
// 1. Open your Google Sheet
// 2. Go to File > Share > Publish to web
// 3. Select "Entire Document" (or specific sheet) and "Comma-separated values (.csv)"
// 4. Click Publish.
// 5. Copy the ID from your browser URL: docs.google.com/spreadsheets/d/[YOUR_ID_IS_HERE]/edit
const SPREADSHEET_ID = '1wqtDeNZvW6jAKiuln2RVjvC9Ruy5i465OyMvypapcvs'; 
const SHEET_NAME = 'Warehouse';

// Using Google Visualization API for reliable CSV export
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

// ==========================================
// 📦 FALLBACK DATA (Offline Mode)
// ==========================================
// Used if the Google Sheet connection fails (e.g. CORS, not published, network error)
const FALLBACK_DATA: WarehouseRawRow[] = [
  ['WH001', 'New York, NY', '+1 (555) 123-4567', 'John Doe', 'john.doe@logistics.com', 'https://example.com/chat/wh001'],
  ['WH002', 'Los Angeles, CA', '+1 (555) 987-6543', 'Jane Smith', 'jane.smith@logistics.com', ''],
  ['WH003', 'Chicago, IL', '+1 (555) 246-8101', 'Robert Johnson', 'bob.j@logistics.com', 'https://example.com/chat/wh003'],
  ['WH004', 'Houston, TX', '+1 (555) 135-7924', 'Emily Davis', 'emily.d@logistics.com', 'https://example.com/chat/wh004'],
  ['WH005', 'Phoenix, AZ', '+1 (555) 369-2580', 'Michael Brown', 'm.brown@logistics.com', ''],
];

export const getAllData = async (): Promise<Warehouse[]> => {
  try {
    const response = await fetch(CSV_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const text = await response.text();
    
    // Check if we got an HTML error page (common with permissions issues)
    if (text.trim().startsWith('<!DOCTYPE html>')) {
      throw new Error('Invalid Sheet ID or permissions. Make sure the Sheet is "Published to Web"');
    }

    const rows = parseCSV(text);

    // Remove header row if it exists
    const dataRows = rows.length > 0 && rows[0][0].toLowerCase() === 'id'
      ? rows.slice(1) 
      : rows;

    const mappedData = dataRows.map((row) => ({
      id: row[0] || '',
      city: row[1] || '',
      contact: row[2] || '',
      manager: row[3] || '',
      email: row[4] || '',
      chatLink: row[5] || '',
    })).filter(w => w.id && w.id.trim() !== '');

    if (mappedData.length === 0) {
        console.warn('Fetched data was empty, using fallback.');
        return getFallbackData();
    }

    return mappedData;
    
  } catch (error) {
    console.warn('⚠️ Google Sheet sync failed. Using offline fallback data.', error);
    return getFallbackData();
  }
};

const getFallbackData = (): Warehouse[] => {
    return FALLBACK_DATA.map(row => ({
        id: row[0],
        city: row[1],
        contact: row[2],
        manager: row[3],
        email: row[4],
        chatLink: row[5],
    }));
};

/**
 * Robust CSV Parser that handles quoted fields containing commas
 */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let inQuotes = false;
  
  // Normalize line endings
  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (inQuotes) {
      if (char === '"' && nextChar === '"') {
        currentVal += '"';
        i++; // Skip escaped quote
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentVal += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentVal.trim().replace(/^"|"$/g, '')); 
        currentVal = '';
      } else if (char === '\n') {
        currentRow.push(currentVal.trim().replace(/^"|"$/g, ''));
        rows.push(currentRow);
        currentRow = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
  }

  // Push last row if exists
  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal.trim().replace(/^"|"$/g, ''));
    rows.push(currentRow);
  }

  return rows;
}