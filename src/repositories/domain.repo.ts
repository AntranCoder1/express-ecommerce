import { Domain } from "../models/domain.model";
import { removeFile } from "../utils/upload.util";
import mongoose from "mongoose";
//#region Atomics
export const isWebsiteAddressAvailable = async (
  websiteAddress: string,
  domainId?: any
) => {
  const domain = await Domain.findOne({ websiteAddress }).select({
    _id: 1,
  });
  if (!domainId && domain) {
    return false;
  }
  if (domainId && !domain) {
    return true;
  }
  if (domainId && domain && domainId.toString() !== domain._id.toString()) {
    return false;
  }
  return true;
};
//#endregion
//#region Gets

export const domainGetById = async (domainId: any) => {
  const data = await Domain.findById(domainId).populate([
    {
      path: "marketer",
      model: "Marketer",
      select: "_id name email avatar",
    },
    {
      path: "company",
      model: "Company",
      select: "name",
    },
    {
      path: "linkDomain",
      model: "Domain",
      select: { logo: 1, name: 1, websiteAddress: 1, _id: 1 },
    },
  ]);
  return data;
};
export const domainGetListByMarketer = async (marketerId: any) => {
  const data = await Domain.find({ marketer: marketerId }).populate([
    {
      path: "company",
      model: "Company",
      select: "name",
    },
  ]);
  return data;
};
export const domainGetByAddress = async (websiteAddress: string) => {
  const data = await Domain.findOne({ websiteAddress }).populate([
    {
      path: "marketer",
      model: "Marketer",
      select: "name email avatar",
    },
    {
      path: "company",
      model: "Company",
      select: "name",
    },
    {
      path: "linkDomain",
      model: "Domain",
      select: { name: 1, websiteAddress: 1, _id: 1 },
    },
  ]);
  return data;
};
export const domainGetFirstByMarketer = async (marketerId: any) => {
  const data = await Domain.findOne({ marketer: marketerId });
  return data;
};
//#endregion
//#region Modifies
export const domainCreate = async (body: any) => {
  const newDomain = new Domain(body);
  await newDomain.save();
  return newDomain._id;
};
export const domainUpdate = async (domainId: any, body: any) => {
  const modified = await Domain.findByIdAndUpdate(domainId, body, {
    runValidators: true,
  });
  return modified._id;
};
//#endregion
//#region Deletes
export const domainDeleteSingle = async (domain: any) => {
  if (domain.banner) {
    removeFile(domain.banner.path);
  }
  if (domain.logo) {
    removeFile(domain.logo.path);
  }
  if (domain.favicon) {
    removeFile(domain.favicon.path);
  }
  const result = await Domain.deleteOne({ _id: domain._id });
  if (result.deletedCount > 0) {
    return true;
  } else {
    return false;
  }
};

export const updateChoosen = (arrDomainId: any) => {
  return Domain.updateMany({ _id: { $in: arrDomainId } }, { isChoosen: false });
};

export const updateDefautDomain = (domain: any) => {
  return Domain.updateOne({ _id: domain._id }, { isChoosen: true });
};

export const getChoosenDomain = (maketerId: string) => {
  return Domain.findOne({ marketer: maketerId, isChoosen: true }).select({
    _id: 1,
    name: 1,
    websiteAddress: 1,
  });
};

export const updateBanner = (domainId, banner) => {
  return Domain.updateOne({ _id: domainId }, { $set: { banner } });
};
//#endregion

export const updateBannerItem = (bannerId, data) => {
  return Domain.updateOne(
    { "banner._id": bannerId },
    { $set: { "banner.$": data } }
  );
};

export const updateUrl = (data, bannerId) => {
  return Domain.updateOne(
    { "banner._id": bannerId },
    { $set: { "banner.$": data } }
  );
};

export const updateLogo = (id, logo) => {
  return Domain.updateOne({ _id: id }, { $set: { logo } });
};

export const updateSocial = async (domain, social) => {
  const modified = await Domain.findByIdAndUpdate(domain, social, {
    runValidators: true,
  });
  return modified;
};

export const getAll = () => {
  return Domain.find().select({ name: 1, _id: 1 });
};

export const addLinkDomain = (domain, newDomain) => {
  return Domain.updateOne(
    {
      _id: domain,
    },
    { $push: { linkDomain: new mongoose.Types.ObjectId(newDomain) } }
  );
};

export const removeLinkDomain = (domain, oldDomain) => {
  return Domain.updateOne(
    {
      _id: domain,
    },
    { $pull: { linkDomain: new mongoose.Types.ObjectId(oldDomain) } }
  );
};

export const getAllDomain = () => {
  return Domain.find({ status: "active" }).select({
    logo: 1,
    name: 1,
    websiteAddress: 1,
    _id: 1,
    phoneNumber: 1,
    status: 1,
  });
};

export const getDomainByCompany = (company) => {
  return Domain.find({ status: "active", company }).select({
    _id: 1,
  });
};
