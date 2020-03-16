var $ = require("jquery");
require("jquery-modal");

const {getMovies} = require('./api.js');
const {postMovie} = require('./api.js');
const {editMovie} = require('./api.js');
const {deleteMovie} = require('./api.js');



getMovies().then((movies) => { // Query movies from local DB
  movies.forEach(({title, rating, id}) => {
    // console.log(`id#${id} - ${title} - rating: ${rating}`);
    $("#movieList").append(` </br>  id#${id} - ${title} - rating: ${rating}   `);

  })
}).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.');
  console.log(error);
});


// This is the autocomplete for searching movies. Onve the movie is found in the IMDb the data is sent to our local DB
$("#titleSearch").keyup(function () { // This is watching the text input for autocomplete
  var keyPress = this.value;          // This literally triggers an API search every keypress
  $('#searchInput').append('<div id="autocompleteWrapper"></div>\n')
  var url = "http://www.omdbapi.com/?apikey=1b3199ec&s=" + keyPress;
  $.get(url)
      .done(function (data) {
          var results = data.Search;
        var movieList = []; // A little bucket to hold the search results from OMDB
        results.forEach(({Title, Poster, imdbID}) => {
            var displayPoster = `<img class="moviePoster" style="" src="${Poster}">`; // display poster in autocomplete
            if(Poster === "N/A"){
                displayPoster = `<div class="noPoster"><small>No Poster Available</small></div>`; // some movies return "N/A" for poster this handles that
            } // now the fetch has gotten our data. Time to dump it in this bucket.
            movieList.push(`<a href="#movieDetails" rel="modal:open" class="listingItemContainer" id="${imdbID}"> ${displayPoster} 
                            <div class="titleTextList"> ${Title} </div> </a>`);
        });
          $('#autocompleteWrapper').html(movieList); // This renders the autocomplete DIV with the results

          $('.listingItemContainer').on('click', function () {
              var imdbLink = $(this).attr("id"); // This grabs the internet movie databse ID so we can plug it into a new URL for a detailed search.
              $('#autocompleteWrapper').remove(); // removes the autocomplete div
              // < open add movie confirm>
              addMovieModal(imdbLink); // sends the new URL element to be added to the local database
          })
      })
});


const addMovieModal = (imdbData) => {
    let searchLink = "http://www.omdbapi.com/?apikey=1b3199ec&i=" + imdbData;
    // the Modal pop up is triggered by html <a> tags and a jquery plugin so we just have to code for
    // confirmation and error handeling.
    // TODO: display loading animation
    // pulls all omdb data and prepares it to be added locally using a bucket "newMovieBucket"
    $.get(searchLink)
        .done((d)=>{
            var newMovieBucket = {
                title: d.Title,
                year: d.Year,
                rated: d.Rated,
                ratings: d.Ratings,
                poster: "<img src=" + d.Poster + "\" alt='Movie Poster' >",
                director: d.Director,
                actors: d.Actors,
                released: d.Released,
                runtime: d.Runtime,
                imdbid: d.imdbID
            };

            // This renders the modal
            $('#movieDetails').html(`<h2 style="display:inline">${d.Title}</h2> 
<div style="font-weight:lighter; display:inline; float:right;">${d.Year} | ${d.Rated} | ${d.Ratings[0].Value}</div><hr>
            <div class="parent">
            <div class="div1"> <img src="${d.Poster}" alt="Movie Poster"> </div>
            <div class="div2">  </div>
            <div class="div3">
            <p>${d.Plot}</p> 
            <p> Director: ${d.Director}</p>
            <p> Actors: ${d.Actors}</p>
            <p> Release Date: ${d.Released}</p>
            <p> Runtime: ${d.Runtime}</p>
            </div>
            <a href="#" rel="modal:close"><button>Cancel</button></a>
            <a id="addMovieButton" rel="modal:close" style="float:right"><button>ADD MOVIE</button></a>
            </div>`);

            $('#addMovieButton').click(function () { // Add movie button clicked.
                // TODO: Start loader animation???
                // verify movie is not in our local DB.
                getMovies().then((movies) => {
                    movies.forEach(({imdbid})=> {
                        if(imdbid === d.imdbID){ // This checks if the new movie is already in our collection.
                            //TODO: add modal alert "This movie already here!"
                            console.log('already added');
                            return false;
                        } else {
                            console.log("this has not been added");
                            postMovie(newMovieBucket); // Adds new movie to local DB.
                        }
                    })
                });


                // then go to page display of movie ??
            })
        })     // todo: loading complete, kill loading animation here

};



