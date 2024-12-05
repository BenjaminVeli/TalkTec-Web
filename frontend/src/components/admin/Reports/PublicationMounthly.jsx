import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { getMounthlyPublications } from '../../../api/publication';

import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  Tooltip,
} from 'chart.js';

ChartJS.register(
  BarElement,
  CategoryScale,
  Tooltip,
);

const PublicationMounthly = () => {
  const [publicationStats, setPublicationStats] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicationMounthly();
  }, []);

  const fetchPublicationMounthly = async () => {
    setLoading(true);
    try {
        const data = await getMounthlyPublications();
        setPublicationStats(data); 
    } catch (err) {
        setError('Error fetching publications registrations: ' + err.message);
    } finally {
        setLoading(false);
    }
  };

  const months = publicationStats.map((stat) => stat.month);
  const publicationCounts = publicationStats.map((stat) => stat.publication_count);

  const data = {
    labels: months,
    datasets: [
        {
            label: 'Número de publicaciones',
            data: publicationCounts,
            backgroundColor: '#3463e8',
            borderColor: '#ffffff',
            borderWidth: 1,
            borderRadius: 4,
            barThickness: 25,
        },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
        legend: {
            display: false,  // Desactiva la leyenda
        },
    },
    scales: {
        x: {
            grid: {
                display: false,
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
};

  return (
    <div className="w-full">
            {loading ? (
                <div className="text-center text-white">Loading statistic...</div>
            ) : error ? (
                <div className="text-red-500 mb-4">{error}</div>
            ) : (
                <Bar data={data} options={options} height={130}/>
            )}
        </div>
  )
}

export default PublicationMounthly