import React, { useState } from 'react';
import { X, ExternalLink, BookOpen, Search } from 'lucide-react';
import './PostDetailModal.css';

// 세부 전공별 어울리는 화사하고 프리미엄한 그라데이션 자동 생성
const getCoverGradient = (major = '') => {
  if (!major) return 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)';
  const hash = major.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const hue1 = hash % 360;
  const hue2 = (hue1 + 45) % 360;
  return `linear-gradient(135deg, hsl(${hue1}, 75%, 65%) 0%, hsl(${hue2}, 80%, 50%) 100%)`;
};

const MEETUP_SPOTS = {
  barom: [
    '🏫 바롬인성교육관 1층 로비 자율 쉼터 소파 앞',
    '☕ 바롬인성교육관 지하 1층 매점 앞 테이블',
    '🌿 바롬관 정문 우측 야외 목재 데크 벤치',
    '🏢 바롬관 2층 엘리베이터 옆 스터디 라운지'
  ],
  intl: [
    '🏢 국제생활관 1층 안내데스크 앞 로비',
    '🎒 국제생활관 입구 자전거 보관대 앞',
    '🛋️ 국제생활관 1층 공용 라운지 정수기 옆',
    '🌳 국제생활관 뒷길 산책로 나무 의자'
  ],
  shalom: [
    '🏠 샬롬하우스 기숙사 정문 앞 벤치 구역',
    '🚪 샬롬하우스 지하 1층 무인 택배함 구역 앞',
    '📮 샬롬하우스 로비 우편함 옆 자율 나눔 테이블',
    '⛲ 샬롬하우스 주차장 입구 조경 정원 벤치'
  ],
  nuri: [
    '🏪 학생누리관 1층 편의점 앞 원형테이블 쉼터',
    '🍔 학생누리관 2층 학생식당 입구 키오스크 앞',
    '🛋️ 학생누리관 3층 동아리방 중앙 쉼터 홀 소파',
    '☕ 학생누리관 1층 가온 카페 입구 쪽 야외 테이블'
  ],
  library: [
    '📚 중앙도서관 1층 자율 열람대 책꽂이 앞',
    '🖥️ 중앙도서관 2층 멀티미디어실 복사기 옆',
    '🛋️ 중앙도서관 로비 반창고 스터디 라운지 테이블',
    '🌳 중앙도서관 정문 앞 계단 아래 자율 반납함 앞'
  ],
  human: [
    '🌸 인문사회관 1층 중앙 현관 아치문 로비 앞',
    '☕ 인문관 2층 가온카페 라운지 창가 의자',
    '🛋️ 인문관 1층 복도 중간 스터디 벤치',
    '🌲 인문관 야외 테라스 쉼터 흔들그네 앞'
  ],
  '50th': [
    '⛲ 50주년기념관 지하 1층 분수대 앞 벤치',
    '☕ 50주년기념관 1층 블루포트 카페 입구 우측 테이블',
    '🏢 50주년기념관 2층 글로벌 라운지 유리문 앞',
    '🚪 50주년기념관 지하 2층 주차장 엘리베이터 홀'
  ],
  christ: [
    '⛪ 기독교관 1층 입구 대형 십자가 앞',
    '🛋️ 기독교관 1층 휴게실 자율 서재 테이블',
    '🌿 기독교관 뒤편 쉼터 벤치 구역',
    '🔔 기독교관 예배실 입구 복도 쉼터 벤치'
  ],
  sci1: [
    '🌿 제1과학관 1층 중앙게시판 앞 온실 입구',
    '🏢 제1과학관 2층 연결구름다리 입구 앞',
    '🧬 제1과학관 1층 화학과 실험실 복도 의자',
    '🛋️ 제1과학관 지하 1층 사물함 구역 쉼터'
  ],
  sci2: [
    '💻 제2과학관 1층 중앙로비 엘리베이터 앞',
    '☕ 제2과학관 1층 브레드앤코 베이커리 매장 테이블',
    '🪟 제2과학관 3층 컴퓨터공학과 랩실 앞 휴게 벤치',
    '🌳 제2과학관 입구 자전거 거치대 옆 화단 벤치'
  ],
  art: [
    '🎨 조형예술관 1층 중앙 원형 유리 타워 입구 앞',
    '🖌️ 조형예술관 2층 시각디자인전공 갤러리 쇼케이스 앞',
    '🛋️ 조형예술관 1층 복도 휴게실 소파',
    '🖼️ 조형예술관 정문 야외 공예 조각품 광장 벤치'
  ],
  gym: [
    '👟 체육관 정문 계단 입구 앞',
    '🏀 체육관 1층 체력단련실 유리문 우측 의자',
    '🪑 체육관 야외 운동장 스탠드 중앙 구역',
    '🚪 체육관 후문 주차구역 벤치'
  ],
  forest: [
    '🧺 삼각숲 중앙 잔디밭 빨간 돗자리 위 Picnic Spot!',
    '🛖 삼각숲 우측 나무 원두막 파고라 내부',
    '🌳 삼각숲 벚나무 아래 둥근 나무 벤치',
    '👟 삼각숲 진입로 모퉁이 우편함 쉼터'
  ],
};

