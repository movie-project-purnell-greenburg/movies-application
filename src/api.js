import {OMDBkey} from "./keys.js";

module.exports = {
  getMovies: () => {
    return fetch('/api/movies')
        .then(response => response.json());
  },
  postMovie: (newMovie) => {
    return fetch('api/movies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMovie)
    })
        .then(response => response.json());
  },
  editMovie: (id, book) => {
    return fetch(`api/movies/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: json.stringify(book)
    })
        .then(response => resopnse.json());
  },
  deleteMovie: (id) => {// a delete is final so we want a confirm
    return fetch(`api/movies/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
        .then(response => response.json());
  },
  omdbList: (searchString) => { // Pulls a list of 10 itesm from online movie database to populate auto-complete
    // http://www.omdbapi.com/?s= "string" &apikey=1b3199ec  (http://www.omdbapi.com/?s=happy+gilmore&apikey=1b3199ec)
    let omdbListurl = `http://www.omdbapi.com/?s=` + searchString + OMDBkey;
    return fetch(omdbListurl)
        .then(response => response.json())
    }
};

// http://www.omdbapi.com/?i= "IMDB ID" &apikey=1b3199ec (http://www.omdbapi.com/?i=tt3896198&apikey=1b3199ec)






