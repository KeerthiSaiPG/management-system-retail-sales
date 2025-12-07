
import { getSalesData } from "../utils/csvLoader.js";

const dedupe = (arr) => Array.from(new Set(arr.filter(Boolean)));

export const getMetadata = () => {
  const data = getSalesData() || [];

  const productCategories = dedupe(data.map(r => (r["Product Category"] || "").trim()));
  const tags = dedupe(data.flatMap(r => (r.Tags || "").split(",").map(t => t.trim()).filter(Boolean)));
  const paymentMethods = dedupe(data.map(r => (r["Payment Method"] || "").trim()));
  const regions = dedupe(data.map(r => (r["Customer Region"] || "").trim()));
  const genders = dedupe(data.map(r => (r.Gender || "").trim()));

  const sortAlpha = (list) => list.sort((a,b) => a.localeCompare(b));

  return {
    productCategories: sortAlpha(productCategories),
    tags: sortAlpha(tags),
    paymentMethods: sortAlpha(paymentMethods),
    regions: sortAlpha(regions),
    genders: sortAlpha(genders)
  };
};
