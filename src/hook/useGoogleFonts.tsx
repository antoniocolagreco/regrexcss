import { useLayoutEffect, useState } from 'react';
import { Font, Variant } from '../types/Font';

export type UseGoogleFontsReturnType = [Font[], string[], Variant[], string[], boolean, boolean, string];

export type GoogleResponse = {
  kind: string;
  items: GoogleFont[];
};

export type FontFiles = { [key: string]: string };

export type GoogleFont = {
  kind: string;
  family: string;
  category: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: FontFiles;
};

export type GoogleFonts = [
  fonts: GoogleFont[],
  categories: string[],
  variants: string[],
  subsets: string[],
  loading: boolean,
  valid: boolean,
  error: string
];

const GOOGLE_API_URL = `https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.REACT_APP_GOOGLE_FONTS_API_KEY}`;
const REQUEST_INTERVAL = 60000;

const useGoogleFonts = (): UseGoogleFontsReturnType => {
  const [fonts, setFonts] = useState<Font[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [valid, setValid] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    const myInit = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };
    await fetch(GOOGLE_API_URL, myInit)
      .then((response) => {
        if (response.ok) {
          response.json().then((jsonData: GoogleResponse) => {
            const [_fonts, _categories, _variants, _languages] = convertFonts(jsonData.items);
            setFonts(_fonts);
            setCategories(_categories);
            setVariants(_variants);
            setLanguages(_languages);
            setValid(true);
          });
        }
      })
      .catch((error: Error) => {
        setValid(false);
        setError(error.message);
        setTimeout(() => fetchData(), REQUEST_INTERVAL);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useLayoutEffect(() => {
    fetchData();
  }, []);

  return [fonts, categories, variants, languages, loading, valid, error];
};

export default useGoogleFonts;

const convertFonts = (googleFonts: GoogleFont[]): [Font[], string[], Variant[], string[]] => {
  const fonts: Font[] = [];
  const categories: string[] = [];
  const variants: Variant[] = [];
  const languages: string[] = [];
  for (let currentFont of googleFonts) {
    const font: Font = {
      family: currentFont.family,
      type: 'google',
      category: currentFont.category,
      languages: currentFont.subsets,
      variants: convertVariants(currentFont.variants, currentFont.files),
    };
    fonts.push(font);
    addCategory(font, categories);
    addVariants(font, variants);
    addLanguages(font, languages);
  }
  return [fonts, categories, variants, languages];
};

const convertVariants = (variants: string[], files: FontFiles): Variant[] => {
  const result: Variant[] = [];
  for (let currentVariant of variants) {
    if (currentVariant === 'regular') {
      result.push({
        type: '400',
        weight: 400,
        supportItalic: false,
        supportRegular: true,
        supportOblique: true,
        src: files[currentVariant],
      });
      continue;
    }
    if (currentVariant === 'italic') {
      result.push({
        type: '400 Italic',
        weight: 400,
        supportItalic: true,
        supportRegular: false,
        supportOblique: false,
        src: files[currentVariant],
      });
      continue;
    }
    if (currentVariant.indexOf('italic')) {
      const weight = currentVariant.substring(0, 2);
      result.push({
        type: weight + ' Italic',
        weight: Number.parseInt(weight),
        supportItalic: true,
        supportRegular: false,
        supportOblique: false,
        src: files[currentVariant],
      });
      continue;
    }
    const weight = currentVariant.substring(0, 2);
    result.push({
      type: weight,
      weight: Number.parseInt(weight),
      supportItalic: false,
      supportRegular: true,
      supportOblique: true,
      src: files[currentVariant],
    });
  }
  return result;
};

const addCategory = (font: Font, categories: string[]) => {
  if (font.category && !categories.includes(font.category)) categories.push(font.category);
};

const addVariants = (font: Font, variants: Variant[]) => {
  for (let currentFontVariant of font.variants) {
    for (let currentVariant of variants) {
      if (currentVariant.type === currentFontVariant.type) continue;
      variants.push(currentFontVariant);
    }
  }
};

const addLanguages = (font: Font, languages: string[]) => {
  for (let currentFontLanguage of font.languages) {
    if (languages.includes(currentFontLanguage)) continue;
    languages.push(currentFontLanguage);
  }
};
