import { UploadedAsset } from "../types";

// NOTE: In a real Vercel environment, you would use @vercel/blob
// Example: import { put } from '@vercel/blob';

export const uploadFile = async (file: File): Promise<UploadedAsset> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // -------------------------------------------------------------------------
  // IMPORTANT: MOCK IMPLEMENTATION FOR DEMO
  // Since we cannot deploy a backend in this code generation, we use FileReader
  // to create a local Data URL.
  //
  // FOR PRODUCTION WITH VERCEL:
  // 1. Install @vercel/blob
  // 2. Create an API route (e.g., /api/upload)
  // 3. Use `put(file.name, file, { access: 'public' })`
  // -------------------------------------------------------------------------

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      
      const asset: UploadedAsset = {
        id: crypto.randomUUID(),
        name: file.name,
        // In a real app, this would be `https://...public.blob.vercel-storage.com/...`
        url: base64, 
        type: file.type,
        size: file.size,
        createdAt: Date.now(),
        status: 'completed'
      };
      
      resolve(asset);
    };
    reader.onerror = () => reject(new Error("Error reading file"));
    reader.readAsDataURL(file);
  });
};