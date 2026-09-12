'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DonutDataItem {
    name: string;
    value: number;
    color: string;
}

interface DonutChartCardProps {
    title: string;
    data: DonutDataItem[];
}

export default function DonutChartCard({ title, data }: DonutChartCardProps) {
    return (
        <div className="w-full max-w-xs border-1 border-[#0D151A]/15 md:bg-[#0D151A]/30 rounded-sm p-6">
            <h2 className="text-xs font-bold tracking-wide text-white mb-6">
                {title}
            </h2>

            <div className="w-full h-52">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius="65%"
                            outerRadius="95%"
                            paddingAngle={2}
                            stroke="#0D151A"
                            strokeWidth={2}
                        >
                            {data.map((item) => (
                                <Cell key={item.name} fill={item.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="flex flex-col gap-3 mt-7">
                {data.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-2.5 h-2.5 rounded-sm shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-[#B9D8E6]">{item.name}</span>
                        </div>
                        <span className="font-semibold text-white">{item.value}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
