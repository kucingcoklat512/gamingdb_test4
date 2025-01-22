import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Bar } from "react-chartjs-2"; // Import Bar chart from react-chartjs-2
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = ({ handleLogout }) => {
  const [totalGames, setTotalGames] = useState(0);
  const [gamesByYear, setGamesByYear] = useState({});
  const [topGames, setTopGames] = useState([]); // State for top games
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null); // State for accordion

  const fetchGames = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://127.0.0.1:5000/api/games", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        if (data && data.data && data.data.games) {
          setTotalGames(data.data.games.length);
          processGamesByYear(data.data.games);
          setTopGames(getTopRatedGames(data.data.games)); // Get top rated games based on score
        } else {
          Swal.fire("Error", "Unexpected response structure.", "error");
        }
      } else {
        Swal.fire("Error", "Failed to fetch games. Please check the API.", "error");
      }
    } catch (error) {
      Swal.fire("Error", "An error occurred during fetching games.", "error");
    }
  };

  const processGamesByYear = (games) => {
    const yearCount = {};
    games.forEach(game => {
      const year = game.released;
      if (year > 1970) {
        yearCount[year] = (yearCount[year] || 0) + 1;
      }
    });

    const sortedYearCount = Object.entries(yearCount).sort(([yearA], [yearB]) => yearA - yearB);
    const sortedYears = sortedYearCount.map(([year]) => year);
    const sortedCounts = sortedYearCount.map(([, count]) => count);

    setGamesByYear({ years: sortedYears, counts: sortedCounts });
  };

  const getTopRatedGames = (games) => {
    return games
      .filter(game => game.score > 0) // Adjust this condition as needed
      .sort((a, b) => b.score - a.score) // Sort by score in descending order
      .slice(0, 5); // Get the top 5 games
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const chartData = {
    labels: gamesByYear.years || [],
    datasets: [
      {
        label: 'Number of Games',
        data: gamesByYear.counts || [],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',
        },
      },
      title: {
        display: true,
        text: 'Games by Year',
        color: 'white',
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'white',
        },
      },
    },
  };

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside style={{ backgroundColor: '#1e1e1e' }} className={`w-64 p-6 transition-transform duration-300 shadow-lg rounded-lg ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <h2 className="text-white text-3xl font-bold mb-6 font-poppins">Admin Dashboard</h2>
        <nav>
          <ul className="flex flex-col">
            <li className="mb-4 w-full">
              <a href="/" className="block text-gray-300 hover:text-white transition-colors duration-200 text-left p-3 rounded w-full text-lg font-poppins">Dashboard</a>
            </li>
            <li className="mb-4 w-full">
              <a href="/games" className="block text-gray-300 hover:text-white transition-colors duration-200 text-left p-3 rounded w-full text-lg font-poppins">Games</a>
            </li>
            <li className="mb-4 w-full">
              <a href="/users" className="block text-gray-300 hover:text-white transition-colors duration-200 text-left p-3 rounded w-full text-lg font-poppins">Users</a>
            </li>
            <li className="mb-4 w-full">
              <a href="/developers" className="block text-gray-300 hover:text-white transition-colors duration-200 text-left p-3 rounded w-full text-lg font-poppins">Developers</a>
            </li>
            <li className="mb-4 w-full">
              <a href="/genres" className="block text-gray-300 hover:text-white transition-colors duration-200 text-left p-3 rounded w-full text-lg font-poppins">Genres</a>
            </li>
             <li className="mb-4 w-full">
              <a href="/publishers" className="block text-gray-300 hover:text-white transition-colors duration-200 text-left p-3 rounded w-full text-lg font-poppins">Publishers</a>
            </li>
            <li className="mb-4 w-full">
              <a href="/ratings" className="block text-gray-300 hover:text-white transition-colors duration-200 text-left p-3 rounded w-full text-lg font-poppins">Ratings</a>
            </li>
            <li className="mb-4 w-full">
              <button onClick={handleLogout} className="block text-gray-300 hover:text-white transition-colors duration-200 text-left p-3 rounded w-full text-lg font-poppins">Logout</button>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="flex-1 p-4">
        <h1 className="text-3xl font-bold text-white mb-4">Dashboard</h1>
        <div className="chart-container mb-4">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">Top 5 Games</h2>
        <div className="accordion">
          {topGames.map((game, index) => (
            <div key={game.id} className="card mb-2">
              <div className="card-header cursor-pointer" onClick={() => toggleAccordion(index)}>
                <h3 className="text-lg font-semibold text-white">{game.name}</h3>
                <span className="text-gray-400">{activeIndex === index ? '-' : '+'}</span>
              </div>
              {activeIndex === index && (
                <div className="card-body bg-gray-800 p-2 flex justify-around">
                  <p className="text-gray-300">Score: {game.score}</p>
                  <p className="text-gray-300">Released: {game.released}</p>
                  <p className="text-gray-300">Rating: {game.rating}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;