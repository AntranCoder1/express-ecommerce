import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

export let newDateTimeString = () => {
  const present = new Date();
  const result =
    present.getFullYear().toString() +
    (present.getMonth() + 1).toString() +
    present.getDate().toString() +
    present.getHours().toString() +
    present.getMinutes().toString() +
    present.getSeconds().toString() +
    present.getMilliseconds().toString();
  return result;
};
const rootFolder = path.join(__dirname, "..", "uploads");
const tempFolder = path.join(__dirname, "..", "uploads_temp");
const storages = new Map([
  // Company logo
  [
    "company-logo",
    {
      dest: path.join(rootFolder, "company", "logos"),
      filename: "CompanyLogo_" + newDateTimeString(),
    },
  ],
  // Company favicon
  [
    "company-favicon",
    {
      dest: path.join(rootFolder, "company", "favicons"),
      filename: "CompanyFavicon_" + newDateTimeString(),
    },
  ],
  // Company product image
  [
    "company-product-image",
    {
      dest: path.join(rootFolder, "company", "products"),
      filename: "CompanyProduct_" + newDateTimeString(),
    },
  ],
  // Company product version
  [
    "company-product-version",
    {
      dest: path.join(rootFolder, "company", "product-versions"),
      filename: "CompanyProductVersion_" + newDateTimeString(),
    },
  ],
  // Company product icon
  [
    "company-product-icon",
    {
      dest: path.join(rootFolder, "company", "product-icons"),
      filename: "CompanyProductIcon_" + newDateTimeString(),
    },
  ],
  // Marketer avatar
  [
    "marketer-avatar",
    {
      dest: path.join(rootFolder, "marketer", "avatars"),
      filename: "MarketerAvatar_" + newDateTimeString(),
    },
  ],
  // Marketer product image
  [
    "marketer-product-image",
    {
      dest: path.join(rootFolder, "marketer", "products"),
      filename: "MarketerProduct_" + newDateTimeString(),
    },
  ],
  // Marketer product version
  [
    "marketer-product-version",
    {
      dest: path.join(rootFolder, "marketer", "product-versions"),
      filename: "MarketerProductVersion_" + newDateTimeString(),
    },
  ],
  [
    "domain-product-icon",
    {
      dest: path.join(rootFolder, "domain", "product-icons"),
      filename: "DomainProductIcon_" + newDateTimeString(),
    },
  ],
  // Domain banner
  [
    "domain-banner",
    {
      dest: path.join(rootFolder, "domain", "banners"),
      filename: "DomainBanner_" + newDateTimeString(),
    },
  ],
  // Domain logo
  [
    "domain-logo",
    {
      dest: path.join(rootFolder, "domain", "logos"),
      filename: "DomainLogo_" + newDateTimeString(),
    },
  ],
  // Domain favicon
  [
    "domain-favicon",
    {
      dest: path.join(rootFolder, "domain", "favicons"),
      filename: "DomainFavicon_" + newDateTimeString(),
    },
  ],
  [
    "domain-blog-thumbnail",
    {
      dest: path.join(rootFolder, "domain", "blog-thumbnails"),
      filename: "DomainBlogThumbnail_" + newDateTimeString(),
    },
  ],
  // Customer avatar
  [
    "customer-avatar",
    {
      dest: path.join(rootFolder, "customer", "avatars"),
      filename: "CustomerAvatar_" + newDateTimeString(),
    },
  ],
  [
    "brand-icon",
    {
      dest: path.join(rootFolder, "company", "brands"),
      filename: "Brand_" + newDateTimeString(),
    },
  ],
  [
    "banner-event",
    {
      dest: path.join(rootFolder, "marketer", "events"),
      filename: "Event_" + newDateTimeString(),
    },
  ],
  [
    "collaborator-withdraw-history",
    {
      dest: path.join(tempFolder, "collaborator", "withdraws"),
      filename: "CollabWithdraw_" + newDateTimeString(),
    },
  ],
  [
    "marketer-withdraw-history",
    {
      dest: path.join(tempFolder, "marketer", "withdraws"),
      filename: "MarketerWithdraw_" + newDateTimeString(),
    },
  ],
  [
    "customer-withdraw-history",
    {
      dest: path.join(tempFolder, "customer", "withdraws"),
      filename: "Event_" + newDateTimeString(),
    },
  ],
]);
const storages_temp = new Map([
  [
    "company-logo",
    {
      dest: path.join(tempFolder, "company", "logos"),
      filename: "CompanyLogo_" + newDateTimeString(),
    },
  ],
  [
    "company-favicon",
    {
      dest: path.join(tempFolder, "company", "favicons"),
      filename: "CompanyFavicon_" + newDateTimeString(),
    },
  ],
  [
    "company-product-image",
    {
      dest: path.join(tempFolder, "company", "products"),
      filename: "CompanyProduct_" + newDateTimeString(),
    },
  ],
  [
    "company-product-version",
    {
      dest: path.join(tempFolder, "company", "product-versions"),
      filename: "CompanyProductVersion_" + newDateTimeString(),
    },
  ],
  [
    "company-product-icon",
    {
      dest: path.join(rootFolder, "company", "product-icons"),
      filename: "CompanyProductIcon_" + newDateTimeString(),
    },
  ],
  [
    "marketer-avatar",
    {
      dest: path.join(tempFolder, "marketer", "avatars"),
      filename: "MarketerAvatar_" + newDateTimeString(),
    },
  ],
  [
    "marketer-product-image",
    {
      dest: path.join(tempFolder, "marketer", "products"),
      filename: "MarketerProduct_" + newDateTimeString(),
    },
  ],
  [
    "marketer-product-version",
    {
      dest: path.join(tempFolder, "marketer", "product-versions"),
      filename: "MarketerProductVersion_" + newDateTimeString(),
    },
  ],
  [
    "domain-product-icon",
    {
      dest: path.join(rootFolder, "domain", "product-icons"),
      filename: "DomainProductIcon_" + newDateTimeString(),
    },
  ],
  [
    "domain-banner",
    {
      dest: path.join(tempFolder, "domain", "banners"),
      filename: "DomainBanner_" + newDateTimeString(),
    },
  ],
  [
    "domain-logo",
    {
      dest: path.join(tempFolder, "domain", "logos"),
      filename: "DomainLogo_" + newDateTimeString(),
    },
  ],
  [
    "domain-favicon",
    {
      dest: path.join(tempFolder, "domain", "favicons"),
      filename: "DomainFavicon_" + newDateTimeString(),
    },
  ],
  [
    "domain-blog-thumbnail",
    {
      dest: path.join(tempFolder, "domain", "blog-thumbnails"),
      filename: "DomainBlogThumbnail_" + newDateTimeString(),
    },
  ],
  [
    "customer-avatar",
    {
      dest: path.join(tempFolder, "customer", "avatars"),
      filename: "CustomerAvatar_" + newDateTimeString(),
    },
  ],
  [
    "brand-icon",
    {
      dest: path.join(tempFolder, "company", "brands"),
      filename: "Brand_" + newDateTimeString(),
    },
  ],
  [
    "banner-event",
    {
      dest: path.join(tempFolder, "marketer", "events"),
      filename: "Event_" + newDateTimeString(),
    },
  ],
  [
    "collaborator-withdraw-history",
    {
      dest: path.join(tempFolder, "collaborator", "withdraws"),
      filename: "Event_" + newDateTimeString(),
    },
  ],
  [
    "marketer-withdraw-history",
    {
      dest: path.join(tempFolder, "marketer", "withdraws"),
      filename: "Event_" + newDateTimeString(),
    },
  ],
  [
    "customer-withdraw-history",
    {
      dest: path.join(tempFolder, "customer", "withdraws"),
      filename: "Event_" + newDateTimeString(),
    },
  ],
]);
export const tempMulterDiskStorage = (folderTempName: any) => {
  console.log("vao day", folderTempName);

  const pathUrl: any = storages_temp.get(folderTempName)?.dest;
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, pathUrl);
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
};
//#endregion
export const filesAllowed = new Map([
  ["image", [".jpg", ".jpeg", ".png", ".gif"]],
  ["file", [".pdf"]],
]);
export const isAllowedFile = (file: any) => {
  const ext: any = path.extname(file.originalname);
  const imageListExt: any = filesAllowed.get("image");
  for (const item of imageListExt) {
    if (item === ext) {
      return true;
    }
  }
  return false;
};
export const getFileDiskStorage = (
  file: any,
  folderUpload: string,
  isTemp?: boolean
) => {
  console.log("folderUpload", storages.get(folderUpload));

  if (isTemp === false || !isTemp) {
    return {
      dest: storages.get(folderUpload)?.dest,
      filename:
        storages.get(folderUpload)?.filename +
        "-" +
        uuidv4() +
        path.extname(file.originalname),
    };
  } else {
    return {
      dest: storages_temp.get(folderUpload)?.dest,
      filename: file.originalname,
    };
  }
};
export const customFileDiskStorage = (
  file: any,
  folderUpload: string,
  customName: string
) => {
  return {
    dest: storages.get(folderUpload)?.dest,
    filename: customName + path.extname(file.originalname),
  };
};
// Return path if file exists, otherwise return null when file cannot open by missing or broken.
export const getFileLocation = (fileName: string, folder: string) => {
  const dest: any = storages.get(folder)?.dest;
  const source = path.join(dest, fileName);
  const result = source;
  try {
    if (fs.existsSync(result)) {
      return result;
    }
  } catch (err) {
    return null;
  }
};
export const removeFile = (pathUrl: string) => {
  try {
    if (fs.existsSync(pathUrl)) {
      fs.unlinkSync(pathUrl);
      return true;
    } else {
      throw new Error("Đường dẫn file không chính xác.");
    }
  } catch (err) {
    return false;
  }
};
