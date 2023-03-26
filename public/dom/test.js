const toolsWrapper = document.querySelector(".tools-wrapper");
const viewTools = document.querySelectorAll(".viewTool");
const closeToolsWrapper = document.querySelector(".closeToolsWrapper");

viewTools.forEach((viewTool) => {
  viewTool.addEventListener("click", () => {
    toolsWrapper.classList.remove("hidden");
  });
});

closeToolsWrapper.addEventListener('click', ()=>{
  toolsWrapper.classList.add('hidden')
})