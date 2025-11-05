// PEQUEÑO JS PARA EL MENU DESPLEGABLE

const userIcon = document.querySelector('.user-icon');
const menu = document.querySelector('.menu-desplegable');

userIcon.addEventListener('click', () => {
    menu.classList.toggle('abrir-menu');
});