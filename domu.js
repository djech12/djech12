
//MENU EFEKT
const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach(item => item.addEventListener('click', () => {
    menuItems.forEach(item => item.classList.remove("active"));
    item.classList.add("active");
    menuNav.style.borderTopLeftRadius = "35px";
    menuNav.style.borderTopRightRadius = "35px";
    menuNav.style.border = "none";
}))



//DOMU
const domuButton = menuItems[0];

domuButton.addEventListener('click', function(){
    document.querySelector("#domu-days").style.display = "block";
    domuCont.style.background = "f8f8f8";
})



//TODAY
const denElement = document.getElementById('aktualni-den');

const dny = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];

let aktualniDatum = new Date();

function zobrazDatum(datum) {
    const denVTydnu = dny[datum.getDay()];
    const den = String(datum.getDate()).padStart(2, '0');
    const mesic = String(datum.getMonth() + 1).padStart(2, '0');
    const rok = datum.getFullYear();
    denElement.textContent = `${denVTydnu} ${den}.${mesic}.${rok}`;
}
zobrazDatum(aktualniDatum);



//CHANGE DAY
const dayBefore = document.querySelector(".fa-arrow-left");
const dayAfter = document.querySelector(".fa-arrow-right");

dayBefore.addEventListener('click', () => {
    aktualniDatum.setDate(aktualniDatum.getDate() - 1);
    zobrazDatum(aktualniDatum);
    nactiTreninkyNaDatum(aktualniDatum.toISOString().split('T')[0]);
});

dayAfter.addEventListener('click', () => {
    aktualniDatum.setDate(aktualniDatum.getDate() + 1);
    zobrazDatum(aktualniDatum);
    nactiTreninkyNaDatum(aktualniDatum.toISOString().split('T')[0]);
});



//VYPIS TRENINKU
function ziskejDnesniDatum() {
    const dnes = new Date();
    return dnes.toISOString().split('T')[0]; // "2025-04-06"
}

async function nactiTreninkyNaDatum(datum) {
    try {
        const response = await fetch(`/api/treninky?datum=${datum}`);
        const treninky = await response.json();
        zobrazTreninky(treninky);
    } catch (error) {
        console.error('Chyba při načítání tréninků:', error);
    }
}

function zobrazTreninky(treninky) {
    const container = document.querySelector('.treninky-container');
    container.innerHTML = ''; // vyčistíme staré záznamy

    if (treninky.length === 0) {
        container.textContent = 'Žádné tréninky na tento den.';
        return;
    }

    treninky.forEach(trenink => {
        const div = document.createElement('div');
        div.classList.add('trenink');

        div.innerHTML = `
        <div class="trenink-content">
            <h3>${trenink.sport} - ${trenink.podnazev}</h3>
            <p>${trenink.gym}</p>
            <p>${trenink.trener}</p>
            <p>${JSON.parse(trenink.kategorie).join(', ')} | ${JSON.parse(trenink.dovednost).join(', ')}</p>
            <h4>${trenink.zacatek.slice(0,5)} - ${trenink.konec.slice(0,5)}</h4>
        </div>
            <button class="trenink-btn" data-id="${trenink.id}"><i class="fa-solid fa-circle-plus"></i></button>
        `;

        container.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const dnesniDatum = ziskejDnesniDatum();
    nactiTreninkyNaDatum(dnesniDatum);
});

//PRIHLAS TRENINK
document.addEventListener('click', function (event) {
    // Zjisti, jestli bylo kliknuto na ikonku přihlášení
    if (event.target.classList.contains('fa-circle-plus')) {
        const btn = event.target.closest('.trenink-btn');
        btn.innerHTML = '<i class="fa-solid fa-circle-minus"></i>';
        btn.classList.add('trenink-prihlasen');
        btn.classList.remove('trenink-odhlasen');
    }

    // Zjisti, jestli bylo kliknuto na ikonku odhlášení
    if (event.target.classList.contains('fa-circle-minus')) {
        const btn = event.target.closest('.trenink-btn');
        btn.innerHTML = '<i class="fa-solid fa-circle-plus"></i>';
        btn.classList.add('trenink-odhlasen');
        btn.classList.remove('trenink-prihlasen');
    }
});


//DALSI
const dalsiButton = menuItems[4];
const menuNav = document.querySelector(".navigation");
const domuCont = document.querySelector(".domu-container");

dalsiButton.addEventListener('click', function(){
    document.querySelector("#domu-days").style.display = "none";
    document.querySelector(".first-dropdown-ul").style.display ="flex";
    domuCont.style.background = "#1e1e1e";

    menuNav.style.borderRadius = "0";
    menuNav.style.borderLeft = "10px solid #d72638";
    menuNav.style.borderRight = "10px solid #d72638";
})



//DROPDOWNS
document.addEventListener("DOMContentLoaded", function () {
    const adminButton = document.querySelector(".admin");
    const firstDropdown = document.querySelector(".first-dropdown-ul");
    const secondDropdown = document.querySelector(".second-dropdown-ul");
    const adminIcon = document.querySelector(".admin i");


    adminButton.addEventListener("click", function () {
        if (secondDropdown.style.display === "flex") {
            // Reset - zobrazíme první seznam, skryjeme druhý
            firstDropdown.querySelectorAll("li").forEach(li => li.style.display = "flex");
            secondDropdown.style.display = "none";
            adminIcon.style.transform = "rotate(0deg)";
        } else {
            // Skrytí všech li prvků v prvním seznamu kromě admin tlačítka
            firstDropdown.querySelectorAll("li:not(.admin)").forEach(li => li.style.display = "none");

            // Zobrazení druhého seznamu
            secondDropdown.style.display = "flex";

            adminIcon.style.transform = "rotate(90deg)";
        }
    });
});


