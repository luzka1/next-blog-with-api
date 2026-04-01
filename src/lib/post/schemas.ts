import { isUrlOrRelativePath } from "@/utils/is-url-or-relative-path";
import sanitize from "sanitize-html";
import z from "zod";
import { PublicUserSchema } from "../user/schemas";

const PostBaseSchema = z.object({
  title: z
    .string()
    .trim()
    .min(10, "Título dever ter, no mínimo, 10 caracteres")
    .max(120, "Título deve ter, no máximo, 120 caracteres"),
  content: z
    .string()
    .trim()
    .min(3, "Conteúdo é obrigatório!")
    .transform((val) => sanitize(val)),
  author: z
    .string()
    .trim()
    .min(4, "Autor precisa de um mínimo de 4 caracteres")
    .max(120, "Nome do autor não pode ser maior que 120 caracteres"),
  excerpt: z
    .string()
    .trim()
    .min(3, "Excerto dever ter no mínimo 3 caracteres")
    .max(200, "Excerto deve ter no máximo 200 caracteres"),
  coverImageUrl: z.string().trim().refine(isUrlOrRelativePath, {
    message: "URL da capa precisa ser uma URL ou capa para imagem",
  }),
  published: z
    .union([
      z.literal("on"),
      z.literal("true"),
      z.literal("false"),
      z.literal(true),
      z.literal(false),
      z.literal(null),
      z.literal(undefined),
    ])
    .default(false)
    .transform((val) => val === "on" || val === "true" || val === true),
});

export const PostCreateSchema = PostBaseSchema;

export const PostUpdateSchema = PostBaseSchema.extend({});

export const CreatePostForApiSchema = PostBaseSchema.omit({
  author: true,
  published: true,
}).extend({});

export const UpdatePostForApiSchema = PostBaseSchema.omit({
  author: true,
}).extend({});

export const PublicPostSchemaForApi = PostBaseSchema.extend({
  id: z.string().default(""),
  slug: z.string().default(""),
  title: z.string().default(""),
  excerpt: z.string().default(""),
  author: PublicUserSchema.optional().default({
    id: "",
    email: "",
    name: "",
  }),
  content: z.string().default(""),
  coverImageUrl: z.string().default(""),
  createdAt: z.string().default(""),
});

export type CreatePostForApiDto = z.infer<typeof CreatePostForApiSchema>;
export type UpdatePostForApiDto = z.infer<typeof UpdatePostForApiSchema>;
export type PublicPostForApiDto = z.infer<typeof PublicPostSchemaForApi>;
