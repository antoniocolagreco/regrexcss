import { Dispatch } from '@reduxjs/toolkit';
import React, { FC, HTMLAttributes } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FontPreview from '../components/FontPreview/FontPreview';
import Selector from '../components/Selector/Selector';
import {
  RootState,
  SetSelectedFontAction,
  SetSelectedFontByNameAction,
  typographyActions,
  TypographyState
} from '../store/store';
import { Font } from '../types/Font';
import css from './FontSelectionView.module.css';

interface FontSelectionViewProps {}

const FontSelectionView: FC<FontSelectionViewProps & HTMLAttributes<HTMLDivElement>> = (props) => {
  const { ...otherProps } = props;
  const dispatchFontByName = useDispatch<Dispatch<SetSelectedFontByNameAction>>();
  const dispatchFont = useDispatch<Dispatch<SetSelectedFontAction>>();
  const typographyState = useSelector<RootState, TypographyState>((state) => state.typographyReducer);

  const onFontSelectHandler = (value: Font) => {
    dispatchFont(typographyActions.setSelectedFont({ font: value }));
  };

  const onFontSelectByNameHandler = (value: string) => {
    dispatchFontByName(typographyActions.setSelectedFontByName({ family: value }));
  };

  return (
    <div {...otherProps}>
      <Selector
        className={css.filter}
        options={typographyState.fonts}
        value={typographyState.selectedFont}
        onOptionSelect={onFontSelectHandler}
        onInputSelect={onFontSelectByNameHandler}
        optionLabel={(font: Font) => font.family}
        optionRender={(font: Font) => font.family}
      />
      {typographyState.selectedFont && <FontPreview font={typographyState.selectedFont} />}
    </div>
  );
};

export default FontSelectionView;
