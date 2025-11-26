import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud, FileImage, X, Loader2 } from 'lucide-react';
import { ALLOWED_MIME_TYPES, MAX_FILE_SIZE_BYTES } from '../constants';
import { formatBytes } from '../utils/format';

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onFileSelect, isUploading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError(`Tipo de archivo no soportado. Use: JPEG, PNG, WEBP.`);
      return false;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`El archivo excede el límite de ${formatBytes(MAX_FILE_SIZE_BYTES)}.`);
      return false;
    }
    return true;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full mb-8">
      <div 
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-2xl p-8 sm:p-12 transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center text-center
          ${dragActive 
            ? 'border-brand-500 bg-brand-500/10 scale-[1.01]' 
            : 'border-slate-700 hover:border-brand-400 hover:bg-slate-800/50 bg-slate-900/50'
          }
          ${isUploading ? 'opacity-50 pointer-events-none' : 'opacity-100'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={ALLOWED_MIME_TYPES.join(',')}
          onChange={handleChange}
        />

        <div className={`
          w-16 h-16 mb-4 rounded-2xl flex items-center justify-center transition-all duration-300
          ${dragActive ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-brand-400'}
        `}>
          {isUploading ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8" />
          )}
        </div>

        <h3 className="text-lg font-semibold text-slate-200 mb-2">
          {isUploading ? 'Subiendo activo...' : 'Arrastra tu imagen aquí'}
        </h3>
        
        <p className="text-sm text-slate-400 max-w-xs mx-auto mb-4">
          Soporta JPG, PNG y WEBP hasta 10MB.
          <br/>
          <span className="text-xs text-slate-500 mt-2 block">Optimizado para Kie AI Sora 2</span>
        </p>

        {!isUploading && (
          <button 
            type="button"
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium text-brand-400 transition-colors border border-slate-700"
          >
            Explorar archivos
          </button>
        )}

        {error && (
          <div className="absolute inset-x-4 bottom-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center justify-between text-red-400 text-sm animate-in fade-in slide-in-from-bottom-2">
            <span>{error}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setError(null); }}
              className="p-1 hover:bg-red-500/20 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};