// We Are awesome
let genreEl = document.querySelector('#genre')
let zipRequestEl = document.querySelector('#zipRequest')
let zipSubmitEl = document.querySelector('#zipSubmit')
let zipFormEl = document.querySelector('#zipForm')
let resultsEl = document.querySelector('#results')
let searchHistory = [];
let searchHistoryEl = document.querySelector('#searchHistory')
let cuisinelist = ['Sandwiches', 'American', 'Bar Food', 'Italian', 'Mexican', 'Pizza', 'Dali Food', 'Japanese']
let movieIteration = 0;

function get(x) {
  return document.getElementById(x)
}
// Get the modal
var modal = document.getElementById('myModal');
var zipModal = document.getElementById('zipModal');

let diaplayZipModal = function () {
  if (!zipCode) {
    zipModal.style.display = 'block';
  }
}

// Get the button that opens the modal
var btn = document.getElementById('myBtn');

// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close')[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
  modal.style.display = 'block'
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = 'none'
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = 'none'
  }
}
const genreSelector = function (genre) {
  fetch('https://api.themoviedb.org/3/discover/movie?api_key=f0c90416c29040e056b30db72789fae5&with_genres=' + genre + '&language=en-US')

    .then(response => response.json())

    .then(function (data) {
      movieChosen = randomNumGen(5);
      linkArt = 'http://image.tmdb.org/t/p/w500' + data.results[movieChosen].backdrop_path;
      movieTitle = data.results[movieChosen].original_title;
      movieOverview = data.results[movieChosen].overview;
      displayMovieInfo();
    })
}

// Fetch request for a list of all genres - use to find the numbers mapping to the genre. Returns an Object
let genreList = function () {
  fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=f0c90416c29040e056b30db72789fae5&language=en-US')
    .then(response => response.json())
    .then(data => data.genres.forEach((item, i) => {

      var genreDropDownButton = document.createElement('button')
      genreDropDownButton.textContent = item.name;
      genreDropDownButton.setAttribute('class', 'dropdown-item');
      genreDropDownButton.setAttribute('style', 'width: 60vw;');
      genreDropDownButton.setAttribute('onclick', 'handleSelection2(' + item.id + ', "' + item.name + '")');
      document.querySelector('.dropdown-content').appendChild(genreDropDownButton);
    })
    )
}

let displayMovieInfo = function () {
  MovieInfoDiv = document.createElement('div');
  MovieInfoDiv.setAttribute('class', `box movie` + movieIteration);
  movieLocation = '.movie' + movieIteration;
  movieIteration++;
  movieTitleHeading = document.createElement('h2');
  movieTitleHeading.setAttribute('class', 'subtitle is-3');
  movieTitleHeading.textContent = movieTitle;

  movieOverviePrint = document.createElement('p');
  movieOverviePrint.textContent = movieOverview;

  movieimagePrimt = document.createElement('img');
  movieimagePrimt.setAttribute('src', linkArt);
  movieimagePrimt.setAttribute('width', '200px');
  movieimagePrimt.setAttribute('height', '200px');

  MovieInfoDiv.appendChild(movieTitleHeading);
  MovieInfoDiv.appendChild(movieOverviePrint);
  MovieInfoDiv.appendChild(movieimagePrimt);
  resultsEl.appendChild(MovieInfoDiv);
};

let fetchResturant = function (foodZip, foodType) {
  foodApiAddress = 'https://api.documenu.com/v2/restaurants/zip_code/' + foodZip + '?size=5&cuisine=' + foodType + '&key=983626163e2a685b3ade4ddc277fc658'
  fetch(foodApiAddress)
    .then(function (foodResponse) {
      if (foodResponse.ok) {
        foodResponse.json().then(function (foodData) {
          if (foodData.data[0]) {
            randomFood = randomNumGen(foodData.data.length);
            foodName = foodData.data[randomFood].restaurant_name;
            foodSite = foodData.data[randomFood].restaurant_website;
            createFoodLink()
          }
          else {
            console.log('No results')
            errorFood = document.createElement('p');
            errorFood.setAttribute('style', 'color: red');
            errorFood.textContent = 'No Resturant Results';
            document.querySelector(movieLocation).appendChild(errorFood)
          }
        })
      } else {
        console.log(foodResponse.statusText)
      }
    })
};

let createFoodLink = function () {
  if (!foodSite) {
    foodSite = 'https://www.grubhub.com';
  }
  lineBreak = document.createElement('br')
  foodButton = document.createElement('a')
  foodButton.setAttribute('href', foodSite);
  foodButton.setAttribute('target', '_blank');
  foodButton.setAttribute('class', "button is-ghost");
  foodButton.textContent = foodName;
  document.querySelector(movieLocation).appendChild(lineBreak);
  document.querySelector(movieLocation).appendChild(foodButton);
}

let randomNumGen = function (max) {
  return Math.floor(Math.random() * max);
};

let loadZip = function () {
  zipCode = JSON.parse(localStorage.getItem('zip'));
  if (zipCode) {
    return;
  }
  zipCode = '';
}

let pullZip = function () {
  event.preventDefault();
  zipModal.style.display = 'none';
  zipCode = zipRequestEl.value;
  localStorage.setItem('zip', JSON.stringify(zipCode));
  zipRequestEl.value = "";

};

let saveHistory = function () {
  historyString = JSON.stringify(searchHistory)
  localStorage.setItem('history', historyString)
}

let loadHistory = function () {
  searchHistory = JSON.parse(localStorage.getItem('history'));
  if (searchHistory) {
    displayHistory();
    return;
  }
  searchHistory = [];
}

let displayHistory = function () {
  searchHistoryEl.innerHTML = '';
  for (i = 0; i < 5; i++) {
    historyButton = document.createElement('button');
    historyButton.setAttribute('class', "button is-primary mt*-3");
    historyButton.setAttribute('onclick', 'handleHistory(' + i + ')');
    if (searchHistory[i]) {
      historyButton.textContent = searchHistory[i].genreName;
      searchHistoryEl.appendChild(historyButton);
    }
  }
};

let handleHistory = function (index) {
  genreSelector(searchHistory[index].genreType);
  fetchResturant(zipCode, searchHistory[index].cusineType);
};

let removeSearchDuplicates = function (item, index) {
  if (addSave.genreType === item.genreType) {
    searchHistory.splice(index, 1);
  }
};


let handleSelection2 = function (kool, krazy) {
  modal.style.display = 'none';
  genreSelector(kool);
  randomCuisine = randomNumGen(cuisinelist.length);
  fetchResturant(zipCode, cuisinelist[randomCuisine])
  addSave = { genreType: kool, genreName: krazy, cusineType: cuisinelist[randomCuisine] };
  searchHistory.forEach(removeSearchDuplicates);
  searchHistory.push(addSave);
  if (searchHistory.length > 5) {
    searchHistory.splice(0, 1)
  }
  displayHistory();
  saveHistory();
  genreEl.selectedIndex = 0;
};

let dropDownHandler = function () {
  document.querySelector('#dropdownMain').classList.toggle("is-active");
}

zipFormEl.addEventListener('submit', pullZip)

loadZip();
genreList()
loadHistory();
diaplayZipModal();
