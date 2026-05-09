import { cookies } from "next/headers";
import PostForm from "../../components/PostForm";
import { prisma } from "@repo/db/prisma";

export default async function PostPage({
  params,
}: {
  params: Promise<{ urlId: string }>;
}) {
  const { urlId } = await params;

  // Check if user is logged in by looking for auth token cookie
  const loggedIn = (await cookies()).has("auth_token");

  if (!loggedIn) {
    return (
      <main>
        <h1>Admin Login</h1>
        <p>Sign in to your account</p>

        <form action="/api/login" method="POST">
          <label htmlFor="password">Password</label>
          <input id="password" name="password" type="password" />
          <button type="submit">Sign In</button>
        </form>
      </main>
    );
  }

  // Fetch post data from database where the urlId matches the urlId in the URL parameters
  const post = await prisma.post.findUnique({
    where: { urlId },
  });

  if (!post) {
    return <main>Post not found</main>;
  }

  // Render Update Post Screen
  return (
    <main>
      <PostForm
        action={`/api/posts/${post.id}`}
        title="Edit Post"
        initialData={{
          title: post.title,
          description: post.description,
          content: post.content,
          tags: post.tags ?? "",
          imageUrl: post.imageUrl,
          category: post.category,
        }}
      />
    </main>
  );
}