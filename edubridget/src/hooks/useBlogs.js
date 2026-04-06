import { useQuery } from '@tanstack/react-query';
import { blogService } from '../services/cmsService';

/**
 * Hook to fetch all blogs from Firestore
 * Uses a default 5-minute staleTime for caching.
 */
export function useBlogs() {
  return useQuery({
    queryKey: ['blogs'],
    queryFn: blogService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
