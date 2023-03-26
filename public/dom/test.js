const toolsWrapper = document.querySelector(".tools-wrapper");
const viewTools = document.querySelectorAll(".viewTool");
const view = document.querySelector(".view");

viewTools.forEach((viewTool) => {
  viewTool.addEventListener("click", () => {
    toolsWrapper.classList.remove("hidden");
    view.classList.remove("hidden");
  });
});

toolsWrapper.addEventListener("click", () => {
  toolsWrapper.classList.add("hidden");
});

const deleteBtns = document.querySelectorAll("#deleteBtn");
const deleteBtnActives = document.querySelectorAll(".deleteBtnActive");

for (let i = 0; i < deleteBtns.length; i++) {
  deleteBtns[i].addEventListener("click", () => {
    deleteBtnActives[i].classList.toggle("hidden");
  });
}

/***********************************************/
// get all the view buttons
const viewButtons = document.querySelectorAll(".viewTool");

// loop through each view button
viewButtons.forEach((button) => {
  // add a click event listener to the button
  button.addEventListener("click", () => {
    // get the product details for the clicked product
    const product = button.closest(".product");
    const title = product.querySelector(".product-th").textContent;
    const description = product.querySelector(".description").textContent;
    const price = product.querySelector(".product-price").textContent;
    const image = product.querySelector(".product-img").getAttribute("src");

    // display the product details in the view section
    const viewSection = document.querySelector(".view");
    viewSection.innerHTML = `
    <div class="products-head">
      <h2>View Product</h2>
      <button class="bg-blue view-edit-button">
        <i class="bi bi-pencil-square"></i>
        <span> Edit</span>
      </button>
    </div>
    <div class='view-product-area'>
      <img src="${image}" alt="${title}" />
      <div class='view-text-area'>
          <h5 class="view-title">${title}</h5>
          <hr/>
          <p> ${description}</p>
          <p class='view-price'>Price: ${price}</p>
      </div>
    </div>
    `;

    // show the tools wrapper and the view section
    const toolsWrapper = document.querySelector(".tools-wrapper");
    toolsWrapper.classList.remove("hidden");
    viewSection.classList.remove("hidden");
  });
});

// add click event listener to close button in the view section
const closeViewButton = document.querySelector(".closeToolsWrapper");
closeViewButton.addEventListener("click", () => {
  const toolsWrapper = document.querySelector(".tools-wrapper");
  const viewSection = document.querySelector(".view");
  toolsWrapper.classList.add("hidden");
  viewSection.classList.add("hidden");
});
