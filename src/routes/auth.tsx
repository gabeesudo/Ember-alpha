import { createFileRoute, useRouter, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Flame } from "@/components/ember-icons";
import { EmberBar, EmberStatus, WindowTitle } from "@/components/ember-chrome";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "Entrar — Kaizen" },
      { name: "description", content: "Entre ou cadastre-se no Kaizen para começar sua aventura." },
      { property: "og:title", content: "Entrar — Kaizen" },
      {
        property: "og:description",
        content: "Entre ou cadastre-se no Kaizen para começar sua aventura.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
});

const signupSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  characterName: z.string().min(1, "Nome do personagem é obrigatório").max(50),
});

const phoneSchema = z
  .string()
  .regex(/^\+[1-9]\d{7,14}$/, "Use o formato internacional, como +5511999999999");

type LoginForm = z.infer<typeof loginSchema>;
type SignupForm = z.infer<typeof signupSchema>;

function AuthPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [loginPhoneNumber, setLoginPhoneNumber] = useState("");
  const [loginPhoneCode, setLoginPhoneCode] = useState("");
  const [loginPhoneCodeSent, setLoginPhoneCodeSent] = useState(false);

  const loginForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const signupForm = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: "", password: "", characterName: "" },
  });

  async function onLogin(values: LoginForm) {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    router.invalidate();
    router.navigate({ to: "/dashboard" });
  }

  async function onGoogleLogin() {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });

    if (error) {
      setIsLoading(false);
      toast.error(error.message);
    }
  }

  async function onPhoneLogin() {
    const phoneResult = phoneSchema.safeParse(loginPhoneNumber);
    if (!phoneResult.success) {
      toast.error(phoneResult.error.issues[0]?.message);
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone: phoneResult.data });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setLoginPhoneCodeSent(true);
    toast.success("Código enviado por SMS.");
  }

  async function onPhoneLoginVerify() {
    const phoneResult = phoneSchema.safeParse(loginPhoneNumber);
    if (!phoneResult.success) {
      toast.error(phoneResult.error.issues[0]?.message);
      return;
    }

    if (!/^\d{6}$/.test(loginPhoneCode)) {
      toast.error("Digite o código de 6 dígitos recebido por SMS.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: phoneResult.data,
      token: loginPhoneCode,
      type: "sms",
    });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    router.invalidate();
    router.navigate({ to: "/dashboard" });
  }

  async function onPhoneSignup() {
    const isCharacterNameValid = await signupForm.trigger("characterName");
    if (!isCharacterNameValid) return;

    const phoneResult = phoneSchema.safeParse(phoneNumber);
    if (!phoneResult.success) {
      toast.error(phoneResult.error.issues[0]?.message);
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      phone: phoneResult.data,
      options: {
        data: { character_name: signupForm.getValues("characterName") },
      },
    });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setPhoneCodeSent(true);
    toast.success("Código enviado por SMS.");
  }

  async function onPhoneCodeVerify() {
    const isCharacterNameValid = await signupForm.trigger("characterName");
    if (!isCharacterNameValid) return;

    const phoneResult = phoneSchema.safeParse(phoneNumber);
    if (!phoneResult.success) {
      toast.error(phoneResult.error.issues[0]?.message);
      return;
    }

    if (!/^\d{6}$/.test(phoneCode)) {
      toast.error("Digite o código de 6 dígitos recebido por SMS.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      phone: phoneResult.data,
      token: phoneCode,
      type: "sms",
    });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    router.invalidate();
    router.navigate({ to: "/dashboard" });
  }

  async function onSignup(values: SignupForm) {
    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { character_name: values.characterName },
      },
    });
    setIsLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Conta criada! Verifique seu email para confirmar.");
    setActiveTab("login");
  }

  return (
    <div className="desktop auth-desktop">
      <EmberBar />

      <div className="auth-workspace">
        <div className="os-window auth-window">
          <WindowTitle code="02">Acesso ao sistema</WindowTitle>
          <div className="auth-content">
            <div className="mb-6 text-center auth-heading">
              <Flame className="auth-flame" />
              <h1 className="text-2xl font-bold text-card-foreground">Continue sua jornada</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Entre para continuar sua jornada.
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar conta</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input id="login-email" type="email" {...loginForm.register("email")} />
                    {loginForm.formState.errors.email && (
                      <p className="text-xs text-destructive">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input
                      id="login-password"
                      type="password"
                      {...loginForm.register("password")}
                    />
                    {loginForm.formState.errors.password && (
                      <p className="text-xs text-destructive">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Entrar
                  </Button>
                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">ou</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onGoogleLogin}
                    disabled={isLoading}
                  >
                    <span className="font-bold" aria-hidden="true">
                      G
                    </span>
                    Continuar com Google
                  </Button>

                  <div className="relative py-1">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">ou entre com telefone</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-phone">Telefone</Label>
                      <Input
                        id="login-phone"
                        type="tel"
                        inputMode="tel"
                        placeholder="+5511999999999"
                        value={loginPhoneNumber}
                        onChange={(event) => setLoginPhoneNumber(event.target.value)}
                        disabled={loginPhoneCodeSent || isLoading}
                      />
                    </div>

                    {!loginPhoneCodeSent ? (
                      <Button type="button" variant="outline" className="w-full" onClick={onPhoneLogin} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Enviar código por SMS
                      </Button>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="login-phone-code">Código recebido</Label>
                          <Input
                            id="login-phone-code"
                            type="text"
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            maxLength={6}
                            placeholder="000000"
                            value={loginPhoneCode}
                            onChange={(event) => setLoginPhoneCode(event.target.value.replace(/\D/g, ""))}
                            disabled={isLoading}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <Button type="button" onClick={onPhoneLoginVerify} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Confirmar código
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setLoginPhoneCodeSent(false);
                              setLoginPhoneCode("");
                            }}
                            disabled={isLoading}
                          >
                            Trocar número
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-character">Nome do personagem</Label>
                    <Input
                      id="signup-character"
                      {...signupForm.register("characterName")}
                      placeholder="Ex: Aragorn das Tarefas"
                    />
                    {signupForm.formState.errors.characterName && (
                      <p className="text-xs text-destructive">
                        {signupForm.formState.errors.characterName.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input id="signup-email" type="email" {...signupForm.register("email")} />
                    {signupForm.formState.errors.email && (
                      <p className="text-xs text-destructive">
                        {signupForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      {...signupForm.register("password")}
                    />
                    {signupForm.formState.errors.password && (
                      <p className="text-xs text-destructive">
                        {signupForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Criar conta
                  </Button>
                </form>

                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">ou use seu telefone</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-phone">Telefone</Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      inputMode="tel"
                      placeholder="+5511999999999"
                      value={phoneNumber}
                      onChange={(event) => setPhoneNumber(event.target.value)}
                      disabled={phoneCodeSent || isLoading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use o formato internacional com código do país.
                    </p>
                  </div>

                  {!phoneCodeSent ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={onPhoneSignup}
                      disabled={isLoading}
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Enviar código por SMS
                    </Button>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="signup-phone-code">Código recebido</Label>
                        <Input
                          id="signup-phone-code"
                          type="text"
                          inputMode="numeric"
                          autoComplete="one-time-code"
                          maxLength={6}
                          placeholder="000000"
                          value={phoneCode}
                          onChange={(event) => setPhoneCode(event.target.value.replace(/\D/g, ""))}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button type="button" onClick={onPhoneCodeVerify} disabled={isLoading}>
                          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          Confirmar código
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setPhoneCodeSent(false);
                            setPhoneCode("");
                          }}
                          disabled={isLoading}
                        >
                          Trocar número
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <Link to="/" className="text-primary hover:underline">
                Voltar ao início
              </Link>
            </div>
          </div>
        </div>
      </div>
      <EmberStatus />
    </div>
  );
}
