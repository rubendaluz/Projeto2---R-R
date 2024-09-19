
// ****************************************************************************************************
// Declaracoes de variaveis globais
// ****************************************************************************************************

const btn_open_user_form = document.querySelector("#create_user_button")
const btn_add_user = document.querySelector("#create_user_submit")
const btn_close_user_form = document.querySelector("#close_user_form_btn")


import { ip } from './config/config.js';
import { showLoading, hideLoading } from './animations.js';

const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    //limpar user
    localStorage.removeItem("user");
    window.location.href = "../HTML/login.html";

}); 

// ****************************************************************************************************
// Event Listeners
// ****************************************************************************************************
document.addEventListener("DOMContentLoaded", (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "../HTML/login.html";
    }

    const user = JSON.parse(localStorage.getItem("user"));

    const userNameElement = document.querySelector(".user-name");
    const welcomeMSG = document.querySelector("#welcome_msg");
    
    console.log(user.name)
    // user exist
    if (user) {
        userNameElement.textContent = user.name;
        welcomeMSG.textContent = `Olá, bem-vindo de volta, ${user.name}`
    } else {
        window.location.href = "../HTML/login.html";
    }
    getAllUsers()

})

btn_open_user_form.addEventListener("click", () => {
    document.querySelector(".form-container").style.display = "block"
    document.querySelector(".form_title").textContent = "Adicionar Utilizador"
    document.querySelector("#create_user_submit").style.display = "block";
    document.querySelector("#edit_user_submit").style.display = "none";
})
btn_close_user_form.addEventListener("click", () => {
    document.querySelector(".form-container").style.display = "none"
})

btn_add_user.addEventListener("click", () => {
    console.log("Click")
    createUser()
})

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Funcoes 
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

function add_user_to_table(id, name, email, phone, accessLevel) {
    const table_body = document.querySelector("#users_table_body");

    // Cria um novo elemento <tr>
    const newRow = document.createElement('tr');
    
    // Define o conteúdo HTML da nova linha
    newRow.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${email}</td>
        <td>${phone}</td>
        <td>${accessLevel}</td>
        <td class="action-icons">
            <a href="#" title="Edit"><i class="fas fa-edit edit_user_btn" data-id="${id}"></i></a>
            <a href="#" title="Delete"><i class="fas fa-trash-alt delete_user_btn" data-id="${id}"></i></a>
        </td>
    `;

    // Anexa a nova linha ao corpo da tabela
    table_body.appendChild(newRow);

    // Adiciona eventos de clique para os botões de editar e excluir
    newRow.querySelector(`.edit_user_btn[data-id="${id}"]`).addEventListener('click', editUser);
    newRow.querySelector(`.delete_user_btn[data-id="${id}"]`).addEventListener('click', deleteUser);
}

function getAllUsers () {
    const baseUrl = `http://${ip}:4242/api/user/`;
    const url = new URL(baseUrl);
    
    showLoading();
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(users => {

            const tableBody = document.getElementById("users_table_body");
            tableBody.innerHTML = "";

            if (users && users.length > 0) {
                users.forEach(user => {
                    add_user_to_table(user["id"], user["name"], user["email"], user["phone"], user["access_level"]);
                });
                hideLoading();
            } else {
                console.log("Nenhum usuário encontrado na resposta da API.");
                hideLoading();
            }
        })
        .catch(error => {
            console.error(`Erro ao obter utilizadores: ${error.message}`);
            hideLoading();
        });
}

function createUser() {
    const name = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('number').value;
    const access_level = document.getElementById('role').value;
    document.getElementById('password').style.display = "block";
    document.getElementById('password_label').style.display = "block";
    const password = document.getElementById('password').value;

    const userData = {
        name, email, phone,access_level,password
    };

    // Send asset data to the server
    fetch(`http://${ip}:4242/api/user/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao registar utilizador: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Utilizador criado com sucesso:');
            // Reset the form
            document.getElementById('userForm').reset();
        })
        .catch(error => {
            console.error('Erro ao registar utilizador:', error);
            alert('Erro ao registar utilizador. Tente novamente.');
        });
}


let deleteUser = (event) => {
    const userId = event.target.getAttribute('data-id');
    const cancel_btn = document.querySelector("#cancel_btn")
    const confirm_btn = document.querySelector("#confirm_btn")
    const confirmation_form = document.querySelector("#delete_user_form")
    confirmation_form.style.display = "flex";


    cancel_btn.addEventListener("click", (e) => {
        confirmation_form.style.display = "none";

    })

    confirm_btn.addEventListener("click", (e) => {
        const apiUrl = `http://${ip}:4242/api/user/${userId}`;

        fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                console.log('User deleted successfully');
                confirmation_form.style.display = "none";
                getAllUsers();

            })
            .catch(error => {
                console.error('Error during user deletion:', error);
            });

    })
}

let editUser = (event) => {
    // Abrir o formulário
    document.querySelector(".form-container").style.display = "block";
    document.querySelector(".form_title").textContent = "Editar Ativo";
    
    document.querySelector("#create_user_submit").style.display = "none";
    document.querySelector("#edit_user_submit").style.display = "block";

    // Obter o ID do ativo
    const userId = event.target.getAttribute('data-id');
    
    // Preencher o formulário com os dados antigos
    fetch(`http://${ip}:4242/api/user/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            // Preencher campos com os dados correspondentes
            document.getElementById('nome').value = data.name;
            document.getElementById('email').value = data.email;
            document.getElementById('number').value = data.phone;
            document.getElementById('role').value = data.access_level;
            document.getElementById('password').style.display = "none";
            document.getElementById('password_label').style.display = "none";

        })
        .catch(error => {
            console.error('Error retrieving asset:', error);
        });

    // Adicionar um ouvinte de evento para o botão de salvar
    document.getElementById('edit_asset_submit').onclick = () => {
        const newName = document.getElementById('nome').value;
        const newEmail = document.getElementById('email').value = data.email;
        const newPhone = document.getElementById('number').value = data.phone;
        const newRole = document.getElementById('role').value = data.access_level;
        document.getElementById('userForm').reset();

        if (newName && newUhfTag && newRoom && newType) {
            // Fazer o request para atualizar o objeto
            fetch(`http://${ip}:4242/api/objects/${assetId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newName,
                    email: newEmail,
                    phone: newPhone,
                    access_level: newRole
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(`Asset with ID ${assetId} has been updated.`);
                // Atualizar a tabela com os novos dados
                const row = document.querySelector(`.edit_asset_btn[data-id="${assetId}"]`).closest('tr');
                row.querySelector('td:nth-child(2)').textContent = newName;
                row.querySelector('td:nth-child(3)').textContent = newEmail;
                row.querySelector('td:nth-child(4)').textContent = newPhone;
                row.querySelector('td:nth-child(5)').textContent = newRole;
            })
            .catch(error => {
                console.error('Error updating asset:', error);
            });
        } else {
            alert('All fields are required to edit the asset.');
        }
    };
}
