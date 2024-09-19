import { ip } from './config/config.js';
import { showLoading, hideLoading } from './animations.js';

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
    getAllDetections()

})


function add_detection_to_table (id, object_name, object_tag, old_room_id,new_room_id, timestamp)  {
    const table_body = document.querySelector("#assets_table_body");

    table_body.innerHTML += `
        <tr>
           
            <td>${id}</td>
            <td>${object_name}</td>
            <td>${object_tag}</td>
            <td>${old_room_id}</td>
            <td>${new_room_id}</td>
            <td>${timestamp}</td>
        </tr>
    `
}

function getAllDetections () {
    const baseUrl = `http://${ip}:4242/api/detections/`;
    const url = new URL(baseUrl);
    showLoading()
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
                    let timestampFormatado = formatarTimestamp(object.timestamp);
                    add_detection_to_table(object.id, object.object.name, object.object.uhfTag,object.old_room.room_name, object.new_room.room_name, timestampFormatado);
                });
            } else {
                console.log("Nenhum ativo encontrado na resposta da API.");
            }
            hideLoading()
        })
        .catch(error => {
            console.error(`Erro ao obter ativos: ${error.message}`);
            hideLoading();
        });
}

function formatarTimestamp(timestamp) {
    const date = new Date(timestamp);
          const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: 'UTC'
          };
    const formattedTimestamp = new Intl.DateTimeFormat('pt-BR', options).format(date);
    return formattedTimestamp;
}