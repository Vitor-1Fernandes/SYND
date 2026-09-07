import { ArrowUpRight, ExternalLink } from "lucide-react";

export interface ReuniaoRaw {
  ID: string;
  Data: string;
  "Formato da reunião": string;
  "ID status da reunião": string;
  Status: string;
  Duração: string;
  CODT: string;
  "Tipo de recurso": string;
  "Reunião externa": boolean;
  "Data de criação": string;
  UF: string;
  CNAE: string;
  "Nome da unidade": string;
  Segmento: string;
  "Faixa de faturamento do cliente": string;
  "Data da última pesquisa": string;
  "Nota NPS": string;
  Transcrição: string;
  Analise: string; // string JSON, precisa parsear
  onOpen?: () => void;
}

interface AnaliseParsed {
  resumo_geral: string;
  sentimento: number;
}

function formatarDuracao(duracao: string): string {
  const [h, m] = duracao.split(":");
  const horas = parseInt(h, 10);
  const minutos = parseInt(m, 10);
  return horas > 0 ? `${horas}h${minutos}min` : `${minutos}min`;
}

function labelSentimento(score: number): string {
  if (score >= 7) return "[#21D4FD]" ;
  if (score >= 4) return "[#FFB020]" ;
  return "[#EF4444]";
}

export default function CardResult(raw: ReuniaoRaw) {
  const analise: AnaliseParsed = JSON.parse(raw.Analise);

  const meetingTitle = raw["Nome da unidade"] ?? "-";
  const duration = raw.Duração ? formatarDuracao(raw.Duração) : "-";
  const sentimentScore = analise.sentimento ?? 0;
  const sentimentLabel = labelSentimento(sentimentScore);
  const summary = analise.resumo_geral ?? "Encontramos um problema";
  const onOpen = raw.onOpen ?? (() => {});
  const data = raw.Data

  function formatarDataBR(dataStr: string): string {
  // Espera formato "YYYY-MM-DD HH:mm:ss"
  const [datePart, timePart] = dataStr.split(" ");
  const [ano, mes, dia] = datePart.split("-");
  const hora = timePart?.slice(0, 5) ?? ""; // pega só HH:mm

  return `${dia}/${mes}/${ano}${hora ? ` às ${hora}` : ""}`;
}

  return (
    <div className="lg:border-l-2 border-white/80 lg:pr-10">
      <div className="flex w-full box-border rounded-[5px] px-3 lg:px-8 lg:pb-7 pb-4 font-sans text-[#E6EDF3]">
        <div>
          {/* Meeting info */}
          <div className="mb-[22px]">
            <div className="flex items-end mb-1.5 text-[11px] tracking-wide text-[#7C93A8] justify-between">
              REUNIÃO

              <button
              onClick={onOpen}
              className=" pl-1 pt-4 text-sm font-semibold text-[#3FD0F5]"
            >
              <ExternalLink />
            </button>

            </div>
            <div className="text-md lg:text-lg font-semibold text-[#F5F8FA]">
              {meetingTitle}
            </div>
          </div>

          {/* Stats row */}
          <div className="mb-5 flex flex-wrap justify-between lg:justify-start lg:gap-12 border-b border-white/10 pb-5">
            <Stat label="Duração" value={duration} />
            <Stat label="Data" value={formatarDataBR(data)} />
            <Stat
              label="Sentimento"
              value={`${sentimentScore} / 10`}
              valueColor={`text-${sentimentLabel}`}
            />
          </div>

          {/* Summary */}
          <div>
            <div className="mb-2.5 text-[11px] tracking-wide text-[#7C93A8]">
              RESUMO
            </div>
            <div className="flex gap-3.5">
              <div className="w-[3px] shrink-0 rounded-sm bg-[#3FD0F5]" />
              <p className="m-0 text-md leading-relaxed text-[#eff1f1]">
                {summary}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatProps {
  label?: string;
  value?: string;
  valueColor?: string;
}

function Stat({ label, value, valueColor = "text-[#F5F8FA]" }: StatProps) {
  return (
    <div>
      <div className="mb-1 text-[13px] text-[#7C93A8]">{label}</div>
      <div className={`text-base font-bold ${valueColor}`}>{value}</div>
    </div>
  );
}