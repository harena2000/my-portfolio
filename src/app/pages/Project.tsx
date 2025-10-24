'use client'

import { AnimatedSection } from "@/components/AnimatedSection";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { CV } from "@/constant/cv";

export function Projects() {
  return (
    <AnimatedSection id="project" className="min-h-screen flex items-center justify-center py-12 bg-muted/30">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">Projects</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {CV.projects.map((p) => (
            <Card key={p.title}>
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">{p.desc}</p>
                <p className="text-xs text-muted-foreground">
                  {p.tech.join(" • ")}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
