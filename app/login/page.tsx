import AuthForm from "@/components/auth-form"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md">
        <AuthForm />

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>¿Necesitas ayuda?</p>
          <p>Contacta al administrador del sistema</p>
        </div>
      </div>
    </div>
  )
}
