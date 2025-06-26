"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckinModal } from "@/components/checkin-modal"
import { Search } from "lucide-react"
import { toast } from "sonner"

// Mock data - en producción vendría de la API
const mockClientes = [
  {
    id: "1",
    nombre: "Juan Pérez",
    ci_nit: "12345678",
    planNombre: "Mensual Premium",
    estado: "activo" as const,
    fechaFin: "2024-01-15",
  },
  {
    id: "2",
    nombre: "María González",
    ci_nit: "87654321",
    planNombre: "Anual Básico",
    estado: "vencido" as const,
    fechaFin: "2023-12-20",
  },
]

export default function CheckinPage() {
  const [ci, setCi] = useState("")
  const [selectedCliente, setSelectedCliente] = useState<(typeof mockClientes)[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!ci.trim()) {
      toast.error("Por favor ingrese un CI/NIT")
      return
    }

    setIsSearching(true)

    // Simular búsqueda
    await new Promise((resolve) => setTimeout(resolve, 500))

    const cliente = mockClientes.find((c) => c.ci_nit === ci.trim())

    if (cliente) {
      setSelectedCliente(cliente)
      setIsModalOpen(true)
    } else {
      toast.error("Cliente no encontrado")
    }

    setIsSearching(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Control de Acceso</h2>
        <p className="text-muted-foreground">Ingrese el CI/NIT del cliente para registrar su entrada</p>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Check-in de Cliente</CardTitle>
            <CardDescription>Ingrese el número de cédula para buscar al cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Número de CI/NIT"
                value={ci}
                onChange={(e) => setCi(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10 text-lg h-12"
                autoFocus
              />
            </div>
            <Button onClick={handleSearch} disabled={isSearching || !ci.trim()} className="w-full h-12 text-lg">
              {isSearching ? "Buscando..." : "Buscar Cliente"}
            </Button>
          </CardContent>
        </Card>
      </div>

      <CheckinModal
        cliente={selectedCliente}
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) {
            setCi("")
            setSelectedCliente(null)
          }
        }}
      />
    </div>
  )
}
