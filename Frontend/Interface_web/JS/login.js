
import { ip } from './config/config.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const btnLogin = document.getElementById('btnLogin');
    const formErrorMessage = document.getElementById('formErrorMessage');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const error_message = document.querySelector(".form-error");
        error_message.innerHTML ='';

        // Defina a URL do endpoint de login
        // const url = `http://${ip}:4242/api/user/login`;
        const url = `https://0479-2-83-109-238.ngrok-free.app/api/user/login`;
        const data = { email, password };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`Erro no login: ${response.status}`);
            }

            const result = await response.json();
            const token = result.token;

            // Salvar token e informações do usuário no localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(result.user));

            console.log(token);
            error_message.style.display = "none";

            // Redirecionar para a página de acesso restrito
            window.location.href = "../HTML/dashboard.html";
        } catch (error) {
            console.error(error.message);
            error_message.innerHTML += `<p style="color: red;">Credenciais inválidas. Tente novamente</p>`;
        }
    });
});
