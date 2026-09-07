import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { CalendarIcon, Check, Clock, ExternalLink, UploadIcon } from "lucide-react";

export type TaskStatus = "andamento" | "concluida";

export interface Task {
  title: string;
  client: string;
  date: string;
  status: TaskStatus;
}

export interface Agenda {
  title: string;
  client: string;
  date: string;
  time: string;
  local:string;
  status: TaskStatus;
}

export interface TasksCardProps {
  tasks?: Task[];
  agenda?: Agenda[];
  pendingCount?: number;
  onStatsChange?: (stats: { total: number; pending: number; activeTab: string }) => void;
}

const defaultTasks: Task[] = [
  { title: "Enviar proposta do módulo de BI", client: "Alpha Log", date: "05/09", status: "concluida" },
  { title: "Compartilhar estudo de SLA por rota", client: "Rota Fácil", date: "08/09", status: "concluida" },
  { title: "Resolver pendências Frontend", client: "Nortec", date: "08/09", status: "concluida" },
  { title: "Apresentar demo do módulo Protheus ERP", client: "Carrefour", date: "06/09", status: "concluida" },
  { title: "Ajustar regras de validação no TOTVS Fluig", client: "Localiza", date: "07/09", status: "concluida" },
  { title: "Mapear requisitos para migração de banco", client: "Eurofarma", date: "09/09", status: "concluida" },
  { title: "Validar layout de integração fiscal TAF", client: "Natura", date: "10/09", status: "concluida" },
];

const defaultAgenda: Agenda[] = [
  { title: "Módulos de Compras e Almoxarifado", client: "Corinthians", date: "05/09", time: "13h40", status: "andamento",local:"Neo Quimica Arena" },{ title: "Módulo de Faturamento e Estoque", client: "Carrefour", date: "06/09", time: "09h00", status: "andamento", local: "Matriz São Paulo" },
{ title: "Implementação RM Labore (RH)", client: "Hospital Albert Einstein", date: "07/09", time: "10h30", status: "andamento", local: "Unidade Morumbi" },
{ title: "Treinamento TOTVS Protheus Financeiro", client: "Eurofarma", date: "08/09", time: "14h00", status: "andamento", local: "Planta Itapevi" },
{ title: "Migração de Banco de Dados TOTVS Fluig", client: "Localiza", date: "09/09", time: "08h30", status: "andamento", local: "HQ Belo Horizonte" },
{ title: "Consultoria de Processos Fiscais (TAF)", client: "Natura", date: "10/09", time: "11h00", status: "andamento", local: "Espaço Natura Cajamar" },
{ title: "Integração WMS e Logística", client: "Magalu", date: "11/09", time: "15h15", status: "andamento", local: "CD Louveira" },
{ title: "Migração de Banco de Dados TOTVS Fluig", client: "Localiza", date: "09/09", time: "08h30", status: "andamento", local: "HQ Belo Horizonte" },
{ title: "Consultoria de Processos Fiscais (TAF)", client: "Natura", date: "10/09", time: "11h00", status: "andamento", local: "Espaço Natura Cajamar" },
];

