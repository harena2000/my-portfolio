"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CV } from "@/constant/cv";
import { AnimatedSection } from "@/components/AnimatedSection";

export function Contact() {
  return (
    <AnimatedSection
      id="contact"
      className="min-h-screen flex items-center justify-center py-12"
    >
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-6">Contact</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p>
                <strong>Email:</strong> {CV.contact.email}
              </p>
              <p>
                <strong>Phone:</strong> {CV.contact.phone}
              </p>
              <p>
                <strong>Address:</strong> {CV.contact.address}
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent (demo)");
              }}
              className="space-y-3"
            >
              <Input placeholder="Your name" required />
              <Input placeholder="Your email" type="email" required />
              <Textarea placeholder="Message" required />
              <Button type="submit">Send</Button>
            </form>
          </div>
        </div>
    </AnimatedSection>
  );
}
