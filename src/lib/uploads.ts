export const PHOTO_LIMITS = {
  folder: "avaliacoes",
  max: 10,
  maxBytes: 8 * 1024 * 1024,
  types: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"],
};

/** Blob conectado ao projeto (Vercel injeta BLOB_READ_WRITE_TOKEN ao criar o store). Só no servidor. */
export const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
