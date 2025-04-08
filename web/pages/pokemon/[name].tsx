import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { Pokemon } from '@/data/models/pokemon';
import { PokemonSpecies } from '@/data/models/pokemon-species';
import { formatFlavorText, formatPokemonName } from '@/utils/flavor-text-formatter';

type PokemonDetailProps = {
  pokemon: Pokemon;
  species: PokemonSpecies;
  error?: string;
};

export default function PokemonDetail({ pokemon, species, error }: PokemonDetailProps) {
  const router = useRouter();
  
  // If the page is still generating via fallback
  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 py-8">
        <main className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto border-4 border-gray-800">
            <div className="flex items-center justify-center">
              <p className="text-lg font-mono">Loading Pokémon data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  // Error state handling
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 py-8">
        <main className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto border-4 border-gray-800">
            <div className="flex items-center mb-6">
              <button 
                onClick={() => router.back()}
                className="mr-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors border-2 border-gray-800 font-mono text-sm"
              >
                Back
              </button>
              <h1 className="text-3xl font-mono text-gray-800">Error</h1>
            </div>
            <p className="text-red-600 font-mono">{error}</p>
          </div>
        </main>
      </div>
    );
  }
  
  const englishFlavorText = species.flavor_text_entries.find(
    entry => entry.language.name === 'en'
  )?.flavor_text || 'No description available.';
  
  const formattedDescription = formatFlavorText(englishFlavorText);
  
  const types = [...pokemon.types].sort((a, b) => a.slot - b.slot);
  
  const stats = pokemon.stats;

  // Take only the first 20 moves to improve performance
  const popularMoves = pokemon.moves.slice(0, 20);

  const typeColors: Record<string, string> = {
    normal: 'bg-gray-400',
    fire: 'bg-red-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-blue-200',
    fighting: 'bg-red-700',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-700',
    flying: 'bg-indigo-300',
    psychic: 'bg-pink-500',
    bug: 'bg-green-600',
    rock: 'bg-yellow-800',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-700',
    dark: 'bg-gray-800',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-300',
  };

  return (
    <div className="bg-gradient-to-br from-red-50 to-blue-50 py-8">
      <Head>
        <title>{formatPokemonName(pokemon.name)} | Pokédex</title>
        <meta name="description" content={`Information about ${formatPokemonName(pokemon.name)}`} />
      </Head>

      <main className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto border-4 border-gray-800">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.back()}
              className="mr-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors border-2 border-gray-800 font-mono text-sm"
            >
              Back
            </button>
            <h1 className="text-3xl font-mono text-gray-800">{formatPokemonName(pokemon.name)}</h1>
            
            {/* Legendary or Mythical Badge */}
            {species.is_legendary && (
              <span className="ml-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded border border-gray-800 font-mono">
                Legendary
              </span>
            )}
            {species.is_mythical && (
              <span className="ml-3 bg-purple-600 text-white text-xs px-2 py-1 rounded border border-gray-800 font-mono">
                Mythical
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Left column - Image */}
            <div className="bg-gray-100 rounded-lg p-4 flex justify-center items-center border-2 border-gray-800">
                <Image 
                  src={pokemon.sprites.front_default} 
                  alt={pokemon.name}
                  width={200}
                  height={200}
                  className="w-48 h-48"
                  priority={true}
                />
            </div>

            {/* Middle column - Info */}
            <div className="col-span-2">
              {/* Description */}
              <div className="mb-6 border-2 border-gray-300 p-3 rounded-lg">
                <h2 className="text-xl font-mono text-gray-700 mb-2">Description</h2>
                <p className="text-gray-600 font-mono text-sm">{formattedDescription}</p>
              </div>

              {/* Evolution */}
              {species.evolves_from_species && (
                <div className="mb-6 border-2 border-gray-300 p-3 rounded-lg">
                  <h2 className="text-xl font-mono text-gray-700 mb-2">Evolution</h2>
                  <p className="text-gray-600 font-mono text-sm">
                    Evolves from{' '}
                    <Link 
                      href={`/pokemon/${species.evolves_from_species.name}`}
                      className="text-blue-600 underline hover:text-blue-800 font-semibold"
                    >
                      {formatPokemonName(species.evolves_from_species.name)}
                    </Link>
                  </p>
                </div>
              )}

              {/* Types */}
              <div className="mb-6 border-2 border-gray-300 p-3 rounded-lg">
                <h2 className="text-xl font-mono text-gray-700 mb-2">Types</h2>
                <div className="flex gap-2">
                  {types.map(({ type }) => (
                    <span 
                      key={type.name}
                      className={`${typeColors[type.name] || 'bg-gray-500'} text-white px-3 py-1 rounded text-sm border-2 border-gray-800 font-mono`}
                    >
                      {formatPokemonName(type.name)}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="mb-6 border-2 border-gray-300 p-3 rounded-lg">
                <h2 className="text-xl font-mono text-gray-700 mb-2">Base Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  {stats.map(({ stat, base_stat }) => (
                    <div key={stat.name} className="flex justify-between border-2 border-gray-200 p-2 rounded">
                      <span className="text-sm font-mono text-gray-700">
                        {formatPokemonName(stat.name)}
                      </span>
                      <span className="text-sm font-mono font-bold text-gray-800">
                        {base_stat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Moves section - limited to first 20 moves for performance */}
          <div className="mt-8 border-2 border-gray-300 p-4 rounded-lg">
            <h2 className="text-2xl font-mono text-gray-800 mb-4">Popular Moves</h2>
            <div className="grid grid-cols-4 md:grid-cols-5 gap-2">
              {popularMoves.map(({ move }) => (
                <Link 
                  key={move.name}
                  href={`/moves/${move.name}`}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-800 px-2 py-2 rounded text-sm text-center transition-colors border-2 border-gray-400 font-mono"
                  prefetch={false}
                >
                  {formatPokemonName(move.name)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Generate static paths for the most popular pokemon
export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch a list of popular pokemon to pre-generate
  // These could be the original 151 or most commonly searched ones
  const popularPokemon = [
    'pikachu', 'charizard', 'bulbasaur', 'squirtle', 
    'eevee', 'mewtwo', 'gengar', 'snorlax',
    'lucario', 'greninja', 'garchomp', 'rayquaza'
  ];
  
  const paths = popularPokemon.map(pokemon => ({
    params: { name: pokemon }
  }));
  
  return {
    paths,
    // Use fallback: true for generating pages on-demand
    fallback: true
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const name = context.params?.name as string;
    
    // Normalize the pokemon name
    const normalizedName = name.toLowerCase().replace(/\s+/g, '-');
    
    const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${normalizedName}`);
    
    if (!pokemonResponse.ok) {
      return {
        props: {
          pokemon: null,
          species: null,
          error: `Failed to fetch Pokémon data: ${pokemonResponse.status} ${pokemonResponse.statusText}`
        },
        revalidate: 86400 // Revalidate every 24 hours
      };
    }
    
    const pokemon = await pokemonResponse.json() as unknown as Pokemon;
    
    const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.species.name}`);
    
    if (!speciesResponse.ok) {
      return {
        props: {
          pokemon,
          species: null,
          error: `Failed to fetch species data: ${speciesResponse.status} ${speciesResponse.statusText}`
        },
        revalidate: 86400
      };
    }
    
    const species = await speciesResponse.json() as unknown as PokemonSpecies;
    
    return {
      props: {
        pokemon,
        species,
      },
      revalidate: 86400 // Revalidate every 24 hours
    };
  } catch (error) {
    console.error('Error fetching Pokemon data:', error);
    return {
      props: {
        pokemon: null,
        species: null,
        error: `An error occurred while fetching the data: ${error instanceof Error ? error.message : String(error)}`
      },
      revalidate: 300 // Retry more frequently on error
    };
  }
};