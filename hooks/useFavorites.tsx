"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface IFavoritesContext {
  favoriteIds: Set<string> | null;
  setFavorite: (productId: string, isFavorite: boolean) => Promise<boolean>;
}

const favoriteContext = createContext<IFavoritesContext | null>(null);

export const useFavorites = () => {
  const context = useContext(favoriteContext);
  if (!context)
    throw new Error("useFavorites можно вызвать только  внутри провайдера");
  return context;
};

const fetchFavoriteIds = async () => {
  try {
    const res = await fetch("/api/favorites/ids", { cache: "no-store" });
    if (!res.ok) throw new Error("Данные не загрузились");
    const { ids }: { ids: string[] } = await res.json();
    return new Set(ids);
  } catch (error) {
    console.log(error);
    return null;
  }
};

const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteIds, setFavoriteIds] = useState<Set<string> | null>(null);
  const queues = useRef(new Map<string, Promise<boolean>>());

  useEffect(() => {
  let ignore = false;

  fetchFavoriteIds().then((ids) => {
    if (!ignore && ids) {
      setFavoriteIds(ids);
    }
  });

  return () => {
    ignore = true;
  };
}, []);

  const enqueue = useCallback(
    (key: string, request: () => Promise<Response>) => {
      const run = async () => {
        try {
          const res = await request();
          if (!res.ok) {
            throw new Error(`Ошибка ${res.status}`);
          }
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      };
      const next = (queues.current.get(key) ?? Promise.resolve(true)).then(run);
      queues.current.set(key, next);
      return next;
    },
    [],
  );

  const loadFavoriteIds = useCallback(async () => {
    const ids = await fetchFavoriteIds();
    if (ids) setFavoriteIds(ids);
  },[]);



  const setFavorite = useCallback(async (id: string, isFavorite: boolean) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFavorite) {
        next.add(id);
      } else next.delete(id);
      return next;
    });

    const ok = await enqueue(`favorite${id}`, () =>
      fetch(`/api/favorites/${id}`, { method: isFavorite ? "PUT" : "DELETE" }),
    );
    if (!ok) {
      await loadFavoriteIds();
    }
    return ok;
  },[enqueue, loadFavoriteIds])

  const value = useMemo(() => ({
      favoriteIds, setFavorite 
  }),[favoriteIds, setFavorite]);

  return (
    <favoriteContext.Provider value={value}>
      {children}
    </favoriteContext.Provider>
  );
};

export default FavoritesProvider;
