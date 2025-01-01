import type { Breadcrumbs } from "@/types/common/Breadcrumbs";

export const useBreadcrumbs = () => {
  const breadcrumbs = useState<Breadcrumbs>("breadcrumbs", () => {
    return [];
  });

  return {
    breadcrumbs,
  };
};
