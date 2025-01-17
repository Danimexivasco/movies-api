const express = require("express");
const movies = require("./movies.json");
const crypto = require("node:crypto");
const { validateMovie, validatePartialMovie } = require("./schemas/movies");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: (origin, callback) => {
    const ACCEPTED_ORIGINS = [
      "http://localhost:8080",
      "http://localhost:1234",
      "https://movies.com"
    ];

    if (ACCEPTED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }

    if (!origin) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  }
}));
app.disable("x-powered-by");

app.use(express.json());

// métodos normales: GET/HEAD/POST
// métodos complejos: PUT/PATCH/DELETE

// CORS PRE-Flight
// OPTIONS

app.get("/", (req, res) => {
  res.json({
    message: "chuta"
  });
});

app.get("/movies", (req, res) => {
  const { genre, search } = req.query;
  if (!genre && !search) return res.json(movies);
  const filteredMovies = movies.filter(movie => {
    let matches = true;
    if (search) {
      matches = matches && movie.title.toLowerCase().includes(search.toLowerCase());
    }
    if (genre) {
      matches = matches && movie.genre.some(g => g.toLowerCase() === genre.toLowerCase());
    }
    return matches;
  });
  res.json(filteredMovies);
});

app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find(movie => movie.id === id);
  if (movie) return res.json(movie);

  res.status(404).json({
    message: "Movie not found"
  });
});

app.post("/movies", (req, res) => {
  const result = validateMovie(req.body);

  if (result.error) {
    return res.status(400).json({ // or 422
      error: JSON.parse(result.error.message)
    });
  }

  // const { title, genre, year, director, duration, poster, rate } = req.body;
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  };

  // TODO: Implement this to DB to make it REST
  movies.push(newMovie);
  res.status(201).json(newMovie);
});

app.delete("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex(movie => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({
      message: "Movie not found"
    });
  }

  movies.splice(movieIndex, 1);
  return res.json({
    message: "Movie deleted"
  });
});

app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: JSON.parse(result.error.message)
    });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex(movie => movie.id === id);

  if(movieIndex < 0) return res.status(404).json({
    message: "Movie not found"
  });

  const updatedMovie = {
    ...movies[movieIndex],
    ...result.data
  };
  movies[movieIndex] = updatedMovie;

  return res.json(updatedMovie);

});

// app.options("/movies/:id", (req, res) => {
//   const origin = req.header("origin");

//   if (ACCEPTED_ORIGINS.includes(origin) || !origin) {
//     res.header("Access-Control-Allow-Origin", origin);
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
//   }
//   res.sendStatus(200);
// });

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});