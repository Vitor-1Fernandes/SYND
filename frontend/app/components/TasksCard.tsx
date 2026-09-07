import React, { useState } from "react";
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
  status: TaskStatus;
}

export interface TasksCardProps {
  tasks?: Task[];
  agenda?: Agenda[];
  pendingCount?: number;
}

const defaultTasks: Task[] = [
  { title: "Enviar proposta do módulo de BI", client: "Alpha Log", date: "05/09", status: "andamento" },
  { title: "Compartilhar estudo de SLA por rota", client: "Rota Fácil", date: "08/09", status: "concluida" },
  { title: "Resolver pendências Frontend", client: "Nortec", date: "08/09", status: "concluida" },
  { title: "Resolver pendências Frontend", client: "Vetta Log", date: "08/09", status: "concluida" },
  { title: "Enviar proposta do módulo de BI", client: "Cargo Sul", date: "05/09", status: "andamento" },
  { title: "Compartilhar estudo de SLA por rota", client: "Rota Fácil", date: "08/09", status: "concluida" },
  { title: "Resolver pendências Frontend", client: "Nortec", date: "08/09", status: "concluida" },
  { title: "Resolver pendências Frontend", client: "Vetta Log", date: "08/09", status: "concluida" },
  { title: "Resolver pendências Frontend", client: "Cargo Sul", date: "08/09", status: "concluida" },
  { title: "Compartilhar estudo de SLA por rota", client: "Alpha Log", date: "08/09", status: "concluida" },
];

