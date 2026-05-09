import { prisma } from "@repo/db/prisma";

// simple slug function
function generateUrlId(title: string) {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")       // spaces → dashes
    .replace(/[^\w-]+/g, "");   // remove non-word chars
}
export async function POST(req: Request) {
  // Extract form data from request body (JSON data sent from frontend to backend)
  const body = await req.json();
  const { title, description, content, tags, imageUrl, category } = body;

  if (!title || !description || !content || !imageUrl || !category) {
    return new Response("Missing fields", { status: 400 }); // 400 - invalid request form user
  }

  // Counter to make duplicate URL Ids unique
  let counter = 1;
  // Create base URL ID from title (e.g. "My First Post" → "my-first-post")
  let baseUrlId = generateUrlId(title);
  let urlId = baseUrlId;

  // Check if URL ID already exists in database, if it does, add a number suffix to make it unique (e.g. "my-first-post-2")
  while (await prisma.post.findUnique({ where: { urlId } })) {
    urlId = `${baseUrlId}-${counter++}`;
  }
  // Create new post in database
  const post = await prisma.post.create({
    data: {
      title,
      description,
      content,
      tags: tags || "",
      imageUrl,
      category: category, 
      urlId,
      active: true,
    },
  });

  return Response.json(post);
}