import React, {
  ChangeEvent,
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

interface SelectorProps {
  options: any[];
  value: any | undefined;
  optionRender?: ((value: any) => ReactNode) | undefined;
  optionLabel?: ((value: any) => string) | undefined;
  onSelect?: ((value: any) => void) | undefined;
  onChange?: ((value: any) => void) | undefined;
  filterDeelay?: number | undefined;
}

const Selector: FC<Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'onChange'> & SelectorProps> = (props) => {
  const {
    options,
    value,
    optionRender = (value: ReactNode) => value,
    optionLabel = (value: string) => value,
    onSelect,
    onChange,
    filterDeelay = 500,
    className,
    children,
    ...otherProps
  } = props;
  const [filteredOptions, setFilteredOptions] = useState(options);
  const [selectedOption, setSelectedOption] = useState<any | undefined>(value);
  const listElementRef = useRef<HTMLUListElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputElementRef = useRef<HTMLInputElement>(null);
  let currentItemIndex: number | undefined = undefined;
  let filterTimeout: NodeJS.Timeout;

  useEffect(() => {
    console.log(currentItemIndex);
  }, [currentItemIndex]);

  useLayoutEffect(() => {
    if (selectedOption) {
      const index = filteredOptions.indexOf(selectedOption);
      setCurrentItemIndex(index);
      scrollIntoView(index, { block: 'center' });
    }
  }, [selectedOption, filteredOptions]);

  useLayoutEffect(() => {
    if (!inputElementRef.current || !value) return;
    inputElementRef.current.value = optionLabel(value);
    return () => clearTimeout(filterTimeout);
  }, [value]);

  const onOptionClickHandler = (event: MouseEvent<HTMLLIElement>) => {
    setCurrentItemIndex(event.currentTarget.value);
    selectOption();
    hideDropDown();
  };

  const onOptionOverHandler = (event: MouseEvent<HTMLLIElement>) => {
    if (isDropDownHidden()) return;
    removeHighlight(currentItemIndex);
    setCurrentItemIndex(event.currentTarget.value);
    addHighlight(currentItemIndex);
  };

  const onOptionBlurHandler = (event: FocusEvent<HTMLInputElement>) => {
    restoreInputText();
    hideDropDown();
  };

  const onInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    removeHighlight(currentItemIndex);
    setCurrentItemIndex(undefined);
    filterList(event.currentTarget.value);
  };

  const onInputKeyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        showDropDown();
        removeHighlight(currentItemIndex);
        if (currentItemIndex === undefined || currentItemIndex === filteredOptions.length - 1) {
          setCurrentItemIndex(0);
        } else {
          setCurrentItemIndex(currentItemIndex + 1);
        }
        addHighlight(currentItemIndex);
        scrollIntoView(currentItemIndex);
        break;
      case 'ArrowUp':
        event.preventDefault();
        showDropDown();
        removeHighlight(currentItemIndex);
        if (currentItemIndex === undefined || currentItemIndex === 0) {
          setCurrentItemIndex(filteredOptions.length - 1);
        } else {
          setCurrentItemIndex(currentItemIndex - 1);
        }
        addHighlight(currentItemIndex);
        scrollIntoView(currentItemIndex);
        break;
      case 'Escape':
        restoreInputText();
        hideDropDown();
        break;
      case 'Enter':
        selectOption();
        hideDropDown();
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

  const updateInputText = (value: string) => {
    if (!inputElementRef.current) return;
    inputElementRef.current.value = value;
  };

  const selectOption = () => {
    if (currentItemIndex === undefined) {
      setSelectedOption(undefined);
      if (onSelect) onSelect(inputElementRef.current?.value);
    } else {
      removeHighlight(currentItemIndex);
      const currentOption = filteredOptions[currentItemIndex];
      updateInputText(optionLabel(currentOption));
      setSelectedOption(currentOption);
      if (onSelect) onSelect(optionLabel(currentOption));
    }
  };

  const setCurrentItemIndex = (value: number | undefined) => {
    currentItemIndex = value;
  };

  const filterList = (filterString: string) => {
    filterTimeout = setTimeout(() => {
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
      showDropDown();
    }, filterDeelay);
  };

  const restoreInputText = () => {
    if (!selectedOption || !inputElementRef.current) return;
    inputElementRef.current.value = optionLabel(selectedOption);
  };

  const removeHighlight = (index: number | undefined) => {
    if (index === undefined) return;
    const currentElement = getListElementByIndex(index);
    if (currentElement) currentElement.classList.remove(css.current);
  };

  const addHighlight = (index: number | undefined) => {
    if (index === undefined) return;
    const currentElement = getListElementByIndex(index);
    if (currentElement) currentElement.classList.add(css.current);
  };

  const scrollIntoView = (
    index: number | undefined,
    scrollIntoViewOptions: ScrollIntoViewOptions = { block: 'nearest' }
  ) => {
    if (index === undefined) return;
    const currentElement = getListElementByIndex(index);
    if (currentElement) currentElement.scrollIntoView(scrollIntoViewOptions);
  };

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
              const selected = listOption === selectedOption;
              return (
                <li
                  className={classes(css.option, selected ? css.selected : undefined)}
                  key={index}
                  value={index}
                  onClick={onOptionClickHandler}
                  onMouseOver={onOptionOverHandler}
                  aria-selected={selected}
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
