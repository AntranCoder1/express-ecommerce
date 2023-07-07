import { Blog } from "../models/blog.model";
import { VietnameseStringToSlug } from "../utils/supporter.util";
import { bc_updateBlogs } from "./blogCategory.repo";
export const b_list = async (domain: any) => {
  return await Blog.find({ domain }).populate("author").populate("category");
};
export const b_getById = async (id: any) => {
  return await Blog.findById(id);
};
export const b_getBySlug = async (domain: any, slug: string) => {
  return await Blog.findOne({ domain, slug })
    .populate("author")
    .populate("category");
};
export const b_create = async (body: any) => {
  let slug = body.slug;
  let blog = await Blog.findOne({ slug }).select({ _id: 1 });

  while (blog !== null || blog !== undefined) {
    slug += "-1";

    blog = await Blog.findOne({ slug }).select({ _id: 1 });
  }
  body.slug = slug;
  const newBlog = new Blog(body);
  await newBlog.save();

  if (newBlog.category) {
    await bc_updateBlogs(newBlog.category, 1);
  }

  return newBlog._id;
};
export const b_update = async (id: any, body: any) => {
  const blog = await Blog.findById(id);
  // Handle category
  if (
    body.category &&
    blog.category &&
    body.category.toString() !== blog.category.toString()
  ) {
    await bc_updateBlogs(body.category, 1);
    await bc_updateBlogs(blog.category, -1);
  } else if (body.category && !blog.category) {
    await bc_updateBlogs(body.category, 1);
  } else if (!body.category && blog.category) {
    await bc_updateBlogs(blog.category, -1);
  }
  // Handle slug
  if (blog.title !== body.title) {
    let slug = VietnameseStringToSlug(body.title);
    let oldBlog = await Blog.findOne({ slug });
    while (oldBlog !== undefined || oldBlog !== null) {
      slug += "-1";
      oldBlog = await Blog.findOne({ slug });
    }
    body.slug = slug;
  }
  const modified = await Blog.findByIdAndUpdate(id, body);
  return modified._id;
};
export const b_updateThumbnail = async (id: any, thumbnail: any) => {
  const modified = await Blog.findByIdAndUpdate(id, thumbnail);
  return modified._id;
};
export const b_delete = async (id: any) => {
  const blog = await Blog.findById(id);
  if (blog.category) {
    await bc_updateBlogs(blog.category, -1);
  }
  await Blog.findByIdAndDelete(id);
};
