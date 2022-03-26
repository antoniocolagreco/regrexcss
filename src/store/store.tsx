import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Font, Variant } from '../types/Font';

const MENU = 'menu';
const TYPOGRAPHY = 'typography';
const GUTTERS = 'gutters';
const COLORS = 'colors';

const getNewCustomFont = (family: string): Font => {
  return {
    family: family,
    type: undefined,
    category: undefined,
    variants: [],
    languages: [],
  };
};

type SelectedCategory = {
  category: string;
  selected: boolean;
};
type SelectedLanguages = {
  alphabet: string;
  selected: boolean;
};
type SelectedVariant = {
  variant: string;
  selected: boolean;
};

export interface TypographyState {
  fonts: Font[];
  categories: string[];
  languages: string[];
  variants: Variant[];
  valid: boolean;
  loading: boolean;
  error: string;
  selectedFont: Font | undefined;
  selectedFontIndex: number;
  selectedCategories: SelectedCategory[];
  selectedLanguages: SelectedLanguages[];
  selectedVariants: SelectedVariant[];
}

const typographyInitialState: TypographyState = {
  fonts: [],
  categories: [],
  languages: [],
  variants: [],
  valid: false,
  loading: false,
  error: '',
  selectedFont: undefined,
  selectedFontIndex: -1,
  selectedCategories: [],
  selectedLanguages: [],
  selectedVariants: [],
};

export interface FontIndexPayload {
  index: number;
}

export interface FontNamePayload {
  family: string;
}

export interface FontPayload {
  font: Font;
}

export interface CategoriesIndexPayload {
  index: number;
  selected: boolean;
}

export interface LanguagesIndexPayload {
  index: number;
  selected: boolean;
}

export interface VariantsIndexPayload {
  index: number;
  selected: boolean;
}

export interface FontsDataPayload {
  fonts: Font[];
  categories: string[];
  languages: string[];
  variants: Variant[];
  loading: boolean;
  valid: boolean;
  error: string;
}

export interface SetSelectedFontAction extends PayloadAction<FontPayload> {}
export interface SetSelectedFontByNameAction extends PayloadAction<FontNamePayload> {}
export interface SetSelectedFontByIndexAction extends PayloadAction<FontIndexPayload> {}
export interface SetSelectedCategoriesByIndexAction extends PayloadAction<CategoriesIndexPayload> {}
export interface SetSelectedLanguagesByIndexAction extends PayloadAction<LanguagesIndexPayload> {}
export interface SetSelectedVariantsByIndexAction extends PayloadAction<VariantsIndexPayload> {}
export interface SetFontsAction extends PayloadAction<FontsDataPayload> {}

const typographySlice = createSlice({
  name: TYPOGRAPHY,
  initialState: typographyInitialState,
  reducers: {
    setSelectedFont(state: TypographyState, action: SetSelectedFontAction) {
      const newState: TypographyState = { ...state };
      if (!action.payload.font) return newState;
      newState.selectedFont = action.payload.font;
      return newState;
    },
    setSelectedFontByName(state: TypographyState, action: SetSelectedFontByNameAction) {
      const newState: TypographyState = { ...state };
      for (let font of newState.fonts) {
        if (font.family.toLowerCase() === action.payload.family.toLowerCase()) {
          newState.selectedFont = font;
          newState.selectedFontIndex = state.fonts.indexOf(font);
          return newState;
        }
      }
      newState.selectedFont = getNewCustomFont(action.payload.family);
      return newState;
    },
    setSelectedFontByindex(state: TypographyState, action: SetSelectedFontByIndexAction) {
      const newState: TypographyState = { ...state };
      newState.selectedFontIndex = action.payload.index;
      if (action.payload.index !== undefined && action.payload.index > -1) {
        newState.selectedFont = newState.fonts[action.payload.index];
      }
      return newState;
    },
    setRandomFont(state: TypographyState, action: {}) {
      const newState: TypographyState = { ...state };
      const randomIndex = Math.round(Math.random() * newState.fonts.length);
      newState.selectedFontIndex = randomIndex;
      newState.selectedFont = newState.fonts[randomIndex];
      return newState;
    },
    setFonts(state: TypographyState, action: SetFontsAction) {
      const newState: TypographyState = { ...state };
      newState.fonts = action.payload.fonts;
      newState.categories = action.payload.categories;
      newState.languages = action.payload.languages;
      newState.variants = action.payload.variants;
      newState.loading = action.payload.loading;
      newState.valid = action.payload.valid;
      newState.error = action.payload.error;
      /* RANDOM FONT */
      const randomIndex = Math.round(Math.random() * action.payload.fonts.length);
      newState.selectedFontIndex = randomIndex;
      newState.selectedFont = action.payload.fonts[randomIndex];
      return newState;
    },
    setSelectedCategories(state: TypographyState, action: SetSelectedCategoriesByIndexAction) {
      const newState: TypographyState = { ...state };
      return newState;
    },
    setSelectedAlphabets(state: TypographyState, action: SetSelectedLanguagesByIndexAction) {
      const newState: TypographyState = { ...state };
      return newState;
    },
    setSelectedVariants(state: TypographyState, action: SetSelectedVariantsByIndexAction) {
      const newState: TypographyState = { ...state };
      return newState;
    },
  },
});

export const typographyActions = typographySlice.actions;

const store = configureStore({
  reducer: { typographyReducer: typographySlice.reducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type StoreDispatch = typeof store.dispatch;

export default store;