const defaultAgenda: Agenda[] = [
  { title: "Módulos de Compras e Almoxarifado", client: "Alpha Log", date: "05/09", time:"13h40", status: "andamento" },
  { title: "Renegociação de Contrato", client: "Rota Fácil", date: "08/09", time:"17h00", status: "concluida" },
  { title: "Negociação Presencial", client: "Nortec", date: "08/09", time:"11h30", status: "concluida" },
  { title: "Resolver pendências Frontend", client: "Vetta Log", date: "08/09", time:"15h40", status: "concluida" },
  { title: "Módulos de Compras e Almoxarifado", client: "Cargo Sul", date: "05/09", time:"13h40", status: "andamento" },
  { title: "Compartilhar estudo de SLA por rota", client: "Rota Fácil", date: "08/09", time:"13h40", status: "concluida" },
  { title: "Resolver pendências Frontend", client: "Nortec", date: "08/09", time:"13h40", status: "concluida" },
  { title: "Resolver pendências Frontend", client: "Vetta Log", date: "08/09", time:"13h40", status: "concluida" },
  { title: "Resolver pendências Frontend", client: "Cargo Sul", date: "08/09", time:"13h40", status: "concluida" },
  { title: "Compartilhar estudo de SLA por rota", client: "Alpha Log", date: "08/09", time:"13h40", status: "concluida" },
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

function TaskModal({
  item,
  onClose,
}: {
  item: Task | Agenda;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-sm border border-white/10 bg-[#0B1B2B] p-6 text-[#E6EDF3] shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between">
          <h3 className="text-lg font-bold text-[#F5F8FA]">{item.title}</h3>
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

export default function TasksCard({
  tasks = defaultTasks,
  agenda = defaultAgenda,
  pendingCount,
}: TasksCardProps) {
  const [activeTab, setActiveTab] = useState<"tarefas" | "agenda">("tarefas");
  const [checklist, setChecklist] = useState<TaskStatus[]>(tasks.map((t) => t.status));
  const [checklistAg, setChecklistAg] = useState<TaskStatus[]>(agenda.map((t) => t.status));
  const [openTaskIdx, setOpenTaskIdx] = useState<number | null>(null);

  const toggleTask = (idx: number) => {
    setChecklist((prev) =>
      prev.map((status, i) => (i === idx ? (status === "concluida" ? "andamento" : "concluida") : status))
    );
  };

  const toggleAgenda = (idx: number) => {
    setChecklistAg((prev) =>
      prev.map((status, i) => (i === idx ? (status === "concluida" ? "andamento" : "concluida") : status))
    );
  };

  const pendingTasks = checklist.filter((s) => s === "andamento").length;
  const pendingAgenda = checklistAg.filter((s) => s === "andamento").length;

  const pending =
    pendingCount ?? (activeTab === "tarefas" ? pendingTasks : pendingAgenda);

  // #21D4FD quando não houver pendências (em tarefas ou agenda); caso contrário mantém o tom de alerta
  const pendingColor = pending === 0 ? "#21D4FD" : "#f0b851";

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-sm font-sans text-[#E6EDF3]">
      <div className="shrink-0 px-8 pt-2">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("tarefas")}
            className={`pb-1 text-base md:text-xl md:font-bold ${
              activeTab === "tarefas" ? "border-b-2 border-[#F5F8FA] text-[#F5F8FA]" : "text-[#7C93A8]"
            }`}
          >
            Tarefas
          </button>
          <button
            onClick={() => setActiveTab("agenda")}
            className={`pb-1 text-base md:text-xl md:font-bold ${
              activeTab === "agenda" ? "border-b-2 border-[#F5F8FA] text-[#F5F8FA]" : "text-[#7C93A8]"
            }`}
          >
            Agenda
          </button>
        </div>

        <div
          className="mb-4 mt-4 text-sm font-light md:font-normal transition-colors"
          style={{ color: pendingColor }}
        >
          {pending} pendente{pending !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Conteúdo rolável */}
      <div className="flex-1 overflow-y-auto px-8 pb-4">
        {activeTab === "tarefas" ? (
          <div className="flex flex-col">
            {tasks.map((task, idx) => {
              const status = checklist[idx];
              const isDone = status === "concluida";
              return (
                <div
                  key={idx}
                  className="flex items-start justify-between border-b border-white/5 py-3 last:border-b-0"
                >
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
                      <div
                        className={`text-[13px] md:text-[15px] leading-none ${
                          isDone ? "text-[#7C93A8] line-through" : "text-[#F5F8FA]"
                        }`}
                      >
                        {task.title}
                      </div>
                      <div className="mt-0.5 text-xs text-[#7C93A8]">{task.client}</div>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="hidden md:flex items-center gap-1.5 text-sm text-[#7C93A8]">
                      <CalendarIcon size="18px" color="#7C93A8"/>
                      {task.date}
                    </div>
                    <div className="flex md:justify-end">
                        <div className="px-2.5 py-1">
                          <ExternalLink size={"20px"} />
                        </div>
                    </div>
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
                <div
                  key={idx}
                  className="flex items-start justify-between border-b border-white/5 py-3 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleAgenda(idx)}
                      className={`flex items-center justify-center transition-colors ${
                        isDone ? "border-[#7C93A8]" : "border-[#0c6cc5]"
                      }`}
                    >
                      {!isDone ? <UploadIcon size={"20px"} /> : <Check size={"20px"} />}
                    </button>
                    <div>
                      <div
                        className={`text-[13px] md:text-[15px] leading-none ${
                          isDone ? "text-[#7C93A8]" : "text-[#F5F8FA]"
                        }`}
                      >
                        {item.title}
                      </div>
                      <div className="mt-0.5 text-xs text-[#7C93A8]">{item.client}</div>
                    </div>
                  </div>


                 

                  {isDone ? (
                         <div className="flex gap-6">
                    <div className="hidden md:flex items-center gap-1.5 text-sm text-[#7C93A8]">
                      <CalendarIcon size="18px" color="#7C93A8"/>
                      {item.date}
                    </div>
                    <div className="hidden md:flex items-center gap-1.5 text-sm text-[#7C93A8]">
                      <Clock size={"18px"} />
                      {item.time}
                    </div>
                  </div>
                      ) : (
                        <div className="flex gap-6">
                    <div className="hidden md:flex items-center gap-1.5 text-sm text-[#eceff3]">
                      <CalendarIcon size="18px" color="#eceff3"/>
                      {item.date}
                    </div>
                    <div className="hidden md:flex items-center gap-1.5 text-sm text-[#eceff3]">
                      <Clock size={"18px"} />
                      {item.time}
                    </div>
                  </div>
                      )}


                </div>
              );
            })}
          </div>
        )}
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