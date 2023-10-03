  const intro = document.querySelector('.intro');
  const logo = document.querySelector('.logo');
  const logoImg = document.querySelector('.logo img');
  const text = document.querySelector('.text-content');
  // const song = document.createElement('audio');
  // song.setAttribute('src','https://raw.githubusercontent.com/barionleg/starwars/master/audio/Star_Wars_original_opening_crawl_1977.ogg');
  // song.setAttribute('src','https://raw.githubusercontent.com/barionleg/starwars/master/audio/Star_Wars_original_opening_crawl_1977.mp3');
  var moveTextRequest;

  document.querySelector('.logo img').addEventListener('animationend', (e) => {
    logo.classList.add('hide');
  });

  const initialPosition = window.innerHeight;
  let currentPosition = initialPosition;
  const exit = -(text.offsetHeight + 50)
  const velocity = 0.5;

  function moveText() {

    // console.log({initialPosition,currentPosition,exit});

    text.style.transform = `rotateX(20deg) translateY(${currentPosition}px)`;
    currentPosition -= velocity;

    if (currentPosition < exit) {
      text.classList.add('fade-out');
      cancelAnimationFrame(moveTextRequest);
      console.log("End");
    } else {
      moveTextRequest = requestAnimationFrame(moveText);
    }
  }

  function start() {

    intro.classList.remove('hide');
    currentPosition = initialPosition;

    // Hide intro and play logo
    setTimeout(() => {
      intro.classList.add('hide');
      logo.classList.remove('hide');
      logoImg.classList.add('shrink');
      song.play();

      setTimeout(() => {
        text.parentElement.classList.remove('fade-out');
        moveTextRequest = requestAnimationFrame(moveText);
      }, 500);

    }, 3000)

  }

  start();
