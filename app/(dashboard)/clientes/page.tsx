"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientStatusBadge } from "@/components/client-status-badge"
import { Search, Plus, Pencil, Trash2 } from "lucide-react"
import Link from "next/link"

// Mock data
const mockClientes = [
  {
    id: "1",
    nombre: "Juan Pérez",
    ci_nit: "12345678",
    telefono: "+59178901234",
    email: "juan@email.com",
    planNombre: "Mensual Premium",
    estado: "activo" as const,
    fechaInicio: "2023-12-15",
    fechaFin: "2024-01-15",
  },
  {
    id: "2",
    nombre: "María González",
    ci_nit: "87654321",
    telefono: "+59187654321",
    email: "maria@email.com",
    planNombre: "Anual Básico",
    estado: "vencido" as const,
    fechaInicio: "2023-01-01",
    fechaFin: "2023-12-20",
  },
  {
    id: "3",
    nombre: "Carlos Mamani",
    ci_nit: "11223344",
    telefono: "+59176543210",
    email: null,
    planNombre: "Trimestral",
    estado: "congelado" as const,
    fechaInicio: "2023-10-15",
    fechaFin: "2024-01-15",
  },
]

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClientes = mockClientes.filter(
    (cliente) => cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || cliente.ci_nit.includes(searchTerm),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Clientes</h2>
          <p className="text-muted-foreground">Gestión de todos los miembros del gimnasio</p>
        </div>
        <Button asChild>
          <Link href="/clientes/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Cliente
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>Todos los clientes registrados en el sistema</CardDescription>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre o CI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>CI/NIT</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Vence</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClientes.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nombre}</TableCell>
                  <TableCell>{cliente.ci_nit}</TableCell>
                  <TableCell>{cliente.telefono}</TableCell>
                  <TableCell>{cliente.planNombre}</TableCell>
                  <TableCell>
                    <ClientStatusBadge estado={cliente.estado} />
                  </TableCell>
                  <TableCell>{new Date(cliente.fechaFin).toLocaleDateString("es-BO")}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
