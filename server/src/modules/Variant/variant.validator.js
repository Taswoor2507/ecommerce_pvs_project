import { z } from "zod";

const addVariantTypeSchema = z.object({
    name: z.string("Variant type name is required").min(1, "Variant type name is required").max(100, "Variant type name must be less than 100 characters"),
    options: z.array(z.string("Option is required")).min(1, "At least one option is required").nonempty("At least one option is required"),
})

export default addVariantTypeSchema