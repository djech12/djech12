
//MENU EFEKT
const menuItems = document.querySelectorAll(".menu-item");
const logo1 = document.querySelector(".logo1");
const contBack = document.querySelector("#container-back");

menuItems.forEach(item => item.addEventListener('click', () => {
    menuItems.forEach(item => item.classList.remove("active"));
    item.classList.add("active");
    menuNav.style.borderTopLeftRadius = "35px";
    menuNav.style.borderTopRightRadius = "35px";
    menuNav.style.border = "none";


   //ROZVRH MENU
   const rozvrhButton = document.querySelector(".rozvrh-button");
   const rozvrhCont = document.querySelector(".rozvrh-container");

   if(rozvrhButton.classList.contains("active")){
      domuCont.style.display = "none";
      rozvrhCont.style.display = "flex";
      logo1.style.display = "none";
      contBack.style.maxHeight = "180vh";
      document.querySelector("body").style.OverflowY = "scroll";
   }

}))

//DOCHAZKA 
const dochazkaButton = menuItems[2];
const dochazkaCont = document.querySelector(".dochazka-container");

dochazkaButton.addEventListener('click', function(){
    logo1.style.display = "none";
    domuCont.style.display = "none";
    rozvrhCont.style.display = "none";
    document.querySelector(".first-dropdown-ul").style.display ="none";
    document.querySelector(".second-dropdown-ul").style.display = "none";

    dochazkaCont.style.display = "flex";
})




const domuButton = menuItems[0];
const menuNav = document.querySelector(".navigation");
const domuCont = document.querySelector(".domu-container");

//DOMU (Z DALSI)
domuButton.addEventListener('click', function(){
    document.querySelector("#domu-days").style.display = "block";
    domuCont.style.background = "#f8f8f8";
    document.querySelector(".first-dropdown-ul").style.display ="none";
    document.querySelector(".second-dropdown-ul").style.display = "none";
    document.querySelector("body").style.overflowY = "scroll";

        
        const treninky = document.querySelectorAll('.trenink');
        treninky.forEach(trenink => {
            trenink.style.display = ""; 
        });
})

//DOMU (Z ROZVRH)
domuButton.addEventListener('click', function(){
    const rozvrhCont = document.querySelector(".rozvrh-container");

    document.querySelector("#domu-days").style.display = "block";
    rozvrhCont.style.display = "none";
    logo1.style.display = " ";
    contBack.style.maxHeight = "100vh";
})


//USERNAME
window.addEventListener('DOMContentLoaded', () => {
    const uzivatel = JSON.parse(sessionStorage.getItem('user'));

    if (uzivatel && uzivatel.jmeno && uzivatel.prijmeni) {
        document.getElementById('username').innerHTML = `${uzivatel.jmeno} ${uzivatel.prijmeni}`;
    } else {
        //window.location.href = 'prihlaseni.html';
    }
});

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
let dayBefore = document.querySelector(".fa-arrow-left");
let dayAfter = document.querySelector(".fa-arrow-right");

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

        document.querySelector(".trenink-rozvrh").innerHTML = `
        
            <h3>${trenink.sport} - ${trenink.podnazev}</h3>

            <p>${JSON.parse(trenink.kategorie).join(', ')} | ${JSON.parse(trenink.dovednost).join(', ')}</p>
            
        `;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const dnesniDatum = ziskejDnesniDatum();
    nactiTreninkyNaDatum(dnesniDatum);
});

//PRIHLAS TRENINK
document.addEventListener('click', function (event) {
    //Přihlášení
    if (event.target.classList.contains('fa-circle-plus')) {
        const btn = event.target.closest('.trenink-btn');
        btn.innerHTML = '<i class="fa-solid fa-circle-minus"></i>';
        btn.classList.add('trenink-prihlasen');
        btn.classList.remove('trenink-odhlasen');
    }

    //Odhlášení
    if (event.target.classList.contains('fa-circle-minus')) {
        const btn = event.target.closest('.trenink-btn');
        btn.innerHTML = '<i class="fa-solid fa-circle-plus"></i>';
        btn.classList.add('trenink-odhlasen');
        btn.classList.remove('trenink-prihlasen');
    }
});

const prihlTren = document.querySelectorALL(".trenink-btn");

if (prihlTren.classList.contains(".trenink-prihlasen")){
    const dochazkaTren = document.createElement("div");
    dochazkaTren.classList.add("trenink-dochazka")
}

//ROZVRH//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



//CHANGE MONTH
const mesice = [
  'Leden', 'Únor', 'Březen', 'Duben', 'Květen', 'Červen',
  'Červenec', 'Srpen', 'Září', 'Říjen', 'Listopad', 'Prosinec'
];

const mesicElement = document.getElementById('aktualni-mesic');
const grid = document.getElementById("mesicni-grid");

function zobrazMesic(datum) {
    const mesic = datum.getMonth();
    const rok = datum.getFullYear();
    mesicElement.textContent = `${mesice[mesic]} ${rok}`;

    // Začátek měsíce
    const zacatek = new Date(rok, mesic, 1);
    const pocatecniDen = (zacatek.getDay() + 6) % 7;

    const pocetDni = new Date(rok, mesic + 1, 0).getDate();

    grid.innerHTML = "";

    // Prázdné dny před začátkem měsíce
    for (let i = 0; i < pocatecniDen; i++) {
      grid.innerHTML += `<div></div>`;
    }

    // Vykresli každý den v měsíci
    for (let den = 1; den <= pocetDni; den++) {
      const datumStr = `${rok}-${String(mesic + 1).padStart(2, '0')}-${String(den).padStart(2, '0')}`;
      grid.innerHTML += `<div data-datum="${datumStr}">
        <strong>${den}</strong>
        <div class="trenink-rozvrh"></div>
      </div>`;
    }

    //nactiTreninkyMesicne(rok, mesic + 1); // Zde načti tréninky pro daný měsíc
  }

document.querySelector('.month-prev').addEventListener('click', () => {
  aktualniDatum.setMonth(aktualniDatum.getMonth() - 1);
  zobrazMesic(aktualniDatum);
  //nactiTreninkyNaDatum(`${aktualniDatum.getFullYear()}-${String(aktualniDatum.getMonth() + 1).padStart(2, '0')}-01`);
});

document.querySelector('.month-next').addEventListener('click', () => {
  aktualniDatum.setMonth(aktualniDatum.getMonth() + 1);
  zobrazMesic(aktualniDatum);
  //nactiTreninkyNaDatum(`${aktualniDatum.getFullYear()}-${String(aktualniDatum.getMonth() + 1).padStart(2, '0')}-01`);
});

zobrazMesic(aktualniDatum);





//DALSI
const dalsiButton = menuItems[4];

dalsiButton.addEventListener('click', function(){
    document.querySelector("#domu-days").style.display = "none";
    document.querySelector(".first-dropdown-ul").style.display ="flex";
    document.querySelector("body").style.overflow = "hidden";
    domuCont.style.background = "#1e1e1e";
    const treninky = document.querySelectorAll('.trenink');

    treninky.forEach(trenink => {
        trenink.style.display = "none";
    });

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


