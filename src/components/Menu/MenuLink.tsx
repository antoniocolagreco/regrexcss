import React, { FC, RefAttributes } from 'react';
import { LinkProps, NavLink } from 'react-router-dom';
import classes from '../../utilities/classes';
import css from './MenuLink.module.css';

interface MenuLinkProps {
  selected?: boolean;
}

const MenuLink: FC<LinkProps & RefAttributes<HTMLAnchorElement> & MenuLinkProps> = (props) => {
  const { children, className, ...otherProps } = props;
  return (
    <NavLink
      className={(navData) => classes(css['menu-link'], navData.isActive ? css.active : undefined, className)}
      {...otherProps}
    >
      {children}
    </NavLink>
  );
};

export default MenuLink;
