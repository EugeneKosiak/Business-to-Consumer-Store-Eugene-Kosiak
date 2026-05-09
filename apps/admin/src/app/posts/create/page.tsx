import { isLoggedIn } from "../../../utils/auth";
import { redirect } from "next/dist/client/components/navigation";
import PostForm from "../../components/PostForm";

export default async function CreatePage() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect("/admin/login");
  }

  // Render Create Post Screen
  return (
    <main>
      <PostForm 
        action="/api/posts" 
        title="Create Post"
      />
    </main>
  );
}