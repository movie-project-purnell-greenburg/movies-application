<<<<<<< HEAD
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

=======
var $ = require("jquery");
require("jquery-modal");

const {getMovies} = require('./api.js');
const {postMovie} = require('./api.js');
const {editMovie} = require('./api.js');
const {deleteMovie} = require('./api.js');



getMovies().then((movies) => {
  console.log('Here are all the movies:');
  movies.forEach(({title, rating, id}) => {
    // console.log(`id#${id} - ${title} - rating: ${rating}`);
    $("#movieList").append(` </br>  id#${id} - ${title} - rating: ${rating}   `);

  })
}).catch((error) => {
  alert('Oh no! Something went wrong.\nCheck the console for details.');
  console.log(error);
});


// api key fe20f474
$("#titleSearch").keyup(function () {
  var keyPress = this.value;
  $('#searchInput').append('<div id="autocompleteWrapper"></div>\n')
  console.log(keyPress);
  var url = "http://www.omdbapi.com/?apikey=1b3199ec&s=" + keyPress;
  $.get(url)
      .done(function (data) {
          console.log(data);
          var results = data.Search;
        var movieList = [];
        results.forEach(({Title, Poster, imdbID}) => {

            var displayPoster = `<img class="moviePoster" style="" src="${Poster}">`;
            if(Poster === "N/A"){
                displayPoster = `<div class="noPoster"><small>No Poster Available</small></div>`;
            }
            movieList.push(`<a href="#movieDetails" rel="modal:open" class="listingItemContainer" id="${imdbID}"> ${displayPoster}
                            <div class="titleTextList"> ${Title} </div> </a>`);
        });
          $('#autocompleteWrapper').html(movieList);

          $('.listingItemContainer').on('click', function () {
              var imdbLink = $(this).attr("id"); // assigns imdb ID to var to plug into search
              $('#autocompleteWrapper').remove(); // removes the autocomplete div
              console.log(imdbLink);
              // < open add movie confirm>
              addMovieModal(imdbLink);
          })
      })
});


