import { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { getTopFivePublicationsByComments } from '../../../api/publication';

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
);

const FivePublicationsComments = () => {
  const [publicationStats, setPublicationStats] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopFivePublicationsByComments();
  }, []);

  const fetchTopFivePublicationsByComments = async () => {
    setLoading(true);
    try {
      const data = await getTopFivePublicationsByComments();
      setPublicationStats(data.top_five_publications_by_comments); // Accede al campo correcto de la respuesta
    } catch (err) {
      setError('Error fetching publications with most comments: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Mapea los nombres de autores y la cantidad de comentarios
  const authors = publicationStats.map((stat) => stat.author);
  const commentCounts = publicationStats.map((stat) => stat.comment_count);

  const data = {
    labels: authors,  // Nombres de los autores como etiquetas
    datasets: [
      {
        label: 'Cantidad de comentarios',
        data: commentCounts,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
        ],
        hoverBackgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
        ],
        borderColor: '#ffffff',
        borderWidth: 2,
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
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="text-center text-white">Loading statistic...</div>
      ) : error ? (
        <div className="text-red-500 mb-4">{error}</div>
      ) : (
        <Doughnut data={data} options={options} weight={90} />
      )}
    </div>
  );
};

export default FivePublicationsComments;
