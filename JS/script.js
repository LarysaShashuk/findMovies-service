let APIKey = 'http://www.omdbapi.com/?i=tt3896198&apikey=4a249f8d';

// get reguest from user

let radioArr = document.querySelectorAll('.radio-butoon');
let userRequest = document.querySelector('.user-request');
let form = document.querySelector('#search-form');

let checkedRadioValue;

// container for all cards
let resultsContainer = document.querySelector('.results-container');

form.addEventListener('submit', function (e) {
  e.preventDefault();

  document.querySelector('.firstScreen').classList.add('hiddenElement');

  if (
    !document.querySelector('.errorScreen').classList.contains('hiddenElement')
  ) {
    document.querySelector('.errorScreen').classList.add('hiddenElement');
  }

  if (
    document.querySelector('.favoritesList') &&
    !document
      .querySelector('.favoritesList')
      .classList.contains('hiddenElement')
  ) {
    document.querySelector('.favoritesList').classList.add('hiddenElement');
  }

  let paginstionContainer = document.querySelector('.pagination');
  if (!paginstionContainer.classList.contains('hiddenElement')) {
    paginstionContainer.classList.add('hiddenElement');
  }

  for (i = 0; i < radioArr.length; i++) {
    if (radioArr[i].checked) {
      checkedRadioValue = radioArr[i].value;
    }
  }

  let uri = `http://www.omdbapi.com/?s=${userRequest.value}&type=${checkedRadioValue}&page=1&apikey=4a249f8d`;
  let encodedRequest = encodeURI(uri);

  if (document.querySelector('.foundMovie')) {
    let previousRequest = document.querySelectorAll('.foundMovie');
    for (elem of previousRequest) {
      elem.remove();
    }
  }

  fetch(encodedRequest)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);

      if (data.totalResults <= 10) {
        createMovieCard(data);
      } else {
        let amountOfPages = Math.ceil(data.totalResults / 10);

        let total = document.querySelector('.pagination__total');
        total.innerText = amountOfPages;

        let firstButton = document.querySelector('.pagination__first');
        let secondButton = document.querySelector('.pagination__second');
        let thirdButton = document.querySelector('.pagination__third');

        firstButton.innerText = '1';
        secondButton.innerText = '2';
        thirdButton.innerText = '3';

        pagination();
      }
    })
    .catch((error) => console.log(`Error: ${error}`));
});

let defoltImg = 'assets/images/7d712f26c2ea449bd45b902c73981a42 1.jpg';