const addMovieModal = (imdbData) => {
    let searchLink = "http://www.omdbapi.com/?apikey=1b3199ec&i=" + imdbData;
    // Open modal div
    $('#manual-ajax').click(function(event) {
        event.preventDefault();
        // this.blur(); // Manually remove focus from clicked link.
        $.get(this.href, function(html) {
            $(html).appendTo('body').modal();
        });
    });
    // display loading animation
    // pull all omdb data
    // loading complete, kill loading
    $.get(searchLink)
        .done((d)=>{
            console.log(d);
            var newMovieBucket = {
                title: d.Title,
                year: d.Year,
                rated: d.Rated,
                ratings: d.Ratings,
                poster: "<img src=" + d.Poster + "\" alt='Movie Poster' >",
                director: d.Director,
                actors: d.Actors,
                released: d.Released,
                runtime: d.Runtime
            };


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
            <button id="addMovieButton" style="float:right"><em>ADD MOVIE</em></button>
            </div>`);

            $('#addMovieButton').click(function () {
                postMovie(newMovieBucket);
                $('.modal').remove();
                // then go to page display of movie
            })

        })
};
// modal test









// Post new movie


// const newMovie = {title: 'Animal House', rating: '9'};


// const moviePost = {title: 'Ajax Requests', body: 'Are a fun way to use JS!'};
// const url = '/posts';
// const options = {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify(moviePost),
// }

// fetch(url, options)
//     .then(/* post was created successfully */)
//     .catch(/* handle errors */);
//------------------------------Autocomplete Script------------------------------//
// function autocomplete(inp, arr) {
//   /*the autocomplete function takes two arguments,
//   the text field element and an array of possible autocompleted values:*/
//   var currentFocus;
//   /*execute a function when someone writes in the text field:*/
//   inp.addEventListener("input", function(e) {
//     var a, b, i, val = this.value;
//     /*close any already open lists of autocompleted values*/
//     closeAllLists();
//     if (!val) { return false;}
//     currentFocus = -1;
//     /*create a DIV element that will contain the items (values):*/
//     a = document.createElement("DIV");
//     a.setAttribute("id", this.id + "autocomplete-list");
//     a.setAttribute("class", "autocomplete-items");
//     /*append the DIV element as a child of the autocomplete container:*/
//     this.parentNode.appendChild(a);
//     /*for each item in the array...*/
//     for (i = 0; i < arr.length; i++) {
//       /*check if the item starts with the same letters as the text field value:*/
//       if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
//         /*create a DIV element for each matching element:*/
//         b = document.createElement("DIV");
//         /*make the matching letters bold:*/
//         b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
//         b.innerHTML += arr[i].substr(val.length);
//         /*insert a input field that will hold the current array item's value:*/
//         b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
//         /*execute a function when someone clicks on the item value (DIV element):*/
//         b.addEventListener("click", function(e) {
//           /*insert the value for the autocomplete text field:*/
//           inp.value = this.getElementsByTagName("input")[0].value;
//           /*close the list of autocompleted values,
//           (or any other open lists of autocompleted values:*/
//           closeAllLists();
//         });
//         a.appendChild(b);
//       }
//     }
//   });
//   /*execute a function presses a key on the keyboard:*/
//   inp.addEventListener("keydown", function(e) {
//     var x = document.getElementById(this.id + "autocomplete-list");
//     if (x) x = x.getElementsByTagName("div");
//     if (e.keyCode == 40) {
//       /*If the arrow DOWN key is pressed,
//       increase the currentFocus variable:*/
//       currentFocus++;
//       /*and and make the current item more visible:*/
//       addActive(x);
//     } else if (e.keyCode == 38) { //up
//       /*If the arrow UP key is pressed,
//       decrease the currentFocus variable:*/
//       currentFocus--;
//       /*and and make the current item more visible:*/
//       addActive(x);
//     } else if (e.keyCode == 13) {
//       /*If the ENTER key is pressed, prevent the form from being submitted,*/
//       e.preventDefault();
//       if (currentFocus > -1) {
//         /*and simulate a click on the "active" item:*/
//         if (x) x[currentFocus].click();
//       }
//     }
//   });
//   function addActive(x) {
//     /*a function to classify an item as "active":*/
//     if (!x) return false;
//     /*start by removing the "active" class on all items:*/
//     removeActive(x);
//     if (currentFocus >= x.length) currentFocus = 0;
//     if (currentFocus < 0) currentFocus = (x.length - 1);
//     /*add class "autocomplete-active":*/
//     x[currentFocus].classList.add("autocomplete-active");
//   }
//   function removeActive(x) {
//     /*a function to remove the "active" class from all autocomplete items:*/
//     for (var i = 0; i < x.length; i++) {
//       x[i].classList.remove("autocomplete-active");
//     }
//   }
//   function closeAllLists(elmnt) {
//     /*close all autocomplete lists in the document,
//     except the one passed as an argument:*/
//     var x = document.getElementsByClassName("autocomplete-items");
//     for (var i = 0; i < x.length; i++) {
//       if (elmnt != x[i] && elmnt != inp) {
//         x[i].parentNode.removeChild(x[i]);
//       }
//     }
//   }
//   /*execute a function when someone clicks in the document:*/
//   document.addEventListener("click", function (e) {
//     closeAllLists(e.target);
//   });
// }
//   $("#movieList").on('change',function(e) {
//
//     e.preventDefault();
//
//     $.ajax({
//       url: '<?php echo site_url('admin/get_input');?>',
//         type: 'post',
//         data: { movie_list: $("#movieList").val() },
//     dataType: 'json',
//         success: function (data) {
//
//       var inputs = [];
//
//       $.each(data,function(id,value) {
//         inputs.push(
//             '<div class="form-group">' +
//             '<label>' + value.name + '</label>' +
//             '<div class="col-sm-6">' +
//             '<input type="text" name="' + value.name + '">' +
//             '</div>' +
//             '</div>'
//         );
//       });
//
//       $("#movie_list").html(inputs.join(''));
//     }
//   });

// var url = "http://www.omdbapi.com/?i=tt3896198&apikey=1b3199ec&s=" + dInput;
// $.ajax(url).done

>>>>>>> 9ca7fe39abf3926e40655cd2fe4812e9b29ce782

