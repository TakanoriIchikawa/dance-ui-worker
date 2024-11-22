export const useDrawer = () => {
  const isDrawer = useState<boolean>("isDrawer", () => {
    return false;
  });

  return {
    isDrawer,
  };
};