function createMovieCard(json) {
  if (json.Response == 'False') {
    document.querySelector('.errorScreen').classList.remove('hiddenElement');
    document.querySelector('.pagination').classList.add('hiddenElement');
  } else {
    for (i = 0; i < json.Search.length; i++) {
      //card
      let resultsCard = document.createElement('div');
      resultsCard.className = 'results-card foundMovie';
      resultsContainer.append(resultsCard);

      let resultsCardMainContainer = document.createElement('div');
      resultsCardMainContainer.className = 'results-card__mainContainer';
      resultsCard.append(resultsCardMainContainer);

      // img container
      let resultsCardImgWrap = document.createElement('div');
      resultsCardImgWrap.className = 'results-card__img-wrap';
      resultsCardMainContainer.append(resultsCardImgWrap);

      let resultsCardImgWrapItem = document.createElement('img');
      resultsCardImgWrapItem.className = 'results-card__img-wrap__item';
      if (json.Search[i].Poster == 'N/A') {
        resultsCardImgWrapItem.setAttribute('src', defoltImg);
      } else {
        resultsCardImgWrapItem.setAttribute('src', json.Search[i].Poster);
      }
      resultsCardImgWrap.append(resultsCardImgWrapItem);

      //content container
      let resultsCardContentWrap = document.createElement('div');
      resultsCardContentWrap.className = 'results-card__content-wrap';
      resultsCardMainContainer.append(resultsCardContentWrap);

      let resultsCardTitle = document.createElement('div');
      resultsCardTitle.className = 'results-card__title';
      resultsCardContentWrap.append(resultsCardTitle);

      let resultsCardTitleHead = document.createElement('p');
      resultsCardTitleHead.className = 'results-card__title__head';
      resultsCardTitleHead.innerText = json.Search[i].Title;
      resultsCardTitle.append(resultsCardTitleHead);

      let resultsCardType = document.createElement('div');
      resultsCardType.className = 'results-card__type wrap';
      resultsCardContentWrap.append(resultsCardType);

      let resultsCardTypeHead = document.createElement('p');
      resultsCardTypeHead.className = 'results-card__type__head headings';
      resultsCardTypeHead.innerText = 'Type:';
      resultsCardType.append(resultsCardTypeHead);

      let resultsCardTypeText = document.createElement('p');
      resultsCardTypeText.className = 'results-card__type__text descriptions';
      resultsCardTypeText.innerText = json.Search[i].Type;
      resultsCardType.append(resultsCardTypeText);

      let resultsCardYear = document.createElement('div');
      resultsCardYear.className = 'results-card__year wrap';
      resultsCardContentWrap.append(resultsCardYear);

      let resultsCardYearHead = document.createElement('p');
      resultsCardYearHead.className = 'results-card__year__head headings';
      resultsCardYearHead.innerText = 'Year:';
      resultsCardYear.append(resultsCardYearHead);

      let resultsCardYearText = document.createElement('p');
      resultsCardYearText.className = 'results-card__year__head descriptions';
      resultsCardYearText.innerText = json.Search[i].Year;
      resultsCardYear.append(resultsCardYearText);

      let resultsCardButton = document.createElement('button');
      resultsCardButton.className = 'results-card__button';
      resultsCardButton.innerText = 'more details';
      resultsCardContentWrap.append(resultsCardButton);

      // Add to favotite
      let popUpWindowAddToFavoritResoltCard = document.createElement('button');
      popUpWindowAddToFavoritResoltCard.className =
        'popUp-window__addToFavorit popUp-window__addToFavorit--resoltCard';
      popUpWindowAddToFavoritResoltCard.innerText = 'Add to favorites';
      resultsCardContentWrap.append(popUpWindowAddToFavoritResoltCard);

      popUpWindowAddToFavoritResoltCard.addEventListener('click', function (e) {
        e.preventDefault();

        if (popUpWindowAddToFavoritResoltCard.classList.contains('wasAdded')) {
          popUpWindowAddToFavoritResoltCard.classList.remove('wasAdded');
          popUpWindowAddToFavoritResoltCard.innerText = 'Add to favorites';

          localStorage.removeItem(movieTitle, movieId);
        } else {
          popUpWindowAddToFavoritResoltCard.innerText = 'Remove from favorites';
          popUpWindowAddToFavoritResoltCard.classList.add('wasAdded');
          popUpWindowAddToFavoritResoltCard.classList.add(movieId);

          localStorage.setItem(movieTitle, movieId);
        }
      });

      // id of current film
      let movieId = json.Search[i].imdbID;
      let movieTitle = json.Search[i].Title;

      resultsCardButton.addEventListener('click', function (e) {
        e.preventDefault();
        createDetailsCard(
          movieId,
          resultsCard,
          resultsCardMainContainer,
          popUpWindowAddToFavoritResoltCard
        );
        resultsCard.classList.add('moreDetailRequest');
      });
    }
  }
}

