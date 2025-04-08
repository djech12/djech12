        // Získání elementů
        const loginBtn = document.getElementById("loginBtn");
        const registerBtn = document.getElementById("registerBtn");
        const loginForm = document.getElementById("loginForm");
        const registerForm = document.getElementById("registerForm");

        // Přepínání mezi formuláři
        loginBtn.addEventListener("click", () => {
            loginForm.classList.remove("hidden");
            registerForm.classList.add("hidden");
            loginBtn.classList.add("active");
            registerBtn.classList.remove("active");
        });

        registerBtn.addEventListener("click", () => {
            registerForm.classList.remove("hidden");
            loginForm.classList.add("hidden");
            registerBtn.classList.add("active");
            loginBtn.classList.remove("active");
        });



// REGISTRACE
document.querySelector('#registerForm form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('register-email').value.trim();
    const jmeno = document.getElementById('register-name').value.trim();
    const prijmeni = document.getElementById('register-surname').value.trim();
    const heslo = document.getElementById('register-password').value;
    const heslo2 = document.getElementById('register-password2').value;

    if (heslo !== heslo2) {
        alert('Hesla se neshodují!');
        return;
    }

    const data = {
        email,
        jmeno,
        prijmeni,
        heslo,
        heslo2
    };

    try {
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (res.ok) {
            alert('Registrace proběhla úspěšně!');
            loginForm.classList.remove("hidden");
            registerForm.classList.add("hidden");
            loginBtn.classList.add("active");
            registerBtn.classList.remove("active");
        } else {
            alert(result.message || 'Chyba při registraci.');
        }
    } catch (err) {
        console.error('Chyba:', err);
        alert('Něco se pokazilo.');
    }
});




// PŘIHLÁŠENÍ
document.querySelector('#loginForm form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const heslo = document.getElementById('login-password').value;

    const data = {
        email,
        heslo
    };

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (res.ok) {
            alert('Přihlášení úspěšné!');
            // tady si můžeš uložit token nebo session a přesměrovat uživatele
        } else {
            alert(result.message || 'Nesprávné přihlašovací údaje.');
        }
    } catch (err) {
        console.error('Chyba:', err);
        alert('Něco se pokazilo.');
    }
});

