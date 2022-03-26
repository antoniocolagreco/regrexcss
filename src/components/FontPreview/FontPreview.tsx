import { Property } from 'csstype';
import React, { CSSProperties, FC, Fragment, HTMLAttributes, useLayoutEffect, useRef, useState } from 'react';
import { Font } from '../../types/Font';
import classes from '../../utilities/classes';
import FontFaceLoader from './FontFaceLoader';
import css from './FontPreview.module.css';

interface FontPeviewProps {
  font: Font;
  fontSize?: Property.FontSize | undefined;
  fontWeight?: Property.FontWeight | undefined;
  fontSpacing?: Property.LetterSpacing | undefined;
  fontLineHeight?: Property.LineHeight | undefined;
  fontStyle?: Property.FontStyle | undefined;
}

const FontPreview: FC<HTMLAttributes<HTMLDivElement> & FontPeviewProps> = (props) => {
  const { fontSize, fontWeight, fontSpacing, fontLineHeight, fontStyle, font, className, children, ...otherProps } =
    props;
  const previewStyleInitialState: CSSProperties = {
    fontFamily: font.family,
    ...(fontSize ? { fontSize: fontSize } : {}),
    ...(fontWeight ? { fontWeight: fontWeight } : {}),
    ...(fontSpacing ? { letterSpacing: fontSpacing } : {}),
    ...(fontLineHeight ? { lineHeight: fontLineHeight } : {}),
    ...(fontStyle ? { fontStyle: fontStyle } : {}),
  };
  const [previewStyle, setPreviewStyle] = useState<CSSProperties>(previewStyleInitialState);
  const [previewFont, setPreviewFont] = useState<Font>(font);
  const [lastupdate, setLastupdate] = useState(new Date());
  let debounceDeelay = 0;
  const previewRef = useRef<HTMLDivElement>(null);
  let requestTimeout: NodeJS.Timeout;

  const updatePreview = () => {
    if (requestTimeout) clearTimeout(requestTimeout);
    if (new Date().getTime() - lastupdate.getTime() < 500) {
      debounceDeelay = 500;
    } else {
      debounceDeelay = 0;
    }
    setLastupdate(new Date());
    requestTimeout = setTimeout(() => {
      setPreviewStyle({
        fontFamily: font.family.includes(' ') ? '"' + font.family + '"' : font.family,
        ...(fontSize ? { fontSize: fontSize } : {}),
        ...(fontWeight ? { fontWeight: fontWeight } : {}),
        ...(fontSpacing ? { letterSpacing: fontSpacing } : {}),
        ...(fontLineHeight ? { lineHeight: fontLineHeight } : {}),
        ...(fontStyle ? { fontStyle: fontStyle } : {}),
      });
      setPreviewFont(font);
      fadeIn();
    }, debounceDeelay);
  };

  const fadeIn = () => {
    document.fonts.ready.then(() => {
      if (!previewRef.current) return;
      previewRef.current.classList.add(css.visible);
      void previewRef.current.offsetHeight;
    });
  };

  const fadeOut = () => {
    if (!previewRef.current) return;
    previewRef.current.ontransitionend = (event: TransitionEvent) => {
      if (event.target !== event.currentTarget) return;
      if (previewRef.current) {
        previewRef.current.ontransitionend = null;
        updatePreview();
      }
    };
    if (!previewRef.current.classList.contains(css.visible)) {
      previewRef.current.ontransitionend = null;
      updatePreview();
    }
    previewRef.current.classList.remove(css.visible);
    void previewRef.current.offsetHeight;
  };

  useLayoutEffect(() => {
    if (font === previewFont) {
      fadeIn();
    } else {
      fadeOut();
    }
    return () => {
      clearTimeout(requestTimeout);
    };
  }, [font.family]);

  return (
    <div className={classes(css['preview-container'], className)} {...otherProps}>
      {previewFont.type && <FontFaceLoader font={previewFont} />}
      <div className={css.preview} style={previewStyle} ref={previewRef}>
        {children ? (
          children
        ) : (
          <Fragment>
            <h1>Lorem ipsum dolor sit amet</h1>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
            <h2>Lorem ipsum dolor sit amet</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
            <h3>Lorem ipsum dolor sit amet</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
            <h4>Lorem ipsum dolor sit amet</h4>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </p>
            <h5>Lorem ipsum dolor sit amet</h5>
            <small>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
              ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
              fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt
              mollit anim id est laborum.
            </small>
          </Fragment>
        )}
      </div>
    </div>
  );
};

export default FontPreview;
