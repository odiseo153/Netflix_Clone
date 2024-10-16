import { useEffect, useState } from "react";
import { MessageCircleX, Search, Star } from "lucide-react";
import { Movie } from "../Types/Movie";
import { GetGenders, GetMoviesPopular, GetMoviesTrending } from "../Api/ApiController";
import { urlImage } from "./Home";
import { Genders } from "../Types/Genders";
import MoviesDetail from "./MoviesDetail";

export default function SearchComponent({ setIsSearching }: { setIsSearching: (valor: boolean) => void }) {
  const [searchQuery, setSearchQuery] = useState<string>(""); // Almacena el término de búsqueda
  const [selectedGenre, setSelectedGenre] = useState<number>(0); // Almacena el ID del género seleccionado
  const [allMovies, setAllMovies] = useState<Movie[]>([]); // Almacena todas las películas
  const [genres, setGenres] = useState<Genders[]>([]); // Almacena la lista de géneros
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie>();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false); // Para el sidebar en pantallas pequeñas
 
  // Filtra las películas basadas en la búsqueda y el género seleccionado
  const filteredMovies = allMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (selectedGenre === 0 || movie.genre_ids.includes(selectedGenre)) // Filtra por género o muestra todas si no se selecciona un género
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtiene las películas populares, las que están en tendencia y los géneros
        const [trendingMovies, popularMovies, fetchedGenres] = await Promise.all([
          GetMoviesTrending(),
          GetMoviesPopular(),
          GetGenders(),
        ]);
  
        // Configura las películas y géneros obtenidos
        const uniqueMovies = new Set([...trendingMovies, ...popularMovies]);
        setAllMovies([...uniqueMovies]);
  
        if (fetchedGenres?.genres) {
          setGenres(fetchedGenres.genres);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);


  const onClose = () => {
    setIsOpen(false);
  };

  const selectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsOpen(true);
  };

  
  return (
    <div className="min-h-screen bg-black text-white">
      <MoviesDetail onClose={onClose} selectedMovie={selectedMovie} isOpen={isOpen} />

      <div className="container mx-auto px-4 py-8">
        {/* Campo de búsqueda */}
        <div className="mb-8 relative">
          <input
            type="search"
            placeholder="Títulos, personas, géneros"
            className="w-full bg-gray-800 text-white border border-gray-700 rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-gray-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            onClick={() => setIsSearching(false)}
          >
            <MessageCircleX />
          </button>
        </div>

        {/* Botón para abrir/cerrar el sidebar en pantallas pequeñas */}
        <button
          className="md:hidden mb-4 bg-gray-800 text-white py-2 px-4 rounded"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {!isSidebarOpen && <i className="fa-solid fa-bars"></i> }
        </button>
      
        <div className="flex">
          {/* Sidebar de géneros */}
          <div className={`fixed md:relative inset-y-0 left-0 z-20 md:z-auto w-60 md:w-1/4   p-4 transform ${isSidebarOpen ? 'bg-gray-700 translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:translate-x-0`}>
            <h2 className="text-xl font-bold mb-4">Géneros</h2>
            <ul className="space-y-2">
              {genres.map((genre, i) => (
                <li key={i}>
                  <button
                    className={`text-left w-full py-2 px-4 rounded ${selectedGenre === genre.id ? "bg-red-600" : "hover:bg-gray-700"}`}
                    onClick={() => setSelectedGenre(genre.id === selectedGenre ? 0 : genre.id)} // Selecciona o deselecciona el género
                  >
                    {genre.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Overlay para cerrar el sidebar en pantallas pequeñas */}
          {isSidebarOpen && (
            <div className="fixed inset-0 bg-black opacity-50 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
          )}

          {/* Resultados de películas */}
          <div className="w-full ">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMovies.map((movie, i) => (
                <div onClick={() => selectMovie(movie)} key={i} className="bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
                  <img src={urlImage + movie.backdrop_path} alt={movie.title} className="w-full h-40 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1 truncate">{movie.title}</h3>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>{movie.release_date}</span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{movie.popularity.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredMovies.length === 0 && (
                <p className="col-span-full font-bold text-center text-white">No se encontraron películas para el género seleccionado.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
