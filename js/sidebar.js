// Sidebar movil — toggle del overlay deslizante
// Port del componente 21st "sidebar" (id 1075, manuarora700)
(function () {
  const overlay = document.getElementById("overlay");
  const menuBtn = document.getElementById("menu-btn");
  const closeBtn = document.getElementById("close-btn");

  menuBtn.addEventListener("click", () => overlay.classList.add("open"));
  closeBtn.addEventListener("click", () => overlay.classList.remove("open"));
})();