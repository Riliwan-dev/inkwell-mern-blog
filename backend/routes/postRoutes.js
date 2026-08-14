import express from "express";
import {
  getPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  getFilterMeta,
} from "../controllers/postController.js";
import { getComments, addComment } from "../controllers/commentController.js";
import { protect, optionalAuth, authorize } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", optionalAuth, getPosts);
router.get("/meta/filters", getFilterMeta);
router.get("/:slug", optionalAuth, getPostBySlug);

router.post("/", protect, authorize("author", "admin"), upload.single("coverImage"), createPost);
router.put("/:id", protect, authorize("author", "admin"), upload.single("coverImage"), updatePost);
router.delete("/:id", protect, authorize("author", "admin"), deletePost);

// Comments nested under a post, referenced by post ObjectId
router.get("/:postId/comments", getComments);
router.post("/:postId/comments", protect, addComment);

export default router;
