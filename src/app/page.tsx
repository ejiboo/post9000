import { auth, UserButton } from "@clerk/nextjs";
import { SignIn } from "@clerk/nextjs";
import PostForm from "@/components/PostForm";

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
      <nav className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Post9000</h1>
        <UserButton afterSignOutUrl="/" />
      </nav>
      <PostForm />
    </main>
  );
} 