"use client"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Pencil, Trash2 } from "lucide-react"

const mockPlanes = [
  {
    id: "1",
    nombre: "Mensual Básico",
    precio: 150,
    duracionDias: 30,
    descripcion: "Acceso a gimnasio y máquinas básicas",
  },
  {
    id: "2",
    nombre: "Mensual Premium",
    precio: 250,
    duracionDias: 30,
    descripcion: "Full acceso + clases grupales + nutricionista",
  },
  {
    id: "3",
    nombre: "Trimestral",
    precio: 400,
    duracionDias: 90,
    descripcion: "Plan de 3 meses con descuento",
  },
  {
    id: "4",
    nombre: "Anual",
    precio: 1500,
    duracionDias: 365,
    descripcion: "Plan anual con máximo descuento",
  },
]

export default function PlanesPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Planes</h2>
          <p className="text-muted-foreground">Gestión de planes de membresía</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Plan
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Planes</CardTitle>
          <CardDescription>Todos los planes de membresía disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio (Bs.)</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPlanes.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium">{plan.nombre}</TableCell>
                  <TableCell>Bs. {plan.precio}</TableCell>
                  <TableCell>{plan.duracionDias} días</TableCell>
                  <TableCell>{plan.descripcion}</TableCell>
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
