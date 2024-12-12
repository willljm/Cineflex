import React, { useMemo, useState, useEffect } from 'react'

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

export const Carrusel = ({ mandandoPeliculas }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [actors, setActors] = useState([]);

  const obtenerTrailer = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=d0c9f48906c0503c033778bb3aa582a1`
      );
      const data = await response.json();
      const trailer = data.results.find(
        (video) => video.type === "Trailer" && video.site === "YouTube"
      );
      if (trailer) {
        setTrailerKey(trailer.key);
        setShowTrailer(true);
      }
    } catch (error) {
      console.error("Error al obtener el trailer:", error);
    }
  };

  const getActors = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=d0c9f48906c0503c033778bb3aa582a1`
      );
      const data = await response.json();
      setActors(data.cast.slice(0, 5));
    } catch (error) {
      console.error("Error al obtener actores:", error);
    }
  };

  useEffect(() => {
    if (selectedMovie) {
      getActors(selectedMovie.id);
    }
  }, [selectedMovie]);

  // Función para mezclar el array de películas aleatoriamente
  const peliculasAleatorias = useMemo(() => {
    return [...mandandoPeliculas]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
  }, [mandandoPeliculas]);

  return (
    <div className="relative pt-20">
      <Swiper
        effect={'coverflow'}
        centeredSlides={true}
        slidesPerView={1}
        allowTouchMove={false}
        grabCursor={false}
        preventInteractionOnTransition={true}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: false,
        }}
        loop={peliculasAleatorias.length > 1}
        pagination={{
          clickable: false,
        }}
        modules={[EffectCoverflow, Pagination, Autoplay]}
        className="mySwiper"
      >
        {
          peliculasAleatorias.map((elementos) => (
            <SwiperSlide key={elementos.id}>
              <div className='relative w-full h-[600px]'>
                <img 
                  className='w-full h-full object-cover' 
                  src={`https://image.tmdb.org/t/p/original/${elementos.backdrop_path}`} 
                  alt={elementos.title}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-4xl font-bold mb-4">{elementos.title}</h2>
                  <p className="text-lg line-clamp-2 max-w-2xl mb-4">{elementos.overview}</p>
                  <div className="flex items-center gap-4">
                    <button 
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors"
                      onClick={() => obtenerTrailer(elementos.id)}
                    >
                      Reproducir
                    </button>
                    <button 
                      className="bg-gray-600 bg-opacity-50 hover:bg-opacity-70 text-white px-6 py-2 rounded-md transition-colors"
                      onClick={() => setSelectedMovie(elementos)}
                    >
                      Más información
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))
        }
      </Swiper>

      {selectedMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-6xl w-full p-8 relative">
            <button 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
              onClick={() => {
                setSelectedMovie(null);
                setActors([]);
              }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col md:flex-row gap-8">
              <img
                src={`https://image.tmdb.org/t/p/w500/${selectedMovie.poster_path}`}
                alt={selectedMovie.title}
                className="w-full md:w-72 h-[450px] object-cover rounded-lg"
              />
              
              <div className="flex-1 space-y-6">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-3">{selectedMovie.title}</h2>
                  <p className="text-purple-400 text-lg">{selectedMovie.release_date}</p>
                </div>

                <p className="text-gray-300 text-lg leading-relaxed">{selectedMovie.overview}</p>

                <div>
                  <h3 className="text-2xl font-semibold text-white mb-4">Reparto Principal</h3>
                  <div className="flex flex-wrap gap-6">
                    {actors.map((actor) => (
                      <div key={actor.id} className="flex items-center gap-3">
                        <img 
                          src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                          alt={actor.name}
                          className="w-14 h-14 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-white font-medium">{actor.name}</p>
                          <p className="text-gray-400">{actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="bg-gray-800 p-5 rounded-lg">
                    <p className="text-purple-400 text-base">Puntuación</p>
                    <p className="text-white text-xl font-bold">{selectedMovie.vote_average}/10</p>
                  </div>
                  <div className="bg-gray-800 p-5 rounded-lg">
                    <p className="text-purple-400 text-base">Votos</p>
                    <p className="text-white text-xl font-bold">{selectedMovie.vote_count}</p>
                  </div>
                  <div className="bg-gray-800 p-5 rounded-lg">
                    <p className="text-purple-400 text-base">Popularidad</p>
                    <p className="text-white text-xl font-bold">{selectedMovie.popularity.toFixed(0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal del Trailer */}
      {showTrailer && trailerKey && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-4xl">
            <button 
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              onClick={() => setShowTrailer(false)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full"
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
