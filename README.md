# 🎬 Movies API

A simple and modular RESTful API for managing and retrieving movie data, built with **Node.js**, **Express**, and **Zod**.

## 🚀 Features
- ✅ Uses [Zod](https://github.com/colinhacks/zod) for runtime schema validation
- 🔍 RESTful endpoints for movie data retrieval
- 🧪 Example HTTP requests using `api.http`
- 🌐 Deployed at: [movies-api-uc54.onrender.com/movies](https://movies-api-uc54.onrender.com/movies)

## 📚 API Endpoints
- `GET /movies` - Retrieve a list of all movies

- `GET /movies/:id` - Retrieve details of a specific movie by ID

- `POST /movies` - Add a new movie (validates input with Zod)

- `PUT /movies/:id` - Update an existing movie by ID (validates input with Zod)

- `DELETE /movies/:id` - Delete a movie by ID