export const VietnameseStringToSlug = (vietnameseString: string) => {
  const result = vietnameseString
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return result;
};

export const VietnameseStringToNonAccentedLetters = (
  vietnameseString: string
) => {
  const result = vietnameseString
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/([^0-9a-z-\s])/g, "")
    .replace(/(\s+)/g, "")
    .replace(/-+/g, "")
    .replace(/^-+|-+$/g, "");
  return result;
};
