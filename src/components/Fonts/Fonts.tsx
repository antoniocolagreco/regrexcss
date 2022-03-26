import React, { FC, HTMLAttributes } from 'react';
import css from './Fonts.module.css';

type FontClass = {
  name: string;
  sizes: [number, number, number, number, number];
};

const initialSettings = {}

interface FontsProps {}

const Fonts = (props: HTMLAttributes<HTMLElement> & FontsProps) => {
  return (
    <section>
      <table className={css['typography-table']}>
        <thead>
          <tr>
            <th></th>
            <th>
              <span className={css.name}>Extra small devices</span>
            </th>
            <th>
              <span className={css.name}>Small devices</span>
            </th>
            <th>
              <span className={css.name}>Medium devices</span>
            </th>
            <th>
              <span className={css.name}>Large devices</span>
            </th>
            <th>
              <span className={css.name}>Extra large devices</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <FontsTableRow name='Display <h1>' />
          <FontsTableRow name='Title Large <h2>' />
          <FontsTableRow name='Title Normal <h3>' />
          <FontsTableRow name='Title Small <h4>' />
          <FontsTableRow name='Body Large <h5>' />
          <FontsTableRow name='Body Normal <h6> <p>' />
          <FontsTableRow name='Body Small <small>' />
        </tbody>
      </table>
    </section>
  );
};

interface FontsTableRowProps {
  name: string;
  value?: FontClass;
  onChange?: (value: FontClass | undefined) => void;
}

const FontsTableRow: FC<HTMLAttributes<HTMLTableRowElement> & FontsTableRowProps> = (props) => {
  const { name } = props;
  return (
    <>
      <tr>
        <td>
          <span className={css.name}>{name}</span>
        </td>
      </tr>
      <tr className={css['size-row']}>
        <td>
          <span className={css['small-label']}>Size (REM)</span>
        </td>
        <td>
          <input type='text' />
        </td>
        <td>
          <input type='text' />
        </td>
        <td>
          <input type='text' />
        </td>
        <td>
          <input type='text' />
        </td>
        <td>
          <input type='text' />
        </td>
      </tr>
      <tr className={css['spacing-row']}>
        <td>
          <span className={css['small-label']}>Letter spacing (PX)</span>
        </td>
        <td>
          <input type='text' />
        </td>
        <td>
          <input type='text' />
        </td>
        <td>
          <input type='text' />
        </td>
        <td>
          <input type='text' />
        </td>
        <td>
          <input type='text' />
        </td>
      </tr>
      <tr className={css['height-row']}>
        <td>
          <span className={css['small-label']}>Line height</span>
        </td>
        <td>
          <input type='text' />
        </td>
        <td>
          <input type='text' />
        </td>
        <td>
          <input type='text' />
        </td>
        <td>
          <input type='text' />
        </td>
        <td>
          <input type='text' />
        </td>
      </tr>
    </>
  );
};

export default Fonts;
