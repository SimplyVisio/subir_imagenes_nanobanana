import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export const config = {
  runtime: 'nodejs',
};

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname: string) => {
        // Aquí puedes agregar validación de usuario si implementas autenticación más adelante
        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/json'],
          tokenPayload: JSON.stringify({
            // Datos opcionales para guardar en los metadatos del blob
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload completed:', blob.url);
      },
    });

    return new Response(JSON.stringify(jsonResponse), {
      status: 200,
      headers: {
        'content-type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 400,
    });
  }
}