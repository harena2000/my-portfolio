"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CV } from "@/constant/cv";
import { AnimatedSection } from "@/components/AnimatedSection";
import { motion } from "framer-motion";

export function Contact() {
  return (
    <AnimatedSection
      id="contact"
      className="min-h-screen flex items-center justify-center text-white py-12"
    >
      <div className="max-w-4xl mx-auto px-6 w-full">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold mb-10 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400"
        >
          Contact
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3 text-gray-300"
          >
            <p>
              <strong>Email:</strong> {CV.contact.email}
            </p>
            <p>
              <strong>Phone:</strong> {CV.contact.phone}
            </p>
            <p>
              <strong>Address:</strong> {CV.contact.address}
            </p>
          </motion.div>

          <motion.form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Message sent (demo)");
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6"
          >
            <Input
              placeholder="Your name"
              required
              className="bg-transparent text-white border-white/20"
            />
            <Input
              placeholder="Your email"
              type="email"
              required
              className="bg-transparent text-white border-white/20"
            />
            <Textarea
              placeholder="Message"
              required
              className="bg-transparent text-white border-white/20"
            />
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white"
            >
              Send
            </Button>
          </motion.form>
        </div>
      </div>
      <div className="relative flex justify-end">
          <div className="absolute -top-10 right-0 w-[400px] h-[400px] bg-blue-600/20 rounded-full blur-3xl" />
        </div>
    </AnimatedSection>
  );
}
