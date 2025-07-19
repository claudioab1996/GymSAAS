"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts"

type TimePeriod = "1mes" | "3meses" | "6meses"

// Función para generar datos según el período
const generateCheckinData = (period: TimePeriod) => {
  const days = period === "1mes" ? 30 : period === "3meses" ? 90 : 180
  return Array.from({ length: days }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (days - 1 - i))
    return {
      fecha: date.toLocaleDateString("es-BO", {
        month: "short",
        day: "numeric",
        ...(period === "6meses" && { year: "2-digit" }),
      }),
      checkins: Math.floor(Math.random() * 80) + 20,
    }
  })
}

// Datos mejorados para el heatmap
const heatmapData = [
  { hora: "06:00", lunes: 15, martes: 18, miercoles: 16, jueves: 20, viernes: 22, sabado: 25, domingo: 8 },
  { hora: "07:00", lunes: 35, martes: 40, miercoles: 38, jueves: 42, viernes: 45, sabado: 50, domingo: 15 },
  { hora: "08:00", lunes: 55, martes: 60, miercoles: 58, jueves: 62, viernes: 65, sabado: 70, domingo: 25 },
  { hora: "09:00", lunes: 30, martes: 35, miercoles: 33, jueves: 37, viernes: 40, sabado: 45, domingo: 35 },
  { hora: "10:00", lunes: 20, martes: 25, miercoles: 23, jueves: 27, viernes: 30, sabado: 35, domingo: 40 },
  { hora: "11:00", lunes: 15, martes: 18, miercoles: 16, jueves: 20, viernes: 22, sabado: 28, domingo: 32 },
  { hora: "12:00", lunes: 25, martes: 28, miercoles: 26, jueves: 30, viernes: 32, sabado: 35, domingo: 38 },
  { hora: "17:00", lunes: 45, martes: 48, miercoles: 46, jueves: 50, viernes: 52, sabado: 30, domingo: 20 },
  { hora: "18:00", lunes: 70, martes: 75, miercoles: 73, jueves: 77, viernes: 80, sabado: 45, domingo: 25 },
  { hora: "19:00", lunes: 85, martes: 90, miercoles: 88, jueves: 92, viernes: 95, sabado: 60, domingo: 30 },
  { hora: "20:00", lunes: 60, martes: 65, miercoles: 63, jueves: 67, viernes: 70, sabado: 40, domingo: 20 },
  { hora: "21:00", lunes: 35, martes: 38, miercoles: 36, jueves: 40, viernes: 42, sabado: 25, domingo: 15 },
]

const planesPopulares = [
  { plan: "Mensual Premium", clientes: 85, color: "#22c55e" },
  { plan: "Mensual Básico", clientes: 142, color: "#3b82f6" },
  { plan: "Trimestral", clientes: 34, color: "#f59e0b" },
  { plan: "Anual", clientes: 28, color: "#ef4444" },
]

// Función para obtener la intensidad del color basada en el valor
const getHeatmapColor = (value: number) => {
  if (value < 20) return "#fef3c7" // amarillo muy claro
  if (value < 40) return "#fde047" // amarillo
  if (value < 60) return "#fb923c" // naranja
  if (value < 80) return "#f87171" // rojo claro
  return "#dc2626" // rojo intenso
}

