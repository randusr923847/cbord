function resizeImages() {
  let cards = document.querySelectorAll('.card');

  cards.forEach((card) => {
    let cardBody = card.querySelector('.card-body');
    let cardImg = card.querySelector('.card-img img');

    if (cardBody && cardImg) {
      let height = 0;

      Array.from(cardBody.children).forEach((item) => {
        height += item.offsetHeight;
      });

      cardImg.style.maxHeight = `calc(${height}px + 2rem)`;
    }
  });
}

window.addEventListener('load', resizeImages);
window.addEventListener('resize', resizeImages);
