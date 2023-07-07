import { promises as fsp } from "fs";

export const loadTemplate = async (template: string) => {
  const folder = __dirname.replace("utils", "mail_templates");
  const path: string = `/${template}.html`;
  console.log(path);
  return fsp.readFile(folder + path, "utf8");
};
