var $ = require("jquery");

const {getMovies} = require('./api.js');
const {postMovie} = require('./api.js');
const {editMovie} = require('./api.js');
const {deleteMovie} = require('./api.js');



getMovies().then((movies) => {
  console.log('Here are all the movies:');
  movies.forEach(({title, rating, id}) => {
    // console.log(`id#${id} - ${title} - rating: ${rating}`);
    $("#movieList").append(` </br>  id#${id} - ${title} - rating: ${rating}   `);

  });
}).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.')
  console.log(error);
});

// Post new movie


const newMovie = {title: 'Animal House', rating: '9'};

postMovie(newMovie);