function CheckIcon() {
  return (
    <svg
      className="h-3 w-3 text-[#081017]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function TaskStatusTag({ status }: { status: TaskStatus }) {
  if (status === "concluida") {
    return <span className="text-sm text-[#3FA9F5]">Concluída</span>;
  }
  return (
    <span className="rounded-xs border border-[#FFB020] px-2.5 py-1 text-xs text-[#FFB020]">
      Em andamento
    </span>
  );
}

function TaskModal({ item, onClose }: { item: Task | Agenda; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-sm border border-white/10 bg-[#0B1B2B] p-6 text-[#E6EDF3] shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-[#F5F8FA]">{item.title}</h3>
          <button onClick={onClose} className="text-[#7C93A8] hover:text-[#F5F8FA]">
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[#7C93A8]">Cliente</span>
            <span className="text-[#F5F8FA]">{item.client}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#7C93A8]">Prazo</span>
            <span className="text-[#F5F8FA]">{item.date}</span>
          </div>
          <div className="flex items-start justify-between">
            <span className="text-[#7C93A8]">Status</span>
            <TaskStatusTag status={item.status} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TasksCard({ tasks = defaultTasks, agenda = defaultAgenda, pendingCount, onStatsChange }: TasksCardProps) {
  const [activeTab, setActiveTab] = useState<"tarefas" | "agenda">("tarefas");
  const [checklist, setChecklist] = useState<TaskStatus[]>(tasks.map((t) => t.status));
  const [checklistAg, setChecklistAg] = useState<TaskStatus[]>(agenda.map((t) => t.status));
  const [openTaskIdx, setOpenTaskIdx] = useState<number | null>(null);

  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const inputRef = useRef<HTMLInputElement>(null);

  // Recebe o evento e faz o upload/analise do arquivo selecionado.
  async function selecionarArquivo(idx: number, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setErro("Selecione um arquivo .json, .csv ou .txt válido.");
      return;
    }

    const formatosPermitidos = [".json", ".csv", ".txt"];
    const arquivoValido = formatosPermitidos.some((formato) => file.name.toLowerCase().endsWith(formato));

    if (!arquivoValido) {
      setErro("Selecione um arquivo .json, .csv ou .txt válido.");
      return;
    }

    setErro("");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${apiUrl}/api/analisar-reuniao`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.detail || "Erro ao analisar reunião.");
      }

      // data.resposta pode vir como string JSON (ou dict Python stringificado) ou já como objeto
      let parsed = data.resposta;
      if (typeof parsed === "string") {
        try {
          parsed = JSON.parse(parsed);
        } catch {
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

      const existenteStr = window.localStorage?.getItem("Reuniao");
      let lista: unknown[] = [];

      if (existenteStr) {
        try {
          const existente = JSON.parse(existenteStr);
          lista = Array.isArray(existente) ? existente : [existente];
        } catch {
          lista = [];
        }
      }

      lista.push(parsed);
      window.localStorage?.setItem("Reuniao", JSON.stringify(lista));
      window.dispatchEvent(new Event("reuniaoAtualizada"));
      toggleAgenda(idx)
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

  const toggleTask = (idx: number) => {
    setChecklist((prev) => prev.map((status, i) => (i === idx ? (status === "concluida" ? "andamento" : "concluida") : status)));
  };

  const toggleAgenda = (idx: number) => {
    setChecklistAg((prev) => prev.map((status, i) => (i === idx ? (status === "concluida" ? "andamento" : "concluida") : status)));
  };

  const pendingTasks = checklist.filter((s) => s === "andamento").length;
  const pendingAgenda = checklistAg.filter((s) => s === "andamento").length;
  const pending = pendingCount ?? (activeTab === "tarefas" ? pendingTasks : pendingAgenda);
  const pendingColor = pending === 0 ? "#21D4FD" : "#f0b851";

  useEffect(() => {
    if (!onStatsChange) return;
    const total = activeTab === "tarefas" ? tasks.length : agenda.length;
    onStatsChange({ total, pending, activeTab });
  }, [pending, activeTab, tasks.length, agenda.length, onStatsChange]);

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-sm text-[#E6EDF3]">
      <div className="shrink-0 px-8 pt-2">
        <div className="relative flex w-fit gap-6">
          <button
            onClick={() => setActiveTab("tarefas")}
            className={`w-20 pb-1 text-base md:text-xl md:font-semibold transition-colors duration-300 ${
              activeTab === "tarefas" ? "text-[#F5F8FA]" : "text-[#7C93A8]"
            }`}
          >
            Tarefas
          </button>
          <button
            onClick={() => setActiveTab("agenda")}
            className={`w-20 pb-1 text-base md:text-xl md:font-semibold transition-colors duration-300 ${
              activeTab === "agenda" ? "text-[#F5F8FA]" : "text-[#7C93A8]"
            }`}
          >
            Agenda
          </button>

          <div
            className="absolute bottom-0 h-[2px] w-20 bg-[#F5F8FA] transition-transform duration-300 ease-out"
            style={{
              transform: activeTab === "tarefas" ? "translateX(0)" : "translateX(calc(100% + 1.5rem))",
            }}
          />
        </div>

        <div className="mb-4 mt-4 text-sm font-light md:font-normal transition-colors" style={{ color: pendingColor }}>
          {" "}
        </div>

        {erro && <div className="mb-2 text-xs text-red-400">{erro}</div>}
        {loading && <div className="mb-2 text-xs text-[#7C93A8]">Analisando arquivo...</div>}
      </div>

      {/* Conteúdo rolável */}
      <div className="flex-1 overflow-y-auto px-8 pb-4">
        <div key={activeTab} className="animate-fade-in-metric2">
          {activeTab === "tarefas" ? (
            <div className="flex flex-col">
              {tasks.map((task, idx) => {
                const status = checklist[idx];
                const isDone = status === "concluida";
                return (
                  <div key={idx} className="flex items-start justify-between border-b border-white/5 py-3 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(idx)}
                        className={`flex h-5 w-5 rounded-sm items-center justify-center border-2 transition-colors ${
                          isDone ? "border-[#3FA9F5] bg-[#3FA9F5]" : "border-[#7C93A8]"
                        }`}
                      >
                        {isDone && <CheckIcon />}
                      </button>
                      <div>
                        <div className={`text-[13px] md:text-[15px] leading-none ${isDone ? "text-[#7C93A8] line-through" : "text-[#F5F8FA]"}`}>
                          {task.title}
                        </div>
                        <div className="mt-0.5 text-xs text-[#7C93A8]">{task.client}</div>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="hidden md:flex items-center gap-1.5 text-sm text-[#7C93A8]">
                        <CalendarIcon size="18px" color="#7C93A8" />
                        {task.date}
                      </div>
                      <button className="flex md:justify-end px-2.5 py-1" onClick={() => setOpenTaskIdx(idx)}>
                        <ExternalLink size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col">
              {agenda.map((item, idx) => {
                const status = checklistAg[idx];
                const isDone = status === "concluida";
                return (
                  <div key={idx} className="flex items-start justify-between border-b border-white/5 py-3 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <label
                        htmlFor={`file-input-${idx}`}
                        className={`flex items-center justify-center cursor-pointer transition-colors ${
                          isDone ? "border-[#7C93A8]" : "border-[#0c6cc5]"
                        }`}
                      >
                        {!isDone ? <UploadIcon size={20} /> : <Check size={20} />}
                      </label>

                      <input
                        id={`file-input-${idx}`}
                        type="file"
                        accept=".json,.csv,.txt,application/json,text/csv,text/plain"
                        className="hidden"
                        onChange={(e) => {
                          selecionarArquivo(idx, e);
                          e.target.value = "";
                        }}
                      />

                      <div>
                        <div className={`text-[13px] md:text-[15px] leading-none ${isDone ? "text-[#7C93A8]" : "text-[#F5F8FA]"}`}>
                          {item.title}
                        </div>
                        <div className="mt-0.5 text-sm text-[#7C93A8]">{item.client} - {item.local}</div>
                      </div>
                    </div>

                    <div className="flex justify-between gap-5">
                      <div className={`hidden md:flex items-center gap-1.5 text-sm w-[70px] ${isDone ? "text-[#7C93A8]" : "text-[#eceff3]"}`}>
                        <CalendarIcon size="18px" color={isDone ? "#7C93A8" : "#eceff3"} />
                        {item.date}
                      </div>
                      <div className={`hidden md:flex items-center gap-1.5 text-sm w-[70px] ${isDone ? "text-[#7C93A8]" : "text-[#eceff3]"}`}>
                        <Clock size="18px" />
                        {item.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {openTaskIdx !== null && (
        <TaskModal
          item={
            activeTab === "tarefas"
              ? { ...tasks[openTaskIdx], status: checklist[openTaskIdx] }
              : { ...agenda[openTaskIdx], status: checklistAg[openTaskIdx] }
          }
          onClose={() => setOpenTaskIdx(null)}
        />
      )}
    </div>
  );
}