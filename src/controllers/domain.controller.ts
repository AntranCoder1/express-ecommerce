import { createAccessToken } from "./../utils/authentication.util";
import {
  marketerGetById,
  marketerModifyDomainQuantity,
} from "./../repositories/marketer.repo";
import { Request, Response } from "express";
import {
  isWebsiteAddressAvailable,
  domainGetById,
  domainGetListByMarketer,
  domainGetByAddress,
  domainCreate,
  domainUpdate,
  domainDeleteSingle,
  updateChoosen,
  updateDefautDomain,
  getChoosenDomain,
} from "../repositories/domain.repo";
import * as domainRepo from "../repositories/domain.repo";
import * as marketerIncomeRepo from "../repositories/marketerIncome.repo";
import {
  getFileDiskStorage,
  isAllowedFile,
  getFileLocation,
  removeFile,
} from "../utils/upload.util";
import path from "path";
import fs from "fs";
//#region Get
export const switchDomain = async (req: Request, res: Response) => {
  const marketerId = req.body.user._id;
  const domainId = req.params.id;
  try {
    const domain = await domainGetById(req.params.id);
    if (domain) {
      await updateDefautDomain(domain);
      const allDomain = await domainGetListByMarketer(marketerId);
      const arrDomainId = [];
      for (const i of allDomain) {
        if (i._id.valueOf() !== domainId) {
          arrDomainId.push(i._id);
        }
      }
      if (arrDomainId.length > 0) {
        const updateAllDomain = await updateChoosen(arrDomainId);
      }
      res.status(200).json({ status: "success" });
    } else {
      throw new Error("Không tìm thấy cửa hàng.");
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getDomainChoosen = async (req: Request, res: Response) => {
  const marketerId = req.body.user._id;
  try {
    const allDomain = await domainGetListByMarketer(marketerId);
    if (allDomain.length > 0) {
      const domain = await getChoosenDomain(marketerId);
      if (domain) {
        res.status(200).json({ status: "success", domain });
      } else {
        throw new Error("Không tìm thấy cửa hàng.");
      }
    } else {
      res
        .status(200)
        .json({ status: "failed", message: "Bạn chưa có cửa hàng" });
    }
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const data = await domainGetById(req.params.id);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getListByMarketer = async (req: Request, res: Response) => {
  const marketerId = req.body.user._id;
  try {
    const data = await domainGetListByMarketer(marketerId);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getByAddress = async (req: Request, res: Response) => {
  try {
    const data = await domainGetByAddress(req.params.address);
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Modifies
export const create = async (req: Request, res: Response) => {
  const marketerId = req.body.user._id;
  try {
    const isAddressAvailable = await isWebsiteAddressAvailable(
      req.body.websiteAddress
    );
    if (isAddressAvailable === true) {
      const bodyCreate = {
        name: req.body.name,
        address: req.body.address ? req.body.address : undefined,
        phoneNumber: req.body.phoneNumber,
        marketer: req.body.marketer,
        company: req.body.company,
        websiteAddress: req.body.websiteAddress,
        isChoosen: true,
        customStyle: {
          logoStyle: req.body.customStyle.logoStyle,
          bgColor:
            req.body.customStyle.bgColor === ""
              ? req.body.customStyle.bgColor
              : "#333399",
          textColor:
            req.body.customStyle.textColor === ""
              ? req.body.customStyle.textColor
              : "#fffffff",
        },
      };
      const data = await domainCreate(bodyCreate);
      if (data) {
        // Increase domains quantity of marketer
        await marketerModifyDomainQuantity(req.body.marketer, 1);
      }
      const allDomain = await domainGetListByMarketer(marketerId);
      const arrDomainId = [];
      for (const i of allDomain) {
        if (i._id.valueOf() !== data._id.valueOf()) {
          arrDomainId.push(i._id);
        }
      }
      if (arrDomainId.length > 0) {
        const updateAllDomain = await updateChoosen(arrDomainId);
      }
      const createMarketerIncome =
        await marketerIncomeRepo.createMarketerIncome(marketerId, data._id);
      res.status(201).json({ status: "success", data });
    } else {
      throw new Error(
        "Địa chỉ truy cập đã được sử dụng bởi một cửa hàng khác."
      );
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const updateBasicInfo = async (req: Request, res: Response) => {
  try {
    const bodyUpdate = {
      name: req.body.name,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
    };
    const data = await domainUpdate(req.body._id, bodyUpdate);
    res.status(201).json({ data });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const bodyUpdate = {
      status: req.body.status,
    };
    const result = await domainUpdate(req.body._id, bodyUpdate);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const updateHeader = async (req: Request, res: Response) => {
  try {
    const bodyUpdate = {
      customStyle: req.body.customStyle,
    };
    const result = await domainUpdate(req.body._id, bodyUpdate);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
};

export const updateWebsiteAddress = async (req: Request, res: Response) => {
  try {
    const isAddressAvailable = await isWebsiteAddressAvailable(
      req.body.websiteAddress,
      req.body._id
    );
    if (isAddressAvailable === true) {
      const bodyUpdate = {
        websiteAddress: req.body.websiteAddress,
      };
      const result = await domainUpdate(req.body._id, bodyUpdate);
      res.status(200).json({ data: result });
    } else {
      throw new Error(
        "Địa chỉ truy cập đã được sử dụng bởi một cửa hàng khác."
      );
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Deletes
export const deleteById = async (req: Request, res: Response) => {
  const marketerId = req.body.user._id;
  try {
    const domain = await domainGetById(req.params.id);
    if (domain !== undefined) {
      // Decrease domains quantity of marketer
      const result = await domainDeleteSingle(domain);
      await marketerModifyDomainQuantity(domain.marketer._id, -1);
      const allDomain = await domainGetListByMarketer(marketerId);
      const chooseDefault = await updateDefautDomain(allDomain[0]);
      // Delete domain
      if (result) {
        res.status(200).json({ status: "success" });
      } else {
        res
          .status(400)
          .json({ status: "failed", message: "Không thể xóa cửa hàng" });
      }
    } else {
      throw new Error("Không tìm thấy cửa hàng để xóa.");
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
//#region Logo, banner & favicon
export const updateUrl = async (req: Request, res: Response) => {
  const url = req.body.url;
  const image = req.body.image;
  const bannerId = req.body.bannerId;
  try {
    const data = {
      url,
      image,
    };
    const updateB = await domainRepo.updateUrl(data, bannerId);
    if (updateB) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(400).json({ status: "failed" });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const updateLogo = async (req: Request, res: Response) => {
  const domainId = req.body._id;
  const image = req.body.image;
  try {
    const updateB = await domainRepo.updateLogo(domainId, image);
    if (updateB) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(400).json({ status: "failed" });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const updateBanner = async (req: Request, res: Response) => {
  const domainId = req.body.newDomainId;
  const banner = req.body.banner;
  try {
    const updateB = await domainRepo.updateBanner(domainId, banner);
    if (updateB) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(400).json({ status: "failed" });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const uploadBanner = async (req: Request, res: Response) => {
  try {
    const file: any = req.file;
    const tempStorage = getFileDiskStorage(file, "domain-banner", true);
    const fileStorage = getFileDiskStorage(file, "domain-banner");
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
        const name = fileStorage.filename;
        res.status(200).send({ data: name });
      }
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const uploadOneBanner = async (req: Request, res: Response) => {
  try {
    const file: any = req.file;
    const tempStorage = getFileDiskStorage(file, "domain-banner", true);
    const fileStorage = getFileDiskStorage(file, "domain-banner");
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
        const name = fileStorage.filename;
        const data = {
          image: name,
          url: req.body.url,
        };
        const updateBanners = await domainRepo.updateBannerItem(
          req.body.bannerId,
          data
        );
        if (updateBanners) {
          res.status(200).send({ status: "success" });
        } else {
          res.status(200).send({ status: "failed" });
        }
      }
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getBanner = async (req: Request, res: Response) => {
  try {
    const result = getFileLocation(req.params.name, "domain-banner");
    if (!result || result === null) {
      throw new Error("Không tìm thấy banner của cửa hàng.");
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const uploadLogo = async (req: Request, res: Response) => {
  try {
    const file: any = req.file;
    const tempStorage = getFileDiskStorage(file, "domain-logo", true);
    const fileStorage = getFileDiskStorage(file, "domain-logo");
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
        if (domain.logo) {
          // Remove old image
          const oldSrc = domain.logo.path;
          removeFile(oldSrc);
        }
        fs.copyFileSync(tempSrc, newDest);
        fs.unlinkSync(tempSrc);
        const updateData = {
          logo: {
            path: newDest,
            name: fileStorage.filename,
            type: file.mimetype,
            width: req.body.width,
            minWidth: req.body.minWidth,
          },
        };
        const result = await domainUpdate(req.body._id, updateData);
        res.status(200).json({ data: result });
      }
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getLogo = async (req: Request, res: Response) => {
  try {
    const result = getFileLocation(req.params.name, "domain-logo");
    if (!result || result === null) {
      throw new Error("Không tìm thấy logo của cửa hàng.");
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getEventBanner = async (req: Request, res: Response) => {
  try {
    const result = getFileLocation(req.params.name, "banner-event");
    if (!result || result === null) {
      throw new Error("Không tìm thấy banner của evemt.");
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const uploadFavicon = async (req: Request, res: Response) => {
  try {
    const file: any = req.file;
    const tempStorage = getFileDiskStorage(file, "domain-favicon", true);
    const fileStorage = getFileDiskStorage(file, "domain-favicon");
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
        if (domain.favicon) {
          // Remove old image
          const oldSrc = domain.favicon.path;
          removeFile(oldSrc);
        }
        fs.copyFileSync(tempSrc, newDest);
        fs.unlinkSync(tempSrc);
        const updateData = {
          favicon: {
            path: newDest,
            name: fileStorage.filename,
            type: file.mimetype,
          },
        };
        const result = await domainUpdate(req.body._id, updateData);
        res.status(200).json({ data: result });
      }
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const getFavicon = async (req: Request, res: Response) => {
  try {
    const result = getFileLocation(req.params.name, "domain-favicon");
    if (!result || result === null) {
      throw new Error("Không tìm thấy logo của cửa hàng.");
    }
    res.status(200).sendFile(result);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const updateSocial = async (req: Request, res: Response) => {
  try {
    const domain = req.body.domain;
    const bodyUpdate = {
      social: req.body.social,
    };
    const uSocial = domainRepo.updateSocial(domain, bodyUpdate);
    if (uSocial) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(400).json({ status: "failed" });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getAllDomainByMarketer = async (req: Request, res: Response) => {
  try {
    const getDomain = await domainRepo.getAll();
    if (getDomain) {
      res.status(200).json({ status: "success", data: getDomain });
    } else {
      res.status(400).json({ status: "failed" });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getAllDomain = async (req: Request, res: Response) => {
  try {
    const getDomain = await domainRepo.getAllDomain();
    if (getDomain) {
      res.status(200).json({ status: "success", data: getDomain });
    } else {
      res.status(400).json({ status: "failed" });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const addLinkDomain = async (req: Request, res: Response) => {
  try {
    const domainId = req.body.domain;
    const newDomainId = req.body.newDomain;
    const newDomain = await domainRepo.addLinkDomain(domainId, newDomainId);
    if (newDomain) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(400).json({ status: "failed" });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
export const removeLinkDomain = async (req: Request, res: Response) => {
  try {
    const domainId = req.body.domain;
    const oldDomainId = req.body.oldDomain;
    const newDomain = await domainRepo.removeLinkDomain(domainId, oldDomainId);
    if (newDomain) {
      res.status(200).json({ status: "success" });
    } else {
      res.status(400).json({ status: "failed" });
    }
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};
//#endregion
