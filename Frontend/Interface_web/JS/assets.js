import { ip } from './config/config.js';
import { showLoading, hideLoading } from './animations.js';

const btn_open_asset_form = document.querySelector("#create_asset_button")
const btn_add_asset = document.querySelector("#create_asset_submit")
const btn_close_asset_form = document.querySelector("#close_asset_form_btn")

// Onloanding function

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
    getAllAssests()

    const urlSalas = `http://${ip}:4242/api/rooms/getallrooms`;
    const urlTiposObjeto = `http://${ip}:4242/api/objecttype`;

    // Função para popular select com opções
    function popularSelectSalas(selectElement, options) {
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.id;
            optionElement.textContent = "Piso " + option.floor + " - " + option.room_name;
            selectElement.appendChild(optionElement);
        });
    }
    function popularSelectTypes(selectElement, options) {
        options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.id;
            optionElement.textContent = option.name;
            selectElement.appendChild(optionElement);
        });
    }

    // Fazer requisição para obter as salas
    fetch(urlSalas)
        .then(response => response.json())
        .then(data => {
            const salaSelect = document.getElementById('sala');
            popularSelectSalas(salaSelect, data);
        })
        .catch(error => console.error('Erro ao obter salas:', error));

    // Fazer requisição para obter os tipos de objeto
    fetch(urlTiposObjeto)
        .then(response => response.json())
        .then(data => {
            const tipoObjetoSelect = document.getElementById('tipoObjeto');
            popularSelectTypes(tipoObjetoSelect, data);
        })
        .catch(error => console.error('Erro ao obter tipos de objeto:', error));
})

// Event listeners
btn_open_asset_form.addEventListener("click", () => {
    document.querySelector(".form-container").style.display = "block"
    document.querySelector(".form_title").textContent = "Adicionar Ativo"
    document.querySelector("#create_asset_submit").style.display = "block";
    document.querySelector("#edit_asset_submit").style.display = "none";
})
btn_close_asset_form.addEventListener("click", () => {
    document.querySelector(".form-container").style.display = "none"
})

btn_add_asset.addEventListener("click", () => {
    console.log("Click")
    createAsset()
})

document.querySelector("#btn_read_uhf").addEventListener("click", () => {
    readUhfTag()
})

async function readUhfTag() {
    document.getElementById('statusMessage').textContent = 'Aguardando tag UHF...';
            try {
                const response = await fetch(`http://${ip}:4242/api/objects/addTag`, {
                    method: 'POST',
                });
                
                if (!response.ok) {
                    throw new Error('Erro ao adicionar tag UHF');
                }
                
                const data = await response.json();
                
                if (data.success) {
                    document.getElementById('uhfTag').value = data.uhfTag;
                    document.getElementById('statusMessage').textContent = 'Tag UHF adicionada com sucesso!';
                } else {
                    document.getElementById('statusMessage').textContent = data.message;
                }
            } catch (error) {
                document.getElementById('statusMessage').textContent = error.message;
            }
}

