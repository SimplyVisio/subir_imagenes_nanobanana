import { head } from '@vercel/blob';

export const config = {
  runtime: 'nodejs',
};

export async function GET(request: Request): Promise<Response> {
  // 1. Seguridad
  const authHeader = request.headers.get('x-api-key');
  if (authHeader !== process.env.N8N_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // 2. Obtener URL de los parámetros
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get('url');

  if (!fileUrl) {
    return new Response(JSON.stringify({ error: 'Missing "url" query parameter' }), { status: 400 });
  }

  try {
    // 3. Obtener metadatos del Blob usando la URL como ID
    const blobDetails = await head(fileUrl);

    return new Response(JSON.stringify(blobDetails), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'File not found or invalid URL' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }
}