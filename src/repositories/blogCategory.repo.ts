import { BlogCategory } from "../models/blogCategory.model";
export const bc_list = async (domain: any) => {
  return await BlogCategory.find({ domain });
};
export const bc_getById = async (id: any) => {
  return await BlogCategory.findById(id);
};

export const bc_create = async (body: any) => {
  const cat = await BlogCategory.findOne({ slug: body.slug });
  if (cat) {
    throw new Error("Đường dẫn đã được sử dụng bởi danh mục khác");
  } else {
    const newCat = new BlogCategory(body);
    await newCat.save();
    return newCat._id;
  }
};
export const bc_update = async (id: any, body: any) => {
  const cat = await BlogCategory.findOne({ slug: body.slug });
  if (!cat || (cat && cat._id.toString() === id.toString())) {
    const modified = await BlogCategory.findByIdAndUpdate(id, body);
    return modified._id;
  } else {
    throw new Error("Đường dẫn đã được sử dụng bởi danh mục khác");
  }
};
export const bc_updateBlogs = async (id: any, quantity: number) => {
  const cat = await BlogCategory.findById(id);
  cat.blogs += quantity;
  await cat.save();
  return cat._id;
};
export const bc_delete = async (id: any) => {
  await BlogCategory.findByIdAndDelete(id);
};
