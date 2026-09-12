'use client';

import { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Tooltip, LabelList } from 'recharts';

interface ClienteDataItem {
    nome: string;
    valor: number;
}

interface ClientesRankingChartProps {
    title?: string;
    data: ClienteDataItem[];
    top?: number;
}

const CORES = ['#2DD4FF', '#21A6D4', '#1A8FBF', '#3B8FB0', '#8FE8FF'];

// tamanho de fonte decrescente por posição no ranking (1º maior, últimos menores)
// precisa continuar inline: é um valor calculado em runtime, Tailwind não gera
// classes dinâmicas a partir de números computados no client
const FONT_SIZE_MAX = 16;
const FONT_SIZE_MIN = 13;

// abaixo dessa largura de container, o card entra em "modo compacto":
// fonte menor, menos espaço reservado pro nome/valor e número abreviado
const BREAKPOINT_COMPACTO = 380;

function fontSizePorPosicao(index: number, total: number, compacto: boolean) {
    const max = compacto ? FONT_SIZE_MAX - 3 : FONT_SIZE_MAX;
    const min = compacto ? FONT_SIZE_MIN - 2 : FONT_SIZE_MIN;
    if (total <= 1) return max;
    const passo = (max - min) / (total - 1);
    return max - passo * index;
}

function formatarValor(valor: number, compacto: boolean) {
    if (compacto) {
        // "R$ 31.000,00" vira "R$ 31 mil" — cabe no espaço estreito sem cortar
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            notation: 'compact',
            maximumFractionDigits: 1,
        }).format(valor);
    }
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// tick customizado do eixo Y (nome do cliente), alinhado à esquerda
function NomeTick({ y, payload, index, total, compacto }: any) {
    return (
        <text
            x={0}
            y={y}
            dy={4}
            textAnchor="start"
            className={`fill-[#B9D8E6] ${index === 0 ? 'font-semibold' : 'font-normal'}`}
            style={{ fontSize: fontSizePorPosicao(index, total, compacto) }}
        >
            {payload.value}
        </text>
    );
}

// label customizado do valor, ao final da barra
function ValorLabel({ x, y, width, height, value, index, total, compacto }: any) {
    return (
        <text
            x={x + width + 8}
            y={y + height / 2}
            dy={4}
            textAnchor="start"
            className={`fill-white ${index === 0 ? 'font-semibold' : 'font-normal'}`}
            style={{ fontSize: fontSizePorPosicao(index, total, compacto) }}
        >
            {formatarValor(Number(value), compacto)}
        </text>
    );
}

export default function ClientesRankingChart({
    title = 'CLIENTES POR VALOR',
    data,
    top = 10,
}: ClientesRankingChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [largura, setLargura] = useState(0);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            setLargura(entries[0].contentRect.width);
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const compacto = largura > 0 && largura < BREAKPOINT_COMPACTO;

    const ranking = [...data]
        .sort((a, b) => b.valor - a.valor)
        .slice(0, top);

    // nome/valor ocupam menos espaço fixo no modo compacto, sobrando mais
    // largura útil pra barra em telas estreitas
    const larguraNome = compacto ? 72 : 110;
    const margemValor = compacto ? 56 : 90;

    return (
        <div
            ref={containerRef}
            className="w-full h-full border-1 border-[#0D151A]/15 md:bg-[#0D151A]/30 rounded-sm p-6"
        >
            <h2 className="text-xs font-bold tracking-wide text-white mb-6">
                {title}
            </h2>

            <div className="w-full" style={{ height: ranking.length * 44 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={ranking}
                        layout="vertical"
                        margin={{ top: 0, right: margemValor, left: 0, bottom: 0 }}
                        barCategoryGap={12}
                    >
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="nome"
                            width={larguraNome}
                            tickLine={false}
                            axisLine={false}
                            tick={(props) => (
                                <NomeTick {...props} total={ranking.length} compacto={compacto} />
                            )}
                        />
                        <Tooltip
                            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                            wrapperClassName="!bg-[#0D151A] !border !border-[#2DD4FF]/20 !rounded"
                            labelClassName="text-[#B9D8E6]"
                            itemStyle={{ color: '#2DD4FF' }}
                            formatter={(value) => [
                                Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
                                'Valor',
                            ]}
                        />
                        <Bar dataKey="valor" radius={[0, 4, 4, 0]} barSize={14}>
                            {ranking.map((item, index) => (
                                <Cell key={item.nome} fill={CORES[index % CORES.length]} />
                            ))}
                            <LabelList
                                dataKey="valor"
                                content={(props) => (
                                    <ValorLabel {...props} total={ranking.length} compacto={compacto} />
                                )}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}