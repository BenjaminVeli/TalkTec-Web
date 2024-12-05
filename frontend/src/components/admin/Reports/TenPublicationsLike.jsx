import { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { getTopTenPublicationsByLikes } from '../../../api/publication';

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

const TenPublicationsLike = () => {
  const [publicationStats, setPublicationStats] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopTenPublicationsByLikes();
  }, []);

  const fetchTopTenPublicationsByLikes = async () => {
    setLoading(true);
    try {
      const data = await getTopTenPublicationsByLikes();
      setPublicationStats(data.top_ten_publications_by_likes); // Asegúrate de acceder al campo correcto de la respuesta
    } catch (err) {
      setError('Error fetching publications with most likes: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mapea los nombres de autores y la cantidad de "likes"
  const authors = publicationStats.map((stat) => stat.author);
  const likeCounts = publicationStats.map((stat) => stat.like_count);

  const data = {
    labels: authors,  // Nombres de los autores como etiquetas
    datasets: [
      {
        label: 'Cantidad de likes',
        data: likeCounts,
        backgroundColor: '#FF6347',
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
        display: false,
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
          width: 0,
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
        <Bar data={data} options={options} height={80} />
      )}
    </div>
  );
};

export default TenPublicationsLike;
