import { Badge } from "@/components/ui/badge"

type EstadoCliente = "activo" | "vencido" | "congelado"

interface ClientStatusBadgeProps {
  estado: EstadoCliente
}

export function ClientStatusBadge({ estado }: ClientStatusBadgeProps) {
  const statusConfig = {
    activo: { label: "Activo", variant: "default" as const },
    vencido: { label: "Vencido", variant: "destructive" as const },
    congelado: { label: "Congelado", variant: "secondary" as const },
  }

  const config = statusConfig[estado]

  return <Badge variant={config.variant}>{config.label}</Badge>
}
