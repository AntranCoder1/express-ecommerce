import fs from "fs";
import path from "path";
const assetFolder = path.join(__dirname, "..", "assets");
export const statis_getImage = (imageName: string) => {
  const dest = path.join(assetFolder, "images", imageName);
  if (fs.existsSync(dest)) {
    return dest;
  } else {
    return null;
  }
};
