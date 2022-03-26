import React, {
  FC,
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import classes from '../../utilities/classes';
import css from './Selector.module.css';

interface SelectorProps<T> {
  options: T[];
  selectedOption: T | undefined;
  renderOptionsAs?: ((value: any) => ReactNode) | undefined;
  evaluateOptionsAs?: ((value: any) => string) | undefined;
  onSelect?: ((value: T) => void) | undefined;
  onChange?: ((value: T) => void) | undefined;
  filterDeelay?: number | undefined;
}

const Selector: FC<Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'onChange'> & SelectorProps<any>> = (props) => {
  const {
    options,
    selectedOption,
    renderOptionsAs = (value: any) => value,
    evaluateOptionsAs = (value: any) => value,
    onSelect,
    onChange,
    filterDeelay = 500,
    className,
    children,
    ...otherProps
  } = props;
  const [filteredOptions, setFilteredOptions] = useState<typeof selectedOption[]>(options);
  const [dropdownRendered, setDropdownRendered] = useState(false);
  const selectorRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  let currentElementRef = useRef<HTMLLIElement | null>(null);
  let inputElementRef = useRef<HTMLInputElement | null>(null);
  let selectedIndexRef = useRef<number | null>(null);
  let filterTimeout = useRef<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    if (!selectedOption || !inputElementRef.current) return;
    selectedIndexRef.current = options.indexOf(selectedOption);
    inputElementRef.current.value = evaluateOptionsAs(selectedOption);
  }, [selectedOption]);

  useLayoutEffect(() => {
    if (!dropdownRendered) return;
    if (!selectedIndexRef.current) return;
    if (!listRef.current) return;
    if (selectedIndexRef.current < 0) return;
    if (selectedIndexRef.current > options.length) return;
    currentElementRef.current = listRef.current.children[selectedIndexRef.current] as HTMLLIElement;
    currentElementRef.current.scrollIntoView({ block: 'center' });
  }, [dropdownRendered]);

  useEffect(() => {
    return () => {
      if (!filterTimeout.current) return;
      clearTimeout(filterTimeout.current);
    };
  }, []);

  const onInputClickHandler = (event: MouseEvent<HTMLInputElement>) => {
    dropdownRendered ? hideDropDown() : showDropDown();
  };

  const onInputBlurHandler = (event: FocusEvent<HTMLInputElement>) => {
    hideDropDown();
  };

  const showDropDown = () => {
    setDropdownRendered(true);
  };

  const hideDropDown = () => {
    setDropdownRendered(false);
  };

  const setSelectedOption = () => {
    if (inputElementRef.current && onSelect) {
      onSelect(inputElementRef.current.value);
    }
  };

  const setInput = () => {
    if (!currentElementRef.current || !inputElementRef.current) return;
    inputElementRef.current.value = evaluateOptionsAs(options[currentElementRef.current.value]);
    inputElementRef.current.setSelectionRange(
      inputElementRef.current.value.length,
      inputElementRef.current.value.length,
      'forward'
    );
  };

  const onOptionClickHandler = (event: MouseEvent<HTMLLIElement>) => {
    setInput();
    setSelectedOption();
    hideDropDown();
  };

  const filterList = (filterString: string) => {
    filterTimeout.current = setTimeout(() => {
      const list = [];
      for (let option of options) {
        if (evaluateOptionsAs(option) === filterString) {
          list.push(option);
        }
      }
      setFilteredOptions(list);
    }, filterDeelay);
  };

  const onInputKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        if (!dropdownRendered) showDropDown();
        selectNextElement();
        setInput();
        break;
      case 'ArrowUp':
        if (!dropdownRendered) showDropDown();
        selectPrevElement();
        setInput();
        break;
      case 'Escape':
        if (dropdownRendered) hideDropDown();
        break;
      case 'Enter':
        setSelectedOption();
        hideDropDown();
        break;
      default:
        filterList(event.currentTarget.value);
        return;
    }
  };

  const setCurrentItem = (element: HTMLLIElement) => {
    currentElementRef.current?.classList.remove(css.current);
    currentElementRef.current = element;
    currentElementRef.current.classList.add(css.current);
    if (onChange) onChange(options[currentElementRef.current.value]);
  };

  const selectNextElement = () => {
    if (!listRef.current) return;
    let nextItem: HTMLLIElement;
    if (currentElementRef.current) {
      if (currentElementRef.current === listRef.current.lastElementChild) {
        nextItem = listRef.current.firstElementChild as HTMLLIElement;
      } else {
        nextItem = currentElementRef.current.nextElementSibling as HTMLLIElement;
      }
    } else {
      nextItem = listRef.current.firstElementChild as HTMLLIElement;
    }
    setCurrentItem(nextItem);
    nextItem.scrollIntoView({ block: 'nearest' });
  };

  const selectPrevElement = () => {
    if (!listRef.current) return;
    let nextItem: HTMLLIElement;
    if (currentElementRef.current) {
      if (currentElementRef.current === listRef.current.firstElementChild) {
        nextItem = listRef.current.lastElementChild as HTMLLIElement;
      } else {
        nextItem = currentElementRef.current.previousElementSibling as HTMLLIElement;
      }
    } else {
      nextItem = listRef.current.lastElementChild as HTMLLIElement;
    }
    setCurrentItem(nextItem);
    nextItem.scrollIntoView({ block: 'nearest' });
  };

  return (
    <div className={classes(css.selector, className)} ref={selectorRef} {...otherProps}>
      <input
        className={css.input}
        type='text'
        onKeyDown={onInputKeyDownHandler}
        onClick={onInputClickHandler}
        onBlur={onInputBlurHandler}
        ref={inputElementRef}
      />
      {/* {dropdownRendered && ( */}
      <div className={classes(css['drop-down'], dropdownRendered ? css.visible : css.hidden)} >
        <div className={css['drop-down-scroll']}>
          <ul className={css.list} ref={listRef}>
            {options.map((listContent, index) => (
              <li
                className={classes(css.option, index === selectedIndexRef.current ? css.selected : undefined)}
                key={index}
                value={index}
                onClick={onOptionClickHandler}
                onMouseOver={(event) => setCurrentItem(event.currentTarget)}
              >
                {renderOptionsAs(listContent)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default Selector;
