"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Phone, Check } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Cliente {
  id: string;
  nombre: string;
  ci_nit: string;
  telefono: string;
  email: string | null;
  fecha_inicio: string;
  fecha_fin: string;
}

export default function EditarCliente({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<Cliente>({
    id: "",
    nombre: "",
    ci_nit: "",
    telefono: "",
    email: "",
    fecha_inicio: "",
    fecha_fin: ""
  });

  // Cargar datos existentes
  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const { data, error } = await supabase
          .from("clientes")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) {
          console.error("Error fetching cliente:", error);
          toast.error("Error al cargar los datos del cliente");
          return;
        }

        if (data) {
          // Convertir el teléfono de +59178901234 a 78901234
          const telefono = data.telefono?.replace("+591", "") || "";
          setForm({
            ...data,
            telefono,
            email: data.email || ""
          });
        }
      } catch (error) {
        console.error("Error inesperado:", error);
        toast.error("Error inesperado al cargar el cliente");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCliente();
  }, [params.id]);

  const handleInputChange = (field: keyof Cliente, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const actualizar = async () => {
    if (!form.nombre.trim()) {
      toast.error("Falta nombre");
      return;
    }

    if (form.fecha_fin <= form.fecha_inicio) {
      toast.error("La fecha de fin debe ser posterior a la fecha de inicio");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("clientes")
        .update({
          nombre: form.nombre,
          ci_nit: form.ci_nit,
          telefono: `+591${form.telefono}`,
          email: form.email || null,
          fecha_inicio: form.fecha_inicio,
          fecha_fin: form.fecha_fin,
        })
        .eq("id", params.id);

      if (error) {
        console.error("Error updating cliente:", error);
        toast.error(error.message);
        return;
      }

      toast.success("¡Cliente actualizado exitosamente!", {
        description: `${form.nombre} ha sido actualizado en el sistema`,
      });

      router.push("/clientes");
    } catch (error) {
      console.error("Error inesperado:", error);
      toast.error("Error inesperado al actualizar el cliente");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/clientes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Editar Cliente</h2>
            <p className="text-muted-foreground">Cargando datos del cliente...</p>
          </div>
        </div>
        <Card className="max-w-2xl">
          <CardContent className="p-6">
            <div className="text-center">Cargando...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/clientes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Editar Cliente</h2>
          <p className="text-muted-foreground">Modificar información del cliente</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Modifique los datos del cliente</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nombre">Nombre Completo *</Label>
              <Input 
                id="nombre" 
                value={form.nombre}
                onChange={(e) => handleInputChange("nombre", e.target.value)}
                placeholder="Ej: Juan Pérez" 
                className="mt-1" 
              />
            </div>
            <div>
              <Label htmlFor="ci_nit">CI/NIT *</Label>
              <Input 
                id="ci_nit" 
                value={form.ci_nit}
                onChange={(e) => handleInputChange("ci_nit", e.target.value)}
                placeholder="Número de documento" 
                className="mt-1" 
              />
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
                  value={form.telefono}
                  onChange={(e) => handleInputChange("telefono", e.target.value)}
                  placeholder="78901234"
                  className="pl-20"
                  maxLength={8}
                />
              </div>
              {form.telefono && form.telefono.length > 0 && (
                <p className="text-sm text-muted-foreground mt-1">Número completo: +591{form.telefono}</p>
              )}
            </div>
            <div>
              <Label htmlFor="email">Email (opcional)</Label>
              <Input
                id="email"
                type="email"
                value={form.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="cliente@email.com"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={form.fecha_inicio ? new Date(form.fecha_inicio).toISOString().split('T')[0] : ""}
                onChange={(e) => handleInputChange("fecha_inicio", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="fecha_fin">Fecha de Fin *</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={form.fecha_fin ? new Date(form.fecha_fin).toISOString().split('T')[0] : ""}
                onChange={(e) => handleInputChange("fecha_fin", e.target.value)}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" asChild>
              <Link href="/clientes">
                Cancelar
              </Link>
            </Button>
            <Button 
              onClick={actualizar} 
              disabled={isSubmitting} 
              className="min-w-32"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 