export default function AnaliticasPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>("1mes")
  const [checkinData, setCheckinData] = useState(() => generateCheckinData("1mes"))

  const handlePeriodChange = (period: TimePeriod) => {
    setSelectedPeriod(period)
    setCheckinData(generateCheckinData(period))
  }

  const periodLabels = {
    "1mes": "Último mes",
    "3meses": "Últimos 3 meses",
    "6meses": "Últimos 6 meses",
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analíticas</h2>
        <p className="text-muted-foreground">Análisis detallado de la actividad del gimnasio</p>
      </div>

      {/* Filtros de tiempo */}
      <Card>
        <CardHeader>
          <CardTitle>Período de Análisis</CardTitle>
          <CardDescription>Selecciona el rango de tiempo para visualizar los datos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {(Object.keys(periodLabels) as TimePeriod[]).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                onClick={() => handlePeriodChange(period)}
                size="sm"
              >
                {periodLabels[period]}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Check-ins diarios mejorado */}
      <Card>
        <CardHeader>
          <CardTitle>Check-ins Diarios - {periodLabels[selectedPeriod]}</CardTitle>
          <CardDescription>Tendencia de entradas registradas por día</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={checkinData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="fecha" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="checkins"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Heatmap mejorado */}
      <Card>
        <CardHeader>
          <CardTitle>Mapa de Calor - Horarios Más Concurridos</CardTitle>
          <CardDescription>Intensidad de check-ins por día de la semana y hora del día</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Leyenda */}
            <div className="flex items-center gap-4 text-sm">
              <span>Menos concurrido</span>
              <div className="flex gap-1">
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#fef3c7" }}></div>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#fde047" }}></div>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#fb923c" }}></div>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#f87171" }}></div>
                <div className="w-4 h-4 rounded" style={{ backgroundColor: "#dc2626" }}></div>
              </div>
              <span>Más concurrido</span>
            </div>

            {/* Grid del heatmap */}
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-8 gap-1 text-sm">
                  {/* Header */}
                  <div className="p-2 font-medium text-center">Hora</div>
                  <div className="p-2 font-medium text-center">Lun</div>
                  <div className="p-2 font-medium text-center">Mar</div>
                  <div className="p-2 font-medium text-center">Mié</div>
                  <div className="p-2 font-medium text-center">Jue</div>
                  <div className="p-2 font-medium text-center">Vie</div>
                  <div className="p-2 font-medium text-center">Sáb</div>
                  <div className="p-2 font-medium text-center">Dom</div>

                  {/* Data rows */}
                  {heatmapData.map((row) => (
                    <div key={row.hora} className="contents">
                      <div className="p-2 font-medium text-center bg-muted/50 rounded">
                        {row.hora}
                      </div>
                      <div
                        key={`${row.hora}-lunes`}
                        className="p-2 text-center rounded font-medium text-gray-800"
                        style={{ backgroundColor: getHeatmapColor(row.lunes) }}
                      >
                        {row.lunes}
                      </div>
                      <div
                        key={`${row.hora}-martes`}
                        className="p-2 text-center rounded font-medium text-gray-800"
                        style={{ backgroundColor: getHeatmapColor(row.martes) }}
                      >
                        {row.martes}
                      </div>
                      <div
                        key={`${row.hora}-miercoles`}
                        className="p-2 text-center rounded font-medium text-gray-800"
                        style={{ backgroundColor: getHeatmapColor(row.miercoles) }}
                      >
                        {row.miercoles}
                      </div>
                      <div
                        key={`${row.hora}-jueves`}
                        className="p-2 text-center rounded font-medium text-gray-800"
                        style={{ backgroundColor: getHeatmapColor(row.jueves) }}
                      >
                        {row.jueves}
                      </div>
                      <div
                        key={`${row.hora}-viernes`}
                        className="p-2 text-center rounded font-medium text-gray-800"
                        style={{ backgroundColor: getHeatmapColor(row.viernes) }}
                      >
                        {row.viernes}
                      </div>
                      <div
                        key={`${row.hora}-sabado`}
                        className="p-2 text-center rounded font-medium text-gray-800"
                        style={{ backgroundColor: getHeatmapColor(row.sabado) }}
                      >
                        {row.sabado}
                      </div>
                      <div
                        key={`${row.hora}-domingo`}
                        className="p-2 text-center rounded font-medium text-gray-800"
                        style={{ backgroundColor: getHeatmapColor(row.domingo) }}
                      >
                        {row.domingo}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Planes más populares mejorado */}
        <Card>
          <CardHeader>
            <CardTitle>Planes Más Populares</CardTitle>
            <CardDescription>Distribución de clientes por tipo de plan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={planesPopulares} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="plan" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="clientes" radius={[4, 4, 0, 0]}>
                  {planesPopulares.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Estadísticas rápidas mejoradas */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Mes</CardTitle>
            <CardDescription>Estadísticas clave del mes actual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div>
                <span className="text-sm text-muted-foreground">Nuevos clientes</span>
                <p className="text-xs text-green-600 mt-1">↗ +15% vs mes anterior</p>
              </div>
              <Badge variant="secondary" className="text-2xl font-bold text-green-600 bg-green-100 dark:bg-green-900">
                +23
              </Badge>
            </div>

            <div className="flex justify-between items-center p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
              <div>
                <span className="text-sm text-muted-foreground">Cancelaciones</span>
                <p className="text-xs text-red-600 mt-1">↘ -8% vs mes anterior</p>
              </div>
              <Badge variant="secondary" className="text-2xl font-bold text-red-600 bg-red-100 dark:bg-red-900">
                -5
              </Badge>
            </div>

            <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div>
                <span className="text-sm text-muted-foreground">Check-ins promedio/día</span>
                <p className="text-xs text-blue-600 mt-1">↗ +12% vs mes anterior</p>
              </div>
              <Badge variant="secondary" className="text-2xl font-bold text-blue-600 bg-blue-100 dark:bg-blue-900">
                67
              </Badge>
            </div>

            <div className="flex justify-between items-center p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div>
                <span className="text-sm text-muted-foreground">Horario pico</span>
                <p className="text-xs text-purple-600 mt-1">Mayor concurrencia</p>
              </div>
              <Badge
                variant="secondary"
                className="text-2xl font-bold text-purple-600 bg-purple-100 dark:bg-purple-900"
              >
                19:00
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
