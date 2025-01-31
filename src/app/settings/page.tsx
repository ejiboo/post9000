import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import PlatformConnections from "@/components/PlatformConnections";

export default async function SettingsPage() {
  const { userId } = auth();

  if (!userId) {
    redirect('/');
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-semibold mb-4">Platform Connections</h2>
        <PlatformConnections />
      </section>
    </div>
  );
} 