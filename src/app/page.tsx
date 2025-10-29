import { Contact, Experience, Hero, Projects, Skills } from "@/app/pages";

export default function Home() {
  return (
    <main className="relative min-h-screen text-white overflow-x-hidden bg-gradient-to-b from-[#0a0a2e] via-[#0f1e64] to-[#132f9c]">
      <div className="inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.15),transparent_60%)]">
        <Hero />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
        <footer className="text-center text-sm py-6 text-muted-foreground">
          © {new Date().getFullYear()} Harena Rico
        </footer>
      </div>
    </main>
  );
}
