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

////////////////////////////////////////////////////////////
const logoWide = document.querySelector(".logo-wide");
const logoNarrow = document.querySelector(".logo-narrow");

const menuIcon = document.querySelector(".menu-icon-btn");

const aside = document.querySelector("aside");
const menu = document.querySelector(".menu");
const menuItem = document.querySelectorAll(".menu-item");
const menuItemA = document.querySelectorAll(".menu-item-a");
const menuItemI = document.querySelectorAll(".menu-item-i");
const menuItemSpan = document.querySelectorAll(".menu-item-span");

menuIcon.addEventListener("click", () => {
  if (aside.classList.contains("wide")) {
    aside.classList.remove("wide");
    aside.style.width = "70px";
    logoNarrow.classList.toggle("hidden");
    logoWide.classList.toggle("hidden");
    products.style.gap = "10px";
  } else {
    aside.classList.add("wide");
    aside.style.width = "290px";
    logoWide.classList.toggle("hidden");
    logoNarrow.classList.toggle("hidden");
    products.style.gap = "18px";
  }
});
