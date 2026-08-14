/**
 * Seed script — populates the database with demo users (admin, author, reader),
 * a handful of published blog posts across categories, and sample comments,
 * so the app is immediately populated on first run.
 *
 * Usage: npm run seed
 */
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Post from "./models/Post.js";
import Comment from "./models/Comment.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  console.log("[Seed] Clearing existing data...");
  await Promise.all([User.deleteMany({}), Post.deleteMany({}), Comment.deleteMany({})]);

  console.log("[Seed] Creating users...");
  const admin = await User.create({
    name: "Amara Chukwu",
    email: "admin@inkwell.io",
    password: "Admin123!",
    role: "admin",
  });

  const author = await User.create({
    name: "Deji Okafor",
    email: "author@inkwell.io",
    password: "Author123!",
    role: "author",
  });

  const reader = await User.create({
    name: "Tolu Bankole",
    email: "reader@inkwell.io",
    password: "Reader123!",
    role: "reader",
  });

  console.log("[Seed] Creating posts...");
  const postsData = [
    {
      title: "Why Markdown Won Over the Modern Web",
      excerpt: "A look at why plain-text formatting outlived every rich-text editor trend.",
      content:
        "# Why Markdown Won\n\nMarkdown survived because it gets out of the way. It reads like plain English even before it's rendered, which means writers stay in a writing headspace instead of switching to a formatting headspace.\n\n## Portability\n\nA `.md` file opens anywhere: a terminal, a static site generator, a note-taking app. No proprietary format lock-in.\n\n## Simplicity\n\nHeadings, lists, and emphasis cover 90% of what most writing needs. The remaining 10% can drop into raw HTML when required.\n\nThat's the whole pitch, and it's why this editor uses it.",
      category: "Writing",
      tags: ["markdown", "tools", "writing"],
      author: author._id,
    },
    {
      title: "A Practical Guide to JWT Authentication",
      excerpt: "Bearer tokens, refresh strategy, and the mistakes most tutorials skip.",
      content:
        "# JWT Authentication, Practically\n\nJSON Web Tokens are popular because they're stateless — the server doesn't need a session store to validate a request.\n\n## The Core Flow\n\n1. User logs in with credentials\n2. Server verifies and signs a token\n3. Client stores the token and attaches it as a Bearer header\n4. Server verifies the signature on every request\n\n## Common Mistakes\n\n- Storing tokens in `localStorage` without XSS mitigation\n- Never expiring tokens\n- Putting sensitive data in the payload (it's base64, not encrypted)\n\nUsed carefully, JWTs are a solid default for small-to-medium APIs.",
      category: "Engineering",
      tags: ["jwt", "authentication", "nodejs"],
      author: author._id,
    },
    {
      title: "Designing Empty States That Actually Help",
      excerpt: "An empty screen is an invitation to act, not a dead end.",
      content:
        "# Designing Empty States\n\nMost empty states just say 'No data.' That's a missed opportunity.\n\n## Treat It As Onboarding\n\nAn empty inbox, an empty dashboard, an empty search result — each is a chance to tell someone exactly what to do next.\n\n## Keep the Voice Consistent\n\nIf your buttons say 'Create post,' your empty state copy should say 'Create your first post,' not 'Nothing here yet.'\n\nSmall details, but they compound across a whole product.",
      category: "Design",
      tags: ["ux", "design", "product"],
      author: admin._id,
    },
    {
      title: "MongoDB Indexing Basics Every Backend Dev Should Know",
      excerpt: "Query performance rarely comes from bigger servers — it comes from better indexes.",
      content:
        "# MongoDB Indexing Basics\n\nWithout an index, MongoDB scans every document in a collection to satisfy a query. That's fine for a few hundred documents. It's not fine at scale.\n\n## Single Field Indexes\n\n`db.posts.createIndex({ slug: 1 })` — fast lookups on a frequently queried field.\n\n## Text Indexes\n\nFor search bars, a text index (`{ title: \"text\", content: \"text\" }`) lets you use `$text: { $search: ... }` instead of slow regex scans.\n\n## Compound Indexes\n\nWhen you filter and sort together, a compound index on both fields avoids an in-memory sort.\n\nIndexes aren't free — they cost write performance and disk space — but for read-heavy apps like a blog, they're almost always worth it.",
      category: "Engineering",
      tags: ["mongodb", "database", "performance"],
      author: author._id,
    },
  ];

  const createdPosts = [];
  for (const data of postsData) {
    const post = await Post.create(data);
    createdPosts.push(post);
  }

  console.log("[Seed] Creating comments...");
  await Comment.create({
    post: createdPosts[0]._id,
    author: reader._id,
    content: "This is exactly why I switched my notes app to Markdown last year. Great writeup!",
  });
  await Comment.create({
    post: createdPosts[1]._id,
    author: admin._id,
    content: "Worth adding: rotate your JWT_SECRET periodically in production, not just at incident response time.",
  });
  await Comment.create({
    post: createdPosts[1]._id,
    author: reader._id,
    content: "Good breakdown — I always forget that the payload isn't encrypted by default.",
  });

  console.log("[Seed] Done!");
  console.log("--------------------------------------------------");
  console.log(" Admin login:  admin@inkwell.io  / Admin123!");
  console.log(" Author login: author@inkwell.io / Author123!");
  console.log(" Reader login: reader@inkwell.io / Reader123!");
  console.log("--------------------------------------------------");
  process.exit(0);
};

seed().catch((err) => {
  console.error("[Seed] Error:", err);
  process.exit(1);
});
