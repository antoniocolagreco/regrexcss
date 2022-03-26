export type Variant = {
  type: string;
  weight: number;
  supportRegular: boolean;
  supportItalic: boolean;
  supportOblique: boolean;
  src: string;
};

export type Font = {
  family: string;
  type: 'google' | undefined;
  category: string | undefined;
  variants: Variant[];
  languages: string[];
};
