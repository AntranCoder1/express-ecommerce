import { Request, Response } from "express";
import {
  getFileDiskStorage,
  isAllowedFile,
  getFileLocation,
  removeFile,
} from "../utils/upload.util";
import path from "path";
import fs from "fs";
import * as eventRepo from "../repositories/event.repo";
import { domainGetById } from "../repositories/domain.repo";
import getHostname from "../modules/hostname.module";
import * as domainRepo from "../repositories/domain.repo";
export const createEvent = async (req: Request, res: Response) => {
  const domain = req.body.domain;
  const title = req.body.title;
  const slug = req.body.slug;
  const banner = req.body.banner;
  const start_time = req.body.start_time;
  const finish_time = req.body.finish_time;
  const description = req.body.description;
  try {
    const data = {
      domain,
      title,
      slug,
      banner,
      start_time,
      finish_time,
      description,
    };
    const createE = await eventRepo.createEvent(data);
    if (createE) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(400).json({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
export const uploadBanner = async (req: Request, res: Response) => {
  try {
    const file: any = req.file;
    const tempStorage = getFileDiskStorage(file, "banner-event", true);
    const fileStorage = getFileDiskStorage(file, "banner-event");
    let tempSrc: any = tempStorage.dest;
    let newDest: any = fileStorage.dest;
    tempSrc = path.join(tempSrc, tempStorage.filename);
    newDest = path.join(newDest, fileStorage.filename);
    if (isAllowedFile(file) === false) {
      fs.unlinkSync(tempSrc);
      throw new Error("Tệp tin tải lên không hợp lệ.");
    } else {
      const domain = await domainGetById(req.body._id);
      if (!domain || domain === undefined) {
        throw new Error("Không tìm thấy cửa hàng " + req.body._id);
      } else {
        fs.copyFileSync(tempSrc, newDest);
        fs.unlinkSync(tempSrc);
        const data = {
          banner: {
            path: newDest,
            name: fileStorage.filename,
            type: file.mimetype,
          },
        };
        res.status(200).json({ data });
      }
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getImageEvent = async (req: Request, res: Response) => {
  try {
    const hostname = req.headers.origin as string;
    let getDomain;
    if (hostname !== "http://localhost") {
      const domain: any = getHostname(hostname);
      getDomain = await domainRepo.domainGetByAddress(domain);
    } else {
      const domainStr = req.query.slug as string;
      getDomain = await domainRepo.domainGetByAddress(domainStr);
    }

    const getImageEvents = await eventRepo.getImageEvents(getDomain._id);
    if (getImageEvents) {
      res.status(200).send({ status: "success", data: getImageEvents });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const domain = req.body.domain;
    const name = req.body.text;
    const getEvents = await eventRepo.getEvent(domain, name);
    if (getEvents) {
      res.status(200).send({ status: "success", data: getEvents });
    } else {
      res.status(400).send({ status: "failed" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};