function createDetailsCard(
  movieId,
  resultsCard,
  resultsCardMainContainer,
  popUpWindowAddToFavoritResoltCard
) {
  let uri = `http://www.omdbapi.com/?i=${movieId}&plot=full&apikey=4a249f8d`;
  let encodedRequest = encodeURI(uri);

  fetch(encodedRequest)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      addContentToPopUp(data, popUpWindow, resultsCardMainContainer);
    })
    .catch((error) => console.log(`Error: ${error}`));

  // create container for details
  let popUpWindow = document.createElement('div');
  popUpWindow.className = 'popUp-window';
  resultsCard.append(popUpWindow);

  //replace pop-up with result
  resultsCardMainContainer.parentNode.replaceChild(
    popUpWindow,
    resultsCardMainContainer
  );

  //add content to details pop-up

  function addContentToPopUp(json, popUpWindow, resultsCardMainContainer) {
    let popUpWindowContent = document.createElement('div');
    popUpWindowContent.className = 'popUp-window__content';
    popUpWindow.append(popUpWindowContent);

    //Button close
    let popUpWindowClose = document.createElement('div');
    popUpWindowClose.className = 'popUp-window__close';
    popUpWindowContent.append(popUpWindowClose);

    let popUpWindowCloseIcon = document.createElement('img');
    popUpWindowCloseIcon.className = 'popUp-window__close__icon';
    popUpWindowCloseIcon.setAttribute('src', './assets/icons/close.svg');
    popUpWindowClose.append(popUpWindowCloseIcon);

    popUpWindowClose.addEventListener('click', function () {
      popUpWindow.parentNode.replaceChild(
        resultsCardMainContainer,
        popUpWindow
      );
    });

    //Title
    let popUpWindowContentTitle = document.createElement('p');
    popUpWindowContentTitle.className = 'popUp-window__content__title';
    popUpWindowContentTitle.innerText = json.Title;
    popUpWindowContent.append(popUpWindowContentTitle);

    //Plot
    let popUpWindowContentPlot = document.createElement('p');
    popUpWindowContentPlot.className = 'popUp-window__content__plot';
    popUpWindowContentPlot.innerText = json.Plot;
    popUpWindowContent.append(popUpWindowContentPlot);

    //Awards
    let popUpWindowContentWrap1 = document.createElement('div');
    popUpWindowContentWrap1.className = 'popUp-window__content__wrap';
    popUpWindowContent.append(popUpWindowContentWrap1);

    let popUpWindowContentHead1 = document.createElement('p');
    popUpWindowContentHead1.className = 'popUp-window__content__head';
    popUpWindowContentHead1.innerText = 'Awards:';
    popUpWindowContentWrap1.append(popUpWindowContentHead1);

    let popUpWindowContentText1 = document.createElement('p');
    popUpWindowContentText1.className = 'popUp-window__content__text';
    popUpWindowContentText1.innerText = json.Awards;
    popUpWindowContentWrap1.append(popUpWindowContentText1);

    //Actors
    let popUpWindowContentWrap2 = document.createElement('div');
    popUpWindowContentWrap2.className = 'popUp-window__content__wrap';
    popUpWindowContent.append(popUpWindowContentWrap2);

    let popUpWindowContentHead2 = document.createElement('p');
    popUpWindowContentHead2.className = 'popUp-window__content__head';
    popUpWindowContentHead2.innerText = 'Actors:';
    popUpWindowContentWrap2.append(popUpWindowContentHead2);

    let popUpWindowContentText2 = document.createElement('p');
    popUpWindowContentText2.className = 'popUp-window__content__text';
    popUpWindowContentText2.innerText = json.Actors;
    popUpWindowContentWrap2.append(popUpWindowContentText2);

    //Country
    let popUpWindowContentWrap3 = document.createElement('div');
    popUpWindowContentWrap3.className = 'popUp-window__content__wrap';
    popUpWindowContent.append(popUpWindowContentWrap3);

    let popUpWindowContentHead3 = document.createElement('p');
    popUpWindowContentHead3.className = 'popUp-window__content__head';
    popUpWindowContentHead3.innerText = 'Country:';
    popUpWindowContentWrap3.append(popUpWindowContentHead3);

    let popUpWindowContentText3 = document.createElement('p');
    popUpWindowContentText3.className = 'popUp-window__content__text';
    popUpWindowContentText3.innerText = json.Country;
    popUpWindowContentWrap3.append(popUpWindowContentText3);

    //BoxOffice
    let popUpWindowContentWrap4 = document.createElement('div');
    popUpWindowContentWrap4.className = 'popUp-window__content__wrap';
    popUpWindowContent.append(popUpWindowContentWrap4);

    let popUpWindowContentHead4 = document.createElement('p');
    popUpWindowContentHead4.className = 'popUp-window__content__head';
    popUpWindowContentHead4.innerText = 'BoxOffice:';
    popUpWindowContentWrap4.append(popUpWindowContentHead4);

    let popUpWindowContentText4 = document.createElement('p');
    popUpWindowContentText4.className = 'popUp-window__content__text';
    popUpWindowContentText4.innerText = json.BoxOffice;
    popUpWindowContentWrap4.append(popUpWindowContentText4);

    //Released
    let popUpWindowContentWrap5 = document.createElement('div');
    popUpWindowContentWrap5.className = 'popUp-window__content__wrap';
    popUpWindowContent.append(popUpWindowContentWrap5);

    let popUpWindowContentHead5 = document.createElement('p');
    popUpWindowContentHead5.className = 'popUp-window__content__head';
    popUpWindowContentHead5.innerText = 'Released:';
    popUpWindowContentWrap5.append(popUpWindowContentHead5);

    let popUpWindowContentText5 = document.createElement('p');
    popUpWindowContentText5.className = 'popUp-window__content__text';
    popUpWindowContentText5.innerText = json.Released;
    popUpWindowContentWrap5.append(popUpWindowContentText5);

    // Add to favotite
    let popUpWindowAddToFavorit = document.createElement('button');
    popUpWindowAddToFavorit.className = 'popUp-window__addToFavorit';
    popUpWindowAddToFavorit.innerText = 'Add to favorites';
    popUpWindowContent.append(popUpWindowAddToFavorit);

    if (popUpWindowAddToFavoritResoltCard.classList.contains('wasAdded')) {
      popUpWindowAddToFavorit.innerText = 'Remove from favorites';
      popUpWindowAddToFavorit.classList.add('wasAdded');
    }

    popUpWindowAddToFavorit.addEventListener('click', function (e) {
      e.preventDefault();

      if (popUpWindowAddToFavorit.classList.contains('wasAdded')) {
        popUpWindowAddToFavorit.classList.remove('wasAdded');
        popUpWindowAddToFavorit.innerText = 'Add to favorites';

        popUpWindowAddToFavoritResoltCard.classList.remove('wasAdded');
        popUpWindowAddToFavoritResoltCard.innerText = 'Add to favorites';

        localStorage.removeItem(json.Title, movieId);
      } else {
        popUpWindowAddToFavorit.innerText = 'Remove from favorites';
        popUpWindowAddToFavorit.classList.add('wasAdded');

        localStorage.setItem(json.Title, movieId);
      }
    });

    //Poster
    let popUpWindowImgWrap = document.createElement('div');
    popUpWindowImgWrap.className = 'popUp-window__img-wrap';
    popUpWindow.append(popUpWindowImgWrap);

    let popUpWindowImgWrapItem = document.createElement('img');
    popUpWindowImgWrapItem.className = 'popUp-window__img-wrap__item';
    if (json.Poster == 'N/A') {
      popUpWindowImgWrapItem.setAttribute('src', defoltImg);
    } else {
      popUpWindowImgWrapItem.setAttribute('src', json.Poster);
    }
    popUpWindowImgWrap.append(popUpWindowImgWrapItem);
  }
}

