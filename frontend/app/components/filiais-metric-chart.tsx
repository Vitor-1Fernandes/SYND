'use client';

import { useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface FilialDataItem {
    filial: string;
    oportunidades: number;
    churn: number;
    dores: number;
}

type Metrica = 'oportunidades' | 'churn' | 'dores';

interface FiliaisMetricChartProps {
    title?: string;
    data: FilialDataItem[];
}

const METRICAS: { key: Metrica; label: string; cor: string }[] = [
    { key: 'oportunidades', label: 'Oportunidades', cor: '#FFB020' },
    { key: 'churn', label: 'Possíveis Churn', cor: '#FF6B6B' },
    { key: 'dores', label: 'Dores', cor: '#FF6B6B' },
];

export default function FiliaisMetricChart({
    title = 'FILIAIS',
    data,
}: FiliaisMetricChartProps) {
    const [metricaAtiva, setMetricaAtiva] = useState<Metrica>('oportunidades');
    const [filialClicada, setFilialClicada] = useState<string | null>(null);

    const metricaSelecionada = METRICAS.find((m) => m.key === metricaAtiva)!;

    return (
        <div className="w-full border-1 border-[#0D151A]/15 bg-[#0D151A]/30 rounded-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-bold tracking-wide text-white">
                    {title}
                </h2>

                <div className="flex gap-2">
                    {METRICAS.map((metrica) => {
                        const ativa = metrica.key === metricaAtiva;
                        return (
                            <button
                                key={metrica.key}
                                type="button"
                                onClick={() => {
                                    setMetricaAtiva(metrica.key);
                                    setFilialClicada(null);
                                }}
                                className={`px-3 py-1 rounded-sm text-xs font-medium transition-colors ${
                                    ativa
                                        ? 'text-[#0D151A]'
                                        : 'bg-[#12384B] text-[#B9D8E6] hover:bg-[#1A4A61]'
                                }`}
                                style={ativa ? { backgroundColor: metrica.cor } : undefined}
                            >
                                {metrica.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#12384B" vertical={false} />
                        <XAxis
                            dataKey="filial"
                            tickLine={false}
                            axisLine={{ stroke: '#12384B' }}
                            tick={{ fill: '#B9D8E6', fontSize: 12 }}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#B9D8E6', fontSize: 12 }}
                            width={32}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                            itemStyle={{ color: '#FFFFFF' }}
                            wrapperClassName="!bg-[#0D151A] !border !border-[#2DD4FF]/20 !rounded"
                            labelClassName="text-[#B9D8E6]"
                            formatter={(value) => [value, metricaSelecionada.label]}
                        />
                        <Bar dataKey={metricaAtiva} radius={[4, 4, 0, 0]} barSize={32}>
                            {data.map((item) => {
                                const selecionada = item.filial === filialClicada;
                                return (
                                    <Cell
                                        key={item.filial}
                                        fill={selecionada ? '#FFFFFF' : metricaSelecionada.cor}
                                        onClick={() =>
                                            setFilialClicada(selecionada ? null : item.filial)
                                        }
                                        className="cursor-pointer"
                                    />
                                );
                            })}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}