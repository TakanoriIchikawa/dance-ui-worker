export type SearchAddressResponse = {
  status: number;
  message: string | null;
  results: Result[] | null;
};

type Result = {
  address1: string;
  address2: string;
  address3: string;
  kana1: string;
  kana2: string;
  kana3: string;
  prefcode: string;
  zipcode: string;
};
