import { z } from "zod";
import { EFormFields } from "~/pages/Admin/Attributes/AttributeEdit/enums";
import { EMPTY_FIELD_ERROR_MESSAGE } from "~/shared/validation";

export const formSchema = z.object({
  [EFormFields.Alias]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.Name]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  // [EFormFields.Selectable]: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  [EFormFields.Filter]: z.boolean(),
  [EFormFields.Type]: z.object({
    label: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
    value: z.string().trim().min(1, EMPTY_FIELD_ERROR_MESSAGE),
  }),
});
