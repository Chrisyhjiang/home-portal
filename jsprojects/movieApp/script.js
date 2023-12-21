const API_UI = 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=48e62b817c299a8fb3deba6ecc8ff788';
const IMG_PATH = 'https://image.tmdb.org/t/p/w1280';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=48e62b817c299a8fb3deba6ecc8ff788&query=';

const form = document.getElementById('form');
const search = document.getElementById('search');
const main = document.getElementById('main');
const leftArrow = document.getElementById('left');
const rightArrow = document.getElementById('right');

let i = 1;

getMovies(API_UI + "&page=" + i);

async function getMovies(url){
    // pagenation between 1 and 500
    if( i == 1) {
        leftArrow.style.display = 'none';
    } else {
        leftArrow.style.display = 'block'; 
    }
    if( i == 500) {
        rightArrow.style.display = 'none';
    } else {
        rightArrow.style.display = 'block'; 
    }

    const res = await fetch(url);
    const data = await res.json();
    showMovies(data.results);
}

function showMovies(movies){
    main.innerHTML = '';
    movies.forEach((movie) => {
        const { title, poster_path, vote_average, overview} = movie;

        const movieEl = document.createElement('div');
        movieEl.classList.add('movie');
        movieEl.innerHTML = `<div class="movie">
                            <img src="${IMG_PATH + poster_path}" alt="${title}" />
        <div class="movie-info">
            <h3>${title}</h3>
            <span class=${getClassByRate(vote_average)}>${vote_average}</span>
        </div>
        <div class="overview">
            <h3>Overview</h3>
            ${overview}
        </div>

    </div>`
    main.appendChild(movieEl);

    })

}

function getClassByRate(vote){
    if (vote >= 8){
        return 'green';
    } else if (vote >= 5){
        return 'orange';
    } else {
        return 'red';
    }
}

form.addEventListener('submit', (e) => {
    i = 1;
    e.preventDefault();
    const searchTerm = search.value;
    if(searchTerm && searchTerm !== ''){
        getMovies(SEARCH_API + searchTerm);
        search.value='';
    }else {
        window.location.reload();
    }
})

leftArrow.addEventListener('click', (e) =>{
    if( i > 1) {
        i--;
        let url = API_UI;
        if(search.value && search.value !== '' ){
            url = SEARCH_API;
        }
        getMovies(url + "&page=" + i);
    }
})

rightArrow.addEventListener('click', (e) =>{
    if( i < 500) {
        i++;
        let url = API_UI;
        if(search.value && search.value !== '' ){
            url = SEARCH_API;
        }
        getMovies(url + "&page=" + i);
    }
})