import React from 'react';

export default function InfiniteScroll({
  children,
  next,
  hasMore,
  loader,
  options = {
    threshold: 0,
    root: null,
    rootMargin: '0%',
  },
}: {
  children: React.ReactNode;
  next: () => Promise<void> | void;
  hasMore: boolean;
  loader?: React.ReactNode;
  options?: IntersectionObserverInit;
}): JSX.Element {
  const observer = React.useRef<any>(null);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const isLoadMore = React.useRef(false);
  const [entry, setEntry] = React.useState<IntersectionObserverEntry>();

  React.useEffect(() => {
    const fetchMoreData = async () => {
      try {
        if (isLoadMore.current) return;
        isLoadMore.current = true;
        await next();
      } finally {
        isLoadMore.current = false;
      }
    };
    entry?.isIntersecting && fetchMoreData();
    // eslint-disable-next-line
  }, [entry]);

  React.useEffect(() => {
    const handleObserver = async (entities: IntersectionObserverEntry[]) => {
      if (entities[0].isIntersecting) {
        setEntry(entities[0]);
      }
    };

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(handleObserver, options);

    if (ref.current) {
      observer.current.observe(ref.current);
    }

    return () => observer.current.disconnect();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {children}
      {hasMore && <div ref={ref}>{loader}</div>}
    </>
  );
}
