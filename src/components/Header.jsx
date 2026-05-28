import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header animate-slide-down">
      <div className="header-logo-container">
        {/* === [NEW] 풀림 시그니처 3D 일러스트 꽃잎 북 SVG 로고 === */}
        <svg className="logo-svg" width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* 꽃잎용 활기찬 핑크/피치 그라데이션 */}
            <linearGradient id="petal-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff7675" />
              <stop offset="100%" stopColor="#fd79a8" />
            </linearGradient>
            {/* 꽃잎용 부드러운 코랄/골드 그라데이션 */}
            <linearGradient id="petal-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fdcb6e" />
              <stop offset="100%" stopColor="#ff7675" />
            </linearGradient>
            {/* 책 베이스용 차분한 에메랄드 그린 */}
            <linearGradient id="book-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1abc9c" />
              <stop offset="100%" stopColor="#16a085" />
            </linearGradient>
            <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. 활짝 열린 책의 대칭 표지 프레임 */}
          <path d="M 15,80 Q 50,85 50,45" stroke="url(#book-grad)" strokeWidth="6" strokeLinecap="round" />
          <path d="M 85,80 Q 50,85 50,45" stroke="url(#book-grad)" strokeWidth="6" strokeLinecap="round" />
          <path d="M 50,45 L 50,88" stroke="url(#book-grad)" strokeWidth="5" strokeLinecap="round" />

          {/* 2. 책 페이지에서 부드럽게 꽃 피는 5중 그라데이션 꽃잎 (풀림의 철학 반영) */}
          <path d="M 50,45 C 38,20 62,20 50,45 Z" fill="url(#petal-grad-1)" filter="url(#logo-glow)" opacity="0.9" />
          <path d="M 50,45 C 22,28 35,5 50,45 Z" fill="url(#petal-grad-2)" opacity="0.95" />
          <path d="M 50,45 C 78,28 65,5 50,45 Z" fill="url(#petal-grad-2)" opacity="0.95" />
          
          {/* 꽃 수술 포인트 */}
          <circle cx="50" cy="35" r="7" fill="#ffd700" filter="url(#logo-glow)" />
          <circle cx="50" cy="35" r="4" fill="#ffffff" />
        </svg>

        <div className="logo-text-wrapper">
          <h1 className="logo-title">풀림</h1>
          <span className="logo-tagline">PULLIM</span>
        </div>
      </div>
      <div className="header-subtitle-wrapper">
        <p className="header-subtitle">책장에서 책장으로, 캠퍼스에 피어나는 따스한 온기</p>
      </div>
    </header>
  );
};

export default Header;