const PostDetailModal = ({ building, posts, onClose }) => {
  const [localSearch, setLocalSearch] = useState('');

  // 팝업 내부에서 실시간으로 책 제목 및 전공으로 검색/필터링
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(localSearch.toLowerCase()) ||
    (post.major && post.major.toLowerCase().includes(localSearch.toLowerCase()))
  );

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{building.name} 나눔 현황</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        {/* 건물 내 전공 및 교재명 실시간 검색 필터 탑재 */}
        {posts.length > 0 && (
          <div className="modal-search-wrapper">
            <Search className="modal-search-icon" size={16} />
            <input 
              type="text" 
              placeholder="이 건물 내에서 전공이나 교재 이름을 검색해 보세요!" 
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
            {localSearch && (
              <button className="clear-local-search" onClick={() => setLocalSearch('')}>
                <X size={14} />
              </button>
            )}
          </div>
        )}

        <div className="modal-body">
          {building.isGate ? (
            <div className="empty-state reference-empty gate-empty">
              <div className="reference-book-icon-glow" style={{ borderColor: '#2e7d32', color: '#2e7d32', background: '#e8f5e9' }}>
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M3 21v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4M5 15V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10" />
                </svg>
              </div>
              <h3 className="reference-title">{building.name} 안내</h3>
              <p className="reference-desc">
                서울여자대학교의 상징적인 진출입구인 {building.name}입니다.
              </p>
              <p className="reference-note">
                교내 캠퍼스의 여러 단과대 건물들을 지도에서 탐색하여 선한 나눔의 꽃들을 피우고, 나눔받을 전공/교양 서적을 탐색해보세요!
              </p>
            </div>
          ) : building.id === 'library' ? (
            <div className="empty-state reference-empty">
              <div className="reference-book-icon-glow">
                <BookOpen size={42} />
              </div>
              <h3 className="reference-title">중앙도서관 위치 안내</h3>
              <p className="reference-desc">
                도서관은 서울여자대학교의 대출용 공식 장서가 보관되는 공식 시설입니다.
              </p>
              <p className="reference-note">
                개인 간의 <strong>교양 및 전공교재 자율 나눔</strong>은 각 단과대학 건물(예: 인문대, 제2과학관, 50주년기념관 등)의 지도 마커를 통해 활발하게 꽃 피워지고 있습니다. 지도 위의 꽃들을 탐색해 보세요!
              </p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <p>현재 이 건물에서 나눔 중인 책이 없습니다.</p>
              <p>첫 번째 나눔의 꽃을 피워보세요!</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="empty-state">
              <p>검색 결과와 매칭되는 나눔 도서가 없습니다.</p>
            </div>
          ) : (
            <ul className="post-list">
              {filteredPosts.map(post => (
                <li key={post.id} className="post-item">
                  
                  {/* 왼쪽: 입체 3D 미니 책 표지 디자인 */}
                  <div className="book-cover-container">
                    <div className="book-cover" style={{ background: post.imagePreview ? '#f4faf9' : getCoverGradient(post.major) }}>
                      {post.imagePreview ? (
                        <img src={post.imagePreview} alt="교재 표지 실물" className="book-cover-photo" />
                      ) : (
                        <div className="book-cover-inner">
                          <span className="book-major-title">
                            {post.major ? post.major.substring(0, 4) : '교양'}
                          </span>
                        </div>
                      )}
                      <div className="book-spine" />
                    </div>
                  </div>

                  {/* 오른쪽: 정보 메인 및 겹침 해결 레이아웃 */}
                  <div className="post-content-container">
                    {/* 상단 배지 배치 라인 */}
                    <div className="post-badges-row">
                      <span className={`post-type badge-${post.type}`}>
                        {post.type === 'major' ? '전공' : '교양'}
                      </span>
                      {post.major && (
                        <span className="post-major-badge">
                          {post.major}
                        </span>
                      )}
                    </div>

                    {/* 긴 텍스트도 여유 있게 내려앉는 전용 제목 박스 */}
                    <div className="post-title-row">
                      <h3 className="post-title">{post.title}</h3>
                    </div>
                    
                    <div className="post-details">
                      <div className="detail-item">
                        <BookOpen size={13} />
                        <span>상태: <strong>{post.condition}</strong></span>
                      </div>
                      <div className="detail-item meetup-spot-helper">
                        <span className="meetup-label">📍 안전 만남 장소:</span>
                        <span className="meetup-value">
                          {(() => {
                            const spots = MEETUP_SPOTS[post.buildingId];
                            if (!spots) return '🏫 건물 1층 중앙 로비';
                            if (Array.isArray(spots)) {
                              const index = post.id % spots.length;
                              return spots[index];
                            }
                            return spots;
                          })()}
                        </span>
                      </div>
                    </div>
                    
                    <a 
                      href={post.contact.startsWith('http') ? post.contact : `mailto:${post.contact}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="contact-btn"
                    >
                      연락하기 <ExternalLink size={14} />
                    </a>
                  </div>

                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
