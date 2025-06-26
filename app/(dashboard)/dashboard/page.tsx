"use client"

import { KpiCard } from "@/components/kpi-card"
import { Users, UserPlus, Calendar, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Datos mock - en producción vendrían de la API
const kpiData = {
  clientesActivos: 142,
  vencenEn7Dias: 8,
  altasHoy: 3,
  entradasHoy: 67,
}

const chartData = [
  { mes: "Ene", altas: 12, bajas: 2 },
  { mes: "Feb", altas: 18, bajas: 4 },
  { mes: "Mar", altas: 25, bajas: 3 },
  { mes: "Abr", altas: 22, bajas: 5 },
  { mes: "May", altas: 28, bajas: 6 },
  { mes: "Jun", altas: 31, bajas: 4 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Resumen general de la actividad del gimnasio</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Clientes Activos"
          value={kpiData.clientesActivos}
          icon={Users}
          description="Total de membresías activas"
        />
        <KpiCard
          title="Vencen en 7 días"
          value={kpiData.vencenEn7Dias}
          icon={Calendar}
          description="Requieren renovación pronta"
        />
        <KpiCard title="Altas Hoy" value={kpiData.altasHoy} icon={UserPlus} description="Nuevos clientes registrados" />
        <KpiCard
          title="Entradas Hoy"
          value={kpiData.entradasHoy}
          icon={TrendingUp}
          description="Check-ins registrados"
        />
      </div>

      {/* Gráfico */}
      <Card>
        <CardHeader>
          <CardTitle>Altas vs Bajas - Últimos 6 meses</CardTitle>
          <CardDescription>Comparación de nuevos clientes versus cancelaciones</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="altas" fill="#22c55e" name="Altas" />
              <Bar dataKey="bajas" fill="#ef4444" name="Bajas" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
