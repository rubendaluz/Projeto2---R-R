import { ip } from './config/config.js';
import { showLoading, hideLoading, showLoading2, showLoading3, showLoading4, hideLoading2, hideLoading3, hideLoading4 } from './animations.js';

const totalUsersCountElement = document.getElementById("totalUsersCount");
const totalAssetsCountElement = document.getElementById("totalAssetsCount");
const totalAlertsCountElement = document.getElementById("totalAlertsCount");



document.addEventListener("DOMContentLoaded", async () => {
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
    const totalUsersCard = document.getElementById("totalUsersCard");
    const totalAssetsCard = document.getElementById("totalAssetsCard");
    const totalAlertsCard = document.getElementById("totalalerts");

    totalUsersCard.addEventListener("click", function () {
        // Open the page for total users
        window.location.href = "users.html";
    });

    totalAssetsCard.addEventListener("click", function () {
        // Open the page for total assets
        window.location.href = "assets.html";
    });
    totalAlertsCard.addEventListener("click", function () {
        // Open the page for total assets
        window.location.href = "detections.html";
    });
    fetchStatistics()
    getRecentDetections()

    // Dados para o gráfico de pizza - Distribuição dos Ativos por Salas
    const roomChartCtx = document.getElementById('roomDistributionChart').getContext('2d');
    try {
        const roomChartResponse = await fetch(`http://${ip}:4242/api/statistics/room-distribution`);
        const roomChartData = await roomChartResponse.json();
        createChart(roomChartCtx, roomChartData, 'Distribuição por Salas');
    } catch (error) {
        console.error('Error fetching room distribution data:', error);
    }

    // Dados para o gráfico de pizza - Distribuição dos Ativos por Categorias
    const categoryChartCtx = document.getElementById('categoryDistributionChart').getContext('2d');
    try {
        const categoryChartResponse = await fetch(`http://${ip}:4242/api/statistics/category-distribution`);
        const categoryChartData = await categoryChartResponse.json();
        createChart(categoryChartCtx, categoryChartData, 'Distribuição por Categorias');
    } catch (error) {
        console.error('Error fetching category distribution data:', error);
    }
});


function fetchStatistics() {
    // Use a rota configurada no seu servidor

    const apiUrl = `http://${ip}:4242/api/statistics`;
    showLoading2();
    showLoading3();
    showLoading4();
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Atualize os elementos HTML com os dados recebidos
            totalUsersCountElement.textContent = data.usersCount;
            totalAssetsCountElement.textContent = data.assetsCount;
            totalAlertsCountElement.textContent = data.detectionsCount;
            hideLoading2();
            hideLoading3();
            hideLoading4();
        })
        .catch(error => console.error("Error fetching data:", error));
}

const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    //limpar user
    localStorage.removeItem("user");
    window.location.href = "../HTML/login.html";

});

function add_detection_to_table (id, object_name, object_tag, old_room_id,new_room_id, timestamp)  {
    const table_body = document.querySelector("#last_detections_table_body");

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

function getRecentDetections () {
    // const baseUrl = `http://${ip}:4242/api/detections/recent`;
    const baseUrl = `https://0479-2-83-109-238.ngrok-free.app/api/detections/recent`;
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
                    let timestampFormatado = formatarTimestamp(object.timestamp);
                    add_detection_to_table(object.id, object.object.name, object.object.uhfTag, object.old_room.room_name, object.new_room.room_name, timestampFormatado);
                    hideLoading();
                });
            } else {
                console.log("Nenhum ativo encontrado na resposta da API.");
                hideLoading();
            }
        })
        .catch(error => {
            console.error(`Erro ao obter ativos: ${error.message}`);
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

// Função para criar gráfico
    function createChart(ctx, chartData, chartLabel) {
        return new Chart(ctx, {
            type: 'pie',
            data: {
                labels: chartData.labels, // Rótulos
                datasets: [{
                    label: chartLabel,
                    data: chartData.values, // Valores
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw} ativos`;
                            }
                        }
                    }
                }
            }
        });
    }