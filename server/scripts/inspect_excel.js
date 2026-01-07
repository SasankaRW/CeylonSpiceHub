
import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../../product_list_final.xlsx');

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const dumpPath = path.join(__dirname, 'data_dump.json');
    fs.writeFileSync(dumpPath, JSON.stringify(data.slice(0, 100), null, 2));
    console.log('Data dumped to', dumpPath);
} catch (error) {
    console.error('Error reading file:', error);
}
