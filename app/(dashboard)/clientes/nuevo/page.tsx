"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Check, Phone } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/use-auth"

const clienteSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  ci_nit: z.string().min(1, "El CI/NIT es obligatorio"),
  telefono: z.string().regex(/^\d{8}$/, "Debe tener exactamente 8 dígitos"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  planId: z.string().min(1, "Debe seleccionar un plan"),
})

type ClienteForm = z.infer<typeof clienteSchema>

const mockPlanes = [
  { id: "1", nombre: "Mensual Básico", precio: 150, duracionDias: 30, descripcion: "Acceso básico al gimnasio" },
  { id: "2", nombre: "Mensual Premium", precio: 250, duracionDias: 30, descripcion: "Acceso completo + clases" },
  { id: "3", nombre: "Trimestral", precio: 400, duracionDias: 90, descripcion: "3 meses con descuento" },
  { id: "4", nombre: "Anual", precio: 1500, duracionDias: 365, descripcion: "12 meses - mejor precio" },
]

export default function NuevoClientePage() {
  const [step, setStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState<(typeof mockPlanes)[0] | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<ClienteForm>({
    resolver: zodResolver(clienteSchema),
  })

  const watchedPlanId = watch("planId")
  const watchedTelefono = watch("telefono")

  const handleSave = async (data: ClienteForm) => {
    // Validar que nombre no esté vacío
    if (!data.nombre || data.nombre.trim() === "") {
      toast.error("El nombre es obligatorio")
      return
    }

    // Validar que fecha_fin > fecha_inicio
    const fechaInicio = new Date()
    const fechaFin = calculateEndDate()
    
    if (!fechaFin) {
      toast.error("Error al calcular la fecha de vencimiento")
      return
    }

    if (fechaFin <= fechaInicio) {
      toast.error("La fecha de vencimiento debe ser posterior a la fecha de inicio")
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("clientes").insert({
        nombre: data.nombre,
        ci_nit: data.ci_nit,
        telefono: `+591${data.telefono}`,
        email: data.email || null,
        plan_nombre: selectedPlan?.nombre || "",
        fecha_inicio: fechaInicio.toISOString(),
        fecha_fin: fechaFin.toISOString(),
        estado: "activo",
        created_by: user?.id,
      })

      if (error) {
        console.error("Error al guardar cliente:", error)
        toast.error("Error al registrar el cliente")
        return
      }

      toast.success("¡Cliente registrado exitosamente!", {
        description: `${data.nombre} ha sido añadido al sistema`,
      })

      router.push("/clientes")
    } catch (error) {
      console.error("Error inesperado:", error)
      toast.error("Error inesperado al registrar el cliente")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePlanSelect = (planId: string) => {
    setValue("planId", planId)
    const plan = mockPlanes.find((p) => p.id === planId)
    setSelectedPlan(plan || null)
  }

  const calculateEndDate = () => {
    if (!selectedPlan) return null
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + selectedPlan.duracionDias * 24 * 60 * 60 * 1000)
    return endDate
  }

  const validateStep1 = () => {
    const { nombre, ci_nit, telefono } = getValues()
    if (!nombre || nombre.length < 2) {
      toast.error("El nombre debe tener al menos 2 caracteres")
      return false
    }
    if (!ci_nit) {
      toast.error("El CI/NIT es obligatorio")
      return false
    }
    if (!telefono || !telefono.match(/^\d{8}$/)) {
      toast.error("El teléfono debe tener exactamente 8 dígitos")
      return false
    }
    return true
  }

  if (step === 1) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/clientes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Nuevo Cliente</h2>
            <p className="text-muted-foreground">Paso 1 de 2: Datos personales</p>
          </div>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>Ingrese los datos básicos del cliente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre Completo *</Label>
                <Input id="nombre" {...register("nombre")} placeholder="Ej: Juan Pérez" className="mt-1" />
                {errors.nombre && <p className="text-sm text-red-500 mt-1">{errors.nombre.message}</p>}
              </div>
              <div>
                <Label htmlFor="ci_nit">CI/NIT *</Label>
                <Input id="ci_nit" {...register("ci_nit")} placeholder="Número de documento" className="mt-1" />
                {errors.ci_nit && <p className="text-sm text-red-500 mt-1">{errors.ci_nit.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="telefono">Teléfono *</Label>
                <div className="relative mt-1">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">+591</span>
                  </div>
                  <Input
                    id="telefono"
                    {...register("telefono")}
                    placeholder="78901234"
                    className="pl-20"
                    maxLength={8}
                  />
                </div>
                {errors.telefono && <p className="text-sm text-red-500 mt-1">{errors.telefono.message}</p>}
                {watchedTelefono && watchedTelefono.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">Número completo: +591{watchedTelefono}</p>
                )}
              </div>
              <div>
                <Label htmlFor="email">Email (opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="cliente@email.com"
                  className="mt-1"
                />
                {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                onClick={() => {
                  if (validateStep1()) {
                    setStep(2)
                  }
                }}
                className="min-w-32"
              >
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setStep(1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Nuevo Cliente</h2>
          <p className="text-muted-foreground">Paso 2 de 2: Selección de plan</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(handleSave)} className="space-y-6">
        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>Seleccionar Plan</CardTitle>
            <CardDescription>Elige el plan de membresía para el cliente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockPlanes.map((plan) => (
                <Card
                  key={plan.id}
                  className={`cursor-pointer transition-all duration-200 ${
                    watchedPlanId === plan.id
                      ? "ring-2 ring-primary bg-primary/5 shadow-md"
                      : "hover:bg-muted/50 hover:shadow-sm"
                  }`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{plan.nombre}</CardTitle>
                    <p className="text-sm text-muted-foreground">{plan.descripcion}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold">Bs. {plan.precio}</p>
                      <p className="text-sm text-muted-foreground">{plan.duracionDias} días</p>
                      {watchedPlanId === plan.id && (
                        <div className="flex items-center text-primary">
                          <Check className="h-4 w-4 mr-1" />
                          <span className="text-sm font-medium">Seleccionado</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {errors.planId && <p className="text-sm text-red-500 mt-2">{errors.planId.message}</p>}
          </CardContent>
        </Card>

        {selectedPlan && (
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Vista Previa de Membresía</CardTitle>
              <CardDescription>Confirme los detalles antes de registrar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Cliente</Label>
                  <p className="font-semibold">{getValues("nombre")}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">CI/NIT</Label>
                  <p className="font-semibold">{getValues("ci_nit")}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Teléfono</Label>
                  <p className="font-semibold">+591{getValues("telefono")}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Plan Seleccionado</Label>
                  <p className="font-semibold">{selectedPlan.nombre}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Fecha de Inicio</Label>
                  <p className="font-semibold">{new Date().toLocaleDateString("es-BO")}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Fecha de Vencimiento</Label>
                  <p className="font-semibold">{calculateEndDate()?.toLocaleDateString("es-BO")}</p>
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-800 dark:text-green-200">
                  <strong>Total a pagar:</strong> Bs. {selectedPlan.precio} por {selectedPlan.duracionDias} días
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>
                  Volver
                </Button>
                <Button type="submit" disabled={isSubmitting} className="min-w-32">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Registrando...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Registrar Cliente
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </div>
  )
}
