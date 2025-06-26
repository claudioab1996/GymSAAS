"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function ConfiguracionPage() {
  const [gymData, setGymData] = useState({
    nombre: "GymPro Fitness",
    direccion: "Av. Principal 123, La Paz",
    telefono: "+59178901234",
    email: "info@gympro.bo",
    descripcion: "El mejor gimnasio de La Paz con equipos de última generación",
  })

  const [notifications, setNotifications] = useState({
    whatsapp: true,
    email: false,
    diasAnticipacion: 7,
  })

  const handleSaveGym = () => {
    toast.success("Información del gimnasio actualizada")
  }

  const handleSaveNotifications = () => {
    toast.success("Configuración de notificaciones actualizada")
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
        <p className="text-muted-foreground">Configuración general del sistema y gimnasio</p>
      </div>

      {/* Información del gimnasio */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Gimnasio</CardTitle>
          <CardDescription>Datos básicos que aparecerán en reportes y comunicaciones</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre del Gimnasio</Label>
              <Input
                id="nombre"
                value={gymData.nombre}
                onChange={(e) => setGymData({ ...gymData, nombre: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                value={gymData.telefono}
                onChange={(e) => setGymData({ ...gymData, telefono: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={gymData.direccion}
              onChange={(e) => setGymData({ ...gymData, direccion: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={gymData.email}
              onChange={(e) => setGymData({ ...gymData, email: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={gymData.descripcion}
              onChange={(e) => setGymData({ ...gymData, descripcion: e.target.value })}
              rows={3}
            />
          </div>

          <Button onClick={handleSaveGym}>Guardar Información</Button>
        </CardContent>
      </Card>

      <Separator />

      {/* Configuración de notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Notificaciones y Recordatorios</CardTitle>
          <CardDescription>Configuración para recordatorios de vencimiento (funcionalidad futura)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-medium">Canales de Notificación</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Seleccione los métodos para enviar recordatorios de renovación
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <p className="text-sm text-muted-foreground">Enviar recordatorios por WhatsApp</p>
                </div>
                <Switch
                  id="whatsapp"
                  checked={notifications.whatsapp}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, whatsapp: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notif">Email</Label>
                  <p className="text-sm text-muted-foreground">Enviar recordatorios por correo electrónico</p>
                </div>
                <Switch
                  id="email-notif"
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="dias">Días de Anticipación</Label>
            <p className="text-sm text-muted-foreground mb-2">
              Cuántos días antes del vencimiento enviar el recordatorio
            </p>
            <Input
              id="dias"
              type="number"
              min="1"
              max="30"
              value={notifications.diasAnticipacion}
              onChange={(e) =>
                setNotifications({ ...notifications, diasAnticipacion: Number.parseInt(e.target.value) })
              }
              className="max-w-32"
            />
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950/50 p-4 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Nota:</strong> Las notificaciones automáticas serán implementadas en una versión futura.
              Actualmente solo se registran en el sistema para preparar la funcionalidad.
            </p>
          </div>

          <Button onClick={handleSaveNotifications}>Guardar Configuración</Button>
        </CardContent>
      </Card>
    </div>
  )
}
