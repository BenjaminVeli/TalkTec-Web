import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

import { Chart as ChartJS, BarElement, Title, Legend } from "chart.js";
import { getPublicationsStats } from "../../../api/publication";

ChartJS.register(BarElement, Title, Legend);

const Departments = () => {
  const [stats, setStats] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await getPublicationsStats();
      setStats(data);
    } catch (err) {
      setError("Error fetching publications stats: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    "rgba(255, 159, 64, 0.5)",
    "rgba(75, 192, 192, 0.5)",
    "rgba(54, 162, 235, 0.5)",
    "rgba(153, 102, 255, 0.5)",
    "rgba(255, 50, 50, 0.5)",
    "rgba(255, 206, 86, 0.5)",
  ];

  const borderColors = colors.map((color) => color.replace("0.5", "1"));

  const data = {
    labels: stats.map((stat) => stat.degree__name),
    datasets: [
      {
        label: "Seleccionados por usuarios",
        data: stats.map((stat) => stat.total),
        backgroundColor: colors,
        borderColor: borderColors,
        borderWidth: 2,
        barThickness: 15,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permite ajustar la relación de aspecto
    indexAxis: "y", // Cambia a barras horizontales
    scales: {
      x: {
        grid: {
          display: true,
        },
        ticks: {
          color: "#96A2A9",
        },
      },
      y: {
        grid: {
          display: true,
        },
        border: {
          width: 0, // Ajusta el grosor de la línea del eje
        },
        ticks: {
          color: "#96A2A9",
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Desactiva la leyenda
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
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default Departments;
