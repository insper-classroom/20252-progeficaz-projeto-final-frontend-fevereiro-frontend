import React, { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "~/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "~/components/ui/alert"
import { apiClient } from "~/lib/api-client"
import { useResendVerificationEmail, useVerifyEmail } from "~/hooks"
import { Car, Touchpad } from "lucide-react"
import { toast } from "sonner"

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const tokenFromUrl = searchParams.get("authToken")
  const navigate = useNavigate()

  const [step, setStep] = useState<"idle" | "sent">("idle")
  const [first, setFirst] = useState<boolean>(true)
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  const { mutate: verifyEmail, isPending: isVerifying } = useVerifyEmail()
  const { mutate: resendEmail, isPending: isResending } = useResendVerificationEmail()

  useEffect(() => {
    if (tokenFromUrl) setToken(tokenFromUrl)
  }, [tokenFromUrl])

  async function sendVerification(targetEmail?: string) {
    setError(null)
    setSuccessMessage(null)
    setLoading(true)

    try {
      const payload = { email: targetEmail ?? email }
      resendEmail(payload, {
        onSuccess: (data) => {
          setFirst(false)
          setSuccessMessage(data.message || "Email de verificação enviado com sucesso")
          setStep("sent")
          setLoading(false)
        },
        onError: (err: any) => {
          setFirst(false)
        const errorMessage = typeof err?.response?.data?.error === "string"
                ? err.response.data.error
                : err?.response?.data?.error?.message ??
                    err?.response?.data?.message ??
                    err?.message ??
                    "Falha ao enviar email de verificação"
        if (errorMessage.includes("Email já verificado")) {
            toast.error("Este email já foi verificado. Por favor, faça login.")
            navigate("/login")
            return
        }
        else {
             setError(
              errorMessage)
        }
            setLoading(false)
        },
      })
    } catch (err: any) {
      setError(err?.response?.data?.error?.message ?? err?.message ?? "Request failed")
      setLoading(false)
    }
  }

  async function verifyToken(t: string) {
   verifyEmail({ authToken: t }, {
      onSuccess: (data) => {
        setSuccessMessage(data.message || "Email verificado com sucesso")
        setError(null)
        setToken(null)
        navigate("/login")
        toast.success("Email verificado com sucesso!")
      },
      onError: (err: any) => {
        navigate("/verify")
        toast.error("Falha ao verificar email", {
          description:
            typeof err?.response?.data?.error === "string"
              ? err.response.data.error
              : err?.response?.data?.error?.message ||
                err?.response?.data?.message ||
                err?.message ||
                "Falha ao verificar email. Tente novamente.",
        })
        setToken(null)
      },
    }) 
  }

  // If token present in URL show a simple verify button UI
  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Verifique seu email</CardTitle>
            <CardDescription>Clique no botão abaixo para verificar seu email.</CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <Alert className="mb-4">
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>{successMessage}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button onClick={() => verifyToken(token)} disabled={loading}>
                {loading ? "Verificando…" : "Verificar"}
              </Button>
              <Button variant="ghost" onClick={() => navigate("/verify")}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Fallback: original send/resend flow when no token in URL
  return (
    <div className="min-h-screen flex items-center justify-center flex-col p-4">
      {first ? (
        <Card className="w-full max-w-lg mb-6">
          <CardHeader>
            <CardTitle>Verifique seu email</CardTitle>
            <CardDescription>
              Por favor, verifique seu email para confirmar sua conta. Se você não recebeu o email, você pode reenviá-lo abaixo.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Reenvie o email de confirmação</CardTitle>
          <CardDescription>
            Caso você não tenha recebido o email de verificação ou <strong>ele tenha expirado</strong>, você pode reenviá-lo aqui.
            Coloque seu email abaixo e clique em "Reenviar email de confirmação".
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="mb-4">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {step === "idle" ? (
            <>
              <div className="mb-6 border rounded-md p-4 bg-secondary/50">
                <input
                  className="input w-full h-10 placeholder:text-muted-foreground"
                  placeholder="email@al.insper.edu.br"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              </div>
              <div className="flex gap-2 justify-between">
                <Button onClick={() => sendVerification()} disabled={loading}>
                  {loading ? "Enviando…" : "Reenviar email de confirmação"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setEmail("")
                    setError(null)
                    setSuccessMessage(null)
                  }}
                >
                  Clear
                </Button>
              </div>
              <div className="flex gap-2 justify-between mt-4">
                <Button variant="link" onClick={() => navigate("/")}>
                  Voltar
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                Um email de verificação foi enviado para {email}. Por favor, verifique sua caixa de entrada e siga as instruções para verificar seu email.
              </p>

              <div className="flex gap-2">
                <input
                  className="input"
                  placeholder="mail@al.insper.edu.br"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
                <Button onClick={() => sendVerification(email)} disabled={loading || !email}>
                  {loading ? "Reenviando…" : "Reenviar email de confirmação"}
                </Button>
              </div>

              <div className="mt-4">
                <Button variant="link" onClick={() => setStep("idle")}>
                  Back
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}