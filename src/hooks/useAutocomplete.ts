import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Suggestion {
  id: string;
  name: string;
  category: string;
  value: string | number;
}

export const useAutocomplete = (query: string) => {
  return useQuery<Suggestion[]>({
    queryKey: ['autocomplete', query],
    queryFn: async () => {
      const res = await axios.get(
        `https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete`
      );
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
