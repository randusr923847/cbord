// eslint-disable-next-line @typescript-eslint/no-unused-vars
function logView() {
  try {
    fetch(`/api/view`, {
      method: 'POST',
      mode: 'same-origin',
      credentials: 'same-origin',
    });
  } catch (err) {
    console.log(err);
  }
}
