// src/components/TestimonialCard.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type TestimonialCardProps = {
  name: string;
  title: string;
  quote: string;
  companyLogo: React.ReactNode;
  companyName: string;
  score: string;
  avatarSrc: string;
};

export function TestimonialCard({
  name,
  title,
  quote,
  companyLogo,
  companyName,
  score,
  avatarSrc,
}: TestimonialCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-6 flex flex-col gap-4 max-w-sm">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={avatarSrc} alt={name} />
          <AvatarFallback>{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{name}</p>
          <p className="text-sm text-gray-400">{title}</p>
        </div>
      </div>
      <p className="text-gray-300 text-sm leading-6">{quote}</p>
      <div className="mt-auto flex justify-between items-center pt-4">
        <div className="flex items-center gap-2 font-semibold">
          {companyLogo}
          <span>{companyName}</span>
        </div>
        <p className="text-3xl font-bold">
          {score}<span className="text-gray-400 text-lg">/10</span>
        </p>
      </div>
    </div>
  );
}