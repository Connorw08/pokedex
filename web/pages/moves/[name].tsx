import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Move } from '@/data/models/move';
import { formatFlavorText, formatPokemonName } from '@/utils/flavor-text-formatter';

type MoveDetailProps = {
  move: Move;
  error?: string;
};

export default function MoveDetail({ move, error }: MoveDetailProps) {
  const router = useRouter();
  
  // If the page is still generating via fallback
  if (router.isFallback) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 py-8">
        <main className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto border-4 border-gray-800">
            <div className="flex items-center justify-center">
              <p className="text-lg font-mono">Loading move data...</p>
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
  
  const englishFlavorText = move.flavor_text_entries.find(
    entry => entry.language.name === 'en'
  )?.flavor_text || 'No description available.';
  
  const formattedDescription = formatFlavorText(englishFlavorText);

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
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-blue-50 py-8">
      <Head>
        <title>{formatPokemonName(move.name)} | Pokédex</title>
        <meta name="description" content={`Information about the move ${formatPokemonName(move.name)}`} />
      </Head>

      <main className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto border-4 border-gray-800">
          <div className="flex items-center mb-6">
            <button 
              onClick={() => router.back()}
              className="mr-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors border-2 border-gray-800 font-mono text-sm"
            >
              Back
            </button>
            <h1 className="text-3xl font-mono text-gray-800">{formatPokemonName(move.name)}</h1>
          </div>

          <div className="space-y-6">
            {/* Type */}
            <div className="border-2 border-gray-300 p-3 rounded-lg">
              <h2 className="text-xl font-mono text-gray-700 mb-2">Type</h2>
              <span 
                className={`${typeColors[move.type.name] || 'bg-gray-500'} text-white px-3 py-1 rounded text-sm border-2 border-gray-800 font-mono`}
              >
                {formatPokemonName(move.type.name)}
              </span>
            </div>

            {/* Damage Class */}
            <div className="border-2 border-gray-300 p-3 rounded-lg">
              <h2 className="text-xl font-mono text-gray-700 mb-2">Damage Class</h2>
              <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm border-2 border-gray-800 font-mono">
                {formatPokemonName(move.damage_class.name)}
              </span>
            </div>

            {/* Description */}
            <div className="border-2 border-gray-300 p-3 rounded-lg">
              <h2 className="text-xl font-mono text-gray-700 mb-2">Description</h2>
              <p className="text-gray-600 font-mono text-sm">{formattedDescription}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {/* Power */}
              <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
                <h3 className="text-lg font-mono text-gray-700 mb-2">Power</h3>
                <p className="text-2xl font-bold text-center text-gray-800 font-mono">
                  {move.power || 'N/A'}
                </p>
              </div>

              {/* Accuracy */}
              <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
                <h3 className="text-lg font-mono text-gray-700 mb-2">Accuracy</h3>
                <p className="text-2xl font-bold text-center text-gray-800 font-mono">
                  {move.accuracy ? `${move.accuracy}%` : 'N/A'}
                </p>
              </div>

              {/* PP (Power Points) */}
              <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
                <h3 className="text-lg font-mono text-gray-700 mb-2">PP</h3>
                <p className="text-2xl font-bold text-center text-gray-800 font-mono">
                  {move.pp || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Generate static paths for the most common moves
export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch a list of common/popular moves to pre-generate
  // You could expand this list based on usage analytics
  const commonMoves = ['tackle', 'ember', 'water-gun', 'vine-whip', 'thunderbolt'];
  
  const paths = commonMoves.map(move => ({
    params: { name: move }
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
    
    // Normalize the move name
    const normalizedName = name.toLowerCase().replace(/\s+/g, '-');
    
    const moveResponse = await fetch(`https://pokeapi.co/api/v2/move/${normalizedName}`);
    
    if (!moveResponse.ok) {
      return {
        props: {
          move: null,
          error: `Failed to fetch move data: ${moveResponse.status} ${moveResponse.statusText}`
        },
        // Revalidate every 24 hours
        revalidate: 86400
      };
    }
    
    const move = await moveResponse.json() as unknown as Move;
    
    return {
      props: {
        move,
      },
      // Revalidate every 24 hours
      revalidate: 86400
    };
  } catch (error) {
    console.error('Error fetching move data:', error);
    return {
      props: {
        move: null,
        error: `An error occurred while fetching the move data: ${error instanceof Error ? error.message : String(error)}`
      },
      // Revalidate more frequently on error
      revalidate: 300
    };
  }
};