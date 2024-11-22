import type { Breadcrumbs } from "@/type/common/Breadcrumbs";

export const useBreadcrumbs = () => {
  const breadcrumbs = useState<Breadcrumbs>("breadcrumbs", () => {
    return [];
  });

  return {
    breadcrumbs,
  };
};
