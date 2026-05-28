const tabButtons = document.querySelectorAll(".tab-btn");
const pages = document.querySelectorAll(".page");

tabButtons.forEach(button => {

  button.addEventListener("click", () => {

    const target = button.dataset.page;

    pages.forEach(page => {
      page.classList.remove("active");
    });

    tabButtons.forEach(btn => {
      btn.classList.remove("active");
    });

    document.getElementById(target).classList.add("active");
    button.classList.add("active");

  });

});