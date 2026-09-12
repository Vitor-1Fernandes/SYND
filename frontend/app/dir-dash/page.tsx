'use client'
import Navbar from "../components/navbar"
import { SummaryMetricCard } from "../components/summary-card"
import {
    CheckCircle2,
    BriefcaseBusiness,
    Users,
    UserCheck, Mic
} from "lucide-react";

import DonutChartCard from "../components/donut-chart-card";
import ClientesRankingChart from "../components/clientes-ranking-chart";

import FiliaisMetricChart from "../components/filiais-metric-chart";
import TotalClientesStackedBar from "../components/total-clientes-stacked-bar";

export default function Diretor() {

    const clientesPorFilial = [
        { filial: 'SP - Matriz', valor: 142 },
        { filial: 'RJ', valor: 68 },
        { filial: 'MG', valor: 54 },
        { filial: 'RS', valor: 39 },
        { filial: 'BA', valor: 31 },
    ];


    const filiais = [
        { filial: 'São Paulo - SP', oportunidades: 42, churn: 5, dores: 18 },
        { filial: 'Rio de Janeiro - RJ', oportunidades: 28, churn: 8, dores: 12 },
        { filial: 'Belo Horizonte - MG', oportunidades: 19, churn: 3, dores: 9 },
        { filial: 'Porto Alegre - RS', oportunidades: 15, churn: 6, dores: 14 },
        { filial: 'Curitiba - PR', oportunidades: 22, churn: 2, dores: 7 }
    ];


    const oportunidadesPorTipo = [
        { name: 'RH & Folha', value: 34, color: '#2DD4FF' },
        { name: 'BI & Analytics', value: 22, color: '#21A6D4' },
        { name: 'ERP Upgrade', value: 18, color: '#1A5C7A' },
        { name: 'Treinamento', value: 14, color: '#3B8FB0' },
    ];

    const summaryMetrics = [
        {
            label: "Vendedores Ativos",
            value: "8",
            detail: "+1 este mês",
            progress: 68,
            icon: Users,
            iconColor: "text-[#2DD4FF]",
            badgeBg: "bg-[#12384B]",
            badgeText: "text-[#B9D8E6]",
            barColor: "bg-[#2DD4FF]",
        },
        {
            label: "Tarefas Concluídas",
            value: "72%",
            detail: "138 de 191 tarefas",
            progress: 72,
            icon: CheckCircle2,
            iconColor: "text-[#21D4FD]",
            badgeBg: "bg-[#103847]",
            badgeText: "text-[#8FE8FF]",
            barColor: "bg-[#21D4FD]",
        },
        {
            label: "Oportunidades",
            value: "31",
            detail: "Em aberto",
            progress: 54,
            icon: BriefcaseBusiness,
            iconColor: "text-[#FFB020]",
            badgeBg: "bg-[#3A2A0A]",
            badgeText: "text-[#FFD27A]",
            barColor: "bg-[#FFB020]",
        },
        {
            label: "Clkjientes",
            value: "64",
            detail: "Em acompanhamento",
            progress: 81,
            icon: UserCheck,
            iconColor: "text-[#00E5D0]",
            badgeBg: "bg-[#0E3536]",
            badgeText: "text-[#7EF7EA]",
            barColor: "bg-[#00E5D0]",
        }, {
            label: "Cliendtes",
            value: "64",
            detail: "Em acompanhamento",
            progress: 81,
            icon: UserCheck,
            iconColor: "text-[#00E5D0]",
            badgeBg: "bg-[#0E3536]",
            badgeText: "text-[#7EF7EA]",
            barColor: "bg-[#00E5D0]",
        }, {
            label: "Clientaes",
            value: "64",
            detail: "Em acompanhamento",
            progress: 81,
            icon: UserCheck,
            iconColor: "text-[#00E5D0]",
            badgeBg: "bg-[#0E3536]",
            badgeText: "text-[#7EF7EA]",
            barColor: "bg-[#00E5D0]",
        },
    ];

    const summaryMetrics2 = [
        {
            label: "Vendedores Ativos",
            value: "8",
            detail: "+1 este mês",
            progress: 68,
            icon: Users,
            iconColor: "text-[#2DD4FF]",
            badgeBg: "bg-[#12384B]",
            badgeText: "text-[#B9D8E6]",
            barColor: "bg-[#2DD4FF]",
        },
        {
            label: "Tarefas Concluídas",
            value: "72%",
            detail: "138 de 191 tarefas",
            progress: 72,
            icon: CheckCircle2,
            iconColor: "text-[#21D4FD]",
            badgeBg: "bg-[#103847]",
            badgeText: "text-[#8FE8FF]",
            barColor: "bg-[#21D4FD]",
        },
        {
            label: "Oportunidades",
            value: "31",
            detail: "Em aberto",
            progress: 54,
            icon: BriefcaseBusiness,
            iconColor: "text-[#FFB020]",
            badgeBg: "bg-[#3A2A0A]",
            badgeText: "text-[#FFD27A]",
            barColor: "bg-[#FFB020]",
        }
    ];


    // termos mais recorrentes (ex: extraídos de reuniões/documentação do projeto Protheus)
    const palavras: [string, number][] = [
        ['Protheus', 1000],
        ['Módulo', 800],
        ['Implantação', 600],
        ['Processo', 400],
        ['Customização', 300],
        ['Homologação', 150],
        ['Kickoff', 100],
        ['ADVPL', 80],
        ['Requisito', 50],
        ['ERP', 320],
        ['RM', 280],
        ['Datasul', 240],
        ['Go-live', 450],
        ['Escopo', 380],
        ['Integração', 420],
        ['Status Report', 180],
        ['Treinamento', 220],
        ['Backoffice', 310],
        ['Migração', 270],
        ['Sprint', 290],
        ['Suporte', 170],
        ['API', 210],
        ['Fiscal', 260],
    ];

    const palavrasOrdenadas = [...palavras]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10); // top 10 — lista completa fica poluída

    const maxValor = palavrasOrdenadas[0]?.[1] ?? 1;

    const clientes = [
        { nome: 'Ambev', valor: 24500 },
        { nome: 'Magazine', valor: 18000 },
        { nome: 'JBS', valor: 31000 },
        { nome: 'Gerdau', valor: 14500 },
        { nome: 'Embraer', valor: 21000 },
        { nome: 'Vibra', valor: 16000 },
        { nome: 'Localiza', valor: 12000 },
        { nome: 'Marcopolo', valor: 9500 }
    ];

    return (
        <main
            className="w-full min-h-screen overflow-x-hidden text-white"
            style={{
                background:
                    "linear-gradient(135deg, #042133 0%, #002740 8%, #0D151A 93%)",
            }}>
            <Navbar />

            <div className="flex md:px-15 py-5 md:pt-10 flex-col">
                <div className="mb-8 ">
                    <div className=" text-lg lg:text-2xl font-semibold text-center md:text-left">Bem vindo de volta, Laércio</div>
                    <div className=" text-sm lg:text-base font-light text-center md:text-left tracking-wide text-[#bac4ce]">Examine o status das filiais</div>
                </div>

                <section className="flex w-full px-10 border-1 border-[#0D151A]/15 md:bg-[#0D151A]/30 rounded-sm">
                    <div className="flex flex-row w-full flex-wrap md:flex-nowrap justify-between">
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
                                barVisible={item.barVisible}
                            />
                        ))}
                    </div>
                </section>

                <div className="flex justify-center">
                    <div className="w-full mx-15 rounded-2xl h-[1px] bg-white/20 my-10"></div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap w-full justify-center md:items-start md:justify-between gap-5">
                    <DonutChartCard title="OPORTUNIDADES POR TIPO" data={oportunidadesPorTipo} />
                    <ClientesRankingChart data={clientes}/>
                    <TotalClientesStackedBar data={clientesPorFilial} />
                </div>

                {/* <section className="w-full md:w-[50%] border-1 border-[#0D151A]/15 bg-[#0D151A]/30 rounded-sm p-6">
                        <h2 className="flex gap-5 text-lg font-semibold mb-5">
                            Termos Recorrentes <Mic />
                        </h2>

                        <div className="flex flex-col gap-3">
                            {palavrasOrdenadas.map(([texto, valor]) => (
                                <div key={texto} className="flex items-center gap-3">
                                    <span className="w-32 shrink-0 text-sm text-[#B9D8E6] truncate">
                                        {texto}
                                    </span>
                                    <div className="flex-1 h-2 bg-[#12384B] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#2DD4FF] rounded-full"
                                            style={{ width: `${(valor / maxValor) * 100}%` }}
                                        />
                                    </div>
                                    <span className="w-10 shrink-0 text-right text-xs text-[#8FE8FF]">
                                        {valor}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section> */}

                <div className="flex justify-center">
                    <div className="w-full mx-15 rounded-2xl h-[1px] bg-white/20 my-10"></div>
                </div>

                <div className="mt-5">
                <FiliaisMetricChart data={filiais} />
                </div>

            </div>
        </main>
    )

}