import { upload } from '@vercel/blob/client';
import { UploadedAsset } from "../types";

export const uploadFile = async (file: File): Promise<UploadedAsset> => {
  // Implementación real usando Vercel Blob
  // Esto requiere que la variable de entorno BLOB_READ_WRITE_TOKEN esté configurada en Vercel
  // y que el archivo api/upload.ts exista para manejar la autorización.

  try {
    const newBlob = await upload(file.name, file, {
      access: 'public',
      handleUploadUrl: '/api/upload', // Llama a nuestra función serverless
    });

    return {
      id: crypto.randomUUID(),
      name: file.name,
      url: newBlob.url, // URL pública permanente
      type: file.type,
      size: file.size,
      createdAt: Date.now(),
      status: 'completed'
    };
  } catch (error) {
    console.error("Error subiendo a Vercel Blob:", error);
    
    // Fallback SOLO para desarrollo local si no hay conexión a API real
    // En producción, esto debería fallar si no hay backend
    if (process.env.NODE_ENV === 'development') {
        console.warn("Usando modo fallback local (sin persistencia real)");
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                id: crypto.randomUUID(),
                name: file.name,
                url: reader.result as string, 
                type: file.type,
                size: file.size,
                createdAt: Date.now(),
                status: 'completed'
              });
            };
            reader.onerror = () => reject(new Error("Error reading file locally"));
            reader.readAsDataURL(file);
        });
    }

    throw error;
  }
};