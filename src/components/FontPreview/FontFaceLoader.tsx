import React, { FC, HTMLAttributes, memo } from 'react';
import { Font, Variant } from '../../types/Font';

interface FontFaceLoaderProps {
  font: Font;
  variant?: Variant | undefined;
}

const VARIANTS_WEIGHTS_PRIORITY_LIST = [400, 300, 500, 200, 600, 700, 100, 800, 900];

const FontFaceLoader: FC<HTMLAttributes<HTMLStyleElement> & FontFaceLoaderProps> = (props) => {
  const { font, variant, ...otherProps } = props;

  const fontFamily = font.family.split(' ').length > 1 ? `"${font.family}"` : font.family;

  let src: string | undefined = undefined;
  if (variant) {
    src = variant.src;
  } else {
    for (let VARIANT_P of VARIANTS_WEIGHTS_PRIORITY_LIST) {
      for (let variant of font.variants) {
        if (VARIANT_P === variant.weight && variant.supportRegular) {
          src = variant.src;
        }
        if (src) break;
      }
      if (src) break;
    }
    if (!src) {
      for (let VARIANT_P of VARIANTS_WEIGHTS_PRIORITY_LIST) {
        for (let variant of font.variants) {
          if (VARIANT_P === variant.weight && variant.supportItalic) {
            src = variant.src;
          }
          if (src) break;
        }
        if (src) break;
      }
    }
  }

  if (src === undefined) console.error(`Invalid URL for font ${fontFamily}`);

  return (
    <style
      dangerouslySetInnerHTML={{ __html: `@font-face { font-family: ${fontFamily}; src: url("${src}"); }` }}
      {...otherProps}
    ></style>
  );
};

export default memo(FontFaceLoader);
