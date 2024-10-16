import { GendersResponse } from "../Types/GendersResponse";
import { Movie, MoviesResponse } from "../Types/Movie";


const Url = 'https://api.themoviedb.org/3/';

const token = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NGJiMTI4MmQ1ZGMyZmY1MmQ1MWNhZDJmMDkzNDVjMiIsIm5iZiI6MTcyODc4MzE4MC4xODUzNCwic3ViIjoiNjQzZjFkZmZiMGJhN2UwNGEzMTJiOWJhIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.0-olJmDO04U19wCzQnIFzMt4rt2hKqp7dabjCr67-mA";

const LANGUAGE = "en-US";
const PAGE = 1; // Configuración común para paginación

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${token}`
  }
};


const fetchMovies = async (endpoint: string): Promise<Movie[]> => {
    try {
      const urlComplete = `${Url}${endpoint}&language=${LANGUAGE}&page=${PAGE}`;
      const response = await fetch(urlComplete, options);
  
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }
  
      const data: MoviesResponse = await response.json();
      return data.results;
    } catch (error) {
      console.error("Error fetching movies:", error);
      return [];
    }
  };
  
  // Obtiene las películas en tendencia
  export const GetMoviesTrending = (): Promise<Movie[]> => {
    return fetchMovies("trending/movie/day?");
  };
  
  // Obtiene las películas populares
  export const GetMoviesPopular = (): Promise<Movie[]> => {
    return fetchMovies("movie/popular?");
  };
  
  // Obtiene las películas próximas
  export const GetMoviesUpcoming = (): Promise<Movie[]> => {
    return fetchMovies("movie/upcoming?");
  };
  
  // Búsqueda de películas por query
  export const SearchMovies = (query: string): Promise<Movie[]> => {
    const endpoint = `search/movie?query=${encodeURIComponent(query)}`;
    return fetchMovies(endpoint);
  };



export const GetGenders = async (): Promise<GendersResponse | null> => {
    const urlComplete = `${Url}genre/movie/list?language=en`;

    try {
        // Validación de Url y options
        if (!Url || !options) {
            throw new Error("URL or options not defined.");
        }

        const response = await fetch(urlComplete, options);

        // Manejo de errores HTTP
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
        }

        const data: GendersResponse = await response.json();

        // Validar que se recibió un objeto válido
        if (!data || !data.genres) {
            throw new Error("Invalid data format received.");
        }

        return data; // Devolver los resultados correctamente formateados

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error("Error fetching genders:", error.message); // Mensaje de error más claro
        } else {
            console.error("Unknown error occurred while fetching genders.");
        }
        return null; // Devolver null en caso de error
    }
};





