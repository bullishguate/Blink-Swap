import { Header } from "@/components/header";
import { Dashboard } from "@/components/dashboard";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <Dashboard />
      </main>
      <footer className="border-t border-border py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built for the Blink community
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-2 text-xs font-mono text-muted-foreground">
            <span>Onchain: 16XzdTgbSqGQMep7DZ3Ev1ZfARjWph1KP7</span>
            <span className="hidden sm:inline">|</span>
            <span>Lightning: cryptobaby@blink.sv</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
