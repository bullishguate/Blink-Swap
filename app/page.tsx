import { Header } from "@/components/header";
import { Dashboard } from "@/components/dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Dashboard />
      </main>
      <footer className="border-t border-border mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built for the Blink community. Support the creator:
          </p>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs font-mono text-muted-foreground">
            <span>Onchain: 16XzdTgbSqGQMep7DZ3Ev1ZfARjWph1KP7</span>
            <span>Lightning: cryptobaby@blink.sv</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
