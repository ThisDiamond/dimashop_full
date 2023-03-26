const toolsWrapper = document.querySelector(".tools-wrapper");
const toolsWrapperClose = document.querySelector(".tools-wrapper-close")
const viewTools = document.querySelectorAll(".viewTool");
const view = document.querySelector(".view");

viewTools.forEach((viewTool) => {
  viewTool.addEventListener("click", () => {
    toolsWrapper.classList.remove("hidden");
    view.classList.remove("hidden");
  });
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

const viewEdit = document.querySelectorAll(".viewEdit");
viewEdit.forEach((button) => {
  // add a click event listener to the button
  button.addEventListener("click", () => {
    // get the product details for the clicked product
    const product = button.closest(".product");
    const title = product.querySelector(".product-th").textContent;
    const description = product.querySelector(".description").textContent;
    const idProduct = product.querySelector(".idProduct").textContent;
    const price = product.querySelector(".product-price").textContent;
    const image = product.querySelector(".product-img").getAttribute("src");

    // display the product details in the view section
    const viewSection = document.querySelector(".view");
    viewSection.innerHTML = `
${idProduct}
    <div class='view-edit-area'>
    <div>
       <img src="${image}" alt="${title}" />
       <h5 class="view-title">${title}</h5>
       <hr/>
       <p> ${description}</p>
       <p class='view-price'>Price: ${price}</p>
    </div>
    <div class='view-edit-form'>
    <form action="./add-products" method="post">
    <div class="form-floating mb-3">
      <input
        name="title"
        type="text"
        class="form-control"
        id="floatingInput"
        placeholder="title"
      />
      <label for="floatingInput">Title</label>
    </div>
    <div class="form-floating mb-3">
      <textarea
        name="description"
        class="form-control"
        placeholder="Description"
        id="floatingTextarea2"
        style="min-height: 250px"
      ></textarea>
      <label for="floatingTextarea2">Description</label>
    </div>
    <div class="form-floating mb-3">
      <input
        name="image"
        type="text"
        class="form-control"
        id="floatingInput"
        placeholder="image"
      />
      <label for="floatingInput">image</label>
    </div>
    <div class="input-group flex-nowrap">
      <span class="input-group-text bg-light" id="addon-wrapping">$</span>
      <input
        name="price"
        type="number"
        class="form-control"
        placeholder="Price"
        aria-label="Username"
        aria-describedby="addon-wrapping"
      />
    </div>
    <button class="btn btn-primary mt-3">Yuborish</button>
  </form>
    </div>
    </div>

    
    `;

    // show the tools wrapper and the view section
    const toolsWrapper = document.querySelector(".tools-wrapper");
    toolsWrapper.classList.remove("hidden");
    viewSection.classList.remove("hidden");
  });
});

toolsWrapperClose.addEventListener("click", () => {
  toolsWrapper.classList.add("hidden");
});