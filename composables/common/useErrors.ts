export const useErrors = () => {
  const errors = useState<any>("errors", () => {
    return {};
  });

  return {
    errors,
  };
};
