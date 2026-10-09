"use client";

import { useState } from "react";
import { whatsappLink } from "@/lib/site";
import { Check, WhatsApp } from "@/components/Icons";
import { Select } from "@/components/ui/Select";
import { PhotoUpload, uploadPhotos, type Photo } from "./PhotoUpload";

export type Field = {
  name: string;
  label: string;
  type?: "text" | "tel" | "email" | "textarea" | "select" | "number";
  required?: boolean;
  placeholder?: string;
  options?: string[];
  full?: boolean;
  defaultValue?: string;
  autoComplete?: string;
};

const maskPhone = (v: string) => {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
};

/**
 * MVP sem backend: monta a mensagem e abre o WhatsApp da loja.
 * Para integrar com CRM/e-mail depois, troque o `submit` por uma Server Action.
 */
export function LeadForm({
  fields,
  subject,
  cta = "Enviar pelo WhatsApp",
  compact = false,
  note = "Ao enviar, abriremos o WhatsApp com sua mensagem pronta para um consultor.",
  photos: photoOpts,
}: {
  fields: Field[];
  subject: string;
  cta?: string;
  compact?: boolean;
  note?: string;
  /** campo de fotos; `upload` = Vercel Blob conectado (senão as fotos seguem pela conversa do WhatsApp) */
  photos?: { upload: boolean };
}) {
  const [sent, setSent] = useState<"" | "ok" | "attach">("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    const data = new FormData(e.currentTarget);
    const lines = fields
      .map((f) => [f.label, String(data.get(f.name) ?? "").trim()] as const)
      .filter(([, v]) => v)
      .map(([k, v]) => `*${k}:* ${v}`);
    let text = `${subject}\n\n${lines.join("\n")}`;

    if (!photos.length) {
      window.open(whatsappLink(text), "_blank", "noopener");
      setSent("ok");
      return;
    }

    if (!photoOpts?.upload) {
      text += `\n\n_Vou enviar ${photos.length} ${photos.length === 1 ? "foto" : "fotos"} do veículo aqui na conversa._`;
      window.open(whatsappLink(text), "_blank", "noopener");
      setSent("attach");
      return;
    }

    // Abre a aba já no clique (evita bloqueio de pop-up) e só depois envia as fotos
    const tab = window.open("", "_blank");
    if (tab) {
      tab.opener = null;
      tab.document.title = "Enviando fotos…";
      tab.document.body.style.cssText =
        "background:#09090a;color:#f2f0eb;font:15px system-ui;display:grid;place-items:center;height:100vh;margin:0";
      tab.document.body.textContent = "Enviando fotos para a Garage Select…";
    }
    setBusy(true);
    setPhotos((prev) => prev.map((p) => ({ ...p, progress: 0, error: false })));
    try {
      const urls = await uploadPhotos(photos, (id, pct) =>
        setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, progress: pct } : p))),
      );
      text += `\n\n*Fotos do veículo (${urls.length}):*\n${urls.join("\n")}`;
      setSent("ok");
    } catch {
      setPhotos((prev) => prev.map((p) => (p.progress === 100 ? p : { ...p, error: true })));
      text += `\n\n_Não consegui enviar as fotos pelo site, vou mandar aqui na conversa._`;
      setSent("attach");
    } finally {
      setBusy(false);
    }
    const url = whatsappLink(text);
    if (tab && !tab.closed) tab.location.href = url;
    else window.location.href = url;
  };

  const input =
    "peer w-full border-b border-line-strong bg-transparent pt-6 pb-2.5 text-[15px] text-bone outline-none transition-colors placeholder:text-transparent focus:border-gold";

  return (
    <form onSubmit={submit} className={`grid gap-x-6 ${compact ? "gap-y-2" : "gap-y-4 sm:grid-cols-2"}`}>
      {fields.map((f) =>
        f.type === "select" ? (
          <FormSelect key={f.name} field={f} />
        ) : (
        <label key={f.name} className={`relative block ${f.full || f.type === "textarea" ? "sm:col-span-2" : ""}`}>
          {f.type === "textarea" ? (
            <textarea name={f.name} required={f.required} placeholder={f.label} defaultValue={f.defaultValue} rows={compact ? 2 : 3} className={`${input} resize-none`} />
          ) : (
            <input
              name={f.name}
              type={f.type ?? "text"}
              required={f.required}
              placeholder={f.label}
              defaultValue={f.defaultValue}
              autoComplete={f.autoComplete}
              inputMode={f.type === "tel" ? "tel" : f.type === "number" ? "numeric" : undefined}
              onChange={f.type === "tel" ? (e) => (e.currentTarget.value = maskPhone(e.currentTarget.value)) : undefined}
              className={input}
            />
          )}
          <span
            className="pointer-events-none absolute top-6 left-0 text-[15px] text-mute transition-all duration-300 peer-focus:top-0 peer-focus:text-[11px] peer-focus:tracking-wide peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:tracking-wide"
          >
            {f.label}
            {f.required && <span className="text-gold"> *</span>}
          </span>
        </label>
        ),
      )}

      {photoOpts && <PhotoUpload photos={photos} setPhotos={setPhotos} disabled={busy} />}

      <div className={`mt-6 flex flex-col gap-4 ${compact ? "" : "sm:col-span-2"}`}>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-gold px-8 font-medium text-ink transition hover:bg-gold-soft disabled:cursor-wait disabled:opacity-70 sm:self-start"
        >
          {busy ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink/30 border-t-ink" aria-hidden /> Enviando fotos…
            </>
          ) : (
            <>
              <WhatsApp /> {cta}
            </>
          )}
        </button>
        <p className="text-xs text-mute" aria-live="polite">
          {sent ? (
            <span className="inline-flex items-start gap-2 text-bone-2">
              <Check width={14} height={14} className="mt-0.5 shrink-0 text-gold" />
              {sent === "attach"
                ? "Mensagem pronta no WhatsApp. Anexe as fotos na conversa (ícone de clipe) e envie!"
                : "Mensagem pronta no WhatsApp. É só enviar!"}
            </span>
          ) : (
            note
          )}
        </p>
      </div>
    </form>
  );
}

function FormSelect({ field }: { field: Field }) {
  const [value, setValue] = useState(field.defaultValue ?? "");
  return (
    <div className={`relative pt-5 ${field.full ? "sm:col-span-2" : ""}`}>
      <span className="pointer-events-none absolute top-0 left-0 text-[11px] tracking-wide text-mute">
        {field.label}
        {field.required && <span className="text-gold"> *</span>}
      </span>
      <Select
        label={field.label}
        placeholder="Selecione"
        value={value}
        onChange={setValue}
        options={(field.options ?? []).map((o) => ({ value: o, label: o }))}
        className="text-[15px]"
      />
      <input type="hidden" name={field.name} value={value} />
    </div>
  );
}
