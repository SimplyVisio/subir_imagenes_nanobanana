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
    // 2. Procesar el Form Data (multipart)
    const formData = await request.formData();
    let file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided in "file" field' }), { status: 400 });
    }

    // --- LOGICA DE CONVERSIÓN JSON A IMAGEN ---
    // Si es un JSON, intentamos extraer la imagen base64 de adentro
    if (file.type === 'application/json' || file.name.endsWith('.json')) {
      try {
        const textContent = await file.text();
        const json = JSON.parse(textContent);
        
        // Buscamos campos comunes donde podría venir el base64
        // Acepta: { "data": "...", "image": "...", "base64": "...", "content": "..." }
        const base64String = json.data || json.image || json.base64 || json.content || json.file;

        if (base64String && typeof base64String === 'string') {
          // Limpiar cabecera data:image/png;base64, si existe
          const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
          
          // Convertir a Buffer
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Determinar nombre y tipo
          // Si el JSON trae nombre, úsalo, si no, cambia la extensión del archivo subido o genera uno
          let fileName = json.name || json.fileName || file.name.replace('.json', '.png');
          if (!fileName.match(/\.(jpg|jpeg|png|webp)$/i)) {
            fileName += '.png'; // Default a png si no hay extensión
          }

          // Determinar mime type (simple, basado en extensión o default)
          let contentType = json.type || json.mimeType;
          if (!contentType) {
             if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) contentType = 'image/jpeg';
             else if (fileName.endsWith('.webp')) contentType = 'image/webp';
             else contentType = 'image/png';
          }

          // Crear un nuevo objeto "File-like" para subir (Buffer funciona directo en put)
          // Sobreescribimos la variable 'file' original con el buffer, pero put() acepta string | buffer | file
          // Así que cambiamos la llamada a put abajo ligeramente.
          
          const blob = await put(fileName, buffer, {
            access: 'public',
            addRandomSuffix: true,
            contentType: contentType
          });

          return new Response(JSON.stringify({
            success: true,
            converted: true, // Flag para saber que fue convertido
            url: blob.url,
            downloadUrl: blob.downloadUrl,
            pathname: blob.pathname,
            contentType: blob.contentType,
            uploadedAt: new Date().toISOString()
          }), {
            status: 200,
            headers: { 'content-type': 'application/json' },
          });
        }
      } catch (e) {
        console.warn("Fallo al intentar parsear JSON como imagen, subiendo archivo original:", e);
        // Si falla el parseo, sigue y sube el archivo JSON original tal cual
      }
    }
    // -------------------------------------------

    // 3. Subida normal (Imagen directa o JSON fallido)
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true, 
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
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
}