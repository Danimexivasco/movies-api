const z = require("zod");

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: "Title must be a string",
    required_error:     "Movie title is required"
  }),
  year:     z.number().int().positive().min(1900).max(2025), // positive not necessary,
  director: z.string(),
  duration: z.number().int().positive(),
  rate:     z.number().min(0).max(10).default(9.8),
  poster:   z.string().url({
    message: "Poster must be a valid URL"
  }),
  genre: z.array(
    z.enum(["Action", "Adventure", "Animation", "Biography", "Crime", "Drama", "Fantasy", "Romance", "Sci-Fi"]),
    {
      required_error:     "Genre is required",
      invalid_type_error: "Genre must be an array of enum Genre",
      invalid_enum_value: "Genre must be an array of ENUM Genre"
    }
  )
  // genre: z.enum(["Action", "Adventure", "Animation", "Biography", "Crime", "Drama", "Fantasy", "Romance", "Sci-Fi"]).array()
});

function validateMovie (input) {
  return movieSchema.safeParse(input);
}

function validatePartialMovie (input) {
  return movieSchema.partial().safeParse(input);
}

module.exports = {
  validateMovie,
  validatePartialMovie
};