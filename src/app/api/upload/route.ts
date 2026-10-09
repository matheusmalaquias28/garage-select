import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { blobEnabled, PHOTO_LIMITS } from "@/lib/uploads";

/**
 * Gera tokens de upload direto do navegador para o Vercel Blob (fotos do "Venda seu veículo").
 * Só aceita imagens, até PHOTO_LIMITS.maxBytes, dentro da pasta PHOTO_LIMITS.folder.
 */
export async function POST(request: Request) {
  if (!blobEnabled()) {
    return NextResponse.json({ error: "Upload de fotos indisponível." }, { status: 503 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(`${PHOTO_LIMITS.folder}/`)) throw new Error("Caminho inválido.");
        return {
          allowedContentTypes: PHOTO_LIMITS.types,
          maximumSizeInBytes: PHOTO_LIMITS.maxBytes,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(json);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
