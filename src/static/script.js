function resizeImages() {
  let cardBody = document.querySelector('.card-body');
  let cardImg = document.querySelector('.card-img img');

  if (cardBody && cardImg) {
    let height = 0;

    Array.from(cardBody.children).forEach((item) => {height += item.offsetHeight});

    cardImg.style.maxHeight = `calc(${height}px + 2rem)`;
  }
}

window.addEventListener('load', resizeImages);
window.addEventListener('resize', resizeImages);
