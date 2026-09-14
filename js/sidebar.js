// Sidebar movil — hamburguesa <-> X y cierre con el boton atras del celular
(function () {
  const overlay = document.getElementById("overlay");
  const menuBtn = document.getElementById("menu-btn");

  const isOpen = () => overlay.classList.contains("open");

  const closeMenu = () => {
    overlay.classList.remove("open");
    menuBtn.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    overlay.classList.add("open");
    menuBtn.classList.add("open");
    menuBtn.setAttribute("aria-expanded", "true");
    // entrada en el historial: el boton atras cierra el menu en vez de salir de la pagina
    history.pushState({ menu: true }, "");
  };

  menuBtn.addEventListener("click", () => (isOpen() ? closeMenu() : openMenu()));

  // Android/iOS: gesto atras cierra el menu si esta abierto
  window.addEventListener("popstate", () => {
    if (isOpen()) closeMenu();
  });
})();