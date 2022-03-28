import React, {
  ChangeEvent,
  FC,
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
  useCallback,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import classes from '../../utilities/classes';
import css from './Selector.module.css';

interface SelectorProps {
  options: any[];
  value: any | undefined;
  optionRender?: ((value: any) => ReactNode) | undefined;
  optionLabel?: ((value: any) => string) | undefined;
  onOptionSelect?: ((value: any) => void) | undefined;
  onInputSelect?: ((value: string) => void) | undefined;
  onChange?: ((value: any) => void) | undefined;
  filterDeelay?: number | undefined;
}

const Selector: FC<Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'onChange'> & SelectorProps> = (props) => {
  const {
    options,
    value,
    optionRender = (value: ReactNode) => value,
    optionLabel = (value: string) => value,
    onOptionSelect,
    onInputSelect,
    onChange,
    filterDeelay = 500,
    className,
    children,
    ...otherProps
  } = props;
  const [filteredOptions, setFilteredOptions] = useState(options);
  const listElementRef = useRef<HTMLUListElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputElementRef = useRef<HTMLInputElement>(null);
  let filterTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  let currentIndexRef = useRef<number | undefined>(undefined);

  const onOptionClickHandler = (event: MouseEvent<HTMLLIElement>) => {
    if (currentIndexRef.current !== undefined && onOptionSelect) {
      onOptionSelect(filteredOptions[currentIndexRef.current]);
    }
    hideDropDown();
    setFilteredOptions(options);
  };

  const onOptionOverHandler = (event: MouseEvent<HTMLLIElement>) => {
    if (isDropDownHidden()) return;
    removeHighlight();
    setCurrentIndex(event.currentTarget.value);
    addHighlight();
  };

  const onOptionBlurHandler = (event: FocusEvent<HTMLInputElement>) => {
    restoreInputText();
    hideDropDown();
  };

  const onInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    removeHighlight();
    setCurrentIndex(undefined);
    filterOptions(event.currentTarget.value);
    showDropDown();
  };

  const onInputKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (currentIndexRef === undefined) {
          setCurrentIndex(filteredOptions.indexOf(value));
        }
        showDropDown();
        removeHighlight();
        if (currentIndexRef.current === undefined || currentIndexRef.current === filteredOptions.length - 1) {
          setCurrentIndex(0);
        } else {
          setCurrentIndex(currentIndexRef.current + 1);
        }
        addHighlight();
        scrollToCurrent();
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (currentIndexRef === undefined) {
          setCurrentIndex(filteredOptions.indexOf(value));
        }
        showDropDown();
        removeHighlight();
        if (currentIndexRef.current === undefined || currentIndexRef.current === 0) {
          setCurrentIndex(filteredOptions.length - 1);
        } else {
          setCurrentIndex(currentIndexRef.current - 1);
        }
        addHighlight();
        scrollToCurrent();
        break;
      case 'Escape':
        restoreInputText();
        hideDropDown();
        break;
      case 'Enter':
        if (
          currentIndexRef.current !== undefined &&
          onOptionSelect &&
          filteredOptions[currentIndexRef.current] !== value
        ) {
          onOptionSelect(filteredOptions[currentIndexRef.current]);
        } else {
          let newOption: any | undefined = undefined;
          if (inputElementRef.current && onOptionSelect) {
            for (let option of options) {
              if (optionLabel(option) !== inputElementRef.current.value.toLowerCase()) continue;
              newOption = option;
              break;
            }
          }
          if (newOption && onOptionSelect) {
            onOptionSelect(newOption);
          } else if (inputElementRef.current && onInputSelect) {
            onInputSelect(inputElementRef.current.value);
          }
        }
        hideDropDown();
        setFilteredOptions(options);
        break;
    }
  };

  const getListElementByIndex = (index: number): HTMLElement | undefined => {
    if (!listElementRef.current) return;
    return listElementRef.current.children[index] as HTMLElement;
  };

  const isDropDownHidden = (): boolean => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return true;
    return dropdown.classList.contains(css.hidden);
  };

  const switchDropDown = () => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;
    const dropdownHidden = dropdown.classList.contains(css.hidden);
    if (dropdownHidden) {
      dropdown.classList.remove(css.hidden);
    } else {
      dropdown.classList.add(css.hidden);
    }
  };

  const hideDropDown = () => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;
    const dropdownHidden = dropdown.classList.contains(css.hidden);
    if (dropdownHidden) return;
    dropdown.classList.add(css.hidden);
  };

  const showDropDown = () => {
    const dropdown = dropdownRef.current;
    if (!dropdown) return;
    const dropdownHidden = dropdown.classList.contains(css.hidden);
    if (!dropdownHidden) return;
    dropdown.classList.remove(css.hidden);
  };

  const setCurrentIndex = (value: number | undefined) => {
    currentIndexRef.current = value;
  };

  const filterOptions = useCallback(
    async (filterString: string) => {
      if (filterTimeoutRef.current) clearTimeout(filterTimeoutRef.current);
      filterTimeoutRef.current = setTimeout(() => {
        const list = [];
        for (let option of options) {
          if (optionLabel(option).toLowerCase().indexOf(filterString.toLowerCase()) > -1) {
            list.push(option);
          }
        }
        if (list.length > 0) {
          setFilteredOptions(list);
        } else {
          setFilteredOptions(options);
        }
      }, filterDeelay);
    },
    [filterTimeoutRef, options, filterDeelay, optionLabel]
  );

  const restoreInputText = () => {
    if (!inputElementRef.current) return;
    inputElementRef.current.value = optionLabel(value);
  };

  const removeHighlight = () => {
    if (currentIndexRef.current === undefined) return;
    const currentElement = getListElementByIndex(currentIndexRef.current);
    if (currentElement) currentElement.classList.remove(css.current);
  };

  const addHighlight = () => {
    if (currentIndexRef.current === undefined) return;
    const currentElement = getListElementByIndex(currentIndexRef.current);
    if (currentElement) currentElement.classList.add(css.current);
  };

  const scrollToCurrent = () => {
    if (currentIndexRef.current === undefined) return;
    const currentElement = getListElementByIndex(currentIndexRef.current);
    if (currentElement) currentElement.scrollIntoView({ block: 'nearest' });
  };

  const scrollToSelected = useCallback(() => {
    const selectedOptionIndex = filteredOptions.indexOf(value);
    if (selectedOptionIndex >= 0) {
      const currentElement = getListElementByIndex(selectedOptionIndex);
      if (currentElement) currentElement.scrollIntoView({ block: 'center' });
      setCurrentIndex(selectedOptionIndex);
      return;
    }
    const currentElement = getListElementByIndex(0);
    if (currentElement) currentElement.scrollIntoView({ block: 'nearest' });
  }, [filteredOptions, value]);

  /** Setta il campo input al cambio di value*/
  useLayoutEffect(() => {
    if (!inputElementRef.current || !value) return;
    inputElementRef.current.value = optionLabel(value);
  }, [value, optionLabel]);

  /** Aggiorna lista al cambio delle options */
  useLayoutEffect(() => {
    setFilteredOptions(options);
    return () => {
      if (!filterTimeoutRef.current) return;
      clearTimeout(filterTimeoutRef.current);
    };
  }, [options]);

  useLayoutEffect(() => {
    scrollToSelected();
  }, [filteredOptions, scrollToSelected]);

  return (
    <div className={classes(css.selector, className)} {...otherProps}>
      <input
        className={css.input}
        type='text'
        onKeyDown={onInputKeyDownHandler}
        onChange={onInputChangeHandler}
        onBlur={onOptionBlurHandler}
        onClick={() => switchDropDown()}
        ref={inputElementRef}
        aria-autocomplete='list'
      />
      <div className={classes(css['drop-down'], css.hidden)} ref={dropdownRef}>
        <div className={css['drop-down-scroll']}>
          <ul className={css.list} ref={listElementRef}>
            {filteredOptions.map((listOption, index) => {
              const selected = listOption === value;
              return (
                <li
                  className={classes(css.option, selected ? css.selected : undefined)}
                  key={index}
                  value={index}
                  onClick={onOptionClickHandler}
                  onMouseOver={onOptionOverHandler}
                >
                  {optionRender(listOption)}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Selector;
