import React, { FC, RefAttributes } from 'react';
import { Link, LinkProps } from 'react-router-dom';
import classes from '../../utilities/classes';
import css from './MenuLink.module.css';

interface MenuLinkProps {
  selected?: boolean;
}

const MenuLink: FC<LinkProps & RefAttributes<HTMLAnchorElement> & MenuLinkProps> = (props) => {
  const { children, className, ...otherProps } = props;
  return (
    <Link className={classes(css['menu-link'], className)} {...otherProps}>
      {children}
    </Link>
  );
};

export default MenuLink;
