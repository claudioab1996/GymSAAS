"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

interface Cliente {
  id: string
  nombre: string
  telefono: string
  created_at: string
}

export default function ClientesPage() {
  const router = useRouter()
  const [clientes, setClientes] = useState<Cliente[]>([])

  useEffect(() => {
    supabase
      .from("clientes")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setClientes(data || []))
  }, [])

  const borrar = async (id: string) => {
    if (!confirm("¿Eliminar cliente?")) return
    await supabase.from("clientes").delete().eq("id", id)
    setClientes(clientes.filter((c) => c.id !== id))
  }

  return (
    <div className="grid gap-4">
      {clientes.map((c) => (
        <div key={c.id} className="border rounded p-4 flex justify-between">
          <div>
            <p className="font-medium">{c.nombre}</p>
            <p className="text-sm text-muted-foreground">{c.telefono}</p>
          </div>

          <div className="space-x-2">
            <button onClick={() => router.push(`/dashboard/clientes/${c.id}`)}>✏️</button>
            <button onClick={() => borrar(c.id)}>🗑️</button>
          </div>
        </div>
      ))}
    </div>
  )
}
