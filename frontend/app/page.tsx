import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0F] text-[#F1F5F9]">
      <header className="px-6 h-16 flex items-center justify-between border-b border-[#1E1E2E]">
        <div className="text-2xl font-heading font-bold text-[#6366F1]">OMNIX</div>
        <div className="flex gap-4">
          <Link href="/sign-in">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-[#6366F1] hover:bg-[#5254E0]">Get Started</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 max-w-4xl">
          Deploy AI agents to watch the web — <span className="text-[#6366F1]">so you never miss what matters.</span>
        </h1>
        <p className="text-xl text-[#94A3B8] mb-10 max-w-2xl">
          Omnix fires N parallel AI browser agents across any set of websites, returns structured results, and sends you alerts automatically.
        </p>
        <div className="flex gap-4">
          <Link href="/sign-up">
            <Button size="lg" className="bg-[#6366F1] hover:bg-[#5254E0] text-lg px-8 py-6">
              Launch Your First Mission 🚀
            </Button>
          </Link>
        </div>
      </main>
      <footer className="p-6 border-t border-[#1E1E2E] text-center text-[#94A3B8]">
        © 2026 Omnix. AI agents on duty 24/7.
      </footer>
    </div>
  );
}
