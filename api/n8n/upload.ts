import { put } from '@vercel/blob';

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
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ error: 'No file provided in "file" field' }), { status: 400 });
    }

    // 3. Subir a Vercel Blob (Server Side Upload)
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true, // Añade sufijo para evitar colisiones
    });

    // 4. Retornar la URL y metadatos para n8n
    // Nota: Eliminamos 'size' aquí porque el tipo PutBlobResult no siempre lo garantiza,
    // pero la URL es lo que necesitas para Sora.
    return new Response(JSON.stringify({
      success: true,
      url: blob.url,           // ESTE ES TU IDENTIFICADOR ÚNICO Y URL PÚBLICA
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