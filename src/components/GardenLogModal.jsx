import React from 'react';
import { X, Award, Flame, Star, BookOpen, Compass } from 'lucide-react';
import './GardenLogModal.css';

const BADGES = [
  {
    id: 'badge-pansy',
    name: '팬지의 지혜',
    desc: '학문적 소양을 나누어 기린 팬지꽃',
    building: '제1과학관 / 국제생활관',
    color: '#0072ff',
    iconColor: '#7be1ff',
    bg: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
    unlocked: true,
  },
  {
    id: 'badge-bellflower',
    name: '도라지꽃의 탐구',
    desc: 'IT와 공학 지식을 꽃피운 청초한 도라지꽃',
    building: '제2과학관 / 기숙사(샬롬하우스)',
    color: '#4A00E0',
    iconColor: '#d3a5ff',
    bg: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)',
    unlocked: true,
  },
  {
    id: 'badge-daisy',
    name: '데이지의 온기',
    desc: '인문학적 통찰과 숲의 사랑을 담은 데이지',
    building: '인문사회관 / 삼각숲',
    color: '#f5af19',
    iconColor: '#ffeb3b',
    bg: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
    unlocked: true,
  },
  {
    id: 'badge-sakura',
    name: '벚꽃의 조화',
    desc: '예술과 인성 교육의 조화를 이룬 화사한 벚꽃',
    building: '조형예술관 / 바롬인성교육관',
    color: '#ff7eb3',
    iconColor: '#ffd1ff',
    bg: 'linear-gradient(135deg, #ff0844 0%, #ff7eb3 100%)',
    unlocked: true,
  },
  {
    id: 'badge-tulip',
    name: '튤립의 은총',
    desc: '행정, 복지, 기독교 사상을 꽃피운 오목한 튤립',
    building: '50주년기념관 / 기독교관',
    color: '#e65c00',
    iconColor: '#F9D423',
    bg: 'linear-gradient(135deg, #e65c00 0%, #F9D423 100%)',
    unlocked: true,
  },
  {
    id: 'badge-clover',
    name: '클로버의 행복',
    desc: '동아리와 대학 생활에 행복을 퍼트리는 클로버',
    building: '학생누리관',
    color: '#11998e',
    iconColor: '#b2ffda',
    bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    unlocked: true,
  }
];

const GardenLogModal = ({ posts, onClose }) => {
  // 선한 온기 온도 계산 (기본 36.5도 + 나눔 개수당 0.1도 상승!)
  const temp = (36.5 + posts.length * 0.1).toFixed(1);
  // 전체 꽃잎 개수 (나눔 1개당 12개 흩뿌림 효과 환산)
  const totalPetals = posts.length * 12;

  return (
    <div className="garden-log-overlay animate-fade-in" onClick={onClose}>
      <div className="garden-log-content animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="garden-log-header">
          <div className="header-title-row">
            <Award className="title-award-icon" size={28} />
            <h2>Pullim 개화 도감 & 마이 가든</h2>
          </div>
          <button className="close-btn" onClick={onClose} title="도감 닫기">
            <X size={24} />
          </button>
        </div>

        <div className="garden-log-body">
          {/* 상단 온도 및 통계 요약 카드 */}
          <div className="stats-summary-card">
            <div className="temp-section">
              <div className="temp-thermometer">
                <Flame className="flame-icon" size={24} />
                <div className="thermometer-track">
                  <div className="thermometer-fill" style={{ width: `${Math.min(100, (temp - 36.5) * 15 + 10)}%` }} />
                </div>
              </div>
              <div className="temp-text">
                <span className="label">서울여대 나눔 온기 온도</span>
                <span className="value">{temp}°C</span>
              </div>
            </div>
            
            <div className="stats-grid">
              <div className="stat-box">
                <BookOpen className="stat-icon" size={20} style={{ color: '#1abc9c' }} />
                <span className="stat-lbl">총 나눔 도서</span>
                <span className="stat-val">{posts.length}권</span>
              </div>
              <div className="stat-box">
                <Star className="stat-icon" size={20} style={{ color: '#f5af19' }} />
                <span className="stat-lbl">전체 피어난 잎새</span>
                <span className="stat-val">{totalPetals}개</span>
              </div>
              <div className="stat-box">
                <Compass className="stat-icon" size={20} style={{ color: '#9b5de5' }} />
                <span className="stat-lbl">잠금 해제 도감</span>
                <span className="stat-val">6 / 6개</span>
              </div>
            </div>
          </div>

          {/* 중간 개화 수집 도감 배지 격자판 */}
          <h3 className="section-title">🌸 나눔의 꽃 업적 배지</h3>
          <div className="badge-grid">
            {BADGES.map(badge => (
              <div key={badge.id} className="badge-card" style={{ '--card-bg': badge.bg }}>
                <div className="badge-graphic-container">
                  <div className="badge-glow-ring" style={{ backgroundColor: badge.color }} />
                  <Award className="badge-award-icon" size={32} style={{ color: '#fff' }} />
                </div>
                <div className="badge-info">
                  <h4>{badge.name}</h4>
                  <p className="desc">{badge.desc}</p>
                  <span className="building-tag" style={{ color: badge.color, borderColor: `${badge.color}33` }}>
                    {badge.building}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 하단 투데이 캠퍼스 나눔 미션 */}
          <h3 className="section-title">🧭 오늘의 추천 나눔 미션</h3>
          <div className="mission-list">
            <div className="mission-item completed">
              <div className="mission-checkbox">✓</div>
              <div className="mission-text">
                <span className="m-title">캠퍼스에 첫 번째 책 나눔 등록하기</span>
                <span className="m-reward">보상: 데이지의 온기 배지</span>
              </div>
            </div>
            <div className="mission-item">
              <div className="mission-checkbox"></div>
              <div className="mission-text">
                <span className="m-title">인문사회관(도서관 배후)에 8송이 꽃 만개시키기</span>
                <span className="m-reward">보상: 팬지의 지혜 배지</span>
              </div>
            </div>
            <div className="mission-item">
              <div className="mission-checkbox"></div>
              <div className="mission-text">
                <span className="m-title">삼각숲 돗자리 Picnic Spot에서 기분 좋은 책 교환 완료하기</span>
                <span className="m-reward">보상: 클로버의 행복 배지</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenLogModal;
