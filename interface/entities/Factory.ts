export interface Factory {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  updatedAt: string;

  /** Accessors */

  /** Relations */

  /** Pivots */
  pivot: {
    quantity: number | null;
  };

  /** Texts */
}
