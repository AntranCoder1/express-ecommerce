import { Request, Response } from "express";
import { VietnameseStringToSlug } from "../utils/supporter.util";
import {
  b_list,
  b_getById,
  b_getBySlug,
  b_create,
  b_update,
  b_updateThumbnail,
  b_delete,
} from "./../repositories/blog.repo";
// For upload thumbnail
import {
  getFileDiskStorage,
  getFileLocation,
  isAllowedFile,
  removeFile,
} from "../utils/upload.util";
import path from "path";
import fs from "fs";

export const getList = async (req: Request, res: Response) => {
  try {
    const result = await b_list(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getBySlug = async (req: Request, res: Response) => {
  try {
    const result = await b_getBySlug(req.body.domain, req.body.slug);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const create = async (req: Request, res: Response) => {
  try {
    const body = {
      domain: req.body.domain,
      title: req.body.title,
      slug: VietnameseStringToSlug(req.body.title),
      content: req.body.content,
      author: req.body.author,
      category: req.body.category ? req.body.category : null,
    };
    const result = await b_create(body);
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const updateById = async (req: Request, res: Response) => {
  try {
    const body = {
      title: req.body.title,
      slug: req.body.slug,
      content: req.body.content,
      category: req.body.category ? req.body.category : null,
    };
    const result = await b_update(req.body._id, body);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const deleteById = async (req: Request, res: Response) => {
  try {
    await b_delete(req.params.id);
    res.status(200).json({ data: "Bài viết đã được xóa." });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const uploadThumbnail = async (req: Request, res: Response) => {
  try {
    const file: any = req.file;
    const tempStorage = getFileDiskStorage(file, "domain-blog-thumbnail", true);
    const fileStorage = getFileDiskStorage(file, "domain-blog-thumbnail");

    let tempSrc: any = tempStorage.dest;
    let newDest: any = fileStorage.dest;

    tempSrc = path.join(tempSrc, tempStorage.filename);
    newDest = path.join(newDest, fileStorage.filename);

    if (isAllowedFile(file) === false) {
      fs.unlinkSync(tempSrc);
      throw new Error("Tệp tin tải lên không hợp lệ.");
    } else {
      const blog = await b_getById(req.body._id);
      if (!blog || blog === undefined) {
        throw new Error("Bài viết không tồn tại hoặc đã bị xóa.");
      } else {
        if (blog.thumbnail) {
          // Remove old image
          const oldSrc = blog.thumbnail.path;
          removeFile(oldSrc);
        }
        fs.copyFileSync(tempSrc, newDest);
        fs.unlinkSync(tempSrc);
        const updateData = {
          thumbnail: {
            path: newDest,
            name: fileStorage.filename,
            type: file.mimetype,
          },
        };

        const result = await b_updateThumbnail(req.body._id, updateData);
        res.status(200).json({ data: result });
      }
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getThumbnail = async (req: Request, res: Response) => {
  try {
    const result = getFileLocation(req.params.name, "domain-blog-thumbnail");
    if (!result || result === null) {
      throw new Error("Không tìm thấy ảnh đại diện của bài viết.");
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
