'use client'

import { useEffect, useState, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import SentimentDashboard from "../components/chart"
import Navbar from "../components/navbar"
import CardResult from "../components/cardResult"
import InsightTabsCard from "../components/InsightTabsCard"
import TasksCard from "../components/TasksCard"
import { SummaryMetricCard } from "../components/summary-card"
import TableClient from "../components/table-clients"

import {
    Users,
    CheckCircle2,
    BriefcaseBusiness,
    UserCheck,
    HeartCrack,
    Heart,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Download
} from "lucide-react";

import { ReuniaoRaw } from "../components/cardResult";

interface AnaliseParsed {
    resumo_geral: string;
    sentimento: number;
    dores: { texto: string; trecho: string }[];
    oportunidades: { texto: string; trecho: string }[];
    evidencias_churn: { texto: string; trecho: string }[];
    tarefas: { nome: string; trecho: string; data_prevista: string | null }[];
}

interface MetricasCalculadas {
    sentimentoMedio: number; // 0 a 10
    totalOportunidades: number;
    totalDores: number;
}

function parseAnalise(analise: string): AnaliseParsed | null {
    try {
        return JSON.parse(analise) as AnaliseParsed;
    } catch {
        return null;
    }
}

function calcularMetricas(reunioes: ReuniaoRaw[]): MetricasCalculadas {
    let somaSentimento = 0;
    let qtdSentimentosValidos = 0;
    let totalOportunidades = 0;
    let totalDores = 0;

    for (const reuniao of reunioes) {
        const analise = parseAnalise(reuniao.Analise);
        if (analise) {
            if (typeof analise.sentimento === "number" && !isNaN(analise.sentimento)) {
                somaSentimento += analise.sentimento;
                qtdSentimentosValidos++;
            }
            totalOportunidades += analise.oportunidades?.length ?? 0;
            totalDores += analise.dores?.length ?? 0;
        }
    }

    const sentimentoMedio =
        qtdSentimentosValidos > 0
            ? Number((somaSentimento / qtdSentimentosValidos).toFixed(1))
            : 0;

    return {
        sentimentoMedio,
        totalOportunidades,
        totalDores,
    };
}

export default function Vendedor() {

    const [reunioesState, setReunioes] = useState<ReuniaoRaw[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const carregarReunioes = () => {
            const rawStr = localStorage.getItem("Reuniao")
            if (!rawStr) {
                setIsLoading(false)
                return
            }

            try {
                const data: ReuniaoRaw[] = JSON.parse(rawStr)
                if (Array.isArray(data)) {
                    setReunioes(data)
                }
            } catch (e) {
                console.error("Erro ao parsear reunião do localStorage", e)
            } finally {
                setIsLoading(false)
            }
        }

        carregarReunioes()

        window.addEventListener("reuniaoAtualizada", carregarReunioes)
        window.addEventListener("storage", carregarReunioes) // cobre outras abas

        return () => {
            window.removeEventListener("reuniaoAtualizada", carregarReunioes)
            window.removeEventListener("storage", carregarReunioes)
        }
    }, [])

    const metricas = calcularMetricas(reunioesState);
    const [stats, setStats] = useState({ total: 0, pending: 0, activeTab:'tarefas' });

    const summaryMetrics = [
        {
            label: "Sentimento Médio",
            value: `${metricas.sentimentoMedio} / 10`,
            detail: metricas.sentimentoMedio >= 7
                ? "Excelente"
                : metricas.sentimentoMedio >= 4
                    ? "Neutro"
                    : "Precisa de atenção",
            progress: (metricas.sentimentoMedio / 10) * 100,
            icon: Heart,
            iconColor: "text-[#2DD4FF]",
            badgeBg: "bg-[#12384B]",
            badgeText: "text-[#B9D8E6]",
            barColor: "bg-[#2DD4FF]",
        },
        {
            label: `${stats.activeTab == "tarefas" ?  "Tarefas Concluídas" :  "Uploads Concluídos" }`,
            value: `${((stats.total-stats.pending) / stats.total *100).toFixed(0)}%`,
            detail: `${(stats.total-stats.pending)} de ${stats.total} concluídas`,
            progress: (stats.total-stats.pending) / stats.total *100,
            icon: CheckCircle2,
            iconColor: "text-[#21D4FD]",
            badgeBg: "bg-[#103847]",
            badgeText: "text-[#8FE8FF]",
            barColor: "bg-[#21D4FD]",
        },
        {
            label: "Oportunidades",
            value: `${metricas.totalOportunidades}`,
            detail: "Identificadas",
            progress: 100,
            icon: BriefcaseBusiness,
            iconColor: "text-[#FFB020]",
            badgeBg: "bg-[#3A2A0A]",
            badgeText: "text-[#FFD27A]",
            barColor: "bg-[#FFB020]",
        },
        {
            label: "Dores",
            value: `${metricas.totalDores}`,
            detail: "Identificadas",
            progress: 100,
            icon: HeartCrack,
            iconColor: "text-[#E5534B]",
            badgeBg: "bg-[rgba(127,29,29,0.3)]",
            badgeText: "text-[#EF4444]",
            barColor: "bg-[#EF4444]",
        },
    ];


    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: false })
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [canScrollPrev, setCanScrollPrev] = useState(false)
    const [canScrollNext, setCanScrollNext] = useState(false)
    const [showInsightMobile, setShowInsightMobile] = useState(false)

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

    useEffect(() => {
        if (!emblaApi) return

        const onSelect = () => {
            setSelectedIndex(emblaApi.selectedScrollSnap())
            setCanScrollPrev(emblaApi.canScrollPrev())
            setCanScrollNext(emblaApi.canScrollNext())
            setShowInsightMobile(false) // fecha o insight ao trocar de reunião
        }

        onSelect()
        emblaApi.on("select", onSelect)
        emblaApi.on("reInit", onSelect)
    }, [emblaApi])

    return (
        <main className="w-full min-h-screen overflow-x-hidden text-white" style={{
            background: "linear-gradient(135deg, #042133 0%, #002740 8%, #0D151A 93%)"
        }}>
            <nav>
                <Navbar />
            </nav>
            <div className="flex md:px-15 py-5 md:pt-15 flex-col">

                <div className="mb-1 md:mb-10">
                    <div className=" text-lg lg:text-2xl font-semibold text-center md:text-left">Bem vindo de volta, Tadeu</div>
                    <div className=" text-sm lg:text-base font-light text-center md:text-left tracking-wide text-[#bac4ce]">Acompanhe suas métricas comerciais</div>
                </div>

                <div className="flex justify-center md:hidden">
                    <div className="w-full mx-15 rounded-2xl h-[1px] bg-white/20 mb-2"></div>
                </div>

                <div className="relative">
                    <div className="overflow-hidden md:shadow-[0px_25px_20px_-20px_rgba(255,255,255,0.02)]" ref={emblaRef}>
                        <div className="flex">
                            {!isLoading && reunioesState.length > 0 &&
                                reunioesState.map((reuniao) => (
                                    <div key={reuniao.ID} className="flex-[0_0_100%] min-w-0 flex flex-col md:flex-row md:bg-black/15 rounded-md justify-end animate-fade-in-metric2">
                                        <article className="w-full md:w-[50%]">
                                            <CardResult {...reuniao} />
                                        </article>
                                        <div className="relative w-full h-5 md:hidden">
                                            <span
                                                className={`absolute inset-0 flex w-full items-end justify-center font-light text-sm tracking-wide text-[#c0d8f0] transition-opacity duration-200 ease-in-out ${showInsightMobile ? "opacity-0" : "opacity-100"
                                                    }`}
                                            >
                                                Ver insights
                                            </span>

                                            <span
                                                className={`absolute inset-0 flex w-full items-end justify-center font-light text-sm tracking-wide text-[#c0d8f0] transition-opacity duration-200 ease-in-out ${showInsightMobile ? "opacity-100" : "opacity-0"
                                                    }`}
                                            >
                                                Ocultar insights
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => setShowInsightMobile((prev) => !prev)}
                                            aria-label={showInsightMobile ? "Ocultar insights" : "Ver insights"}
                                            className="md:hidden flex items-center justify-center mx-auto mt-2 mb-1 h-8 w-8 rounded-full hover:bg-white/20 transition-colors"
                                        >
                                            <ChevronDown
                                                className={`h-5 w-5 transition-transform duration-300 ${showInsightMobile ? "rotate-180" : ""}`}
                                            />
                                        </button>

                                        <article
                                            className={`w-full md:w-[50%] flex flex-col overflow-hidden transition-all duration-700 ease-in-out md:!max-h-none md:!opacity-100 ${showInsightMobile ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
                                                }`}
                                        >
                                            <InsightTabsCard {...reuniao} />
                                        </article>
                                    </div>
                                ))}

                            {isLoading && (
                                <div className="flex justify-center items-center w-full p-6 min-h-[200px]">
                                    <div className="animate-pulse text-sm text-[#bac4ce]">Carregando...</div>
                                </div>
                            )}

                            {!isLoading && !(reunioesState.length > 0) && <div className="flex justify-center w-full p-6">

                                <div className="flex justify-center items-center flex-col font-light">

                                    <p className="mb-1"> Para começar...</p>
                                    <div className="flex flex-row flex-nowrap justify-center items-center gap-2 h-full mb-5 rounded-sm bg-[#064758] text-sm md:text-lg shadow-[0px_5px_1px_-3px_rgba(0,0,0,0.3)] hover:shadow-[0px_1px_5px_-3px_rgba(0,0,0,0.3)] btn-light-hover">


                                        <a className="flex flex-row flex-nowrap justify-center items-center gap-2 py-2 px-3 " href="../Exemplo_Transcricao.json" download="Exemplo_Transcricao.json">
                                            <Download />
                                            <p className=""> Baixe um Exemplo</p>
                                        </a>

                                    </div>

                                    <p className="text-center">E faça upload da transcrição na Agenda</p>

                                </div>

                            </div>}
                        </div>
                    </div>

                    {reunioesState.length > 1 && (
                        <>
                            <button
                                onClick={scrollPrev}
                                disabled={!canScrollPrev}
                                aria-label="Reunião anterior"
                                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-9 w-9 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/70 transition-colors"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>

                            <button
                                onClick={scrollNext}
                                disabled={!canScrollNext}
                                aria-label="Próxima reunião"
                                className="absolute right-1 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-9 w-9 rounded-full disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black/70 transition-colors"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </>
                    )}
                </div>

                {reunioesState.length > 1 && (
                    <div className="flex justify-center gap-2 mb-5 mt-5 md:mb-15">
                        {reunioesState.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => emblaApi?.scrollTo(i)}
                                aria-label={`Ir para reunião ${i + 1}`}
                                className={`h-2 w-2 rounded-full transition-colors ${selectedIndex === i ? "bg-white" : "bg-white/30"
                                    }`}
                            />
                        ))}
                    </div>
                )}

                <div className="flex justify-center">
                    <div className="w-full mx-15 rounded-2xl h-[1px] bg-white/20 my-5"></div>
                </div>

                <section>
                    <div className="flex flex-row flex-wrap md:flex-nowrap justify-center mb-12 ">
                        {summaryMetrics.map((item) => (
                            <SummaryMetricCard
                                key={item.label == "Tarefas Concluídas" ||  item.label ==  "Uploads Concluídos" ?  `${stats.activeTab}-${item.label}` : item.label }
                                label={item.label}
                                value={item.value}
                                detail={item.detail}
                                progress={item.progress}
                                icon={item.icon}
                                iconColor={item.iconColor}
                                badgeBg={item.badgeBg}
                                badgeText={item.badgeText}
                                barColor={item.barColor}
                            />
                        ))}
                    </div>
                </section>

                <section className="flex justify-start flex-row flex-nowrap gap-6 mb-15">
                    <article className="hidden md:flex w-[40%] ">
                        <SentimentDashboard />
                    </article>

                    <article className="flex w-full md:w-[60%] h-[380px] overflow-x-hidden rounded-sm">
                        <TasksCard onStatsChange={setStats} />
                    </article>
                </section>

                <div className="flex justify-center">
                    <div className="w-full mx-15 rounded-2xl h-[1px] bg-white/20 mb-5"></div>
                </div>

                <section className="flex w-full mt-10">
                    <TableClient />
                </section>
            </div>
        </main>
    )
}