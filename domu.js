
//MENU EFEKT
const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(item => item.addEventListener('click', () => {
    menuItems.forEach(item => item.classList.remove("active"));
    item.classList.add("active");
}))

//DALSI

const dalsiButton = menuItems[4];
const menuNav = document.querySelector(".navigation");
const domuCont = document.querySelector(".domu-container");

dalsiButton.addEventListener('click', function(){
    document.querySelector(".domu-days").style.display = "none";
    domuCont.style.background = "#1e1e1e";

    menuNav.style.borderRadius = "0";
    menuNav.style.borderLeft = "10px solid #d72638";
    menuNav.style.borderRight = "10px solid #d72638";
})

const adminDrop = document.querySelector(".admin");
const firstDropdown = document.querySelector(".first-dropdown-ul");
const adminIcon = document.querySelector(".admin i");
const secondDropdown = document.querySelector(".second-dropdown-ul");

firstDropdown.addEventListener("click", function(event) {
        if (event.target.closest(".admin")) { 
            const allItems = firstDropdown.querySelectorAll("li:not(.admin)"); 
            const isFirstHidden = allItems[0].style.opacity === "0"; 
            const isSecondVisible = secondDropdown.style.opacity === "1"; 

            if (!isFirstHidden && !isSecondVisible) { 
                // 1. Skryjeme firstDropdown a zobrazíme secondDropdown
                allItems.forEach(item => item.style.opacity = "0");
                secondDropdown.style.opacity = "1";
                adminIcon.style.transform = "rotate(90deg)";
            } else if (isSecondVisible) { 
                // 2. Skryjeme secondDropdown a vrátíme vše do původního stavu
                allItems.forEach(item => item.style.opacity = "1");
                secondDropdown.style.opacity = "0";
                adminIcon.style.transform = "rotate(0deg)";
            }
        }
});


