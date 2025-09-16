"use client"

import { Card } from "@/components/ui/card"
import * as Recharts from "recharts"

const R: any = Recharts;
const ResponsiveContainer: React.ComponentType<any> = R.ResponsiveContainer;
const BarChart: React.ComponentType<any> = R.BarChart;
const XAxis: React.ComponentType<any> = R.XAxis;
const YAxis: React.ComponentType<any> = R.YAxis;
const Bar: React.ComponentType<any> = R.Bar;

interface ChartProps {
    data: {
        name: string
        total: number
    }[]
}

export const Chart = ({
    data,
}: ChartProps) => {
    return (
        <Card>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={data}>
                <XAxis 
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                />
                <YAxis 
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: any) => `$${value}`}
                />
                <Bar 
                dataKey="total"
                fill="#0369a1"
                radius={[4, 4, 0, 0]}
                />
            </BarChart>
            </ResponsiveContainer>
        </Card>
    )
}