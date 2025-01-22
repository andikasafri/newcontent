import { useEffect, useRef, useState } from 'react';

interface UseInfiniteScrollOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll<T>(
  loadMore: () => Promise<T[]>,
  options: UseInfiniteScrollOptions = {}
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver>();
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        const target = entries[0];
        if (target.isIntersecting && !loading && hasMore) {
          setLoading(true);
          try {
            const newItems = await loadMore();
            if (newItems.length === 0) {
              setHasMore(false);
            } else {
              setItems(prev => [...prev, ...newItems]);
            }
          } catch (error) {
            console.error('Failed to load more items:', error);
          } finally {
            setLoading(false);
          }
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '50px',
      }
    );

    observerRef.current = observer;

    return () => {
      observer.disconnect();
    };
  }, [loadMore, loading, hasMore, options.threshold, options.rootMargin]);

  useEffect(() => {
    const currentTarget = targetRef.current;
    const currentObserver = observerRef.current;

    if (currentTarget && currentObserver) {
      currentObserver.observe(currentTarget);
    }

    return () => {
      if (currentTarget && currentObserver) {
        currentObserver.unobserve(currentTarget);
      }
    };
  }, [targetRef.current]);

  return {
    items,
    loading,
    hasMore,
    targetRef,
  };
}