function pagination() {
  // make pagination visible

  let paginstionContainer = document.querySelector('.pagination');
  paginstionContainer.classList.remove('hiddenElement');

  if (document.querySelector('.foundMovie')) {
    let previousRequest = document.querySelectorAll('.foundMovie');
    for (elem of previousRequest) {
      elem.remove();
    }
  }

  let uri = `http://www.omdbapi.com/?s=${userRequest.value}&type=${checkedRadioValue}&page=1&apikey=4a249f8d`;
  let encodedRequest = encodeURI(uri);

  fetch(encodedRequest)
    .then((res) => res.json())
    .then((data) => createMovieCard(data))
    .catch((error) => console.log(`Error: ${error}`));

  //pagination buttons
  let navButtonPrev = document.querySelector('.navButtonPrev');
  let navButtonNext = document.querySelector('.navButtonNext');
  let firstButton = document.querySelector('.pagination__first');
  let secondButton = document.querySelector('.pagination__second');
  let thirdButton = document.querySelector('.pagination__third');
  let navNumber = document.querySelectorAll('.navNumber');
  let totalButton = document.querySelector('.pagination__total');
  let numArr = document.querySelectorAll('.pageNumber');

  // Controls Value
  let controlValueNex = +totalButton.innerText - 1;
  let controlValuePrev = 1;

  let activeValue;

  if (firstButton.innerText <= controlValuePrev) {
    navButtonPrev.classList.add('unactiveButton');
  }

  if (!firstButton.classList.contains('activePage')) {
    navButtonPrev.classList.remove('unactiveButton');
  }

  //change active button onclick
  numArr.forEach(function (page) {
    page.addEventListener('click', function () {
      for (elem of numArr) {
        if (elem.classList.contains('activePage')) {
          elem.classList.remove('activePage');
        }
      }

      page.classList.add('activePage');

      activeValue = document.querySelector('.activePage').innerText;

      if (document.querySelector('.foundMovie')) {
        let previousRequest = document.querySelectorAll('.foundMovie');
        for (elem of previousRequest) {
          elem.remove();
        }
      }

      let uri = `http://www.omdbapi.com/?s=${userRequest.value}&type=${checkedRadioValue}&page=${activeValue}&apikey=4a249f8d`;
      let encodedRequest = encodeURI(uri);

      fetch(encodedRequest)
        .then((res) => res.json())
        .then((data) => createMovieCard(data))
        .catch((error) => console.log(`Error: ${error}`));
    });
  });

  firstButton.addEventListener('click', function () {
    if (
      firstButton.classList.contains('activePage') &&
      firstButton.innerText == controlValuePrev
    ) {
      navButtonPrev.classList.add('unactiveButton');
    }

    if (secondButton.innerText == controlValueNex) {
      navButtonNext.classList.remove('unactiveButton');
    }
  });

  secondButton.addEventListener('click', function () {
    if (secondButton.innerText == controlValueNex) {
      navButtonNext.classList.remove('unactiveButton');
    }

    if (
      secondButton.classList.contains('activePage') &&
      firstButton.innerText == controlValuePrev
    ) {
      navButtonPrev.classList.remove('unactiveButton');
    }
  });

  thirdButton.addEventListener('click', function () {
    if (
      thirdButton.classList.contains('activePage') &&
      thirdButton.innerText == totalButton.innerText
    ) {
      navButtonNext.classList.add('unactiveButton');
    }

    if (
      thirdButton.classList.contains('activePage') &&
      firstButton.innerText == controlValuePrev
    ) {
      navButtonPrev.classList.remove('unactiveButton');
    }
  });

  totalButton.addEventListener('click', function () {
    totalButton.classList.add('activePage');
    navButtonPrev.classList.remove('unactiveButton');
    navButtonNext.classList.add('unactiveButton');

    let totalValue = totalButton.innerText;

    if (totalValue !== +thirdButton.innerText - 1) {
      thirdButton.innerText = totalValue;
      secondButton.innerText = +(totalValue - 1);
      firstButton.innerText = +(totalValue - 2);
    }
  });

  // change active button with navigation arrows

  navButtonNext.addEventListener('click', function () {
    if (secondButton.innerText < controlValueNex) {
      if (firstButton.classList.contains('activePage')) {
        firstButton.classList.remove('activePage');
        secondButton.classList.add('activePage');
        firstButton.classList.add('clicked');
      } else {
        firstButton.classList.remove('clicked');
      }

      if (thirdButton.classList.contains('activePage')) {
        firstButton.innerText = secondButton.innerText;
        secondButton.innerText = thirdButton.innerText;

        let currentValueThird = thirdButton.innerText;
        let newValueThird = +currentValueThird + 1;
        thirdButton.innerText = +newValueThird;

        thirdButton.classList.remove('activePage');
        secondButton.classList.add('activePage');
      }

      if (
        secondButton.classList.contains('activePage') &&
        !firstButton.classList.contains('clicked')
      ) {
        for (elem of navNumber) {
          let currentValue = elem.innerText;
          let newValue = +currentValue + 1;
          elem.innerText = +newValue;
        }
      }
    } else if (secondButton.innerText == controlValueNex) {
      //navButtonNext.classList.add("unactiveButton");

      if (firstButton.classList.contains('activePage')) {
        firstButton.classList.remove('activePage');
        secondButton.classList.add('activePage');
        firstButton.classList.add('clicked');
      } else {
        firstButton.classList.remove('clicked');
      }

      if (
        secondButton.innerText == controlValueNex &&
        thirdButton.classList.contains('activePage')
      ) {
        navButtonNext.classList.add('unactiveButton');
      }

      if (
        secondButton.classList.contains('activePage') &&
        !firstButton.classList.contains('clicked')
      ) {
        secondButton.classList.remove('activePage');
        thirdButton.classList.add('activePage');

        navButtonNext.classList.add('unactiveButton');
      }
    } else {
      navButtonNext.classList.add('unactiveButton');
    }

    if (firstButton.innerText >= controlValuePrev) {
      navButtonPrev.classList.remove('unactiveButton');
    }

    activeValue = document.querySelector('.activePage').innerText;

    if (document.querySelector('.foundMovie')) {
      let previousRequest = document.querySelectorAll('.foundMovie');
      for (elem of previousRequest) {
        elem.remove();
      }
    }

    let uri = `http://www.omdbapi.com/?s=${userRequest.value}&type=${checkedRadioValue}&page=${activeValue}&apikey=4a249f8d`;
    let encodedRequest = encodeURI(uri);

    fetch(encodedRequest)
      .then((res) => res.json())
      .then((data) => createMovieCard(data))
      .catch((error) => console.log(`Error: ${error}`));
  });

  navButtonPrev.addEventListener('click', function () {
    if (firstButton.innerText > controlValuePrev) {
      navButtonPrev.classList.remove('unactiveButton');

      if (firstButton.classList.contains('activePage')) {
        firstButton.classList.remove('activePage');
        secondButton.classList.add('activePage');

        for (elem of navNumber) {
          let currentValue = elem.innerText;
          let newValue = +currentValue - 1;
          elem.innerText = +newValue;
        }
      }

      if (
        thirdButton.classList.contains('activePage') &&
        thirdButton.innerText == totalButton.innerText
      ) {
        thirdButton.classList.remove('activePage');
        secondButton.classList.add('activePage');
        thirdButton.classList.add('clicked');
      } else {
        thirdButton.classList.remove('clicked');
      }

      if (thirdButton.classList.contains('activePage')) {
        secondButton.innerText = firstButton.innerText;

        let currentValueThird = thirdButton.innerText;
        let newValueThird = +currentValueThird - 1;
        thirdButton.innerText = +newValueThird;

        thirdButton.classList.remove('activePage');
        secondButton.classList.add('activePage');
      }

      if (
        secondButton.classList.contains('activePage') &&
        !thirdButton.classList.contains('clicked')
      ) {
        for (elem of navNumber) {
          let currentValue = elem.innerText;
          let newValue = +currentValue - 1;
          elem.innerText = +newValue;
        }
      }
    } else if (
      firstButton.innerText == controlValuePrev &&
      secondButton.classList.contains('activePage')
    ) {
      secondButton.classList.remove('activePage');
      firstButton.classList.add('activePage');
      navButtonPrev.classList.add('unactiveButton');
    } else if (
      firstButton.innerText == controlValuePrev &&
      thirdButton.classList.contains('activePage')
    ) {
      thirdButton.classList.remove('activePage');
      secondButton.classList.add('activePage');
      navButtonPrev.classList.remove('unactiveButton');
    } else {
      navButtonPrev.classList.add('unactiveButton');
    }

    if (totalButton.classList.contains('activePage')) {
      let totalValue = totalButton.innerText;
      thirdButton.innerText = totalValue;
      secondButton.innerText = +(totalValue - 1);
      firstButton.innerText = +(totalValue - 2);
      totalButton.classList.remove('activePage');
      secondButton.classList.add('activePage');
      navButtonPrev.classList.remove('unactiveButton');
    }

    if (secondButton.innerText <= controlValueNex) {
      navButtonNext.classList.remove('unactiveButton');
    }

    activeValue = document.querySelector('.activePage').innerText;

    if (document.querySelector('.foundMovie')) {
      let previousRequest = document.querySelectorAll('.foundMovie');
      for (elem of previousRequest) {
        elem.remove();
      }
    }

    let uri = `http://www.omdbapi.com/?s=${userRequest.value}&type=${checkedRadioValue}&page=${activeValue}&apikey=4a249f8d`;
    let encodedRequest = encodeURI(uri);

    fetch(encodedRequest)
      .then((res) => res.json())
      .then((data) => createMovieCard(data))
      .catch((error) => console.log(`Error: ${error}`));
  });
}

