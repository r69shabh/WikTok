import React, { useEffect, useState, useRef } from 'react';
import ArticleCard from '../components/ArticleCard';
import { useInView } from 'react-intersection-observer';
import { ArrowDown } from 'lucide-react';
import { Comment } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface WikipediaResponse {
  query: {
    random: Array<{
      id: number;
      title: string;
    }>;
  };
}

interface WikipediaContent {
  query: {
    pages: {
      [key: string]: {
        extract: string;
        thumbnail?: {
          source: string;
        };
      };
    };
  };
}

interface Article {
  id: number;
  title: string;
  extract: string;
  imageUrl?: string;
  likes: number;
  comments: Comment[];
}

const HomeContent = () => {
  const [articles, setArticles] = useState<Article[]>(() => {
    // Initialize articles from sessionStorage if available
    const savedArticles = sessionStorage.getItem('homeArticles');
    return savedArticles ? JSON.parse(savedArticles) : [];
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();
  const startY = useRef(0);
  const { language } = useLanguage();

  // Save articles to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('homeArticles', JSON.stringify(articles));
  }, [articles]);

  const fetchRandomArticles = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      // Always fetch new articles
      const randomResponse = await fetch(
        `https://${language}.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=5&format=json&origin=*`
      );
      const randomData: WikipediaResponse = await randomResponse.json();

      // Fetch content for each article
      const articlePromises = randomData.query.random.map(async (article) => {
        const contentResponse = await fetch(
          `https://${language}.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro=1&explaintext=1&piprop=thumbnail&pithumbsize=800&pageids=${article.id}&format=json&origin=*`
        );
        const contentData: WikipediaContent = await contentResponse.json();
        const page = contentData.query.pages[article.id];
        const extract = page.extract;
        const imageUrl = page.thumbnail?.source;

        // Mock data for social features
        return {
          id: article.id,
          title: article.title,
          extract,
          imageUrl,
          likes: Math.floor(Math.random() * 1000),
          comments: [
            {
              id: 1,
              author: 'User123',
              content: 'This is fascinating! I learned something new today.',
              likes: 42,
              timestamp: '2h ago',
              replies: [
                {
                  id: 2,
                  author: 'HistoryBuff',
                  content: 'Great observation! Let me add some context...',
                  likes: 15,
                  timestamp: '1h ago',
                }
              ]
            }
          ]
        };
      });

      const articlesWithContent = await Promise.all(articlePromises);
      // For initial load or refresh, replace articles. For infinite scroll, append
      setArticles(prev => prev.length === 0 ? articlesWithContent : [...prev, ...articlesWithContent]);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add effect for initial fetch
  useEffect(() => {
    if (articles.length === 0) {
      fetchRandomArticles();
    }
  }, []);

  // Add effect for infinite scroll
  useEffect(() => {
    if (inView) {
      fetchRandomArticles();
    }
  }, [inView]);

  const handleTouchEnd = () => {
    if (isPulling && pullProgress >= 1) {
      // Clear both articles and storage on manual refresh
      setArticles([]);
      sessionStorage.removeItem('homeArticles');
      fetchRandomArticles();
    }
    setIsPulling(false);
    setPullProgress(0);
  };

  const [isPulling, setIsPulling] = useState(false);
  const [pullProgress, setPullProgress] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;
    if (diff > 0 && window.scrollY === 0) {
      setIsPulling(true);
      setPullProgress(Math.min(diff / 100, 1));
    }
  };

  return (
    <div 
      className="snap-scroll-container hide-scrollbar"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'pan-y' }}
    >
      {isPulling && (
        <div 
          className="flex items-center justify-center h-16 transition-transform"
          style={{ transform: `translateY(${pullProgress * 64}px)` }}
        >
          <ArrowDown 
            className="animate-bounce" 
            style={{ 
              transform: `rotate(${pullProgress * 180}deg)`,
              opacity: pullProgress 
            }} 
          />
        </div>
      )}
      <div className="space-y-0">
        {articles.map((article) => (
          <div key={`${article.id}-${Math.random()}`} className="snap-scroll-item">
            <ArticleCard 
              title={article.title}
              extract={article.extract}
              imageUrl={article.imageUrl}
              pageId={article.id}
              likes={article.likes}
              comments={article.comments}
            />
          </div>
        ))}
      </div>
      <div ref={ref} className="h-1" />
      {isLoading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white" />
        </div>
      )}
    </div>
  );
};

export default function Home() {
  const scrollPositionRef = useRef(0);

  useEffect(() => {
    const savedPosition = sessionStorage.getItem('homeScrollPosition');
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition));
    }

    return () => {
      scrollPositionRef.current = window.scrollY;
      sessionStorage.setItem('homeScrollPosition', scrollPositionRef.current.toString());
    };
  }, []);

  return <HomeContent />;
}