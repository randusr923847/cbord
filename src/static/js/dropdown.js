/*
Adapted from: https://thehelpfultipper.com/custom-input-dropdown-with-html-css-and-javascript/
*/

const dropdowns = document.querySelectorAll('.dropdown-container');
// const dropdownHeight = 200;

dropdowns.forEach((dropdownCont) => {
  // variables
  const input = dropdownCont.querySelector('.dropdown_input'),
    dropdown = dropdownCont.querySelector('.dropdown'),
    dropdownList = dropdownCont.querySelector('.dropdown_wrapper'),
    listItems = dropdownCont.querySelectorAll('.options span');

  // functions
  const positionDropdown = () => {
    let rect = input.getBoundingClientRect();
    // let vh = window.innerHeight;

    dropdownList.style.top = `${rect.bottom + 5}px`;
    dropdownList.style.left = `${rect.left}px`;
    dropdownList.style.width = `${rect.width}px`;
  };

  const addActiveClass = () => {
    positionDropdown();
    dropdown.classList.toggle('active');
    dropdownList.classList.toggle('active');
  };

  const rmvActiveClass = () => {
    // Removes active class
    dropdown.classList.remove('active');
    dropdownList.classList.remove('active');
  };

  const updatePosition = () => {
    if (dropdownList.classList.contains('active')) {
      positionDropdown();
    }
  };

  input.addEventListener('focus', addActiveClass);
  input.addEventListener('blur', () => {
    setTimeout(rmvActiveClass, 250);
  });
  // input.addEventListener("click", addActiveClass);
  input.addEventListener('input', () => {
    dropdown.classList.add('active');
    dropdownList.classList.add('active');
  });

  window.addEventListener('scroll', updatePosition);
  window.addEventListener('resize', updatePosition);

  document.addEventListener('click', (e) => {
    // Check clicked outside of input
    if (
      !e.target.classList.contains('dropdown_input') &&
      e.target.classList.contains('dropdown_wrapper') === false
    ) {
      rmvActiveClass();
    }
  });

  listItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      let val = e.target.innerHTML;
      input.value = val;

      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
  });
});
