/* Revelado al hacer scroll (estilo efferd footer-section): fade + subida escalonada.
   El CSS solo estiliza .reveal (los marca este script), asi que sin JS nada queda oculto. */
const items = document.querySelectorAll("[data-reveal]");

if (items.length && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) en.target.classList.add("in");
        else en.target.classList.remove("in");
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((el) => {
    el.classList.add("reveal");
    io.observe(el);
  });
} else {
  items.forEach((el) => el.classList.add("in"));
}