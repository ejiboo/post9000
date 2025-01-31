import { auth } from "@clerk/nextjs";
import { SignIn } from "@clerk/nextjs";
import PostForm from "@/components/PostForm";
import PostsList from "@/components/PostsList";

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
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Create New Post</h2>
          <div className="bg-white rounded-lg shadow">
            <PostForm />
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Posts</h2>
          <PostsList />
        </div>
      </div>
    </div>
  );
} 