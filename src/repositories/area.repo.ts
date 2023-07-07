import { AreaCity } from "../models/areaCity.model";
import { AreaDistrict } from "../models/areaDistrict.model";
import { AreaCommune } from "../models/areaCommune.model";
//#region City
export const cityGetList = async () => {
  const result = await AreaCity.find().sort({ name: 1 });
  return result;
};
export const cityCreate = async (arr) => {
  const arrCity = [];
  for (const i of arr) {
    const city = new AreaCity({
      name: i.name,
      slug: i.slug,
      type: i.type,
      nameWithType: i.name_with_type,
      code: i.code,
    });
    arrCity.push(city);
  }
  return AreaCity.insertMany(arrCity);
};
// 44 46 50 151 204 318 471 498 526 536 755 762 763
export const districtCreate = async (arr, id) => {
  const arrDistrict = [];
  for (const i of arr) {
    const district = new AreaDistrict({
      city: id,
      name: i.name,
      slug: i.slug,
      type: i.type,
      nameWithType: i.name_with_type,
      path: i.path,
      pathWithType: i.path_with_type,
      code: i.code,
    });
    arrDistrict.push(district);
  }
  return AreaDistrict.insertMany(arrDistrict);
};

export const CommuneCreate = async (arr, id) => {
  const arrCommune = [];
  for (const i of arr) {
    const commune = new AreaCommune({
      district: id,
      name: i.name,
      slug: i.slug,
      type: i.type,
      nameWithType: i.name_with_type,
      path: i.path,
      pathWithType: i.path_with_type,
    });
    arrCommune.push(commune);
  }
  return AreaCommune.insertMany(arrCommune);
};

export const getCity = (code) => {
  return AreaCity.findOne({ code });
};

export const getDistricts = (code) => {
  return AreaDistrict.findOne({ code });
};

export const getDistrictsByCity = (city) => {
  return AreaDistrict.find({ city });
};
export const getCommuneByDistrict = (district) => {
  return AreaCommune.find({ district });
};

//#endregion
