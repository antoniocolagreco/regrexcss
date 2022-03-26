import React, { Dispatch, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import css from './App.module.css';
import Header from './components/Header/Header';
import Menu from './components/Menu/Menu';
import useGoogleFonts from './hook/useGoogleFonts';
import { SetFontsAction, typographyActions } from './store/store';
import FontSelectionView from './views/FontSelectionView';
import Home from './views/Home';
import { Views } from './views/Views';

function App() {
  const dispatchFonts = useDispatch<Dispatch<SetFontsAction>>();
  const [fonts, categories, variants, languages, loading, valid, error] = useGoogleFonts();

  useEffect(() => {
    dispatchFonts(
      typographyActions.setFonts({
        fonts: fonts,
        languages: languages,
        categories: categories,
        variants: variants,
        loading: loading,
        valid: valid,
        error: error,
      })
    );
  }, [valid, loading, error]);

  return (
    <div className={css.app}>
      <aside className={css['menu-container']}>
        <Header />
        <Menu />
      </aside>
      <main className={css['main-container']}>
        <Routes>
          <Route path={Views.HOME} element={<Home />} />
          <Route path={Views.FONTS} element={<FontSelectionView />} />
          <Route path='*' element={<Navigate to='' />} />
        </Routes>
      </main>
      <footer></footer>
    </div>
  );
}

export default App;
