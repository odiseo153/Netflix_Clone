import { useState, useEffect } from "react";
import { GetMoviesPopular, GetMoviesTrending } from "../Api/ApiController";
import { Movie } from "../Types/Movie";
import MoviesDetail from "./MoviesDetail";
import { urlImage } from "./Home";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";

export default function Movies() {
  const [moviesTrending, setMoviesTrending] = useState<Movie[]>([]);
  const [moviesPopular, setMoviesPopular] = useState<Movie[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie>();
  const [pagePopular, setPagePopular] = useState<number>(0);
  const [pageTrending, setPageTrending] = useState<number>(0);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchMovies = async () => {
      const movieTrending = await GetMoviesTrending();
      const moviePopular = await GetMoviesPopular();

      setMoviesTrending(movieTrending ?? []);
      setMoviesPopular(moviePopular ?? []);
    };

    fetchMovies();
  }, []);

  const onClose = () => {
    setIsOpen(false);
  };

  const selectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsOpen(true);
  };

  const handleNextTrending = () => {
    if ((pageTrending + 1) * itemsPerPage < moviesTrending.length) {
      setPageTrending(pageTrending + 1);
    }
  };

  const handlePrevTrending = () => {
    if (pageTrending > 0) {
      setPageTrending(pageTrending - 1);
    }
  };

  const handleNextPopular = () => {
    if ((pagePopular + 1) * itemsPerPage < moviesPopular.length) {
      setPagePopular(pagePopular + 1);
    }
  };

  const handlePrevPopular = () => {
    if (pagePopular > 0) {
      setPagePopular(pagePopular - 1);
    }
  };

  return (
    <div className="h-screen">
      <MoviesDetail onClose={onClose} selectedMovie={selectedMovie} isOpen={isOpen} />

      <div className="px-6 py-8 space-y-8">
        {/* Sección para películas en tendencia */}
        <div>
          <div className="flex space-x-5">
            <h2 className="text-2xl font-semibold mb-4">Tendencias</h2>

            <button
              className="bg-gray-800 text-white p-2 rounded-full"
              onClick={handlePrevTrending}
              hidden={pageTrending === 0}
            >
              <ArrowBigLeft size={30} />
            </button>

            <button
              className="bg-gray-800 text-white p-2 rounded-full"
              onClick={handleNextTrending}
              hidden={(pageTrending + 1) * itemsPerPage >= moviesTrending.length}
            >
              <ArrowBigRight size={30} />
            </button>

          </div>
          <div className="flex space-x-4 items-center ">

            <div className="flex space-x-4 overflow-x-auto mt-3 pb-4">
              {moviesTrending
                .slice(pageTrending * itemsPerPage, (pageTrending + 1) * itemsPerPage)
                .map((movie, i) => (
                  <div key={i} className="flex-none w-40" onClick={() => selectMovie(movie)}>
                    <img
                      src={`${urlImage}${movie.backdrop_path ?? movie.poster_path}`}
                      alt={movie.title}
                      className="rounded-lg hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
            </div>

          </div>
        </div>

        {/* Sección para películas populares */}
        <div>
          <div className="flex space-x-5">
            <h2 className="text-2xl font-semibold mb-4">Películas Populares</h2>

            <button
              className="bg-gray-800 text-white p-2 rounded-full"
              onClick={handlePrevPopular}
              hidden={pagePopular === 0}
            >
              <ArrowBigLeft size={30} />
            </button>
            <button
              className="bg-gray-800 text-white p-2 rounded-full"
              onClick={handleNextPopular}
              hidden={(pagePopular + 1) * itemsPerPage >= moviesPopular.length}
            >
              <ArrowBigRight size={30} />
            </button>
          </div>
          <div className="flex space-x-4 items-center">

            <div className="flex space-x-4 overflow-x-auto pb-4 mt-3">
              {moviesPopular
                .slice(pagePopular * itemsPerPage, (pagePopular + 1) * itemsPerPage)
                .map((movie, i) => (
                  <button key={i} className="flex-none w-44" onClick={() => selectMovie(movie)}>
                    <img
                      src={`${urlImage}${movie.backdrop_path}`}
                      alt={movie.title}
                      className="rounded-lg hover:scale-105 transition-transform"
                    />
                  </button>
                ))}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}
