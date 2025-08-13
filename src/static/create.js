const fileInput = document.getElementById('file');
const fileDisplay = document.getElementById('img-display');

const titleInput = document.getElementById('title');

window.onload = function () {
  titleInput.focus();
};

fileInput.addEventListener('change', function (event) {
  let file = event.target.files[0];
  console.log(file);

  if (file && file.type.startsWith('image/')) {
    let reader = new FileReader();

    reader.onload = function (e) {
      let dataUrl = e.target.result;
      fileDisplay.setAttribute('src', dataUrl);
    };

    reader.readAsDataURL(file);
    fileDisplay.classList.remove('no-image');
  }
});

titleInput.addEventListener('input', resizeTextarea);
window.addEventListener('resize', resizeTextarea);

function resizeTextarea() {
  titleInput.style.height = '72px';
  titleInput.style.height = titleInput.scrollHeight + 'px';
}
