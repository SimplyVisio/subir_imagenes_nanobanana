import React from 'react';
import { UploadedAsset } from '../types';
import { Copy, ExternalLink, Image as ImageIcon, Check, FileJson, FileCode } from 'lucide-react';
import { formatBytes, formatDate } from '../utils/format';

interface AssetListProps {
  assets: UploadedAsset[];
}

export const AssetList: React.FC<AssetListProps> = ({ assets }) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  if (assets.length === 0) {
    return (
      <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl">
        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <ImageIcon className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-slate-400 font-medium">No hay activos cargados</h3>
        <p className="text-slate-600 text-sm mt-1">Sube una imagen o JSON para comenzar</p>
      </div>
    );
  }

  const renderPreview = (asset: UploadedAsset) => {
    if (asset.type === 'application/json') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 group-hover:bg-slate-800 transition-colors">
          <FileJson className="w-12 h-12 text-slate-600 group-hover:text-brand-400 transition-colors mb-2" />
          <span className="text-[10px] text-slate-500 font-mono">JSON</span>
        </div>
      );
    }
    
    return (
      <img 
        src={asset.url} 
        alt={asset.name} 
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
      />
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {assets.map((asset) => (
        <div 
          key={asset.id} 
          className="group relative bg-slate-900 border border-slate-800 hover:border-brand-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-brand-900/20 flex flex-col"
        >
          {/* Image Preview Area */}
          <div className="aspect-video w-full bg-slate-950 relative overflow-hidden">
            {renderPreview(asset)}
            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-mono text-white border border-white/10">
              {asset.type.includes('json') ? 'JSON' : asset.type.split('/')[1].toUpperCase()}
            </div>
          </div>

          {/* Info Area */}
          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-medium text-slate-200 truncate pr-2" title={asset.name}>
                {asset.name}
              </h4>
              <div className="flex items-center space-x-2 mt-1 mb-4">
                <span className="text-xs text-slate-500">{formatBytes(asset.size)}</span>
                <span className="text-slate-700 text-[10px]">•</span>
                <span className="text-xs text-slate-500">{formatDate(asset.createdAt)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  readOnly 
                  value={asset.url}
                  className="w-full bg-slate-950 border border-slate-800 rounded-md py-2 pl-3 pr-10 text-xs text-slate-400 focus:outline-none focus:border-brand-500/50 truncate"
                />
                <button
                   onClick={() => handleCopyUrl(asset.url, asset.id)}
                   className="absolute right-1 top-1 p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-brand-400 transition-colors"
                   title="Copiar URL"
                >
                  {copiedId === asset.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              
              <a 
                href={asset.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg border border-slate-700 transition-colors"
                title="Abrir original"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};