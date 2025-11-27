import { put } from '@vercel/blob';
import { Buffer } from 'buffer';

export const config = {
  runtime: 'nodejs',
};

export async function POST(request: Request): Promise<Response> {
  // 1. Seguridad: Verificar API Key
  const authHeader = request.headers.get('x-api-key');
  if (authHeader !== process.env.N8N_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  try {
    const contentType = request.headers.get('content-type') || '';
    let buffer: Buffer;
    let filename = '';
    let mimeType = 'image/png'; // Default

    // CASO A: Solicitud JSON (Configuración actual de tu n8n)
    if (contentType.includes('application/json')) {
      const body = await request.json();
      
      // Buscar la data base64 en varios campos posibles
      const base64String = body.data || body.image || body.base64 || body.content || body.file;
      
      if (!base64String) {
        return new Response(JSON.stringify({ error: 'Body JSON must contain a "data" field with base64 string' }), { status: 400 });
      }

      // Limpiar prefijo data URI si existe (ej: data:image/png;base64,...)
      const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');

      // Determinar nombre del archivo (Asegurando que sea STRING)
      const rawName = body.name || body.filename || `upload-${Date.now()}.png`;
      filename = String(rawName);

      if (!filename.match(/\.(jpg|jpeg|png|webp)$/i)) {
        filename += '.png';
      }

      // Intentar adivinar mime type por extensión
      if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) mimeType = 'image/jpeg';
      else if (filename.endsWith('.webp')) mimeType = 'image/webp';
      else mimeType = 'image/png';
    } 
    // CASO B: Solicitud Multipart (Archivo binario estándar)
    else if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File || formData.get('data') as File;

      if (!file) {
        return new Response(JSON.stringify({ error: 'No file found in form data' }), { status: 400 });
      }

      // Sub-caso: Si subes un archivo .json que contiene la imagen base64
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        const text = await file.text();
        try {
          const json = JSON.parse(text);
          const base64String = json.data || json.image || json.base64;
          if (base64String) {
             const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
             buffer = Buffer.from(base64Data, 'base64');
             
             // Asegurar que sea string
             const rawJsonName = json.name || file.name.replace('.json', '.png');
             filename = String(rawJsonName);

             if (!filename.match(/\.(jpg|jpeg|png|webp)$/i)) filename += '.png';
          } else {
             // Es un JSON normal sin imagen, subir como tal
             buffer = Buffer.from(text);
             filename = file.name;
             mimeType = 'application/json';
          }
        } catch (e) {
          return new Response(JSON.stringify({ error: 'Invalid JSON file content' }), { status: 400 });
        }
      } else {
        // Es una imagen normal
        const arrayBuffer = await file.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
        filename = file.name;
        mimeType = file.type;
      }
    } else {
      return new Response(JSON.stringify({ error: `Unsupported Content-Type: ${contentType}. Use application/json or multipart/form-data` }), { status: 400 });
    }

    // 2. Subir a Vercel Blob
    const blob = await put(filename, buffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: mimeType
    });

    return new Response(JSON.stringify({
      success: true,
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      contentType: blob.contentType,
      uploadedAt: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}