"use client";

import { ChangeEvent, useState } from "react";
import ReuniaoCard, { validarAnalise } from "./ReuniaoCard";

export default function Upload() {
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [nomeArquivo, setNomeArquivo] = useState("");
  const [resposta, setResposta] = useState<any>(null);
  const [erro, setErro] = useState("");
  const [avisosFormato, setAvisosFormato] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [vendedores, setVendedores]: any = useState([]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  function selecionarArquivo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setArquivo(null);
      setNomeArquivo("");
      return;
    }

    const formatosPermitidos = [".json", ".csv", ".txt"];
    const arquivoValido = formatosPermitidos.some((formato) =>
      file.name.toLowerCase().endsWith(formato)
    );

    if (!arquivoValido) {
      setErro("Selecione um arquivo .json, .csv ou .txt válido.");
      setArquivo(null);
      setNomeArquivo("");
      return;
    }

    setErro("");
    setArquivo(file);
    setNomeArquivo(file.name);
  }

  async function analisarReuniao() {
    if (!arquivo) {
      setErro("Selecione o arquivo transcricao.json antes de analisar.");
      return;
    }

    setLoading(true);
    setErro("");
    setAvisosFormato([]);
    setResposta(null);

    const formData = new FormData();
    formData.append("file", arquivo);

    try {
      const response = await fetch(`${apiUrl}/api/analisar-reuniao`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Erro ao analisar reunião.");
      }

      // data.resposta pode vir como string JSON (ou dict Python stringificado) ou já como objeto
      let parsed = data.resposta;
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
        } catch {
          // fallback: tenta normalizar dict estilo Python (aspas simples, True/False/None)
          try {
            const normalizado = parsed
              .replace(/'/g, '"')
              .replace(/\bTrue\b/g, "true")
              .replace(/\bFalse\b/g, "false")
              .replace(/\bNone\b/g, "null");
            parsed = JSON.parse(normalizado);
          } catch {
            throw new Error("Não foi possível interpretar a resposta da IA como JSON.");
          }
        }
      }

      // Checa se o objeto tem o shape que o ReuniaoCard espera (dores/oportunidades/
      // evidencias_churn como {texto, trecho}, tarefas com "nome", etc.) antes de
      // passar adiante — assim um formato inesperado vira um aviso claro, não uma
      // tela quebrada.
      const { valido, erros } = validarAnalise(parsed);
      if (!valido) {
        setAvisosFormato(erros);
      }

      setResposta(parsed)
      localStorage.setItem("Renunião", JSON.stringify(parsed))
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Erro inesperado ao conectar com o backend.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
          <div>
            <h2 className="text-xl font-semibold">1. Upload do arquivo</h2>
            <p className="mt-1 text-sm text-zinc-400">
              Selecione o arquivo JSON da transcrição da reunião.
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-zinc-700 bg-zinc-950 p-6">
            <input
              type="file"
              accept=".json,.csv,.txt,application/json,text/csv,text/plain"
              onChange={selecionarArquivo}
              className="block w-full cursor-pointer text-sm text-zinc-300 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-700"
            />
            {nomeArquivo && (
              <p className="mt-3 text-sm text-zinc-400">
                Arquivo selecionado:{" "}
                <span className="font-medium text-zinc-200">{nomeArquivo}</span>
              </p>
            )}
          </div>

          <button
            onClick={analisarReuniao}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-950 disabled:text-zinc-400"
          >
            {loading ? "Analisando..." : "Analisar reunião"}
          </button>
        </section>

        {erro && (
          <section className="rounded-2xl border border-red-800 bg-red-950 p-5 text-red-200">
            <h2 className="font-semibold">Erro</h2>
            <p className="mt-1 text-sm">{erro}</p>
          </section>
        )}

        {avisosFormato.length > 0 && (
          <section className="rounded-2xl border border-amber-800 bg-amber-950 p-5 text-amber-200">
            <h2 className="font-semibold">
              A IA retornou um formato inesperado
            </h2>
            <p className="mt-1 text-sm text-amber-300/80">
              O card abaixo pode não renderizar corretamente. Revise o prompt ou o
              parsing no backend:
            </p>
            <ul className="mt-2 space-y-1 text-sm list-disc list-inside">
              {avisosFormato.map((aviso, i) => (
                <li key={i}>{aviso}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">2. Resposta da IA</h2>
            <p className="mt-1 text-sm text-zinc-400">
              A análise retornada pelo Gemini será exibida abaixo.
            </p>
          </div>

          {resposta && avisosFormato.length === 0 && <ReuniaoCard data={resposta} />}
        </section>
      </div>
    </main>
  );
}