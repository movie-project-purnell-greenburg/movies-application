
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
  editMovie: (id, movie) => {
    console.log("Editing movie data for " + movie.title);
    return fetch(`api/movies/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: json.stringify(movie)
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
  }
};


// OMDB API Call variables

