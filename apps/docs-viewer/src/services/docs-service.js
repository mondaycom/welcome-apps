import _ from "lodash";
import mondaySdk from "monday-sdk-js";
import { regexWebUrl } from "./url-validation";

const monday = mondaySdk();
const STORAGE_KEY = "docs_key";
export const TYPES = {
  OTHER: "OTHER",
  GOOGLE_DRIVE: "GOOGLE_DRIVE",
  ONEDRIVE: "ONEDRIVE",
  FIGMA: "FIGMA",
};

// Hash code function taken from https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
const hashCode = (str) => {
  var hash = 0,
    i,
    chr;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

export const removeDoc = async (docoment) => {
  let docs = await getDocs();

  _.remove(docs, (doc) => doc.id === docoment.id);

  await monday.storage.instance.setItem(STORAGE_KEY, JSON.stringify(docs));

  return docs;
};

export const getDocs = async (filterValue) => {
  const res = await monday.storage.instance.getItem(STORAGE_KEY);
  const value = res.data.value ? JSON.parse(res.data.value) : [];
  const filteredValue = filterValue
    ? value.filter((doc) => doc.name.toLowerCase().includes(filterValue.toLowerCase()))
    : value;
  return filteredValue;
};

export const addDoc = async (name, url) => {
  const isValid = isValidUrl(url);
  if (!isValid) return false;

  const docs = await getDocs();
  const id = hashCode(name + url + Date.now());
  const type = detectDocType(url);
  docs.push({ id, name, url, type });
  await monday.storage.instance.setItem(STORAGE_KEY, JSON.stringify(docs));
  return true;
};

export const updateDoc = async (id, name, url) => {
  const isValid = isValidUrl(url);
  if (!isValid) return false;

  const docs = await getDocs();
  const currDoc = _.find(docs, (doc) => doc.id === id);
  const oldName = currDoc.name;
  const oldUrl = currDoc.url;

  currDoc.name = name;
  currDoc.url = url;

  await monday.storage.instance.setItem(STORAGE_KEY, JSON.stringify(docs));

  return true;
};

export const detectDocType = (url) => {
  if (_.includes(url, "docs.google.com")) {
    return TYPES.GOOGLE_DRIVE;
  }
  if (_.includes(url, "onedrive.live.com")) {
    return TYPES.ONEDRIVE;
  }
  if (_.includes(url, "figma.com")) {
    return TYPES.FIGMA;
  }
  return TYPES.OTHER;
};

export const isValidUrl = (url) => {
  return regexWebUrl.test(url);
};
