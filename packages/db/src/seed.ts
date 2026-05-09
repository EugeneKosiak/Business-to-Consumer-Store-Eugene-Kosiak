/*
export async function seed() {
  // TODO: Uncomment below once you set up Prisma and loaded data to your database
  // console.log("🌱 Seeding data");
  // await client.db.like.deleteMany();
  // await client.db.post.deleteMany();
  // for (const post of posts) {
  //   await client.db.post.create({
  //     data: {
  //       title: post.title,
  //       content: post.content,
  //       category: post.category,
  //       description: post.description,
  //       imageUrl: post.imageUrl,
  //       tags: post.tags
  //         .split(",")
  //         .map((p) => p.trim())
  //         .join(","),
  //       urlId: post.urlId,
  //       active: post.active,
  //       date: post.date,
  //       id: post.id,
  //       views: post.views,
  //     },
  //   });
  //   for (let i = 0; i < post.likes; i++) {
  //     await client.db.like.create({
  //       data: {
  //         postId: post.id,
  //         userIP: `192.168.100.${i}`,
  //       },
  //     });
  //   }
  // }
}
  */
import { PrismaClient } from "@prisma/client";
import { posts } from "@repo/db/data";

const client = new PrismaClient();

export async function seed() {
  console.log("🌱 Seeding data");

  await client.like.deleteMany();
  await client.post.deleteMany();

  for (const post of posts) {
    await client.post.create({
      data: {
        title: post.title,
        content: post.content,
        category: post.category,
        description: post.description,
        imageUrl: post.imageUrl,
        tags: post.tags
          .split(",")
          .map((p: string) => p.trim())
          .join(","),
        urlId: post.urlId,
        active: post.active,
        date: post.date,
        id: post.id,
        views: post.views,
      },
    });

    for (let i = 0; i < post.likes; i++) {
      await client.like.create({
        data: {
          postId: post.id,
          userIP: `192.168.100.${i}`,
        },
      });
    }
  }
}
