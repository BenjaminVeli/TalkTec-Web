import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { getWeeklyUserRegistrations } from "../../../api/users";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const UsersWeek = () => {
    const [userStats, setUserStats] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUserRegistrations();
    }, []);

    const fetchUserRegistrations = async () => {
        setLoading(true);
        try {
            const data = await getWeeklyUserRegistrations();  // Usamos la función del archivo users.js
            setUserStats(data.weekly_user_registrations);  // Ajusta según la estructura de la respuesta
        } catch (err) {
            setError('Error fetching user registrations: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const data = {
        labels: userStats.map(stat => stat.day),
        datasets: [
            {
                label: 'Número de usuarios',
                data: userStats.map(stat => stat.count),
                backgroundColor: (context) => {
                    const chart = context.chart;
                    const {ctx, chartArea} = chart;
                    if (!chartArea) {
                        return null;
                    }
                    const gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
                    gradient.addColorStop(0, 'rgba(75, 192, 192, 0.1)');     // Transparente abajo
                    gradient.addColorStop(1, 'rgba(75, 192, 192, 0.8)');   // Semi-transparente arriba
                return gradient;
                },
                borderColor: 'rgb(75, 192, 192)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,  // Esto hace las líneas más suaves
                pointRadius: 4,
                pointBackgroundColor: 'rgb(75, 192, 192)',
                pointBorderColor: 'white',
                pointBorderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: true,
                },
                ticks: {
                    color: '#96A2A9',
                }
            },
            y: {
                grid: {
                    display: true,
                },
                border: {
                    width: 0 // Ajusta el grosor de la línea del eje
                },
                ticks: {
                    color: '#96A2A9',
                }
            },
        },
        plugins: {
            legend: {
                display: false,  // Desactiva la leyenda
            },
        },
    };

    return (
        <div className="w-full">
            {loading ? (
                <div className="text-center text-white">Loading statistic...</div>
            ) : error ? (
                <div className="text-red-500 mb-4">{error}</div>
            ) : (
                <Line data={data} options={options} height={180}/>
            )}
        </div>
    );
}

export default UsersWeek;