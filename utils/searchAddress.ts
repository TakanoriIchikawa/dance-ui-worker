import type { SearchAddressResponse } from "@/types/api/SearchAddressResponse";

export const searchAddress = async (
  postalCode: string
): Promise<{ prefecture: string; city: string; town: string } | null> => {
  try {
    const API_URL = "https://zipcloud.ibsnet.co.jp/api/search";
    const response: SearchAddressResponse = await $fetch(API_URL, {
      params: { zipcode: postalCode },
      responseType: "json",
    });

    if (response.status === 200 && response.results) {
      const result = response.results[0];
      return {
        prefecture: result.address1,
        city: result.address2,
        town: result.address3,
      };
    }

    return null;
  } catch (error) {
    return null;
  }
};
