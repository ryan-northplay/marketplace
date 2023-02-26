import { z } from "zod";
import { paginationSchema } from "../commons";

const attributeItemSchema = z.object({
  attributeName: z.string(),
  attributeAlias: z.string(),
  value: z.string(),
});

export const productsItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  alias: z.string(),
  modifyDate: z.string(),
  createdAt: z.string(),
});

export const productsSchema = paginationSchema.extend({
  content: productsItemSchema.array(),
});

export const productsByCatalogItemSchema = z.object({
  catalogAlias: z.string(),
  id: z.number(),
  name: z.string(),
  alias: z.string(),
  enabled: z.boolean(),
  description: z.string().nullish(),
  rating: z.number(),
  price: z.string(),
  count: z.string(),
  createdAt: z.string(),
  attributes: attributeItemSchema.array(),
});

export const productsParamsSchema = z.any();

export const productsByCatalogSearchParamsSchema = z.object({
  alias: z.string(),
  params: z
    .object({
      currentPage: z.union([z.string(), z.number()]).nullish(),
      pageSize: z.union([z.string(), z.number()]).nullish(),
    })
    .optional(),
});
export const productsByCatalogSchema = paginationSchema.extend({
  content: productsByCatalogItemSchema.array(),
});

export const productDetailParamsSchema = z.object({
  alias: z.string(),
});

export const productDetailSchema = z.object({
  catalogAlias: z.string(),
  id: z.number(),
  name: z.string(),
  alias: z.string(),
  enabled: z.boolean(),
  description: z.string().nullish(),
  rating: z.number(),
  price: z.string(),
  count: z.string(),
  createdAt: z.string(),
  modifyDate: z.string(),
  attributes: attributeItemSchema.array(),
});

const numericValuesSchema = z.object({
  attributeAlias: z.string(),
  value: z.number(),
});

export const productAddParamsSchema = z.object({
  alias: z.string(),
  catalogAlias: z.string(),
  count: z.number(),
  description: z.string().nullish(),
  enabled: z.boolean(),
  name: z.string(),
  numericValues: numericValuesSchema.array().nullish(),
  price: z.number(),
  selectableValues: z.number().array().nullish(),
});

export const productAddSchema = productDetailSchema;

export const productDeleteParamsSchema = z.object({
  alias: z.string(),
});

export const productDeleteSchema = z.any();

export const productEditParamsSchema = z.any();

export const productEditSchema = z.any();
