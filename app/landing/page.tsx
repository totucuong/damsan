import { redirect } from "next/navigation";

export const metadata = {
  title: "Damsan.life — Your Health Companion",
  description:
    "Capture medical records and medicines you've taken using AI. Join the waitlist to get early access.",
};

export default function LandingPage() {
  redirect("/");
}
