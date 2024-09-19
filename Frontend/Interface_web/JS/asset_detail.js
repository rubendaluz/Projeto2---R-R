import { ip } from './config/config.js';

document.addEventListener("DOMContentLoaded", () => {
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
    
    const urlParams = new URLSearchParams(window.location.search);
    const assetId = urlParams.get('id');
    console.log(assetId)

    if (!assetId) {
        alert('No asset ID provided.');
        window.location.href = 'index.html'; // Redirect to the main page or asset list
        return;
    }

    // Fetch asset details
    fetch(`http://${ip}:4242/api/objects/${assetId}`)
        .then(response => {
            if (!response.ok) throw new Error('Error fetching asset details');
            return response.json();
        })
        .then(data => {
            document.getElementById('asset_id').textContent = data.id;
            document.getElementById('asset_name').textContent = data.name;
            document.getElementById('asset_uhfTag').textContent = data.uhfTag;
            document.getElementById('asset_type').textContent = data.objectType.name;
            document.getElementById('asset_room').textContent = data.room.room_name;
            document.getElementById('asset_description').textContent = data.description;
        })
        .catch(error => console.error('Error:', error));

    // Fetch detection history
    fetch(`http://${ip}:4242/api/detections/history/${assetId}`)
        .then(response => {
            if (!response.ok) throw new Error('Error fetching detection history');
            return response.json();
        })
        .then(data => {
            const historyTableBody = document.getElementById('history_table_body');
            data.forEach(detection => {
                const row = document.createElement('tr');
                let timestampFormatado = formatarTimestamp(detection.timestamp)
                row.innerHTML = `
                    
                    <td>${detection.old_room.room_name}</td>
                    <td>${detection.new_room.room_name}</td>
                    <td>${timestampFormatado}</td>
                `;
                historyTableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error:', error));

    document.getElementById('back_button').addEventListener('click', () => {
        window.location.href = 'index.html'; // Redirect to the main page or asset list
    });
});

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