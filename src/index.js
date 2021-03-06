var $ = require("jquery");
require("jquery-modal");

const {getMovies} = require('./api.js');
const {postMovie} = require('./api.js');
const {editMovie} = require('./api.js');
const {deleteMovie} = require('./api.js');

$(document).ready(() => {
    loadGallery();
    adminMenu();
});


// Query movies from local DB and displays them
const loadGallery = () => {


    getMovies()
        .then((movies) => {
            $("#catalogue").empty();
            // Loads catalogue
            movies.forEach(({title, id, poster}) => {
                // console.log(`id#${id} - ${title} - rating: ${rating}`);
                $("#catalogue").append(` <div class="movie-block" id="${id}">  ${poster} <div class="poster-text">${title}</div> </div>   `);
            });

            $('.movie-block').click(function () { // grabs the local db ID of the movie clicked
                let localID = "";

                localID = $(this).attr("id");
                $("#galleryView").modal({
                        fadeDuration: 100
                    },
                );
                $('#detailedViewContainer').empty();
                getMovies().then((movies) => {





                    $('.loader').remove();
                    movies.forEach(({id, poster, plot, title, year, rated, ratings, director, actors, released, runtime}) => {
                        var formData = {"title":title, "plot": plot, "ratings": ratings};

                        if (parseInt(localID) === id) {
                            $('#galleryView').append(`<div id="detailedViewContainer"><h2>${title}</h2><div style="font-weight:lighter; display:inline; float:right;">${year} | ${rated} | ${ratings}</div><hr>
                                                        <div class="parent">
                                                        <div class="div1"> ${poster} <br>             
                                                        <a id="editMovieButton" href="#" style="text-align:right;"><button>Edit</button></a></div>
                                                        <div class="div2">  </div>
                                                        <div class="div3">
                                                        <p>${plot}</p>
                                                        <p> Director: ${director}</p>
                                                        <p> Actors: ${actors}</p>
                                                        <p> Release Date: ${released}</p>
                                                        <p> Runtime: ${runtime}</p>
                                                        </div></div>`);

                            $('#editMovieButton').on('click', function () {
                                //     $('#galleryView').remove();
                                $('#editorView').modal();

                                function populate(frm, data) {
                                    $.each(data, function(key, value){
                                        $('[name='+key+']', frm).val(value);
                                    });
                                }
                                populate('#editorView', formData);
                                $('#editForm').submit(function (event) {
                                    var submitData = $( this ).serializeArray();
                                    console.log(submitData);
                                    event.preventDefault();
                                    console.log(parseInt(id) + " = ID | " + serializeToJson(submitData));
                                    editMovie(parseInt(id), serializeToJson(submitData));
                                    location.reload(true)
                                    // $('#editorView').css('display', 'none');

                                });
                            });


                        }
                    });

                });

            });
        })
        .catch((error) => {
            // alert('Oh no! Something went wrong.\nCheck the console for details.');
            console.log(error);
        });
};

// This is the autocomplete for searching movies. Once the movie is found in the IMDb the data is sent to our local DB
$("#titleSearch").keyup(function () { // This is watching the text input for autocomplete
    var keyPress = this.value;
    // This literally triggers an API search every keypress
    $('#searchInput').append('<ul id="autocompleteWrapper"></ul>\n');
    // $('#search-group').focusout(() => { // removes search results with the input box loses focus
    //     $('#autocompleteWrapper').remove();
    // });
    if (keyPress === "") { // if the search input is empty, user hits delete or whatever, the listings are removed.
        $('#autocompleteWrapper').empty();
    }
    var url = "http://www.omdbapi.com/?apikey=1b3199ec&s=" + keyPress;
    $.get(url)
        .done(function (data) {
            var results = data.Search;
            var movieList = []; // A little bucket to hold the search results from OMDB
            results.forEach(({Title, Poster, imdbID}) => {
                var displayPoster = `<img class="moviePoster" style="" src="${Poster}">`; // display poster in autocomplete
                if (Poster === "N/A") {
                    displayPoster = `<div class="noPoster"><small>N/A</small></div>`; // some movies return "N/A" for poster this handles that
                } // now the fetch has gotten our data. Time to dump it in this bucket.
                movieList.push(`<li> <a href="#movieDetails" rel="modal:open" class="listingItemContainer" id="${imdbID}">${displayPoster} 
                            <div class="titleTextList"> ${Title} </div> </a> </li><br> `);
            });
            $('#autocompleteWrapper').html(movieList); // This renders the autocomplete DIV with the results
            $('.listingItemContainer').on('click', function () {
                var imdbLink = $(this).attr("id"); // This grabs the internet movie databse ID so we can plug it into a new URL for a detailed search.
                console.log(imdbLink);
                $('#autocompleteWrapper').remove(); // removes the autocomplete div
                // < open add movie confirm>
                addMovieModal(imdbLink); // sends the new URL element to be added to the local database
            })
        })
        .catch((onerror) => {
            $('#autocompleteWrapper').empty();
        })
});

