/*
Adapted from: https://thehelpfultipper.com/custom-input-dropdown-with-html-css-and-javascript/
*/

const dropdowns = document.querySelectorAll('.dropdown-container');

dropdowns.forEach((dropdownCont) => {
  // variables
  const input = dropdownCont.querySelector('.dropdown_input'),
    dropdown = dropdownCont.querySelector('.dropdown'),
    dropdownList = dropdownCont.querySelector('.dropdown_wrapper'),
    listItems = dropdownCont.querySelectorAll('.options span');

  console.log(listItems);

  // functions
  const addActiveClass = () => {
    dropdown.classList.toggle('active');
    dropdownList.classList.toggle('active');
  };

  const rmvActiveClass = () => {
    // Removes active class
    dropdown.classList.remove('active');
    dropdownList.classList.remove('active');
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
      console.log('test');
      let val = e.target.innerHTML;
      input.value = val;
    });
  });
});
