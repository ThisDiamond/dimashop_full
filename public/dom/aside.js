/* aside admin */

const changeVisProduct = document.querySelector("#changeVisProduct");
const changeVisProductitem = document.querySelector("#changeVisProductitem");

changeVisProduct.addEventListener("click", () => {
  if (changeVisProductitem.classList.contains("hidden")) {
    changeVisProductitem.classList.remove("hidden");
  } else {
    changeVisProductitem.classList.add("hidden");
  }
});
