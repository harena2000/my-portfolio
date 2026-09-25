import { notFound } from "next/navigation";

// Any unknown /en/... or /fr/... URL renders the localized 404 page
export default function CatchAll() {
  notFound();
}