//favorites
let headersElements = document.querySelector('.headersElements');
let favoriteMoviesCard;

function createFavoriteMoviesCard(innerHTML) {
  favoriteMoviesCard = document.createElement('div');
  favoriteMoviesCard.className = 'results-card favoritesList';
  favoriteMoviesCard.classList.add('listIsOpen');
  favoriteMoviesCard.innerHTML = innerHTML;

  headersElements.after(favoriteMoviesCard);

  let favoritesListClose = document.createElement('div');
  favoritesListClose.className = 'popUp-window__close';
  favoriteMoviesCard.append(favoritesListClose);

  let favoritesListCloseIcon = document.createElement('img');
  favoritesListCloseIcon.className = 'popUp-window__close__icon';
  favoritesListCloseIcon.setAttribute('src', './assets/icons/close.svg');
  favoritesListClose.append(favoritesListCloseIcon);

  favoritesListClose.addEventListener('click', function () {
    favoriteMoviesCard.classList.add('hiddenElement');

    let errorScreen = document.querySelector('.errorScreen');
    let foundedFilm = document.querySelector('.foundMovie');

    if (!foundedFilm || !errorScreen.classList.contains('hiddenElement')) {
      document.querySelector('.firstScreen').classList.remove('hiddenElement');
      errorScreen.classList.add('hiddenElement');
    }
  });
}

