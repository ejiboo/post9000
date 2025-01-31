import { auth } from "@clerk/nextjs";
import { SignIn } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <SignIn />
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Welcome to Post9000</h1>
      {/* We'll add the posting interface here in the next step */}
    </main>
  );
} 