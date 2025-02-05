import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

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

interface Section {
  id: string;
  name: string;
  query: string;
}

const SECTIONS: Section[] = [
  { id: 'trending', name: 'Trending', query: '' },
  { id: 'science', name: 'Science', query: 'science OR scientific discoveries OR research' },
  { id: 'tech', name: 'Technology', query: 'technology OR innovation OR digital' },
  { id: 'politics', name: 'Politics', query: 'politics OR government OR policy' },
  { id: 'history', name: 'History', query: 'history OR historical events' },
  { id: 'arts', name: 'Arts & Culture', query: 'art OR culture OR entertainment' },
];

const Discover = () => {
  const [activeSection, setActiveSection] = useState('trending');
  const [sectionResults, setSectionResults] = useState<SearchResult[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<TrendingArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout>();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchTrendingArticles = async () => {
      try {
        const response = await fetch(
          `https://${language}.wikipedia.org/w/api.php?action=query&format=json&list=trending&tnlimit=10&origin=*`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data?.query?.trending) {
          // If trending endpoint fails, fallback to most viewed pages
          const mostViewedResponse = await fetch(
            `https://${language}.wikipedia.org/w/api.php?action=query&list=mostviewed&format=json&origin=*`
          );
          const mostViewedData = await mostViewedResponse.json();
          
          if (!mostViewedData?.query?.mostviewed) {
            throw new Error('Failed to fetch trending articles');
          }
          
          const articles = mostViewedData.query.mostviewed
            .filter((article: any) => !article.title.startsWith('Special:') && 
              article.title !== 'Main Page' && 
              article.title!== 'Wikipedia:Featured pictures'
            )
            .slice(0, 10)
            .map((article: any) => ({
              title: article.title,
              extract: ''
            }));
            
          // Fetch extracts for each article
          const articlesWithExtracts = await Promise.all(
            articles.map(async (article: TrendingArticle) => {
              try {
                const extractResponse = await fetch(
                  `https://${language}.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(
                    article.title
                  )}&format=json&origin=*`
                );
                const extractData = await extractResponse.json();
                const pages = extractData.query.pages;
                const pageId = Object.keys(pages)[0];
                return {
                  ...article,
                  extract: pages[pageId].extract || ''
                };
              } catch (error) {
                console.error('Error fetching article extract:', error);
                return article;
              }
            })
          );

          setTrendingArticles(articlesWithExtracts);
          return;
        }

        // If trending endpoint succeeds, process the trending data
        const trendingArticles = data.query.trending
          .filter((article: any) => 
            article.title !== 'Main Page' && 
            !article.title.toLowerCase().includes('wikipedia: featured pictures')
          )
          .map((article: any) => ({
            title: article.title,
            views: article.views || 0,
            extract: ''
          }));

        // Fetch extracts for trending articles
        const articlesWithExtracts = await Promise.all(
          trendingArticles.map(async (article: TrendingArticle) => {
            try {
              const extractResponse = await fetch(
                `https://${language}.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&titles=${encodeURIComponent(
                  article.title
                )}&format=json&origin=*`
              );
              const extractData = await extractResponse.json();
              const pages = extractData.query.pages;
              const pageId = Object.keys(pages)[0];
              return {
                ...article,
                extract: pages[pageId].extract || ''
              };
            } catch (error) {
              console.error('Error fetching article extract:', error);
              return article;
            }
          })
        );

        setTrendingArticles(articlesWithExtracts);
      } catch (error) {
        console.error('Error fetching trending articles:', error);
      }
    };

    fetchTrendingArticles();
  }, [language]);

  useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (searchTerm.length > 1) {
      setIsLoading(true);
      searchTimeout.current = setTimeout(async () => {
        try {
          const response = await fetch(
            `https://${language}.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(
              searchTerm
            )}&limit=5&format=json&origin=*`
          );
          const [, titles] = await response.json();
          setSuggestions(titles);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm, language]);

  const handleSearch = async (searchQuery: string) => {
    setIsSearching(true);
    setShowSuggestions(false);
    setSuggestions([]);
    setSearchTerm(searchQuery);
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://${language}.wikipedia.org/w/api.php?action=query&generator=search&gsrlimit=10&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=400&gsrsearch=${encodeURIComponent(
          searchQuery
        )}&format=json&origin=*`
      );
      const data = await response.json();
      const pages = data.query?.pages || {};
      const results = Object.values(pages) as SearchResult[];
      setSearchResults(results);
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      handleSearch(searchTerm);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setIsSearching(false);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSearch(suggestion);
  };

  const fetchSectionResults = async (section: Section) => {
    if (section.id === 'trending') return;
    
    try {
      const response = await fetch(
        `https://${language}.wikipedia.org/w/api.php?action=query&generator=search&gsrlimit=10&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=400&gsrsearch=${encodeURIComponent(
          section.query
        )}&format=json&origin=*`
      );
      const data = await response.json();
      const pages = data.query?.pages || {};
      const results = Object.values(pages) as SearchResult[];
      setSectionResults(results);
    } catch (error) {
      console.error('Error fetching section results:', error);
      setSectionResults([]);
    }
  };

  useEffect(() => {
    const currentSection = SECTIONS.find(section => section.id === activeSection);
    if (currentSection) {
      fetchSectionResults(currentSection);
    }
  }, [activeSection, language]);

  return (
    <div className="min-h-screen bg-white dark:bg-black light:bg-white p-4">
      <form onSubmit={handleSubmit} className="relative mb-6">
        <div className="flex items-center bg-gray-100 dark:bg-gray-900 light:bg-gray-100 rounded-full px-4 py-2">
          <Search size={20} className="text-gray-400" />
          <input
            ref={searchInputRef}
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowSuggestions(!!suggestions.length)}
            placeholder="Search Wikipedia"
            className="bg-transparent border-none focus:outline-none dark:text-white light:text-black ml-2 w-full"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white light:hover:text-black"
            >
              <X size={20} />
            </button>
          )}
          {isLoading && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent ml-2" />
          )}
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className="absolute left-0 right-0 mt-2 bg-gray-100 dark:bg-gray-900 light:bg-gray-100 rounded-lg overflow-hidden shadow-lg z-50"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full px-4 py-3 text-left hover:bg-gray-200 dark:hover:bg-gray-800 light:hover:bg-gray-200 dark:text-white light:text-black transition-colors duration-150 ease-in-out"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="flex items-center">
                  <Search size={16} className="text-gray-400 mr-2" />
                  {suggestion}
                </div>
              </button>
            ))}
          </div>
        )}
      </form>

      {!isSearching && (
        <>
          <div className="mb-4 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 pb-2">
              {SECTIONS.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap ${activeSection === section.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300'}`}
                >
                  {section.name}
                </button>
              ))}
            </div>
          </div>

          {activeSection === 'trending' ? (
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <TrendingUp size={20} className="mr-2 dark:text-white light:text-black" />
                <h2 className="text-lg font-bold dark:text-white light:text-black">Trending on Wikipedia</h2>
              </div>
              <div className="space-y-4">
                {trendingArticles.map((article, index) => (
                  <div
                    key={index}
                    className="bg-gray-100 dark:bg-gray-900 light:bg-gray-100 rounded-lg p-4"
                    onClick={() => window.open(`https://${language}.wikipedia.org/wiki/${encodeURIComponent(article.title)}`, '_blank')}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1 dark:text-white light:text-black">{article.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 light:text-gray-600 line-clamp-2">{article.extract}</p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400 light:text-gray-500 ml-4">
                        Trending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {sectionResults.map((result) => (
                <div
                  key={result.pageid}
                  className="bg-gray-100 dark:bg-gray-900 light:bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => window.open(`https://${language}.wikipedia.org/?curid=${result.pageid}`, '_blank')}
                >
                  {result.thumbnail && (
                    <img
                      src={result.thumbnail.source}
                      alt={result.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 dark:text-white light:text-black">{result.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 light:text-gray-600 line-clamp-3">{result.extract}</p>
                  </div>
                </div>
              ))}
              {sectionResults.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 light:text-gray-500 py-8">
                  No articles found in this section
                </div>
              )}
            </div>
          )}
        </>
      )}

      {isSearching && (
        <div className="space-y-4">
          {searchResults.map((result) => (
            <div
              key={result.pageid}
              className="bg-gray-100 dark:bg-gray-900 light:bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => window.open(`https://${language}.wikipedia.org/?curid=${result.pageid}`, '_blank')}
            >
              {result.thumbnail && (
                <img
                  src={result.thumbnail.source}
                  alt={result.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2 dark:text-white light:text-black">{result.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 light:text-gray-600 line-clamp-3">{result.extract}</p>
              </div>
            </div>
          ))}
          {searchResults.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 light:text-gray-500 py-8">
              No results found for "{searchTerm}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Discover;