//card with favorites movie
let openFavoritesListButton = document.querySelector('.openFavoritesList');
openFavoritesListButton.addEventListener('click', function (e) {
  e.preventDefault();

  document.querySelector('.firstScreen').classList.add('hiddenElement');

  if (document.querySelector('.favoritesList')) {
    let previousRequest = document.querySelectorAll('.favoritesList');
    for (elem of previousRequest) {
      elem.remove();
    }
  }

  let valuesIDArr = [];

  for (i = 0; i <= localStorage.length; i++) {
    let key = localStorage.key(i);
    if (key) {
      let value = localStorage.getItem(key);
      valuesIDArr.push(value);
    }
  }

  if (localStorage.length == 0) {
    let innerHTML =
      'here you will see the list <br> of movies you have marked as favorites <br><br><br> ';
    createFavoriteMoviesCard(innerHTML);
  } else {
    let innerHTML = '';
    createFavoriteMoviesCard(innerHTML);

    valuesIDArr.forEach(function (id) {
      let uri = `http://www.omdbapi.com/?i=${id}&plot=full&apikey=4a249f8d`;
      let encodedRequest = encodeURI(uri);

      fetch(encodedRequest)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          addMovieCardToFavoritesList(data);
        })
        .catch((error) => console.log(`Error: ${error}`));
    });
  }
});