const addMovieModal = (imdbData) => { // opens a modal with all data pulled from OMDB
    let searchLink = "http://www.omdbapi.com/?apikey=1b3199ec&i=" + imdbData;
    // the Modal pop up is triggered by html <a> tags and a jquery plugin so we just have to code for
    // confirmation and error handeling.
    // TODO: display loading animation
    // pulls all omdb data and prepares it to be added locally using a bucket "newMovieBucket"
    $.get(searchLink)
        .done((d) => {
            var oneRating = parseInt(d.Ratings[0].Value);
            var newMovieBucket = {
                title: d.Title,
                year: d.Year,
                rated: d.Rated,
                ratings: oneRating,
                poster: "<img src=" + d.Poster + "\" alt='Movie Poster' >",
                director: d.Director,
                actors: d.Actors,
                released: d.Released,
                runtime: d.Runtime,
                imdbid: d.imdbID,
                plot: d.Plot
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
            <a id="addMovieButton" rel="modal:close" style="text-align:right;"><button>ADD MOVIE</button></a>
            </div>`);
            $('#addMovieButton').click(function () { // Add movie button when clicked.
                // TODO: Start loader animation???
                // verify movie is not in our local DB.
                getMovies().then((movies) => {
                    var stopped = false;
                    for (let {imdbid} of movies) {
                        if (imdbid === d.imdbID) { // This checks if the new movie is already in our collection.
                            //TODO: add modal alert "This movie already here!"
                            console.log('already added');
                            stopped = true;
                            break;
                        }
                    }
                    if (!stopped) {
                        console.log("this has not been added");
                        postMovie(newMovieBucket); // Adds new movie to local DB.
                        loadGallery();
                    }
                })
            });
            // then go to page display of movie ??
        })
};     // todo: loading complete, kill loading animation here

// admin options.. just delete function for now
const adminMenu = () => {
    $('#admin-button').on('click', () => {
        $('#admin-options').modal({
            fadeDuration: 1000,
            fadeDelay: 0.20
        });
        getMovies().then((movieList) => {
            $("#admin-options").empty().append(`<div><h2>Administrate Justice!</h2> <hr></div>`);
            movieList.forEach(({title, id, year}) => {
                // console.log(`id#${id} - ${title} - rating: ${rating}`);
                $("#admin-options").append(` <div class="movie-block" id="${id}">${title} | ${year} </div> <br>  `);
            });
            $('.movie-block').click(function () { // grabs the local db ID of the movie clicked
                console.log('clicked');
                var tempID = $(this).attr("id");
                console.log(tempID);
                deleteConfirm(tempID);
            });
        })
    });
};

const deleteConfirm = (id) => {
    $("#dialog").modal({
        fadeDuration: 100
    });
    $("#dialog").html(`<p>Are you sure?</p><a href="#" rel="modal:close"><button>Cancel</button></a><a id="deleteMovieButton" rel="modal:close" style="text-align:right;"><button>DELETE</button></a>`)
    $('#deleteMovieButton').on('click', function () {
        deleteMovie(id);
        loadGallery();
        $("#admin-options").empty();
    })
};

// #############
function serializeToJson(serializer){
    var _string = '{';
    for(var ix in serializer)
    {
        var row = serializer[ix];
        _string += '"' + row.name + '":"' + row.value + '",';
    }
    var end =_string.length - 1;
    _string = _string.substr(0, end);
    _string += '}';
    return JSON.parse(_string);
}
//search bar//
var myBox = document.getElementById('box');
myBox.addEventListener('webkitAnimationEnd',function(e) { myBox.style.display = 'none'; }, false);

// updated 2019
const input = document.getElementById("titleSearch");
const searchBtn = document.getElementById("search-btn");

const expand = () => {
    searchBtn.classList.toggle("close");
    input.classList.toggle("square");
};

searchBtn.addEventListener("click", expand);