var autocompleteJs = require("autocomplete.js")

const {getMovies} = require('./api.js');
const {postMovie} = require('./api.js');
const {editMovie} = require('./api.js');
const {deleteMovie} = require('./api.js');
const {omdbList} = require('./api.js');


getMovies().then((movies) => { // Get list of movies from db.json
  console.log('Here are all the movies:');
  movies.forEach(({title, rating, id}) => {
    // console.log(`id#${id} - ${title} - rating: ${rating}`);
    $("#movieList").append(`  id#${id} - ${title} - rating: ${rating}   `);
  })
}).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.');
  console.log(error);
});
// External Calls ********************************************





//
// $('#searchBox')
//     .keyup(function (){
//       let searString = $(this).val();
//       omdbList(searString).then((results)=>{
//           console.log(results.Search);
//       })
//     });







    //     let movieList = [];
    //     var input = document.getElementById("searchBox");
    //     new Awesomplete(input, {
    //       list: ["Ada", "Java", "JavaScript", "Brainfuck", "LOLCODE", "Node.js", "Ruby on Rails"]
    // })
