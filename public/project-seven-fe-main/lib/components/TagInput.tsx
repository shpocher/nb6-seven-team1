import React, { useState, useRef, forwardRef } from 'react';
import classNames from 'classnames/bind';
import styles from './TagInput.module.css';

const cx = classNames.bind(styles);

const SYMBOL_TAG_INPUT_CURSOR = Symbol('tag input cursor');

interface TagInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  maxTags: number;
}

interface CursorProps {
  value: string;
  onKeyUp: (event: React.KeyboardEvent<HTMLDivElement>) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onBlur: () => void;
}

const CursorImpl = (
  { value, onKeyUp, onChange, onFocus, onBlur }: CursorProps,
  ref: React.Ref<HTMLInputElement>
) => (
  <span
    style={{
      position: 'relative',
    }}
  >
    {/** Hidden span for adjusting width according to input value */}
    <span className={cx('hiddenSpan')}>{value}</span>
    <input
      className={cx('cursor')}
      value={value}
      onKeyUp={onKeyUp}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      ref={ref}
    />
  </span>
);

const Cursor = forwardRef(CursorImpl);

const Tag = ({ value }: { value: string }) => {
  return <span className={cx('tag')}>#{value}</span>;
};

const Placeholder = () => {
  return <span className={cx('placeholder')}>#태그 후 Enter</span>;
};

const TagInput = ({ value, onChange, maxTags }: TagInputProps) => {
  const [tagsWithCursor, setTagsWithCursor] = useState([
    ...value,
    SYMBOL_TAG_INPUT_CURSOR,
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getCursorIndex = () =>
    tagsWithCursor.findIndex((tag) => tag === SYMBOL_TAG_INPUT_CURSOR);

  const addTag = (value: string) => {
    if (tagsWithCursor.length >= maxTags) return;

    const safeValue = value.trim();
    if (tagsWithCursor.includes(safeValue)) return;

    const cursorIndex = getCursorIndex();
    const nextTagsWithCursor = [
      ...tagsWithCursor.slice(0, cursorIndex),
      safeValue,
      ...tagsWithCursor.slice(cursorIndex),
    ];
    setTagsWithCursor(nextTagsWithCursor);
    const plainNextTags = nextTagsWithCursor
      .filter((tag) => tag !== SYMBOL_TAG_INPUT_CURSOR)
      .map((tag) => tag as string);
    onChange(plainNextTags);
  };

  const removeTag = () => {
    const cursorIndex = getCursorIndex();
    setTagsWithCursor(tagsWithCursor.filter((_, i) => i !== cursorIndex - 1));
  };

  const moveCursor = (direction: 'left' | 'right') => {
    const cursorIndex = getCursorIndex();

    if (direction === 'left') {
      if (cursorIndex === 0) return;
      setTagsWithCursor([
        ...tagsWithCursor.slice(0, cursorIndex - 1),
        SYMBOL_TAG_INPUT_CURSOR,
        tagsWithCursor[cursorIndex - 1],
        ...tagsWithCursor.slice(cursorIndex + 1),
      ]);
    } else {
      if (cursorIndex === tagsWithCursor.length - 1) return;
      setTagsWithCursor([
        ...tagsWithCursor.slice(0, cursorIndex),
        tagsWithCursor[cursorIndex + 1],
        SYMBOL_TAG_INPUT_CURSOR,
        ...tagsWithCursor.slice(cursorIndex + 2),
      ]);
    }
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case '#': {
        event.preventDefault();
        break;
      }
      case 'Enter': {
        if (inputValue) {
          addTag(inputValue);
          setInputValue('');
          event.preventDefault();
        }
        break;
      }
      case 'Backspace': {
        if (!inputValue) {
          removeTag();
        }
        break;
      }
      case 'ArrowLeft': {
        if (!inputValue) {
          moveCursor('left');
        }
        break;
      }
      case 'ArrowRight': {
        if (!inputValue) {
          moveCursor('right');
        }
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value || '');
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
  };

  const showPlaceholder =
    tagsWithCursor.length < 3 &&
    tagsWithCursor[tagsWithCursor.length - 1] === SYMBOL_TAG_INPUT_CURSOR &&
    inputValue === '';

  return (
    <div
      className={cx('input', { isFocused })}
      ref={containerRef}
      onClick={handleFocus}
      onFocus={handleFocus}
    >
      {tagsWithCursor.map((tag, index) =>
        tag === SYMBOL_TAG_INPUT_CURSOR ? (
          <Cursor
            key={'cursor'}
            value={inputValue}
            onKeyUp={handleKeyUp}
            onChange={handleChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            ref={inputRef}
          />
        ) : (
          <Tag key={index} value={tag as string} />
        )
      )}
      {showPlaceholder && <Placeholder />}
    </div>
  );
};

export default TagInput;
