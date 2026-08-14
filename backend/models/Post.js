import mongoose from "mongoose";
import slugify from "slugify";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 160,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    excerpt: {
      type: String,
      maxlength: 300,
      default: "",
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    coverImage: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: true,
      trim: true,
      default: "General",
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

PostSchema.index({ title: "text", content: "text", tags: "text" });

PostSchema.pre("validate", async function (next) {
  if (this.isModified("title") || !this.slug) {
    const base = slugify(this.title, { lower: true, strict: true });
    let candidate = base;
    let counter = 1;
    const Post = this.constructor;
    while (
      await Post.findOne({ slug: candidate, _id: { $ne: this._id } })
    ) {
      candidate = `${base}-${counter++}`;
    }
    this.slug = candidate;
  }
  next();
});

export default mongoose.model("Post", PostSchema);
