import * as XLSX from 'xlsx';

export interface SpreadsheetState {
  sheetName: string;
  headers: string[];
  rows: (string | number)[][];
  activeCell: string;
}

export const DEFAULT_STUDENT_HEADERS = ['Student Name', 'Tamil', 'English', 'Maths', 'Total', 'Result'];

export const DEFAULT_STUDENT_ROWS: (string | number)[][] = [
  ['Rahul Sharma', 85, 90, 95, 270, 'Pass'],
  ['Priya Natarajan', 92, 94, 98, 284, 'Pass'],
  ['Karthik Raja', 78, 80, 85, 243, 'Pass'],
  ['Ananya Iyer', 95, 96, 92, 283, 'Pass'],
  ['Dinesh Kumar', 65, 70, 72, 207, 'Pass']
];

// Calculate cell reference from colIndex (0-based) and rowIndex (0-based)
export function getCellRef(colIndex: number, rowIndex: number): string {
  const colLetter = String.fromCharCode(65 + colIndex);
  return `${colLetter}${rowIndex + 1}`;
}

// Parse cell reference (e.g. "C3") into column and row indices
export function parseCellRef(cellRef: string): { col: number; row: number } | null {
  const match = cellRef.trim().toUpperCase().match(/^([A-Z]+)(\d+)$/);
  if (!match) return null;
  const colLetters = match[1];
  let col = 0;
  for (let i = 0; i < colLetters.length; i++) {
    col = col * 26 + (colLetters.charCodeAt(i) - 64);
  }
  const row = parseInt(match[2], 10) - 1;
  return { col: col - 1, row };
}

// Convert state to real XLSX workbook and trigger browser download
export function exportToExcel(state: SpreadsheetState, filename = 'KIKI_Spreadsheet.xlsx') {
  const data = [state.headers, ...state.rows];
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  const colWidths = state.headers.map(h => ({ wch: Math.max(h.length + 4, 14) }));
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, state.sheetName || 'Sheet1');

  XLSX.writeFile(workbook, filename);
}

// Export to CSV
export function exportToCSV(state: SpreadsheetState, filename = 'KIKI_Spreadsheet.csv') {
  const data = [state.headers, ...state.rows];
  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Set a specific cell value
export function setCellValue(
  currentState: SpreadsheetState,
  cellRef: string,
  value: string | number
): { newState: SpreadsheetState; oldValue?: string | number } {
  const parsed = parseCellRef(cellRef);
  if (!parsed) return { newState: currentState };

  const { col, row } = parsed;
  const newRows = currentState.rows.map(r => [...r]);

  // If row is 0, it might be the header or row 1 (in Excel, row 1 is header if header exists)
  if (row === 0 && col < currentState.headers.length) {
    const newHeaders = [...currentState.headers];
    const oldValue = newHeaders[col];
    newHeaders[col] = String(value);
    return {
      newState: { ...currentState, headers: newHeaders, activeCell: cellRef },
      oldValue
    };
  }

  // Data row is row - 1
  const dataRowIndex = row - 1;

  // Expand rows if needed
  while (newRows.length <= dataRowIndex) {
    newRows.push(new Array(currentState.headers.length).fill(''));
  }

  // Expand columns in row if needed
  while (newRows[dataRowIndex].length <= col) {
    newRows[dataRowIndex].push('');
  }

  const oldValue = newRows[dataRowIndex][col];
  newRows[dataRowIndex][col] = isNaN(Number(value)) ? value : Number(value);

  // Recalculate totals if this is a student mark row
  if (currentState.headers.includes('Total') && currentState.headers.includes('Result')) {
    const totalCol = currentState.headers.indexOf('Total');
    const resultCol = currentState.headers.indexOf('Result');

    let sum = 0;
    let markCount = 0;
    let failed = false;

    for (let c = 1; c < totalCol; c++) {
      const val = Number(newRows[dataRowIndex][c]);
      if (!isNaN(val) && val > 0) {
        sum += val;
        markCount++;
        if (val < 35) failed = true;
      }
    }

    if (markCount > 0) {
      newRows[dataRowIndex][totalCol] = sum;
      newRows[dataRowIndex][resultCol] = failed ? 'Fail' : 'Pass';
    }
  }

  return {
    newState: {
      ...currentState,
      rows: newRows,
      activeCell: cellRef
    },
    oldValue
  };
}

// Read value of a cell
export function readCellValue(state: SpreadsheetState, cellRef: string): string {
  const parsed = parseCellRef(cellRef);
  if (!parsed) return `Invalid cell reference: ${cellRef}`;

  const { col, row } = parsed;
  if (row === 0) {
    return state.headers[col] !== undefined ? `Cell ${cellRef} contains header "${state.headers[col]}"` : `Cell ${cellRef} is empty`;
  }

  const dataRow = row - 1;
  if (dataRow >= state.rows.length || col >= (state.rows[dataRow]?.length || 0)) {
    return `Cell ${cellRef} is currently empty`;
  }

  const val = state.rows[dataRow][col];
  const colName = state.headers[col] || `Column ${String.fromCharCode(65 + col)}`;
  return `Cell ${cellRef} (${colName}) is ${val}`;
}
