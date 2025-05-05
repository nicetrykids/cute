import { useQuery } from 'react-query';
import axiosInstance from '../axios/axios';
import { cacheComics } from '@/lib/db/indexedDb';
import type { Comic } from '@/models/Comic';

const COMICS_URL = 'https://raw.githubusercontent.com/nicetrykids/uploadjson/refs/heads/main/comics.json';

interface ComicsResponse {
  comics: Comic[];
}

export function useComicsQuery() {
  return useQuery<ComicsResponse>({
    queryKey: ['comics'],
    queryFn: async () => {
      const { data } = await axiosInstance.get<ComicsResponse>(COMICS_URL);
      cacheComics(data.comics);
      return data;
    },
  });
} 