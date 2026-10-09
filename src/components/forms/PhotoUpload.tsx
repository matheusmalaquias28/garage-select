"use client";

import { useEffect, useId, useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { PHOTO_LIMITS } from "@/lib/uploads";
import { Check, Close } from "@/components/Icons";

export type Photo = { id: string; file: File; preview: string; progress?: number; url?: string; error?: boolean };

const TIPS = ["Frente", "Traseira", "Laterais", "Interior", "Painel com km"];

/* ---------- compressão no navegador (máx. 1920px, JPEG 82%) ---------- */

async function compress(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file; // formato que o navegador não decodifica (ex.: HEIC fora do Safari): envia o original
  }
}

/** Envia as fotos ao Vercel Blob (3 por vez) e devolve as URLs na ordem. */
export async function uploadPhotos(photos: Photo[], onProgress: (id: string, pct: number) => void) {
  const stamp = new Date().toISOString().slice(0, 10);
  const urls: string[] = new Array(photos.length);
  let next = 0;
  const worker = async () => {
    while (next < photos.length) {
      const i = next++;
      const p = photos[i];
      const file = await compress(p.file);
      const blob = await upload(`${PHOTO_LIMITS.folder}/${stamp}/foto-${i + 1}.${file.type === "image/jpeg" ? "jpg" : file.name.split(".").pop()}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        contentType: file.type || "image/jpeg",
        onUploadProgress: ({ percentage }) => onProgress(p.id, percentage),
      });
      urls[i] = blob.url;
      onProgress(p.id, 100);
    }
  };
  await Promise.all([worker(), worker(), worker()]);
  return urls;
}

/* ---------- campo ---------- */

export function PhotoUpload({ photos, setPhotos, disabled }: { photos: Photo[]; setPhotos: (fn: (p: Photo[]) => Photo[]) => void; disabled?: boolean }) {
  const id = useId();
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const [warn, setWarn] = useState("");
  const left = PHOTO_LIMITS.max - photos.length;

  // libera as prévias da memória ao desmontar
  const latest = useRef(photos);
  useEffect(() => {
    latest.current = photos;
  }, [photos]);
  useEffect(() => () => latest.current.forEach((p) => URL.revokeObjectURL(p.preview)), []);

  const add = (list: FileList | null) => {
    if (!list) return;
    const images = [...list].filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    const tooBig = images.filter((f) => f.size > 25 * 1024 * 1024);
    const ok = images.filter((f) => !tooBig.includes(f)).slice(0, left);
    setWarn(
      tooBig.length
        ? "Algumas fotos passam de 25 MB e foram ignoradas."
        : images.length > left
          ? `Limite de ${PHOTO_LIMITS.max} fotos atingido.`
          : images.length < list.length
            ? "Envie apenas imagens (JPG, PNG, WEBP ou HEIC)."
            : "",
    );
    setPhotos((prev) => [
      ...prev,
      ...ok.map((file) => ({ id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`, file, preview: URL.createObjectURL(file) })),
    ]);
  };

  const remove = (pid: string) =>
    setPhotos((prev) => {
      const p = prev.find((x) => x.id === pid);
      if (p) URL.revokeObjectURL(p.preview);
      return prev.filter((x) => x.id !== pid);
    });

  return (
    <div className="sm:col-span-2">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-[11px] tracking-wide text-mute">
          Fotos do veículo <span className="text-bone-2">(opcional, até {PHOTO_LIMITS.max})</span>
        </label>
        {photos.length > 0 && (
          <span className="text-[11px] text-mute tabular">
            {photos.length}/{PHOTO_LIMITS.max}
          </span>
        )}
      </div>

      {left > 0 && (
        <label
          htmlFor={id}
          onDragOver={(e) => (e.preventDefault(), setOver(true))}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            if (!disabled) add(e.dataTransfer.files);
          }}
          className={`group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-8 text-center transition-colors ${
            over ? "border-gold bg-gold/[0.06]" : "border-line-strong hover:border-bone/50 hover:bg-white/[0.02]"
          } ${disabled ? "pointer-events-none opacity-50" : ""}`}
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line-strong text-gold transition-transform duration-500 group-hover:scale-110">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
              <rect x="3" y="5" width="18" height="15" rx="2" />
              <circle cx="12" cy="12.5" r="3.5" />
              <path d="M8 5l1.5-2h5L16 5" />
            </svg>
          </span>
          <span className="text-[15px] text-bone">
            <span className="max-sm:hidden">Arraste as fotos aqui ou </span>
            <span className="text-gold underline-offset-4 group-hover:underline">
              <span className="sm:hidden">Toque para </span>
              <span className="max-sm:hidden">clique para </span>selecionar
            </span>
          </span>
          <span className="flex flex-wrap justify-center gap-1.5">
            {TIPS.map((t) => (
              <span key={t} className="rounded-full bg-white/[0.05] px-2.5 py-1 text-[11px] text-mute">
                {t}
              </span>
            ))}
          </span>
          <input
            ref={input}
            id={id}
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            disabled={disabled}
            onChange={(e) => {
              add(e.target.files);
              e.target.value = "";
            }}
            className="sr-only"
          />
        </label>
      )}

      {warn && <p className="mt-2 text-xs text-gold">{warn}</p>}

      {photos.length > 0 && (
        <ul className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {photos.map((p, i) => {
            const pct = p.progress;
            return (
              <li key={p.id} className="group relative aspect-square overflow-hidden rounded-lg bg-ink-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- prévia local (blob:) */}
                <img src={p.preview} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                <span className="absolute top-1.5 left-1.5 rounded-full bg-black/60 px-1.5 text-[10px] text-bone tabular backdrop-blur-sm">{i + 1}</span>
                {pct === undefined && !disabled && (
                  <button
                    type="button"
                    onClick={() => remove(p.id)}
                    aria-label={`Remover foto ${i + 1}`}
                    className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-bone backdrop-blur-sm transition hover:bg-gold hover:text-ink md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
                  >
                    <Close width={12} height={12} />
                  </button>
                )}
                {pct !== undefined && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/55">
                    {p.error ? (
                      <span className="text-[10px] text-gold">Falhou</span>
                    ) : pct >= 100 ? (
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gold text-ink">
                        <Check width={14} height={14} />
                      </span>
                    ) : (
                      <span className="text-xs text-bone tabular">{Math.round(pct)}%</span>
                    )}
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-white/10">
                      <span className="block h-full bg-gold transition-[width] duration-300" style={{ width: `${pct}%` }} />
                    </span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
