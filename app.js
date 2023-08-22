require("dotenv").config();

const express = require("express");
const app = express();
app.use(express.json());
const port = process.env.APP_PORT ?? 8000;

//* IMPORT
const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};
const { hashPassword, verifyPassword, verifyToken, verifyTokenById } = require("./auth");

//* PUBLIC ROUTES
app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});

//* GET
app.get("/", welcome);
app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUsersById);


//* POST
app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
); // /!\ login should be a public route
app.post("/api/users", hashPassword, userHandlers.postUser);


// then the routes to protect
//* AUTHENTICATION WALL
app.use(verifyToken); // authentication wall : verifyToken is activated for each route after this line

//* PRIVATE
//* POST
app.post("/api/movies", movieHandlers.postMovie);

//* PUT
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.put("/api/users/:id", verifyTokenById, hashPassword, userHandlers.updateUser);


//* DELETE
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", verifyTokenById, userHandlers.deleteUser);
