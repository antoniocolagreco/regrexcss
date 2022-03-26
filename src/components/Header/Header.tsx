import React, { FC, HTMLAttributes } from 'react';
import { Link } from 'react-router-dom';
import classes from '../../utilities/classes';
import { Views } from '../../views/Views';
import css from './Header.module.css';

interface HeaderProps {}

const Header: FC<HTMLAttributes<HTMLHeadElement> & HeaderProps> = (props) => {
  const { className, children, ...otherProps } = props;
  return (
    <header className={classes(css.header, className)} {...otherProps}>
      <Link to={Views.HOME} className={css['header-link']}>
        <span className={css.title}>RegreXCSS</span>
      </Link>
    </header>
  );
};

export default Header;
