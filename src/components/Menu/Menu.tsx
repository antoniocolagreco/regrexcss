import React from 'react';
import { Views } from '../../views/Views';
import Icon from '../Icons/Icon';
import css from './Menu.module.css';
import MenuLink from './MenuLink';

interface MenuProps {}

const Menu = (props: MenuProps) => {
  return (
    <menu className={css.menu}>
      <li>
        <MenuLink to={Views.FONTS}>
          <div className={css['link-content']}>
            <Icon type='segment' className={css['link-icon']} />
            <span className={css['link-text']}>Fonts</span>
          </div>
        </MenuLink>
      </li>
      <li>
        <MenuLink to={Views.GUTTERS}>
          <div className={css['link-content']}>
            <Icon type='margin' className={css['link-icon']} />
            <span className={css['link-text']}>Gutters</span>
          </div>
        </MenuLink>
      </li>
      <li>
        <MenuLink to={Views.COLORS}>
          <div className={css['link-content']}>
            <Icon type='palette' className={css['link-icon']} />
            <span className={css['link-text']}>Colors</span>
          </div>
        </MenuLink>
      </li>
    </menu>
  );
};

export default Menu;
