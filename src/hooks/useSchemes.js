import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useSchemes(filters) {
  return useQuery({
    queryKey: ["schemes", filters],
    queryFn: async () => {
      const params = {};
      if (filters.q) params.search = filters.q;
      if (filters.state && filters.state !== "All India") params.state = filters.state;
      if (filters.category && filters.category !== "All") params.category = filters.category;
      if (filters.educationLevel && filters.educationLevel !== "All")
        params.educationLevel = filters.educationLevel;
      if (filters.gender && filters.gender !== "All") params.gender = filters.gender;
      params.page = filters.page ?? 1;
      params.limit = filters.limit ?? 24;

      const { data } = await api.get("/schemes", { params });
      return {
        items: (data?.data ?? []),
        meta: data?.meta,
      };
    },
    retry: false,
    staleTime: 30_000,
  });
}
