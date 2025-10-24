'use client'

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CV } from "@/constant/cv";
import { AnimatedSection } from "@/components/AnimatedSection";

export function Hero() {
  return (
    <AnimatedSection
      id="home"
      className="min-h-screen flex items-center justify-center text-center"
    >
      <div>
        <Avatar className="w-32 h-32 mx-auto mb-4">
          <AvatarImage src="/profile.jpg" alt={CV.name} />
          <AvatarFallback>{CV.name[0]}</AvatarFallback>
        </Avatar>
        <h1 className="text-4xl font-bold mb-2">{CV.name}</h1>
        <p className="text-muted-foreground mb-4">{CV.title}</p>
        <p className="max-w-2xl mx-auto mb-6 text-sm md:text-base">
          {CV.profile}
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild>
            <a href="#project">View Projects</a>
          </Button>
          <Button variant="outline" asChild>
            <a href={CV.resumeUrl}>Resume</a>
          </Button>
        </div>
      </div>
    </AnimatedSection>
  );
}
