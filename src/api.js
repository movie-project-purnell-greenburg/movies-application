module.exports = {
  getMovies: () => {
    return fetch('/api/movies')
        .then(response => response.json());
  },
  addMovie: (movie) => {
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(movie)
    };
    console.log(movie);
    return fetch('/api/movies', options)
        .then(response => response.json())
  },
  deleteMovie: (movie, id) => {
    const options = {
      method: "DELETE",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(movie)
    };
    console.log(movie);
    return fetch(`/api/movies/${id}`, options)
  },
  editMovie: (movie, id) => {
    const options = {
      method: "PATCH",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(movie)
    };
    console.log(movie);
    return fetch(`/api/movies/${id}`, options)
  }
};

