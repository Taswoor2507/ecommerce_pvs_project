import { z } from "zod";

const addVariantTypeSchema = z.object({
    name: z.string("Variant type name is required").min(1, "Variant type name is required").max(100, "Variant type name must be less than 100 characters"),
    options: z.array(z.string("Option is required")).min(1, "At least one option is required").nonempty("At least one option is required"),
})


export const addOptionSchema = z.object({
    option: z.string("Option is required").min(1, "Option is required").max(100, "Option must be less than 100 characters"),
})

export default addVariantTypeSchema