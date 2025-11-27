import { upload } from '@vercel/blob/client';
import { UploadedAsset } from "../types";

// Función auxiliar para convertir JSON a Archivo de Imagen en el navegador
const processJsonFile = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const json = JSON.parse(text);
        
        // Buscar cadena base64
        let base64String = json.data || json.image || json.base64 || json.content || json.file;
        
        if (!base64String) {
          // Si no encontramos base64, devolvemos el archivo original (se subirá como json)
          resolve(file);
          return;
        }

        // Asegurar formato data URI para conversión
        if (!base64String.startsWith('data:')) {
            // Asumimos png si no tiene cabecera
            base64String = `data:image/png;base64,${base64String}`;
        }

        // Fetch para convertir base64 a Blob
        const res = await fetch(base64String);
        const blob = await res.blob();
        
        // Determinar nombre
        let newName = json.name || file.name.replace('.json', '.png');
        if (!newName.match(/\.(jpg|jpeg|png|webp)$/i)) newName += '.png';

        // Crear nuevo archivo de imagen
        const imageFile = new File([blob], newName, { type: blob.type });
        resolve(imageFile);
      } catch (error) {
        console.warn("Error parseando JSON en cliente, subiendo original:", error);
        resolve(file);
      }
    };
    reader.onerror = () => resolve(file);
    reader.readAsText(file);
  });
};

export const uploadFile = async (file: File): Promise<UploadedAsset> => {
  // Implementación real usando Vercel Blob
  
  try {
    let fileToUpload = file;

    // Si es JSON, intentamos convertirlo a imagen primero
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
        fileToUpload = await processJsonFile(file);
    }

    const newBlob = await upload(fileToUpload.name, fileToUpload, {
      access: 'public',
      handleUploadUrl: '/api/upload', // Llama a nuestra función serverless
    });

    return {
      id: crypto.randomUUID(),
      name: newBlob.pathname, // Usamos pathname para asegurar extensión correcta en UI
      url: newBlob.url, // URL pública permanente
      type: newBlob.contentType || fileToUpload.type,
      size: fileToUpload.size, // Usar tamaño del archivo convertido
      createdAt: Date.now(),
      status: 'completed'
    };
  } catch (error) {
    console.error("Error subiendo a Vercel Blob:", error);
    
    // Fallback SOLO para desarrollo local
    if (process.env.NODE_ENV === 'development') {
        console.warn("Usando modo fallback local (sin persistencia real)");
        // Simulación básica
        return {
            id: crypto.randomUUID(),
            name: file.name,
            url: URL.createObjectURL(file), 
            type: file.type,
            size: file.size,
            createdAt: Date.now(),
            status: 'completed'
        };
    }

    throw error;
  }
};