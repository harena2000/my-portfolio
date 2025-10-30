"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const menu = [
  "Home",
  "Skills",
  "Project",
  "Experience",
  "Contact",
  "Resume",
];

export function Navbar() {  
  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-15 bg-background/0 backdrop-blur-md"
    >
      <div className="max-w-4xl mx-auto flex justify-between items-center p-4">
        <Link
          href="#home"
          className="font-bold text-lg"
        >
          Harena Rico
        </Link>

        <div className="hidden md:flex gap-4">
          {menu.map((m) => {
            const id = `#${m.toLowerCase().replace(/\\s+/g, "-")}`;
            return (
              <a
                key={m}
                href={id}
                className="text-sm hover:text-primary transition"
              >
                {m}
              </a>
            );
          })}
          <Button asChild size="sm">
            <a href="/resume.pdf">Download CV</a>
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
