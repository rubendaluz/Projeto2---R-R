import { ip } from './config/config.js'; // Certifique-se de que o caminho está correto
import { Chart, registerables } from 'https://cdn.jsdelivr.net/npm/chart.js@4.3.0/dist/chart.umd.min.js';
Chart.register(...registerables);


document.addEventListener('DOMContentLoaded', async () => {
    // Gráfico de Pizza - Distribuição dos Ativos por Salas
    const roomChartCtx = document.getElementById('roomDistributionChart').getContext('2d');
    try {
        const roomChartResponse = await fetch(`http://${ip}:4242/api/statistics/room-distribution`);
        const roomChartData = await roomChartResponse.json();

        new Chart(roomChartCtx, {
            type: 'pie',
            data: {
                labels: roomChartData.labels, // Salas
                datasets: [{
                    label: 'Distribuição por Salas',
                    data: roomChartData.values, // Quantidade de ativos em cada sala
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
    } catch (error) {
        console.error('Error fetching room distribution data:', error);
    }

    // Gráfico de Pizza - Distribuição dos Ativos por Categorias
    const categoryChartCtx = document.getElementById('categoryDistributionChart').getContext('2d');
    try {
        const categoryChartResponse = await fetch(`http://${ip}:4242/api/statistics/category-distribution`);
        const categoryChartData = await categoryChartResponse.json();

        new Chart(categoryChartCtx, {
            type: 'pie',
            data: {
                labels: categoryChartData.labels, // Categorias
                datasets: [{
                    label: 'Distribuição por Categorias',
                    data: categoryChartData.values, // Quantidade de ativos em cada categoria
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
    } catch (error) {
        console.error('Error fetching category distribution data:', error);
    }
});