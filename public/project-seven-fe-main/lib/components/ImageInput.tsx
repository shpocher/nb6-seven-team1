'use client';

import { useRef } from 'react';
import classNames from 'classnames/bind';
import { uploadImage } from '@/lib/api';
import styles from './ImageInput.module.css';
import Button from './Button';
import Image from 'next/image';
import closeImage from '@/public/assets/close.svg';

const cx = classNames.bind(styles);

const ImageInput = ({
  className,
  maxCount = 1,
  values = [],
  onChange,
}: {
  className?: string;
  maxCount?: number;
  values: string[];
  onChange: (urls: string[]) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (files: File[]) => {
    const { urls } = await uploadImage(files);
    onChange(urls);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(Array.from(files).slice(0, maxCount));
    }
  };

  const handleUploadClick = () => {
    inputRef.current?.click();
  };

  const isUploaded = values.length > 0;

  const handleRemoveClick = (value: string) => {
    onChange(values.filter((v) => v !== value));
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cx('container', className)}>
      <input
        type="file"
        className={cx('hiddenInput')}
        ref={inputRef}
        onChange={handleFileChange}
        multiple={maxCount > 1}
        accept="image/*"
      />
      {maxCount > 1 ? (
        <div className={cx('previewImageList')}>
          {values.map((value, index) => (
            <div
              className={cx('previewImageContainer')}
              key={`${value}-${index}`}
            >
              <Image
                className={cx('previewImage')}
                src={value}
                alt="preview"
                width={93}
                height={60}
              />
              <Image
                className={cx('removeButton')}
                src={closeImage}
                alt="제거"
                width={12}
                height={12}
                onClick={() => handleRemoveClick(value)}
              />
            </div>
          ))}
        </div>
      ) : (
        isUploaded && (
          <div className={cx('singlePreviewImageContainer')}>
            <Image
              className={cx('singlePreviewImage')}
              src={values[0]}
              alt="preview"
              width={352}
              height={206}
            />
            <Image
              className={cx('singleRemoveButton')}
              src={closeImage}
              alt="제거"
              width={12}
              height={12}
              onClick={() => handleRemoveClick(values[0])}
            />
          </div>
        )
      )}
      <div className={cx('overlay')}>
        {!isUploaded && (
          <Button
            type="button"
            appearance="minimal"
            onClick={handleUploadClick}
          >
            + 업로드
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageInput;