function createAsset() {
    const name = document.getElementById('nome').value;
    const room_id = document.getElementById('sala').value;
    const object_type_id = document.getElementById('tipoObjeto').value;
    const description = document.getElementById('descricao').value;
    const uhfTag = document.getElementById('uhfTag').value;

    const assetData = {
        name,
        room_id,
        object_type_id,
        description,
        uhfTag
    };

    console.log('Criando ativo:', assetData);

    // Send asset data to the server
    fetch(`http://${ip}:4242/api/objects/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(assetData),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao criar ativo: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('Ativo criado com sucesso:', data);
            alert('Ativo criado com sucesso!');
            // Reset the form
            document.getElementById('assetForm').reset();
        })
        .catch(error => {
            console.error('Erro ao criar ativo:', error);
            alert('Erro ao criar ativo. Tente novamente.');
        });
}

function add_object_to_table(id, name, uhfTag, room, type) {
    const table_body = document.querySelector("#assets_table_body");

    // Cria um novo elemento <tr>
    const newRow = document.createElement('tr');
    
    // Define o conteúdo HTML da nova linha
    newRow.innerHTML = `
        <td>${id}</td>
        <td>${name}</td>
        <td>${uhfTag}</td>
        <td>${type}</td>
        <td>${room}</td>
        <td class="action-icons">
            <a href="asset_detail.html?id=${id}" title="Ver Detatalhes"><i class="fas fa-info-circle view_details_btn" data-id="${id}"></i></a>
            <a href="#" title="Edit"><i class="fas fa-edit edit_asset_btn" data-id="${id}"></i></a>
            <a href="#" title="Delete"><i class="fas fa-trash-alt delete_asset_btn" data-id="${id}"></i></a>
        </td>
    `;

    // Anexa a nova linha ao corpo da tabela
    table_body.appendChild(newRow);

    // Adiciona eventos de clique para os botões de editar e excluir
    newRow.querySelector(`.edit_asset_btn[data-id="${id}"]`).addEventListener('click', editAsset);
    newRow.querySelector(`.delete_asset_btn[data-id="${id}"]`).addEventListener('click', deleteAsset);
}


function getAllAssests () {
    const baseUrl = `http://${ip}:4242/api/objects/`;
    const url = new URL(baseUrl);
    showLoading();
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(objects => {

            
            if (objects && objects.length > 0) {
                objects.forEach(object => {
                    add_object_to_table(object.id, object.name,object.uhfTag, object.room.room_name, object.objectType.name);
                });
            } else {
                console.log("Nenhum ativo encontrado na resposta da API.");
            }
            hideLoading();
        })
        .catch(error => {
            console.error(`Erro ao obter ativos: ${error.message}`);
            hideLoading();
        });
}

let editAsset = (event) => {
    // Abrir o formulário
    document.querySelector(".form-container").style.display = "block";
    document.querySelector(".form_title").textContent = "Editar Ativo";
    
    document.querySelector("#create_asset_submit").style.display = "none";
    document.querySelector("#edit_asset_submit").style.display = "block";

    // Obter o ID do ativo
    const assetId = event.target.getAttribute('data-id');
    
    // Preencher o formulário com os dados antigos
    fetch(`http://${ip}:4242/api/objects/${assetId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            // Preencher campos com os dados correspondentes
            document.getElementById('nome').value = data.name;
            console.log(data)
            document.getElementById('sala').value = data.room_id;
            document.getElementById('tipoObjeto').value = data.object_type_id;
            document.getElementById('descricao').value = data.description;
            document.getElementById('uhfTag').value = data.uhfTag;
        })
        .catch(error => {
            console.error('Error retrieving asset:', error);
        });

    // Adicionar um ouvinte de evento para o botão de salvar
    document.getElementById('edit_asset_submit').onclick = () => {
        const newName = document.getElementById('nome').value;
        const newRoom = document.getElementById('sala').value;
        const newType = document.getElementById('tipoObjeto').value;
        const newDescription = document.getElementById('descricao').value;
        const newUhfTag = document.getElementById('uhfTag').value;

        if (newName && newUhfTag && newRoom && newType) {
            // Fazer o request para atualizar o objeto
            fetch(`http://${ip}:4242/api/objects/${assetId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: newName,
                    room_id: newRoom,
                    object_type_id: newType,
                    description: newDescription,
                    uhfTag: newUhfTag
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(`Asset with ID ${assetId} has been updated.`);
                // Atualizar a tabela com os novos dados
                const row = document.querySelector(`.edit_asset_btn[data-id="${assetId}"]`).closest('tr');
                row.querySelector('td:nth-child(2)').textContent = newName;
                row.querySelector('td:nth-child(3)').textContent = newUhfTag;
                row.querySelector('td:nth-child(4)').textContent = newType;
                row.querySelector('td:nth-child(5)').textContent = newRoom;
            })
            .catch(error => {
                console.error('Error updating asset:', error);
            });
        } else {
            alert('All fields are required to edit the asset.');
        }
    };
};


let deleteAsset = (event) => {
    const assetId = event.target.getAttribute('data-id');
    console.log(`Delete asset with ID: ${assetId}`);
     const cancel_btn = document.querySelector("#cancel_btn")
    const confirm_btn = document.querySelector("#confirm_btn")
    const confirmation_form = document.querySelector("#delete_asset_form")
    confirmation_form.style.display = "flex";

    cancel_btn.addEventListener("click", (e) => {
        confirmation_form.style.display = "none";
    })

    // Confirmar a exclusão do objeto

    confirm_btn.addEventListener("click", (e) => {
        // Fazer o request para excluir o objeto
        fetch(`http://${ip}:4242/api/objects/${assetId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                console.log(`Asset with ID ${assetId} has been deleted.`);
                // Remover a linha da tabela
                const row = document.querySelector(`.delete_asset_btn[data-id="${assetId}"]`).closest('tr');
                row.remove();
            } else {
                console.error('Error deleting asset:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Error deleting asset:', error);
        });
        confirmation_form.style.display = "none";
    })
}

