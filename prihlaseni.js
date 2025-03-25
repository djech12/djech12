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

