import { getDrizzleDb } from ".";
import { postsTable } from "./schemas";
import { JsonPostRepository } from "@/repositories/post/json-post-repository";

(async () => {
  const drizzleDb = getDrizzleDb();
  const jsonPostRepository = new JsonPostRepository();
  const posts = await jsonPostRepository.findAll();

  try {
    await drizzleDb.delete(postsTable);
    await drizzleDb.insert(postsTable).values(posts);
    console.log(`${posts.length} posts foram salvos na base de dados!`);
  } catch (e) {
    console.log("Ocorreu um erro", e);
  }
})();
