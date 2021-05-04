// We Are awesome
let genreEl = document.querySelector('#genre')
let zipRequestEl = document.querySelector('#zipRequest')
let zipSubmitEl = document.querySelector('#zipSubmit')
let zipFormEl = document.querySelector('#zipForm')
let searchHistory = [];
let searchHistoryEl = document.querySelector('#searchHistory')
let cuisinelist = ['Sandwiches', 'American', 'Bar Food', 'Italian', 'Mexican', 'Pizza', 'Dali Food', 'Japanese']

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
      movieChoosen = randomNumGen(5);
      movieTitle = data.results[movieChoosen].original_title;
      movieOverview = data.results[movieChoosen].overview;
      console.log(movieTitle);
      console.log(movieOverview);
    })
}

// Fetch request for a list of all genres - use to find the numbers mapping to the genre. Returns an Object
let genreList = function () {
  fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=f0c90416c29040e056b30db72789fae5&language=en-US')
    .then(response => response.json())
    .then(data => data.genres.forEach((item, i) => {
      var newItem = document.createElement('option')
      get('genre').appendChild(newItem)
    })
    )
}

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
            errorFood.textContent = 'No Results';
          }
        })
      } else {
        console.log(foodResponse.statusText)
      }
    })
};

let createFoodLink = function () {
  foodButton = document.createElement('a')
  foodButton.setAttribute('href', foodSite);
  foodButton.setAttribute('target', '_blank');
  foodButton.textContent = foodName;
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
  for (i = 0; i < 5; i++) {
    historyButton = document.createElement('button');
    historyGenre = searchHistory[i].genreType;
    historyCusine = searchHistory[i].cusineType;
    historyButton.setAttribute('onclick', 'handleHistory()');
    historyButton.textContent = 'place Holder text';
    searchHistoryEl.appendChild(historyButton);
  }
};

let handleHistory = function () {
  genreSelector(historyGenre);
  fetchResturant(zipCode, historyCusine);
};

let handleSelection = function () {
  modal.style.display = 'none';
  genreSelector(genreEl.value);
  randomCuisine = randomNumGen(cuisinelist.length);
  fetchResturant(zipCode, cuisinelist[randomCuisine])
  let addSave = { genreType: genreEl.value, cusineType: cuisinelist[randomCuisine] };
  searchHistory.push(addSave);
  saveHistory();
  genreEl.selectedIndex = 0;
};


genreEl.addEventListener('change', handleSelection)
zipFormEl.addEventListener('submit', pullZip)

loadZip();
genreList()
loadHistory();
diaplayZipModal();