var tags = Array.from(document.getElementById("tags-cont").children);
var tag_arr = [];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function select(tag) {
  if (tag.hasAttribute("aria-selected")) {
    tag.removeAttribute("aria-selected");

    let ind = tag_arr.indexOf(tag.textContent);

    if (ind > -1) {
      tag_arr.splice(ind, 1);
    }

    if (tag_arr.length < 3) {
      enableNonSelected();
    }
  }
  else {
    tag.setAttribute("aria-selected", "true");
    tag_arr.push(tag.textContent);

    if (tag_arr.length == 3) {
      disableNonSelected();
    }
  }
}

function disableNonSelected() {
  tags.forEach((tag) => {
    if (!tag.hasAttribute("aria-selected")) {
      tag.setAttribute("disabled", "");
    }
  });
}

function enableNonSelected() {
  tags.forEach((tag) => {
    if (tag.hasAttribute("disabled")) {
      tag.removeAttribute("disabled");
    }
  });
}
