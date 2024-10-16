import { Search, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { GetMoviesTrending } from "../Api/ApiController";
import { Movie } from "../Types/Movie";
import Movies from "./Movies";
import SearchComponent from "./SearchComponent";

export const urlImage = "https://image.tmdb.org/t/p/w600_and_h900_bestv2";

export default function Home() {
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null); 
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Estado para manejar la apertura del modal

  // useEffect para obtener películas cuando el componente se monta
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await GetMoviesTrending();
        if (data && data.length > 0) {
          const randomIndex = getRandomNumber(0, data.length - 1);
          setRandomMovie(data[randomIndex]);
        }
      } catch (error) {
        console.error("Error al obtener películas:", error);
      }
    };

    fetchMovies();
  }, []);

  // Función para obtener un número aleatorio dentro de un rango
  function getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Modo búsqueda */}
      {isSearching ? (
        <div>
          <SearchComponent setIsSearching={setIsSearching} />
        </div>
      ) : (
        <>
          {/* Navegación */}
          <nav className="flex items-center justify-between px-4 md:px-6 py-4 bg-black bg-opacity-90 shadow-md">
            <div className="flex items-center space-x-4 md:space-x-6">
              <img
                className="w-10 h-10 rounded-full"
                src="https://p1.hiclipart.com/preview/365/513/290/movie-logo-photographic-film-movie-camera-cinema-movie-projector-video-cameras-cinema-camera-circle-png-clipart.jpg"
                alt="Netflix"
              />
              <div className="hidden md:flex space-x-6">
                {["Inicio", "Series TV", "Películas", "Novedades populares", "Mi lista"].map((item) => (
                  <a key={item} href="#" className="hover:text-gray-300 transition">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-4">
              <Search
                className="w-6 h-6 cursor-pointer hover:text-gray-300 transition"
                onClick={() => setIsSearching(true)}
              />
            </div>
          </nav>

          {/* Película destacada */}
          <div className="relative h-[56.25vw] max-h-[80vh] overflow-hidden">
            {randomMovie ? (
              <>
                <img
                  src={`${urlImage}${randomMovie.poster_path}`}
                  alt={randomMovie.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 p-4 md:p-8 bg-gradient-to-t from-black to-transparent flex flex-col justify-end">
                  <h1 className="text-3xl md:text-5xl font-bold mb-4">{randomMovie.title}</h1>
                  <p className="text-base md:text-lg mb-4 max-w-xl">{randomMovie.overview}</p>
                  <div className="flex space-x-4">
                    <button 
                      className="flex items-center px-4 md:px-6 py-2 bg-gray-500 bg-opacity-50 rounded-lg hover:bg-gray-600 transition"
                      onClick={() => setIsModalOpen(true)} // Abre el modal
                    >
                      <Info className="w-5 h-5 md:w-6 md:h-6 mr-2" />
                      Info
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>Cargando...</p>
              </div>
            )}
          </div>

          {/* Lista de películas */}
          <Movies />

          {/* Modal con información completa de la película */}
          {isModalOpen && randomMovie && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">{randomMovie.title}</h2>
                <img
                  src={`${urlImage}${randomMovie.poster_path}`}
                  alt={randomMovie.title}
                  className="w-full mb-4 rounded"
                />
                <p className="text-lg mb-2"><strong>Descripción:</strong> {randomMovie.overview}</p>
                <p className="text-lg mb-2"><strong>Fecha de lanzamiento:</strong> {randomMovie.release_date}</p>
                <p className="text-lg mb-2"><strong>Calificación:</strong> {randomMovie.vote_average}</p>
                <p className="text-lg mb-2"><strong>Lenguaje original:</strong> {randomMovie.original_language}</p>
                <button 
                  className="mt-4 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                  onClick={closeModal} // Cierra el modal
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
