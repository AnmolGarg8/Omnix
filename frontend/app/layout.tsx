import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "AgentForIt | Deploy AI agents to watch the web",
  description: "Autonomous web intelligence swarms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} font-sans bg-[#060A06] text-[#E8FFE8] antialiased`}
      >
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </body>
    </html>
  );
}
