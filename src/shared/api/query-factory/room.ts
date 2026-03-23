import { queryOptions } from '@tanstack/react-query';
import { getRooms } from '../remotes';

export const roomQueries = {
  listKey: () => ['rooms'] as const,
  list: () =>
    queryOptions({
      queryKey: [...roomQueries.listKey()],
      queryFn: getRooms,
    }),
};
