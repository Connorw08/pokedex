import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { Pokedex } from '@/data/models/pokedex';
import { formatPokemonName } from '@/utils/flavor-text-formatter';

// Define the interface for Pokemon with sprite
interface PokemonWithSprite {
  name: string;
  url: string;
  sprite: string;
}

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 50;

  const fetchPokedex = async () => {
    const offset = currentPage * pageSize;
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${pageSize}&offset=${offset}`);
    const data = await response.json() as Pokedex;
    
    // Fetch additional data for each Pokemon to get the sprites
    const pokemonWithSprites = await Promise.all(data.results.map(async (pokemon) => {
      const pokemonDetails = await fetch(pokemon.url);
      const details = await pokemonDetails.json();
      return {
        ...pokemon,
        sprite: details.sprites.front_default
      };
    }));
    
    return {
      ...data,
      results: pokemonWithSprites
    };
  };

  const { data } = useQuery({
    queryKey: ['pokedex', currentPage],
    queryFn: fetchPokedex,
  });

  const totalPages = data ? Math.ceil(data.count / pageSize) : 0;
  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === totalPages - 1;

  const goToPrevPage = () => {
    if (!isFirstPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (!isLastPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50">
      <Head>
        <title>Pokédex</title>
        <meta name="description" content="A complete Pokémon information database" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-5xl font-mono font-bold text-center text-red-600 mb-8 tracking-tight">Pokédex</h1>
        
        <div className="grid grid-cols-3 gap-4">
          {data?.results?.map((pokemon: PokemonWithSprite) => (
            <Link 
              href={`/pokemon/${pokemon.name}`} 
              key={pokemon.name}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 border-4 border-gray-800"
            >
              <div className="flex items-center justify-between">
                <div className="text-center font-mono text-gray-800">
                  {formatPokemonName(pokemon.name)}
                </div>
                {pokemon.sprite && (
                  <Image 
                    src={pokemon.sprite} 
                    alt={pokemon.name}
                    width={48}
                    height={48}
                    className="w-12 h-12"
                  />
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="flex justify-between items-center mt-8">
          <button
            onClick={goToPrevPage}
            disabled={isFirstPage}
            className={`px-4 py-2 rounded-md border-2 border-gray-800 font-mono text-sm ${
              isFirstPage 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Previous
          </button>
          
          <div className="text-gray-700 font-mono">
            Page {currentPage + 1} of {totalPages}
          </div>
          
          <button
            onClick={goToNextPage}
            disabled={isLastPage}
            className={`px-4 py-2 rounded-md border-2 border-gray-800 font-mono text-sm ${
              isLastPage 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }`}
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}