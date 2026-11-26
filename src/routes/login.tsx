import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { authClient, GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  if (isPending) return <main className="frame"><p className="note">…</p></main>;
  if (user) return <Navigate to="/" />;
  return (
    <main className="frame">
      <section className="stage" style={{ maxWidth: 520, margin: "8vh auto" }}>
        <p className="note">MM© STUDIO</p>
        <h1 className="monument" style={{ fontSize: "clamp(3rem, 10vw, 5.5rem)" }}>Éditer</h1>
        <p className="note">Le site public reste visible. L'éditeur est réservé au propriétaire, après une connexion réelle.</p>
        <div className="tool">
          {GROK_PROVIDERS.map((provider) => (
            <button key={provider.providerId} type="button" onClick={() => signIn(provider.providerId, { callbackURL: "/" })}>
              Continuer avec {provider.label}
            </button>
          ))}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            const email = String(form.get("email") ?? "");
            const password = String(form.get("password") ?? "");
            const name = String(form.get("name") ?? "Matt Mez");
            setPending(true);
            setError("");
            const run = mode === "up"
              ? authClient.signUp.email({ email, password, name, callbackURL: "/" })
              : authClient.signIn.email({ email, password, callbackURL: "/" });
            void run
              .then((result) => {
                if (result.error) setError(result.error.message ?? "Connexion impossible.");
              })
              .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Connexion impossible."))
              .finally(() => setPending(false));
          }}
        >
          {mode === "up" ? <label>Nom<input name="name" autoComplete="name" /></label> : null}
          <label>Courriel<input name="email" type="email" required autoComplete="email" /></label>
          <label>Mot de passe<input name="password" type="password" required minLength={8} autoComplete={mode === "up" ? "new-password" : "current-password"} /></label>
          <button className="quiet on" type="submit" disabled={pending}>{mode === "up" ? "Créer le compte" : "Se connecter"}</button>
        </form>
        <button type="button" onClick={() => setMode(mode === "up" ? "in" : "up")}>
          {mode === "up" ? "J'ai déjà un compte" : "Créer un compte propriétaire"}
        </button>
        {error ? <p className="warn">{error}</p> : null}
      </section>
    </main>
  );
}
