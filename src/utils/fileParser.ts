import Papa from 'papaparse';
import * as XLSX from 'xlsx';

export async function parseFile(file: File): Promise<{ headers: string[], data: string[][] }> {
  if (file.name.toLowerCase().endsWith('.csv')) {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        complete: (results) => {
          const parsedData = results.data as string[][];
          if (parsedData.length > 0) {
            resolve({
              headers: parsedData[0],
              data: parsedData.slice(1).filter(row => row.some(cell => cell.trim() !== ''))
            });
          } else {
            reject(new Error('Le fichier est vide'));
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } else {
    // Pour les fichiers Excel
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convertir en tableau avec en-têtes
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as string[][];
          
          if (jsonData.length > 0) {
            resolve({
              headers: jsonData[0].map(String),
              data: jsonData.slice(1).filter(row => row.some(cell => cell?.toString().trim() !== ''))
            });
          } else {
            reject(new Error('Le fichier est vide'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Erreur lors de la lecture du fichier'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
}