import { z } from "zod";

export const identificationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Informe um nome ou apelido com pelo menos 2 caracteres.")
    .max(60, "Use no máximo 60 caracteres."),
  className: z
    .string()
    .trim()
    .max(40, "A turma pode ter no máximo 40 caracteres."),
  subject: z
    .string()
    .trim()
    .min(3, "Descreva o assunto de interesse em pelo menos 3 caracteres.")
    .max(140, "Use no máximo 140 caracteres."),
  notes: z
    .string()
    .trim()
    .max(400, "As observações podem ter no máximo 400 caracteres."),
});

export type IdentificationValues = z.infer<typeof identificationSchema>;
