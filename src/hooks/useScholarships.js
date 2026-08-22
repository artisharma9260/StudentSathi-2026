import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useScholarships(filters) {
  return useQuery({
    queryKey: ["scholarships", filters],
    queryFn: async () => {
      const params = {};
      if (filters.q) params.q = filters.q;
      if (filters.state && filters.state !== "All India") params.state = filters.state;
      if (filters.educationLevel && filters.educationLevel !== "All")
        params.educationLevel = filters.educationLevel;
      params.page = filters.page ?? 1;
      params.limit = filters.limit ?? 24;

      const { data } = await api.get("/scholarships", { params });
      return {
        items: data?.data ?? [],
        meta: data?.meta,
      };
    },
    retry: false,
    staleTime: 30_000,
  });
}
