export interface FactoryApi {
  id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;

  /** Accessors */

  /** Relations */

  /** Pivots */
  pivot: {
    quantity: number | null;
  };

  /** Texts */
}
