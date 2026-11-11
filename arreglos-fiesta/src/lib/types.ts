export type BuilderOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  emoji: string;
  color: string | null;
  allowQuantity: boolean;
  maxQuantity: number;
};

export type BuilderGroup = {
  id: string;
  slug: string;
  name: string;
  description: string;
  multiple: boolean;
  required: boolean;
  options: BuilderOption[];
};

/** optionId -> cantidad */
export type Selections = Record<string, number>;

export type CartItem =
  | { key: string; kind: "producto"; productId: string; name: string; emoji: string; unitPrice: number; quantity: number }
  | {
      key: string;
      kind: "personalizado";
      name: string;
      emoji: string;
      selections: Selections;
      customText: string;
      summary: string[];
      unitPrice: number;
      quantity: number;
    };
