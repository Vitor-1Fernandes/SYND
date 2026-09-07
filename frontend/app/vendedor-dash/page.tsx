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
    ChevronDown
} from "lucide-react";

import { ReuniaoRaw } from "../components/cardResult";


export default function Vendedor() {

    const reunioes: ReuniaoRaw[] = [
        { 'ID': '1319208', 'Data': '2026-04-01 14:00:00', 'Formato da reunião': 'VIDEO', 'ID status da reunião': '3', 'Status': 'COMPLETED', 'Duração': '01:28:06', 'CODT': 'T61098', 'Tipo de recurso': '', 'Reunião externa': true, 'Data de criação': '2026-03-25 14:07:55', 'UF': 'RS', 'CNAE': '8532500', 'Nome da unidade': 'TOTVS RIO GRANDE DO SUL', 'Segmento': 'EDUCACIONAL', 'Faixa de faturamento do cliente': '01.MICRO I - De R$ 0 a R$ 500.000', 'Data da última pesquisa': '2024-12', 'Nota NPS': '8', Transcrição: "a", 'Analise': '{\n  "resumo_geral": "A reunião foi realizada para apresentar a solução de gestão de saúde (TOTVS) para a unidade educacional do cliente, visando integrar a clínica veterinária ao sistema educacional já utilizado (RM). O cliente busca automatizar processos de comissionamento de veterinários e integrar dados financeiros e de estoque, eliminando o retrabalho manual atual. A equipe da TOTVS demonstrou o módulo de saúde e os próximos passos incluem o envio de uma proposta comercial e análise de migração de dados.",\n  "principais_assuntos": "Integração de clínica veterinária ao ecossistema educacional (RM), fluxos de atendimento (ambulatorial/internação), comissionamento de profissionais, gestão de prontuário, farmácia/estoque e faturamento.",\n  "dores": [\n    {\n      "texto": "Inexistência de integração entre o sistema da clínica (Vetus) e o sistema financeiro (RM), gerando retrabalho.",\n      "trecho": "a única desvantagem, até, que foi esse pedido da controladoria e da direção, foi que esse sistema que a gente usa hoje, que é o Vetus, ele não consegue migrar as informações, principalmente financeiras, para o prótese."\n    },\n    {\n      "texto": "Necessidade de realizar cálculos manuais para comissionamento e dispensação de medicamentos.",\n      "trecho": "As prescrições que são feitas pelas veterinárias para os animais internados, elas daí têm a dispensação pela farmácia. Aí uma pessoa pega e faz o cálculo de tudo que foi usado. Tudo manual hoje."\n    }\n  ],\n  "oportunidades": [\n    {\n      "texto": "Expansão de contrato com a inclusão do módulo de saúde (CORE) para a unidade veterinária.",\n      "trecho": "a gente vai entender quais são os módulos que você utiliza hoje, se as suas licenças elas são, contemplariam também o módulo do RM aqui da parte do CORE saúde"\n    },\n    {\n      "texto": "Serviço de migração de dados (carga de dados) realizado pela equipe da TOTVS, agregando valor à proposta.",\n      "trecho": "Então, vocês poderiam colocar também no orçamento essa parte de vocês fazendo toda a migração dos nossos dados?"\n    },\n    {\n      "texto": "Potencial aceleração da migração do sistema para cloud devido à nova iniciativa de gestão.",\n      "trecho": "Dependendo, pode ser que uma iniciativa como essa possa acelerar o processo de migração para cloud, mas é uma discussão em paralelo."\n    }\n  ],\n  "risco_churn": "baixo",\n  "evidencias_churn": [],\n  "sentimento": 9.0,\n  "tarefas": [\n    {\n      "nome": "Compilação de informações e desenho do escopo do projeto pela engenharia de valor.",\n      "data_prevista": "2026-04-11",\n      "trecho": "a gente vai te chamar para para explicar, né, como é que vai ficar, né, essa visão de investimento aí no projeto para atender a clínica."\n    },\n    {\n      "nome": "Envio de proposta comercial consolidada com valores e serviços de migração.",\n      "data_prevista": "2026-04-11",\n      "trecho": "a gente vai compilar todas as informações colhidas aqui e vai montar o escopo, o projeto, e aí a gente vai ter um valor, uma proposta de valores para você."\n    },\n    {\n      "nome": "Estudo de integração com o sistema de imagem (PAX) e laboratório mencionado pelo cliente.",\n      "data_prevista": null,\n      "trecho": "só para pegar depois direitinho o nome do PAX e do laboratório ali para a gente estudar a possibilidade das integrações, tá?"\n    }\n  ]\n}' }, { 'ID': '907223', 'Data': '2026-01-12 15:00:00', 'Formato da reunião': 'VIDEO', 'ID status da reunião': '3', 'Status': 'COMPLETED', 'Duração': '00:31:14', 'CODT': 'TFBER2', 'Tipo de recurso': '', 'Reunião externa': true, 'Data de criação': '2026-01-12 11:17:36', 'UF': 'RS', 'CNAE': '4639701', 'Nome da unidade': 'TOTVS RIO GRANDE DO SUL', 'Segmento': 'DISTRIBUICAO', 'Faixa de faturamento do cliente': '06.SMB III - De R$ 120.000.001 a R$ 240.000.000', 'Data da última pesquisa': '2024-01', 'Nota NPS': '4', 'Transcrição': 'a', 'Analise': '{\n  "resumo_geral": "Reunião de alinhamento com a unidade TOTVS Rio Grande do Sul para diagnóstico de necessidades operacionais. O foco principal é a transição para um escritório de contabilidade externo e a adequação do sistema à Reforma Tributária. A equipe da TOTVS propôs um checklist de processos para mapear necessidades e evitar o engessamento de faturamento, visando a venda de um pacote de horas de consultoria customizado.",\n  "principais_assuntos": "Consultoria em processos contábeis e fiscais, adequação à Reforma Tributária, uso de módulos financeiros (conciliação bancária e pagamentos via arquivo) e diagnóstico de aderência ao sistema (Assessment).",\n  "dores": [\n    {\n      "texto": "Dificuldade de operacionalização contábil e fiscal após a mudança para um escritório terceirizado.",\n      "trecho": "Hoje entrei na [LOCAL] sem conhecer o entorpe e indo para a parte financeira. E no meio desse ano de 25, houve uma transição onde a [LOCAL] passou a utilizar toda a parte contábil e fiscal sendo feita por terceiros."\n    },\n    {\n      "texto": "Falta de conhecimento interno sobre as rotinas e ferramentas disponíveis no sistema para otimização de processos.",\n      "trecho": "Como eu não tenho hoje uma vitrine da TOTOS para entender o que de produto vocês têm à venda, têm a oferecer para nós, e que possa justamente ajudar o nosso dia a dia aqui."\n    },\n    {\n      "texto": "Risco de travamento de faturamento por falta de parametrização da Reforma Tributária.",\n      "trecho": "A única coisa que o que eu estava preocupado era se na virada do ano pudesse travar o nosso faturamento em função de ajustes que a Totos tenha feito dentro do [LOCAL] e a gente não ter parametrizado nada."\n    }\n  ],\n  "oportunidades": [\n    {\n      "texto": "Venda de pacote de horas de consultoria para treinamento contábil, fiscal e implementação de novas rotinas.",\n      "trecho": "O [PESSOA] é quem vai fazer o levantamento do que a gente vai conseguir atender vocês para poder passar o orçamento e valores de entrega do serviço."\n    },\n    {\n      "texto": "Melhoria de eficiência operacional através da implementação de rotinas financeiras negligenciadas (ex: conciliação bancária e automatização de pagamentos).",\n      "trecho": "Hoje a gente não utiliza a conciliação bancária, por exemplo."\n    },\n    {\n      "texto": "Up-sell de módulos de inteligência tributária e atualização de versão (v.37).",\n      "trecho": "A gente queria entender um pouco melhor sobre o produto inteligência tributária"\n    }\n  ],\n  "risco_churn": "medio",\n  "evidencias_churn": [\n    {\n      "texto": "Nota NPS de 4 (em 2024) indica insatisfação histórica recorrente com a entrega de valor ou relacionamento.",\n      "trecho": null\n    },\n    {\n      "texto": "Transição de operação contábil para terceiros pode reduzir a dependência da plataforma ou expor falhas críticas no suporte atual.",\n      "trecho": "A gente tinha pessoas no contábil que saíram e hoje é um escritório externo."\n    }\n  ],\n  "sentimento": 5.0,\n  "tarefas": [\n    {\n      "nome": "Envio do checklist de processos para o cliente",\n      "data_prevista": null,\n      "trecho": "Eu vou organizar o documento aqui, aí eu passo para o [PESSOA] e você encaminha para eles"\n    },\n    {\n      "nome": "Preenchimento e devolutiva do checklist pela equipe do cliente",\n      "data_prevista": null,\n      "trecho": "O quanto mais rápido vocês conseguirem trazer esse checklist, retornar esse para a gente melhor"\n    },\n    {\n      "nome": "Elaboração de orçamento de horas de consultoria após diagnóstico",\n      "data_prevista": null,\n      "trecho": "Eu fico, então, nesse aguardo do [PESSOA] e do [PESSOA] para a gente poder quantificar isso."\n    }\n  ]\n}' }
        // ...outras reuniões
    ]

    const summaryMetrics = [
        {
            label: "Sentimento Médio",
            value: "8 / 10",
            detail: "Excelente",
            progress: 80,
            icon: Heart,
            iconColor: "text-[#2DD4FF]",
            badgeBg: "bg-[#12384B]",
            badgeText: "text-[#B9D8E6]",
            barColor: "bg-[#2DD4FF]",
        },
        {
            label: "Tarefas Concluídas",
            value: "70%",
            detail: "7 de 10 tarefas",
            progress: 72,
            icon: CheckCircle2,
            iconColor: "text-[#21D4FD]",
            badgeBg: "bg-[#103847]",
            badgeText: "text-[#8FE8FF]",
            barColor: "bg-[#21D4FD]",
        },
        {
            label: "Oportunidades",
            value: "3",
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
            value: "6",
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
        }

        onSelect()
        emblaApi.on("select", onSelect)
        emblaApi.on("reInit", onSelect)
    }, [emblaApi])

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
                            {reunioes.map((reuniao) => (
                                <>
                                    <div key={reuniao.ID} className="flex-[0_0_100%] min-w-0 flex flex-col md:flex-row md:bg-black/15  rounded-md justify-end">
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
                                </>
                            ))}
                        </div>
                    </div>

                    {reunioes.length > 1 && (
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

                {reunioes.length > 1 && (
                    <div className="flex justify-center gap-2 mb-5 mt-5 md:mb-15">
                        {reunioes.map((_, i) => (
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
                    <div className="w-full mx-15 rounded-2xl h-[1px] bg-white/20 mb-5"></div>
                </div>

                <section>

                    <div className="flex flex-row flex-wrap md:flex-nowrap justify-center mb-12">
                        {summaryMetrics.map((item) => (
                            <SummaryMetricCard
                                key={item.label}
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
                        <TasksCard />
                    </article>

                </section>

                <div className="flex justify-center">
                    <div className="w-full mx-15 rounded-2xl h-[1px] bg-white/20 mb-5"></div>
                </div>

                <section className="flex w-full mt-10">
                    <TableClient />
                </section>

            </div>
        </main >
    )

}