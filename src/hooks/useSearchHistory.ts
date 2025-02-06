export const useSearchHistory = () => {
  const [history, setHistory] = useState<string[]>([]);
  
  const addToHistory = (term: string) => {
    setHistory(prev => [term, ...prev].slice(0, 10));
  };
};