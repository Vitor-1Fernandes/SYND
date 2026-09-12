'use client';

import { useState } from 'react';

interface FilialValorItem {
    filial: string;
    valor: number;
}

interface TotalClientesStackedBarProps {
    title?: string;
    data: FilialValorItem[];
}

const CORES = ['#2DD4FF', '#21A6D4', '#1A8FBF', '#3B8FB0', '#8FE8FF', '#0E88C9', '#12384B'];

export default function TotalClientesStackedBar({
    title = 'TOTAL DE CLIENTES POR FILIAL',
    data,
}: TotalClientesStackedBarProps) {
    const [hover, setHover] = useState<string | null>(null);

    const total = data.reduce((soma, item) => soma + item.valor, 0);

    const segmentos = data.map((item, index) => ({
        ...item,
        cor: CORES[index % CORES.length],
        percentual: total > 0 ? (item.valor / total) * 100 : 0,
    }));

    return (
        <div className="w-180 border-1 border-[#0D151A]/15 md:bg-[#0D151A]/30 rounded-sm p-6">
            <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-xs font-bold tracking-wide text-white">
                    {title}
                </h2>
                <span className="text-md text-[#B9D8E6]">
                    Total: <span className="text-white font-semibold">{total}</span>
                </span>
            </div>

            <div className="flex gap-8 items-start">
                {/* barra empilhada em pé, do maior (base) pro menor (topo) */}
                <div className="w-14 h-90 rounded-sm overflow-hidden flex flex-col-reverse bg-[#12384B] shrink-0">
                    {segmentos.map((seg) => (
                        <div
                            key={seg.filial}
                            className="w-full transition-opacity cursor-pointer"
                            style={{
                                height: `${seg.percentual}%`,
                                backgroundColor: seg.cor,
                                opacity: hover && hover !== seg.filial ? 0.35 : 1,
                            }}
                            onMouseEnter={() => setHover(seg.filial)}
                            onMouseLeave={() => setHover(null)}
                            title={`${seg.filial}: ${seg.valor} (${seg.percentual.toFixed(1)}%)`}
                        />
                    ))}
                </div>

                {/* legenda */}
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                    {segmentos.map((seg) => (
                        <div
                            key={seg.filial}
                            className="flex items-center justify-between gap-2 text-md cursor-pointer"
                            onMouseEnter={() => setHover(seg.filial)}
                            onMouseLeave={() => setHover(null)}
                            style={{ opacity: hover && hover !== seg.filial ? 0.5 : 1 }}
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <span
                                    className="w-2.5 h-2.5 rounded-sm shrink-0"
                                    style={{ backgroundColor: seg.cor }}
                                />
                                <span className="text-[#B9D8E6] truncate">{seg.filial}</span>
                            </div>
                            <span className="text-white font-semibold shrink-0">
                                {seg.valor}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}