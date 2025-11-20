'use client';

import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Dropdown.module.css';

const cx = classNames.bind(styles);

interface DropdownProps {
  className?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

const Dropdown = ({
  className = '',
  options,
  value,
  onChange,
}: DropdownProps) => {
  const selectedValue = value || options[0].value;
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (nextValue: string) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(
    (option) => option.value === selectedValue
  );

  return (
    <div className={cx('dropdown')}>
      <div
        className={cx('select',className, {
          isOpen,
        })}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption?.label}</span>
        <div className={cx('caret')} />
      </div>
      {isOpen && (
        <div className={cx('options')}>
          {options.map((option) => (
            <div
              key={option.value}
              className={cx('option', { active: option.value === value })}
              onClick={() => handleChange(option.value)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
