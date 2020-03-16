// On page load:
//
// - Display a "loading..." message
// - Make an ajax request to get a listing of all the movies
// - When the initial ajax request comes back, remove the "loading..." message
// and replace it with html generated from the json response your code
// receives

const $ = require("jquery");
import {getMovies,addMovie,deleteMovie,editMovie} from'./api.js';
const form = document.querySelector('form');
const input = document.querySelector('#searchTerm');
const movieTitle = document.querySelector('#movie-title');
const movieRating = document.querySelector('#movie-rating');
const addMoviebutton = document.querySelector('#add-movie');

const movieRefresh = () => {
  getMovies().then((movies) => {
    console.log('Here are all the movies:');
    movies.forEach(({title, rating, id}) => {
      console.log(`id#${id} - ${title} - rating: ${rating}`);
    })

  }).catch((error) => {
    alert('Oh no! Something went wrong.\nCheck the console for details.');
    console.log(error);
  });
};
addMoviebutton.addEventListener('click', (event) => {
  event.preventDefault();
  const addedMovietitle = movieTitle.value;
  const addedMovieRating = movieRating.value;
  const addedMovie = {
    title: addedMovietitle,
    rating: addedMovieRating
  };
  addMovie(addedMovie);
  console.log(addedMovie);
  movieRefresh();
});


