import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, X } from 'lucide-react';

interface TrendingArticle {
  title: string;
  views: number;
  extract: string;
}

interface SearchResult {
  pageid: number;
  title: string;
  extract?: string;
  thumbnail?: {
    source: string;
  };
}

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<TrendingArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        const response = await fetch(
          'https://en.wikipedia.org/w/api.php?action=query&list=mostviewed&pvlimit=10&format=json&origin=*'
        );
        const data = await response.json();
        const articles = data.query.mostviewed.map((article: any) => ({
          title: article.title,
          views: article.views,
          extract: ''
        }));

        const articlesWithExtracts = await Promise.all(
          articles.map(async (article: TrendingArticle) => {
            const extractResponse = await fetch(
              `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(
                article.title
              )}&format=json&origin=*`
            );
            const extractData = await extractResponse.json();
            const pages = extractData.query.pages;
            const extract = pages[Object.keys(pages)[0]].extract;
            return { ...article, extract };
          })
        );

        setTrendingArticles(articlesWithExtracts);
      } catch (error) {
        console.error('Error fetching trending articles:', error);
      }
    };

    fetchTrendingArticles();
  }, []);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchTerm.length > 0) {
      searchTimeout.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
              searchTerm
            )}&limit=5&format=json&origin=*`
          );
          const [, titles] = await response.json();
          setSuggestions(titles);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
    }
  }, [searchTerm]);

  const handleSearch = async (searchQuery: string) => {
    setIsSearching(true);
    setShowSuggestions(false);
    setSuggestions([]); // Add this line to clear suggestions
    try {
      // Search for exact matches first
      const response = await fetch(
        `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrlimit=10&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=400&gsrsearch=${encodeURIComponent(
          searchQuery
        )}&format=json&origin=*`
      );
      const data = await response.json();
      const pages = data.query?.pages || {};
      const results = Object.values(pages) as SearchResult[];
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <form onSubmit={handleSubmit} className="relative mb-6">
        <div className="flex items-center bg-gray-900 rounded-full px-4 py-2">
          <Search size={20} className="text-gray-400" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Wikipedia"
            className="bg-transparent border-none focus:outline-none text-white ml-2 w-full"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                setSuggestions([]);
                setShowSuggestions(false);
                setIsSearching(false);
              }}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute left-0 right-0 mt-2 bg-gray-900 rounded-lg overflow-hidden z-50">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full px-4 py-3 text-left hover:bg-gray-800 text-white"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </form>

      {isSearching ? (
        <div className="space-y-4">
          {searchResults.map((result) => (
            <div
              key={result.pageid}
              className="bg-gray-900 rounded-lg overflow-hidden"
            >
              {result.thumbnail && (
                <img
                  src={result.thumbnail.source}
                  alt={result.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{result.title}</h3>
                <p className="text-sm text-gray-400 line-clamp-3">{result.extract}</p>
                <a
                  href={`https://en.wikipedia.org/?curid=${result.pageid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 mt-2 inline-block text-sm"
                >
                  Read more
                </a>
              </div>
            </div>
          ))}
          {searchResults.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No results found for "{searchTerm}"
            </div>
          )}
        </div>
      ) : (
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <TrendingUp size={20} className="mr-2" />
            <h2 className="text-lg font-bold">Trending on Wikipedia</h2>
          </div>
          <div className="space-y-4">
            {trendingArticles.map((article, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg p-4"
                onClick={() => handleSearch(article.title)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{article.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{article.extract}</p>
                  </div>
                  <span className="text-sm text-gray-400 ml-4">
                    {new Intl.NumberFormat().format(article.views)} views
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;