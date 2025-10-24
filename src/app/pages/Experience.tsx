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

export function Experience() {
  return (
    <AnimatedSection id="experience" className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-6">Experience</h2>
        <div className="space-y-4">
          {CV.experience.map((e) => (
            <Card key={e.company}>
              <CardHeader>
                <CardTitle>{e.role}</CardTitle>
                <CardDescription>
                  {e.company} | {e.from} - {e.to}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{e.details}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