function addMovieCardToFavoritesList(json) {
  //container
  let favoriteMovie = document.createElement('div');
  favoriteMovie.className = 'favoriteMovie';
  favoriteMoviesCard.append(favoriteMovie);

  let favoriteMovieMainWrap = document.createElement('div');
  favoriteMovieMainWrap.className = 'favoriteMovie__mainWrap';
  favoriteMovie.append(favoriteMovieMainWrap);

  //Poster
  let favoriteMovieImgWrap = document.createElement('div');
  favoriteMovieImgWrap.className = 'favoriteMovie__imgWrap';
  favoriteMovieMainWrap.append(favoriteMovieImgWrap);

  let favoriteMovieImgWrapItem = document.createElement('img');
  favoriteMovieImgWrapItem.className = 'favoriteMovie__imgWrap__item';
  if (json.Poster == 'N/A') {
    favoriteMovieImgWrapItem.setAttribute('src', defoltImg);
  } else {
    favoriteMovieImgWrapItem.setAttribute('src', json.Poster);
  }
  favoriteMovieImgWrap.append(favoriteMovieImgWrapItem);

  //Content
  let favoriteMovieContentWrap = document.createElement('div');
  favoriteMovieContentWrap.className = 'favoriteMovie__contentWrap';
  favoriteMovieMainWrap.append(favoriteMovieContentWrap);

  let favoriteMovieContentWrapTitle = document.createElement('p');
  favoriteMovieContentWrapTitle.className = 'favoriteMovie__contentWrap__title';
  favoriteMovieContentWrapTitle.innerText = json.Title;
  favoriteMovieContentWrap.append(favoriteMovieContentWrapTitle);

  let favoriteMovieContentWrapButton = document.createElement('button');
  favoriteMovieContentWrapButton.className =
    'results-card__button favoriteMovie__contentWrap__button';
  favoriteMovieContentWrapButton.innerText = 'more details';
  favoriteMovieContentWrap.append(favoriteMovieContentWrapButton);

  let favoriteMovieContentWrapButtonRemove = document.createElement('button');
  favoriteMovieContentWrapButtonRemove.className =
    'results-card__button favoriteMovie__contentWrap__button favoriteMovie__contentWrap__button--remove wasAdded';
  favoriteMovieContentWrapButtonRemove.innerText = 'remove from favorites';
  favoriteMovieContentWrap.append(favoriteMovieContentWrapButtonRemove);

  favoriteMovieContentWrapButton.addEventListener('click', function (e) {
    e.preventDefault();

    createDetailsCard(
      json.imdbID,
      favoriteMovie,
      favoriteMovieMainWrap,
      favoriteMovieContentWrapButtonRemove
    );
  });

  favoriteMovieContentWrapButtonRemove.addEventListener('click', function (e) {
    e.preventDefault();
    let sameSearchResult = document.querySelector(`.${json.imdbID}`);

    if (favoriteMovieContentWrapButtonRemove.classList.contains('wasAdded')) {
      favoriteMovieContentWrapButtonRemove.classList.remove('wasAdded');
      favoriteMovieContentWrapButtonRemove.innerText = 'Add to favorites';
      localStorage.removeItem(json.Title, json.imdbID);
      sameSearchResult.classList.remove('wasAdded');
      sameSearchResult.innerText = 'Add to favorites';
    } else {
      favoriteMovieContentWrapButtonRemove.innerText = 'Remove from favorites';
      favoriteMovieContentWrapButtonRemove.classList.add('wasAdded');
      sameSearchResult.classList.add('wasAdded');
      localStorage.setItem(json.Title, json.imdbID);
    }

    if (!favoriteMovieContentWrapButtonRemove.classList.contains('wasAdded')) {
      favoriteMovie.remove();

      let triger = document.querySelector('.favoriteMovie');

      if (!triger) {
        favoriteMoviesCard.classList.add('hiddenElement');
      }
    }
  });
}
