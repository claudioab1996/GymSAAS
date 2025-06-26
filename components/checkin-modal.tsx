"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ClientStatusBadge } from "./client-status-badge"
import { toast } from "sonner"
import { RefreshCw, UserCheck } from "lucide-react"

interface Cliente {
  id: string
  nombre: string
  ci_nit: string
  planNombre: string
  estado: "activo" | "vencido" | "congelado"
  fechaFin: string
}

interface CheckinModalProps {
  cliente: Cliente | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CheckinModal({ cliente, open, onOpenChange }: CheckinModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isRenewing, setIsRenewing] = useState(false)

  const handleCheckin = async () => {
    if (!cliente || cliente.estado !== "activo") return

    setIsLoading(true)

    // Simular registro de check-in
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast.success(`Check-in registrado para ${cliente.nombre}`)
    setIsLoading(false)
    onOpenChange(false)
  }

  const handleRenewMembership = async () => {
    if (!cliente) return

    setIsRenewing(true)

    // Simular renovación de membresía
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast.success(`Membresía renovada para ${cliente.nombre}`)
    setIsRenewing(false)

    // Actualizar el estado del cliente localmente para la demo
    cliente.estado = "activo"
    const newDate = new Date()
    newDate.setMonth(newDate.getMonth() + 1)
    cliente.fechaFin = newDate.toISOString()
  }

  if (!cliente) return null

  const canCheckin = cliente.estado === "activo"
  const isExpired = cliente.estado === "vencido"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Información del Cliente</DialogTitle>
          <DialogDescription>
            {isExpired
              ? "Cliente con membresía vencida - Opciones disponibles"
              : "Datos del cliente para registrar entrada"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Nombre</p>
            <p className="font-semibold">{cliente.nombre}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">CI/NIT</p>
            <p className="font-semibold">{cliente.ci_nit}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Plan</p>
            <p className="font-semibold">{cliente.planNombre}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Estado</p>
            <ClientStatusBadge estado={cliente.estado} />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{isExpired ? "Venció el" : "Vence"}</p>
            <p className={`font-semibold ${isExpired ? "text-red-600" : ""}`}>
              {new Date(cliente.fechaFin).toLocaleDateString("es-BO")}
            </p>
          </div>

          {isExpired && (
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Membresía Vencida:</strong> Para permitir el acceso, primero debe renovar la membresía del
                cliente.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancelar
          </Button>

          {isExpired ? (
            <Button
              onClick={handleRenewMembership}
              disabled={isRenewing}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {isRenewing ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Renovando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Renovar Membresía
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleCheckin}
              disabled={!canCheckin || isLoading}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <>
                  <UserCheck className="mr-2 h-4 w-4 animate-pulse" />
                  Registrando...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Registrar Entrada
                </>
              )}
            </Button>
          )}
        </DialogFooter>

        {cliente.estado === "congelado" && (
          <p className="text-sm text-orange-600 text-center">
            Membresía congelada. Contacte al administrador para reactivar.
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}
