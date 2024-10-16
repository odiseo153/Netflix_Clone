import { X, Star, Calendar } from "lucide-react";
import { Movie } from "../Types/Movie";
import { useEffect, useState } from "react";
import { GetGenders } from "../Api/ApiController";
import { Genders } from "../Types/Genders";
import { urlImage } from "./Home";

interface MoviesDetailProps {
  onClose: () => void;
  selectedMovie: Movie | undefined;
  isOpen: boolean;
}

export default function MoviesDetail({ onClose, selectedMovie, isOpen }: MoviesDetailProps) {
  const [genres, setGenres] = useState<Genders[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      const fetchedGenres = await GetGenders();
      if (fetchedGenres && fetchedGenres.genres) {
        setGenres(fetchedGenres.genres);
      }
    };

    if (isOpen) {
      fetchGenres();
    }
  }, [isOpen]);

  const getGenreName = (id: number): string => {
    const genre = genres.find((g) => g.id === id);
    return genre ? genre.name : "Unknown";
  };

  if (!isOpen) return null;

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
      onClick={handleOutsideClick}
    >
      <div className="relative z-10 bg-white text-black rounded-lg w-full sm:max-w-lg md:max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg transform transition-all duration-300 scale-100">
        <div className="relative flex flex-col sm:flex-row">
          {/* Imagen de la película */}
          <div className="sm:w-full md:w-1/3 bg-gray-100 rounded-t-lg md:rounded-l-lg md:rounded-tr-none overflow-hidden">
            <img
              src={`${urlImage}${selectedMovie?.poster_path}`}
              alt={selectedMovie?.title}
              className="w-full h-64 md:h-full object-cover"
            />
          </div>

          {/* Detalles de la película */}
          <div className="sm:w-full md:w-2/3 p-4 md:p-6">
            <button
              className="absolute top-2 right-2 text-white bg-gray-800 hover:bg-gray-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">{selectedMovie?.title}</h2>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="flex items-center text-gray-700">
                <Star className="h-5 w-5 text-yellow-400 mr-1" />
                <span>{selectedMovie?.popularity.toFixed(1)}/100</span>
              </div>

              <div className="flex items-center text-gray-700">
                <Calendar className="h-5 w-5 mr-1" />
                <span>{new Date(selectedMovie?.release_date ?? "").toLocaleDateString()}</span>
              </div>
            </div>

            {/* Géneros */}
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedMovie?.genre_ids.map((genreId, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full"
                >
                  {getGenreName(genreId)}
                </span>
              ))}
            </div>

            <p className="mb-4 text-gray-700 text-sm sm:text-base">{selectedMovie?.overview}</p>

            {selectedMovie?.media_type && (
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Media Type</h3>
                <p className="text-gray-700">{selectedMovie?.media_type}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
