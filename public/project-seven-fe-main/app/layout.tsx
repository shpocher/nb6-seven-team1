import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import classNames from 'classnames/bind';
import logoImage from '@/public/assets/logo.svg';
import styles from './layout.module.css';
import './globals.css';

const cx = classNames.bind(styles);

export const metadata: Metadata = {
  title: 'SEVEN',
  description: '기록 기반의 운동 커뮤니티, 세븐',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <nav className={cx('nav')}>
          <Link href="/">
            <Image src={logoImage} alt="logo" width={51} height={21} />
          </Link>
        </nav>
        <main className={cx('main')}>{children}</main>
        <div id="modal-root"></div>
      </body>
    </html>
  );
}
