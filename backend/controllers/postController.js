import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

// @desc    Get paginated posts (search, category, tag filters)
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 6, 50);
    const skip = (page - 1) * limit;

    const filter = { status: "published" };

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }
    if (req.query.category) {
      filter.category = req.query.category;
    }
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }
    if (req.query.author) {
      filter.author = req.query.author;
    }

    // Authors/admins can request their own drafts via ?mine=true (requires auth, handled in route)
    if (req.query.mine === "true" && req.user) {
      delete filter.status;
      filter.author = req.user._id;
    }

    const [posts, total] = await Promise.all([
      Post.find(filter)
        .populate("author", "name avatarColor role")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Post.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by slug
// @route   GET /api/posts/:slug
// @access  Public
export const getPostBySlug = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).populate("author", "name avatarColor role bio");

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Only the owner/admin can view an unpublished (draft) post
    if (post.status !== "published") {
      const isOwner = req.user && String(post.author._id) === String(req.user._id);
      const isAdmin = req.user && req.user.role === "admin";
      if (!isOwner && !isAdmin) {
        return res.status(404).json({ success: false, message: "Post not found" });
      }
    } else {
      post.views += 1;
      await post.save();
    }

    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a post
// @route   POST /api/posts
// @access  Private (author, admin)
export const createPost = async (req, res, next) => {
  try {
    const { title, content, excerpt, category, tags, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required" });
    }

    const post = await Post.create({
      title,
      content,
      excerpt,
      category,
      tags: Array.isArray(tags) ? tags : tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      status: status === "draft" ? "draft" : "published",
      author: req.user._id,
      coverImage: req.file ? `/uploads/${req.file.filename}` : req.body.coverImageUrl || "",
    });

    res.status(201).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private (owner author, admin)
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const isOwner = String(post.author) === String(req.user._id);
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to edit this post" });
    }

    const { title, content, excerpt, category, tags, status } = req.body;

    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (excerpt !== undefined) post.excerpt = excerpt;
    if (category !== undefined) post.category = category;
    if (tags !== undefined) {
      post.tags = Array.isArray(tags) ? tags : tags.split(",").map((t) => t.trim()).filter(Boolean);
    }
    if (status !== undefined) post.status = status;
    if (req.file) post.coverImage = `/uploads/${req.file.filename}`;
    else if (req.body.coverImageUrl !== undefined) post.coverImage = req.body.coverImageUrl;

    await post.save();
    res.status(200).json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private (owner author, admin)
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const isOwner = String(post.author) === String(req.user._id);
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to delete this post" });
    }

    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();

    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct categories and tags (for filter UI)
// @route   GET /api/posts/meta/filters
// @access  Public
export const getFilterMeta = async (req, res, next) => {
  try {
    const [categories, tags] = await Promise.all([
      Post.distinct("category", { status: "published" }),
      Post.distinct("tags", { status: "published" }),
    ]);
    res.status(200).json({ success: true, data: { categories, tags } });
  } catch (error) {
    next(error);
  }
};
