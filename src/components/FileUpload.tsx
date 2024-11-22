import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length) {
      const file = files[0];
      if (isValidFileType(file)) {
        onFileUpload(file);
      } else {
        alert('Format de fichier non supporté. Veuillez utiliser un fichier CSV, XLS ou XLSX.');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      if (isValidFileType(files[0])) {
        onFileUpload(files[0]);
      } else {
        alert('Format de fichier non supporté. Veuillez utiliser un fichier CSV, XLS ou XLSX.');
      }
    }
  };

  const isValidFileType = (file: File) => {
    const validTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];
    return validTypes.includes(file.type) || 
           /\.(csv|xlsx|xls)$/.test(file.name.toLowerCase());
  };

  return (
    <div
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".csv,.xlsx,.xls"
        onChange={handleFileInput}
        className="hidden"
        id="fileInput"
      />
      <label htmlFor="fileInput" className="cursor-pointer">
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Glissez et déposez votre fichier CSV ou Excel ici ou
        </p>
        <p className="text-sm text-blue-500 hover:text-blue-600">
          cliquez pour parcourir
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Formats supportés: .csv, .xlsx, .xls
        </p>
      </label>
    </div>
  );
}