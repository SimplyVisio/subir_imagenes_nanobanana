import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { AssetList } from './components/AssetList';
import { UploadedAsset } from './types';
import { uploadFile } from './services/storage';
import { Toaster, toast } from 'react-hot-toast';
import { AlertCircle, Info } from 'lucide-react';

const App: React.FC = () => {
  const [assets, setAssets] = useState<UploadedAsset[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Load from local storage on mount (persistence simulation)
  useEffect(() => {
    const saved = localStorage.getItem('kie-assets');
    if (saved) {
      try {
        setAssets(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load assets", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('kie-assets', JSON.stringify(assets));
  }, [assets]);

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    const toastId = toast.loading('Subiendo imagen a la nube...');

    try {
      const newAsset = await uploadFile(file);
      setAssets(prev => [newAsset, ...prev]);
      toast.success('Imagen cargada correctamente', { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error('Error al subir la imagen', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-brand-500/30">
      <Toaster 
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            border: '1px solid #334155',
          },
        }}
      />
      
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Info Banner */}
        <div className="mb-8 p-4 rounded-xl bg-blue-900/20 border border-blue-500/20 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-200/80">
            <strong className="text-blue-200 block mb-1">Integración con n8n y Sora</strong>
            Sube tus imágenes aquí para obtener un enlace público persistente. Copia el enlace generado y utilízalo en tu nodo HTTP Request de n8n o directamente en el prompt de la API de Sora.
          </div>
        </div>

        {/* Upload Section */}
        <section className="max-w-3xl mx-auto">
          <UploadZone onFileSelect={handleFileSelect} isUploading={isUploading} />
        </section>

        {/* Gallery Section */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-8 rounded-full bg-gradient-to-b from-brand-400 to-brand-600"></span>
              Biblioteca de Activos
            </h2>
            <span className="text-sm text-slate-500 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              {assets.length} Archivos
            </span>
          </div>
          
          <AssetList assets={assets} />
        </section>

        {/* Disclaimer Footer for Demo */}
        <footer className="mt-20 border-t border-slate-900 pt-8 pb-12 text-center">
          <div className="inline-flex items-center justify-center p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs max-w-lg mx-auto mb-4">
            <AlertCircle className="w-4 h-4 mr-2" />
            <span>Nota: Esta es una demostración frontend. Para persistencia real de URL pública, configure Vercel Blob en el repositorio.</span>
          </div>
          <p className="text-slate-600 text-sm">
            © 2024 Kie Asset Manager. Designed for high-performance AI workflows.
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;