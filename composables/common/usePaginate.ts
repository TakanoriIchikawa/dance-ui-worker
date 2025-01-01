import type { Paginate } from "@/types/common/Paginate";

export const usePaginate = () => {
  const paginate = useState<Paginate>("paginate", () => {
    return {
      currentPage: 0,
      perPage: 0,
      lastPage: 0,
      total: 0,
    };
  });

  return {
    paginate,
  };
};
