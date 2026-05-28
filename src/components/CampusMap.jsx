import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, Sunrise, Award, Sparkles, Layers } from 'lucide-react';
import FlowerPin from './FlowerPin';
import PostDetailModal from './PostDetailModal';
import './CampusMap.css';

// 서울여자대학교 실제 캠퍼스 기반 빌딩 좌표 (퍼센트로 상대적 위치 지정)
const BUILDINGS = [
  { id: 'barom', name: '바롬인성교육관', top: '18.7%', left: '14.6%', isReference: true },
  { id: 'intl', name: '국제생활관', top: '21.7%', left: '24.6%', isReference: true },
  { id: 'shalom', name: '기숙사(샬롬하우스)', top: '16.1%', left: '36.7%', isReference: true },
  { id: 'forest', name: '삼각숲', top: '32.0%', left: '32.1%' },
  { id: 'grand', name: '대강당', top: '56.0%', left: '38.0%' },
  { id: 'nuri', name: '학생누리관', top: '41.0%', left: '53.5%' },
  { id: 'library', name: '중앙도서관', top: '59.0%', left: '60.5%', isReference: true },
  { id: 'human', name: '인문사회관', top: '72.0%', fillClass: 'human-color', left: '65.0%' },
  { id: '50th', name: '50주년기념관', top: '82.0%', left: '44.0%' },
  { id: 'christ', name: '기독교관', top: '74.5%', left: '47.5%' },
  { id: 'sci1', name: '제1과학관', top: '26.1%', left: '65.4%' },
  { id: 'sci2', name: '제2과학관', top: '30.3%', left: '76.0%' },
  { id: 'art', name: '조형예술관', top: '45.3%', left: '81.5%' },
  { id: 'gym', name: '체육관', top: '37.7%', left: '10.0%', isReference: true },
  { id: 'gate_main', name: '정문', top: '92.5%', left: '50.0%', isGate: true, isReference: true },
  { id: 'gate_back', name: '후문', top: '15.0%', left: '6.0%', isGate: true, isReference: true },
];

const CampusMap = ({ posts, highlightedBuildings = [], bloomingBuildingId = null, onOpenGardenLog }) => {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [scale, setScale] = useState(1); // 지도 확대/축소 배율 (0.5 ~ 2.5)
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'major', 'gened', 'photo'
  const [mapTheme, setMapTheme] = useState('day'); // 'day', 'sunset', 'night'
  const [showPetals, setShowPetals] = useState(true); // 벚꽃 비 온/오프

  // 흩날리는 벚꽃 비 데이터 생성
  const petals = React.useMemo(() => {
    return Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      left: `${(i * 4.7) % 100}%`,
      delay: `${(i * 0.35) % 7}s`,
      duration: `${6 + (i * 0.45) % 6}s`,
      scale: 0.6 + (i % 5) * 0.15,
      opacity: 0.35 + (i % 4) * 0.15,
    }));
  }, []);

  const containerRef = useRef(null);

  // 드래그 앤 패닝 (Drag & Panning) 기능 구현을 위한 상태 관리
  const [pan, setPan] = useState({ x: -200, y: -150 }); // 모바일/데스크톱 초기 맵 중앙 안착 기본값
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 초기 뷰포트 로딩 시 지도의 중심(삼각숲이 있는 곳)이 오도록 화면 크기에 맞춰 중앙 정렬
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const initialX = Math.min(100, Math.max(-1600, (rect.width - 1600) / 2));
      const initialY = Math.min(50, Math.max(-1200, (rect.height - 1200) / 2));
      setPan({ x: initialX, y: initialY });
    }
  }, []);

  // 개화 이벤트 발생 시 해당 건물이 화면 정중앙에 오도록 부드럽게 자동 스크롤(패닝)
  useEffect(() => {
    if (bloomingBuildingId && containerRef.current) {
      const b = BUILDINGS.find(building => building.id === bloomingBuildingId);
      if (b) {
        // 빌딩 좌표 퍼센트를 px 값으로 계산 (지도의 실제 크기: 1600px * 1200px)
        const pctLeft = parseFloat(b.left) / 100;
        const pctTop = parseFloat(b.top) / 100;
        const targetX = 1600 * pctLeft;
        const targetY = 1200 * pctTop;
        
        // 뷰포트(컨테이너)의 현재 너비와 높이 가져오기
        const rect = containerRef.current.getBoundingClientRect();
        const viewportCenterX = rect.width / 2;
        const viewportCenterY = rect.height / 2;
        
        // 해당 건물이 뷰포트 중앙에 오기 위한 pan 좌표 계산 (현재 스케일 배율 반영)
        const newX = viewportCenterX - targetX * scale;
        const newY = viewportCenterY - targetY * scale;
        
        const mapWidthScaled = 1600 * scale;
        const mapHeightScaled = 1200 * scale;
        
        let minX, maxX;
        if (mapWidthScaled > rect.width) {
          minX = rect.width - mapWidthScaled;
          maxX = 0;
        } else {
          minX = (rect.width - mapWidthScaled) / 2;
          maxX = minX;
        }
        
        let minY, maxY;
        if (mapHeightScaled > rect.height) {
          minY = rect.height - mapHeightScaled;
          maxY = 0;
        } else {
          minY = (rect.height - mapHeightScaled) / 2;
          maxY = minY;
        }
        
        setPan({
          x: Math.max(minX, Math.min(maxX, newX)),
          y: Math.max(minY, Math.min(maxY, newY)),
        });
      }
    }
  }, [bloomingBuildingId, scale]);

  // 마우스 스크롤 휠 이벤트 수동 등록 (Passive False 처리로 크롬 경고 및 전체 브라우저 스크롤 완벽 방지)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      // 모달 내부에서 스크롤하는 경우, 지도의 줌 이벤트를 무시하고 모달 자체의 기본 마우스 휠 스크롤이 원활히 동작하도록 예외 처리
      if (e.target.closest('.modal-overlay') || e.target.closest('.modal-content') || e.target.closest('.modal-body') || e.target.closest('.post-list')) {
        return;
      }

      e.preventDefault(); // 웹 브라우저 자체의 줌/스크롤 액션 비활성화
      
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const zoomFactor = 1.1;
      let newScale = scale;
      if (e.deltaY < 0) {
        newScale = Math.min(2.5, scale * zoomFactor);
      } else {
        newScale = Math.max(0.5, scale / zoomFactor);
      }
      
      if (newScale === scale) return;
      
      // 마우스 포인터의 지도 위 위치를 상수로 고정한 채 스케일 배율을 조절하여 Zoom-to-Cursor 구현
      const targetPointX = (mouseX - pan.x) / scale;
      const targetPointY = (mouseY - pan.y) / scale;
      
      let newPanX = mouseX - targetPointX * newScale;
      let newPanY = mouseY - targetPointY * newScale;
      
      const mapWidthScaled = 1600 * newScale;
      const mapHeightScaled = 1200 * newScale;
      
      let minX, maxX;
      if (mapWidthScaled > rect.width) {
        minX = rect.width - mapWidthScaled;
        maxX = 0;
      } else {
        minX = (rect.width - mapWidthScaled) / 2;
        maxX = minX;
      }
      
      let minY, maxY;
      if (mapHeightScaled > rect.height) {
        minY = rect.height - mapHeightScaled;
        maxY = 0;
      } else {
        minY = (rect.height - mapHeightScaled) / 2;
        maxY = minY;
      }
      
      setPan({
        x: Math.max(minX, Math.min(maxX, newPanX)),
        y: Math.max(minY, Math.min(maxY, newPanY)),
      });
      setScale(newScale);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, [scale, pan]);

  // 플로팅 +/- 버튼 전용 줌 액션 (뷰포트 중앙 기준 줌)
  const zoomAtCenter = (factor) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    let newScale = scale * factor;
    newScale = Math.max(0.5, Math.min(2.5, newScale));
    
    if (newScale === scale) return;
    
    const targetPointX = (centerX - pan.x) / scale;
    const targetPointY = (centerY - pan.y) / scale;
    
    let newPanX = centerX - targetPointX * newScale;
    let newPanY = centerY - targetPointY * newScale;
    
    const mapWidthScaled = 1600 * newScale;
    const mapHeightScaled = 1200 * newScale;
    
    let minX, maxX;
    if (mapWidthScaled > rect.width) {
      minX = rect.width - mapWidthScaled;
      maxX = 0;
    } else {
      minX = (rect.width - mapWidthScaled) / 2;
      maxX = minX;
    }
    
    let minY, maxY;
    if (mapHeightScaled > rect.height) {
      minY = rect.height - mapHeightScaled;
      maxY = 0;
    } else {
      minY = (rect.height - mapHeightScaled) / 2;
      maxY = minY;
    }
    
    setPan({
      x: Math.max(minX, Math.min(maxX, newPanX)),
      y: Math.max(minY, Math.min(maxY, newPanY)),
    });
    setScale(newScale);
  };

  const handleZoomIn = () => zoomAtCenter(1.2);
  const handleZoomOut = () => zoomAtCenter(1 / 1.2);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    if (e.target.closest('.building-marker') || e.target.closest('.modal-overlay') || e.target.closest('.modal-content')) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    const rect = containerRef.current.getBoundingClientRect();
    const mapWidthScaled = 1600 * scale;
    const mapHeightScaled = 1200 * scale;
    
    let minX, maxX;
    if (mapWidthScaled > rect.width) {
      minX = rect.width - mapWidthScaled;
      maxX = 0;
    } else {
      minX = (rect.width - mapWidthScaled) / 2;
      maxX = minX;
    }
    
    let minY, maxY;
    if (mapHeightScaled > rect.height) {
      minY = rect.height - mapHeightScaled;
      maxY = 0;
    } else {
      minY = (rect.height - mapHeightScaled) / 2;
      maxY = minY;
    }

    setPan({
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('.building-marker') || e.target.closest('.modal-overlay') || e.target.closest('.modal-content')) return;
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return;
    const touch = e.touches[0];
    const newX = touch.clientX - dragStart.x;
    const newY = touch.clientY - dragStart.y;

    const rect = containerRef.current.getBoundingClientRect();
    const mapWidthScaled = 1600 * scale;
    const mapHeightScaled = 1200 * scale;
    
    let minX, maxX;
    if (mapWidthScaled > rect.width) {
      minX = rect.width - mapWidthScaled;
      maxX = 0;
    } else {
      minX = (rect.width - mapWidthScaled) / 2;
      maxX = minX;
    }
    
    let minY, maxY;
    if (mapHeightScaled > rect.height) {
      minY = rect.height - mapHeightScaled;
      maxY = 0;
    } else {
      minY = (rect.height - mapHeightScaled) / 2;
      maxY = minY;
    }

    setPan({
      x: Math.max(minX, Math.min(maxX, newX)),
      y: Math.max(minY, Math.min(maxY, newY)),
    });
  };

  // 건물별 공고 필터 계산
  const getFilteredPostsForBuilding = (buildingId) => {
    const buildingPosts = posts.filter(post => post.buildingId === buildingId);
    if (activeFilter === 'all') return buildingPosts;
    if (activeFilter === 'major') return buildingPosts.filter(p => p.type === 'major');
    if (activeFilter === 'gened') return buildingPosts.filter(p => p.type === 'gened');
    if (activeFilter === 'photo') return buildingPosts.filter(p => p.imagePreview);
    return buildingPosts;
  };

  const handlePinClick = (building) => {
    setSelectedBuilding(building);
  };

  const closeDetailModal = () => {
    setSelectedBuilding(null);
  };

  // 지도 위 잔디밭 곳곳에 화사하게 피어나는 피크민 스타일 야생 꽃밭
  const lawnFlowers = React.useMemo(() => {
    const flowers = [];
    const random = (seed) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    // 1. 삼각숲 내부 온통 가득 피어나는 화사한 미니 꽃밭 (45개)
    // 새로운 거대 유기적 곡선 영역 내에 넓고 화사하게 분포하도록 조절
    for (let i = 0; i < 45; i++) {
      const x = 160 + random(i * 12) * 440; // X: 160 ~ 600
      const y = 220 + random(i * 12 + 1) * 220; // Y: 220 ~ 440
      
      const size = 5 + random(i * 3) * 6; // 5px ~ 11px
      const colors = ['#ff7675', '#fdcb6e', '#ffffff', '#74b9ff', '#fd79a8', '#55efc4'];
      const color = colors[Math.floor(random(i * 4) * colors.length)];
      
      flowers.push(
        <g key={`tri-lawn-${i}`} transform={`translate(${x}, ${y})`}>
          {/* 꽃잎 4개 그리기 */}
          <circle cx={-size/4} cy={-size/4} r={size/4.5} fill={color} opacity="0.9" />
          <circle cx={size/4} cy={-size/4} r={size/4.5} fill={color} opacity="0.9" />
          <circle cx={-size/4} cy={size/4} r={size/4.5} fill={color} opacity="0.9" />
          <circle cx={size/4} cy={size/4} r={size/4.5} fill={color} opacity="0.9" />
          {/* 꽃 노란 수술 */}
          <circle cx="0" cy="0" r={size/5} fill="#ffd700" />
        </g>
      );
    }

    // 2. 누리광장, 인문관 주변 잔디, 과학관 주변, 운동장 주변 잔디 꽃밭 (80개)
    const zones = [
      { cx: 300, cy: 300, rx: 110, ry: 60, count: 18 },  // 누리관 배후
      { cx: 260, cy: 450, rx: 40, ry: 20, count: 8 },    // 누리광장
      { cx: 960, cy: 590, rx: 130, ry: 70, count: 20 },  // 인문관-50주년 사이
      { cx: 700, cy: 220, rx: 160, ry: 50, count: 18 },  // 과학관 단지 주변
      { cx: 200, cy: 580, rx: 100, ry: 40, count: 16 },  // 운동장 북쪽 잔디
    ];

    let keyIdx = 0;
    zones.forEach((zone, zIdx) => {
      for (let i = 0; i < zone.count; i++) {
        const angle = random(keyIdx * 5) * Math.PI * 2;
        const radiusX = random(keyIdx * 7) * zone.rx;
        const radiusY = random(keyIdx * 9) * zone.ry;
        const x = zone.cx + Math.cos(angle) * radiusX;
        const y = zone.cy + Math.sin(angle) * radiusY;
        
        const size = 4 + random(keyIdx * 3) * 5; // 4px ~ 9px
        const colors = ['#ff7675', '#ffeaa7', '#ffffff', '#74b9ff', '#fd79a8', '#55efc4'];
        const color = colors[Math.floor(random(keyIdx * 4) * colors.length)];
        
        flowers.push(
          <g key={`zone-lawn-${zIdx}-${i}`} transform={`translate(${x}, ${y})`}>
            <circle cx={-size/4} cy={-size/4} r={size/4.5} fill={color} opacity="0.8" />
            <circle cx={size/4} cy={-size/4} r={size/4.5} fill={color} opacity="0.8" />
            <circle cx={-size/4} cy={size/4} r={size/4.5} fill={color} opacity="0.8" />
            <circle cx={size/4} cy={size/4} r={size/4.5} fill={color} opacity="0.8" />
            <circle cx="0" cy="0" r={size/5} fill="#ffd700" />
          </g>
        );
        keyIdx++;
      }
    });

    return flowers;
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`campus-map-container theme-${mapTheme}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* 벚꽃 비 샤워 애니메이션 */}
      {showPetals && (
        <div className="map-petals-shower-container">
          {petals.map(p => (
            <div 
              key={p.id}
              className="drifting-blossom-petal"
              style={{
                left: p.left,
                animationDelay: p.delay,
                animationDuration: p.duration,
                transform: `scale(${p.scale})`,
                opacity: p.opacity,
              }}
            />
          ))}
        </div>
      )}

      {/* 나눔종류별 실시간 카테고리 필터 칩스 (top-left) */}
      <div className="filter-chips-overlay">
        <button 
          className={`filter-chip ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          <Layers size={13} />
          <span>전체 나눔</span>
        </button>
        <button 
          className={`filter-chip ${activeFilter === 'major' ? 'active' : ''}`}
          onClick={() => setActiveFilter('major')}
        >
          <span>🎓 전공</span>
        </button>
        <button 
          className={`filter-chip ${activeFilter === 'gened' ? 'active' : ''}`}
          onClick={() => setActiveFilter('gened')}
        >
          <span>📖 교양</span>
        </button>
        <button 
          className={`filter-chip ${activeFilter === 'photo' ? 'active' : ''}`}
          onClick={() => setActiveFilter('photo')}
        >
          <span>📷 실물사진</span>
        </button>
      </div>

      {/* 시간대별 감성 테마 & 도감 콘솔 (top-right) */}
      <div className="advanced-console-overlay">
        <div className="console-section theme-controller">
          <button 
            className={`console-btn ${mapTheme === 'day' ? 'active' : ''}`}
            onClick={() => setMapTheme('day')}
            title="낮 테마"
          >
            <Sun size={15} />
          </button>
          <button 
            className={`console-btn ${mapTheme === 'sunset' ? 'active' : ''}`}
            onClick={() => setMapTheme('sunset')}
            title="노을 테마"
          >
            <Sunrise size={15} />
          </button>
          <button 
            className={`console-btn ${mapTheme === 'night' ? 'active' : ''}`}
            onClick={() => setMapTheme('night')}
            title="밤 테마"
          >
            <Moon size={15} />
          </button>
        </div>

        <button 
          className={`console-btn petal-toggle ${showPetals ? 'active' : ''}`}
          onClick={() => setShowPetals(!showPetals)}
          title="벚꽃 비"
        >
          <Sparkles size={15} />
          <span>{showPetals ? '벚꽃 비 On' : '벚꽃 비 Off'}</span>
        </button>

        <button 
          className="console-btn garden-log-btn"
          onClick={onOpenGardenLog}
          title="개화 도감 열기"
        >
          <Award size={15} />
          <span>개화 도감</span>
        </button>
      </div>

      <div 
        className="campus-map-content"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`,
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          position: 'absolute',
          width: '1600px',
          height: '1200px',
          top: 0,
          left: 0,
        }}
      >
        {/* 실제 서울여대 기반 모눈종이 설계도 단면도 스타일 SVG 지도 */}
        <svg 
          className="map-background" 
          viewBox="0 0 1200 900" 
          preserveAspectRatio="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
        >
        <defs>
          {/* 아기자기하고 따뜻한 봄날의 햇살 느낌 아이보리/베이지 배경 그라데이션 */}
          <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fdfcf7" />
            <stop offset="50%" stopColor="#faf7ed" />
            <stop offset="100%" stopColor="#f5eedc" />
          </linearGradient>

          {/* 노을 지는 따뜻한 주황빛 감성 그라데이션 */}
          <linearGradient id="bg-grad-sunset" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fce4d6" />
            <stop offset="50%" stopColor="#f8cbad" />
            <stop offset="100%" stopColor="#ea9999" />
          </linearGradient>

          {/* 아늑하고 차분한 밤하늘의 딥 인디고 그라데이션 */}
          <linearGradient id="bg-grad-night" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2c3e50" />
            <stop offset="50%" stopColor="#1a252f" />
            <stop offset="100%" stopColor="#111822" />
          </linearGradient>
          
          {/* 더욱 싱그럽고 선명하게 활짝 피어나는 잔디 그라데이션 */}
          <linearGradient id="lawn-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e2f9eb" />
            <stop offset="50%" stopColor="#a3e4d7" />
            <stop offset="100%" stopColor="#2ecc71" />
          </linearGradient>

          <filter id="blueprint-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. 아기자기하고 따스한 일러스트 베이스 배경 (낮, 노을, 밤 부드러운 그라데이션 크로스페이드) */}
        {/* 낮 배경 (기본 레이어) */}
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#bg-grad)" 
        />
        {/* 노을 배경 (크로스페이드 오버레이) */}
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#bg-grad-sunset)" 
          style={{ 
            opacity: mapTheme === 'sunset' ? 1 : 0, 
            transition: 'opacity 0.8s ease-in-out',
            pointerEvents: 'none'
          }} 
        />
        {/* 밤 배경 (크로스페이드 오버레이) */}
        <rect 
          width="100%" 
          height="100%" 
          fill="url(#bg-grad-night)" 
          style={{ 
            opacity: mapTheme === 'night' ? 1 : 0, 
            transition: 'opacity 0.8s ease-in-out',
            pointerEvents: 'none'
          }} 
        />

        {/* 풍성한 수목을 위한 전체 캠퍼스 녹지/잔디 구역 레이어링 (이전처럼 자연스러운 투명배경으로 원복) */}
        {/* 서쪽 잔디 광장 (바롬관 & 운동장 배후) */}
        <path d="M 40 150 C 180 130, 320 180, 320 380 C 320 540, 240 680, 80 720 C 40 600, 20 300, 40 150 Z" fill="rgba(39, 174, 96, 0.08)" stroke="rgba(39, 174, 96, 0.15)" strokeWidth="1.5" />
        {/* 북쪽 샬롬하우스 숲 및 배후 녹지 */}
        <path d="M 220 80 C 400 90, 620 70, 820 100 C 850 200, 780 260, 680 270 C 500 230, 350 210, 220 220 C 180 180, 190 120, 220 80 Z" fill="rgba(39, 174, 96, 0.07)" stroke="rgba(39, 174, 96, 0.12)" strokeWidth="1.2" />
        {/* 동쪽 인문대 & 조예대 배후 대형 숲 */}
        <path d="M 780 240 C 950 220, 1100 260, 1150 420 C 1150 600, 1080 780, 920 820 C 860 760, 800 680, 780 500 Z" fill="rgba(39, 174, 96, 0.06)" stroke="rgba(39, 174, 96, 0.1)" strokeWidth="1" />
        
        {/* 서울여대 대표 랜드마크: 삼각숲 (Triangle Forest) - 중앙 전체 영역을 부드럽게 감싸는 거대한 시그니처 잔디 광장으로 초대형 확장 */}
        <path d="M 150 200 C 350 180, 550 190, 630 220 C 650 320, 660 420, 640 460 C 500 480, 300 480, 160 450 C 100 380, 100 280, 150 200 Z" fill="url(#lawn-grad)" stroke="#27ae60" strokeWidth="2.5" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))" />
        <text x="385" y="330" fill="#2e7d32" fontSize="16" fontWeight="bold" textAnchor="middle" letterSpacing="2">삼각숲</text>

        {/* 3. 종합 운동장 (Sports Field) - 좌측 하단 구석으로 완벽하게 이동하여 도로와 간섭 회피 */}
        <g transform="translate(130, 530) rotate(-5)">
          {/* 운동장 잔디 */}
          <ellipse cx="0" cy="0" rx="105" ry="60" fill="#d4efdf" stroke="#a9dfbf" strokeWidth="2" />
          {/* 달리기 트랙 */}
          <ellipse cx="0" cy="0" rx="97" ry="53" fill="none" stroke="#e67e22" strokeWidth="6" opacity="0.8" />
          <ellipse cx="0" cy="0" rx="88" ry="45" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeDasharray="5,5" />
          {/* 축구장 라인 단면도 */}
          <rect x="-42" y="-25" width="84" height="50" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
          <line x1="0" y1="-25" x2="0" y2="25" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
          <circle cx="0" cy="0" r="12" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" />
          <text x="0" y="5" fill="#27ae60" fontSize="13" fontWeight="bold" textAnchor="middle" opacity="0.6">종합운동장</text>
        </g>

        {/* 4. 도로 네트워크 (Roads) - 아웃라인과 칠 레이어를 완전히 분리하여 모래색 도로망이 겹침 없이 Seamless하게 병합되도록 구현 */}
        {/* === 도로 네트워크 (모래색 아웃라인 레이어) === */}
        <g opacity="0.95">
          {/* 중앙 진입 메인 도로 아웃라인 */}
          <path d="M 600 840 L 600 680 Q 600 540 500 480" fill="none" stroke="#ebdcc5" strokeWidth="22" strokeLinecap="round" />
          {/* 도서관 & 누리관 연결 우측 도로 아웃라인 */}
          <path d="M 600 680 Q 640 600 640 500 C 640 420, 680 320, 800 280" fill="none" stroke="#ebdcc5" strokeWidth="18" strokeLinecap="round" />
          {/* 좌측 연결 도로 아웃라인 (종합운동장을 피해서 대강당 우측을 돌아 올라가는 부드러운 우회 아웃라인) */}
          <path d="M 500 480 C 340 470, 240 370, 150 200" fill="none" stroke="#ebdcc5" strokeWidth="18" strokeLinecap="round" />
          {/* 상단 순환 도로 아웃라인 */}
          <path d="M 150 200 Q 320 220 500 210 T 640 320" fill="none" stroke="#ebdcc5" strokeWidth="18" strokeLinecap="round" />
        </g>
        
        {/* === 도로 네트워크 (흰색 안쪽 채우기 레이어) === */}
        <g>
          {/* 중앙 진입 메인 도로 채우기 */}
          <path d="M 600 840 L 600 680 Q 600 540 500 480" fill="none" stroke="#ffffff" strokeWidth="16" strokeLinecap="round" />
          {/* 도서관 & 누리관 연결 우측 도로 채우기 */}
          <path d="M 600 680 Q 640 600 640 500 C 640 420, 680 320, 800 280" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
          {/* 좌측 연결 도로 채우기 (종합운동장을 피해서 대강당 우측을 돌아 올라가는 부드러운 우회 채우기) */}
          <path d="M 500 480 C 340 470, 240 370, 150 200" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
          {/* 상단 순환 도로 채우기 */}
          <path d="M 150 200 Q 320 220 500 210 T 640 320" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
        </g>

        {/* 5. 아기자기한 건물 일러스트 (Cozy Cartoon Building Illustrations) */}
        {/* [NEW] 바롬인성교육관 (barom) Footprint - 하단 유선형 글라스 & 상단 거대 벽돌 교육관 */}
        <g transform="translate(130, 130) rotate(-5)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))">
          {/* 상단 거대 벽돌 연구동 */}
          <rect x="-10" y="-15" width="105" height="50" fill="#cd5c5c" stroke="#900c3f" strokeWidth="2.5" rx="2" />
          {/* 상단동 격자 창문들 (5x3 그리드) */}
          <rect x="0" y="-10" width="10" height="7" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="18" y="-10" width="10" height="7" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="36" y="-10" width="10" height="7" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="54" y="-10" width="10" height="7" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="72" y="-10" width="10" height="7" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="0" y="4" width="10" height="7" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="18" y="4" width="10" height="7" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="36" y="4" width="10" height="7" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="54" y="4" width="10" height="7" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="72" y="4" width="10" height="7" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="0" y="18" width="10" height="7" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="18" y="18" width="10" height="7" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="36" y="18" width="10" height="7" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="54" y="18" width="10" height="7" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="72" y="18" width="10" height="7" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          {/* 하단 베이지 사선형 곡선 로비 기단 */}
          <path d="M -15,35 Q 42.5,30 100,35 L 100,60 Q 42.5,65 -15,60 Z" fill="#ebdcc5" stroke="#8b7355" strokeWidth="2" />
          {/* 유선형 전면 통유리창 로비 */}
          <path d="M -5,35 Q 42.5,32 90,35 L 90,54 Q 42.5,58 -5,54 Z" fill="#ebfaf5" stroke="#20c997" strokeWidth="1.5" />
          {/* 로비 유리창 격자 세로선 */}
          <line x1="15" y1="34" x2="15" y2="55" stroke="#20c997" strokeWidth="1" />
          <line x1="35" y1="33" x2="35" y2="56" stroke="#20c997" strokeWidth="1" />
          <line x1="55" y1="33" x2="55" y2="56" stroke="#20c997" strokeWidth="1" />
          <line x1="75" y1="34" x2="75" y2="55" stroke="#20c997" strokeWidth="1" />
        </g>

        {/* [NEW] 국제생활관 (intl) Footprint - 외부 계단이 있는 클래식 화이트 브릭동 */}
        <g transform="translate(260, 150) rotate(5)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))">
          {/* 본체 건물 (화이트 외벽) */}
          <rect x="-10" y="0" width="105" height="52" fill="#faf8f5" stroke="#7f8c8d" strokeWidth="2.5" rx="3" />
          {/* 건물 중간/하단부 적벽돌 조경 띠선 (실물 특징) */}
          <rect x="-9" y="18" width="103" height="8" fill="#cd5c5c" stroke="#900c3f" strokeWidth="1" />
          <rect x="-9" y="40" width="103" height="8" fill="#cd5c5c" stroke="#900c3f" strokeWidth="1" />
          {/* 창문들 */}
          <rect x="5" y="4" width="12" height="10" fill="#ebf5fb" stroke="#7f8c8d" strokeWidth="1.2" rx="0.5" />
          <rect x="25" y="4" width="12" height="10" fill="#ebf5fb" stroke="#7f8c8d" strokeWidth="1.2" rx="0.5" />
          <rect x="45" y="4" width="12" height="10" fill="#ebf5fb" stroke="#7f8c8d" strokeWidth="1.2" rx="0.5" />
          <rect x="65" y="4" width="12" height="10" fill="#ebf5fb" stroke="#7f8c8d" strokeWidth="1.2" rx="0.5" />
          <rect x="85" y="4" width="12" height="10" fill="#ebf5fb" stroke="#7f8c8d" strokeWidth="1.2" rx="0.5" />
          <rect x="5" y="27" width="12" height="10" fill="#ebf5fb" stroke="#7f8c8d" strokeWidth="1.2" rx="0.5" />
          <rect x="25" y="27" width="12" height="10" fill="#ebf5fb" stroke="#7f8c8d" strokeWidth="1.2" rx="0.5" />
          <rect x="45" y="27" width="12" height="10" fill="#ebf5fb" stroke="#7f8c8d" strokeWidth="1.2" rx="0.5" />
          <rect x="65" y="27" width="12" height="10" fill="#ebf5fb" stroke="#7f8c8d" strokeWidth="1.2" rx="0.5" />
          <rect x="85" y="27" width="12" height="10" fill="#ebf5fb" stroke="#7f8c8d" strokeWidth="1.2" rx="0.5" />
          {/* 좌측 실외 스틸 계단 구조물 (국제생활관 시그니처) */}
          <line x1="-10" y1="46" x2="-28" y2="20" stroke="#7f8c8d" strokeWidth="3" strokeLinecap="round" />
          {/* 계단 디딤판 */}
          <line x1="-15" y1="40" x2="-10" y2="40" stroke="#7f8c8d" strokeWidth="2.5" />
          <line x1="-20" y1="33" x2="-15" y2="33" stroke="#7f8c8d" strokeWidth="2.5" />
          <line x1="-25" y1="26" x2="-20" y2="26" stroke="#7f8c8d" strokeWidth="2.5" />
          {/* 계단 난간 */}
          <line x1="-10" y1="36" x2="-28" y2="10" stroke="#95a5a6" strokeWidth="1.5" />
          <line x1="-10" y1="46" x2="-10" y2="36" stroke="#95a5a6" strokeWidth="1.5" />
          <line x1="-28" y1="20" x2="-28" y2="10" stroke="#95a5a6" strokeWidth="1.5" />
        </g>

        {/* [NEW] 기숙사(샬롬하우스) (shalom) Footprint - 장엄한 트윈 오렌지 타워 기숙사 복합동 */}
        <g transform="translate(400, 90)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))">
          {/* 중앙 연결 지상 통로 로비 */}
          <rect x="25" y="35" width="60" height="25" fill="#fdf2e9" stroke="#d35400" strokeWidth="2" />
          <line x1="55" y1="35" x2="55" y2="60" stroke="#d35400" strokeWidth="1" />
          {/* 1. 좌측 메인 타워동 (장엄한 수직 기동형 오렌지 벽돌 타워) */}
          <rect x="0" y="0" width="30" height="70" fill="#f5b041" stroke="#d35400" strokeWidth="2.5" rx="2" />
          {/* 좌측동의 수직 수로형 통유리창 및 세로 격자 */}
          <rect x="8" y="8" width="14" height="42" fill="#ebfaf5" stroke="#d35400" strokeWidth="1.5" />
          <line x1="15" y1="8" x2="15" y2="50" stroke="#d35400" strokeWidth="1" />
          <line x1="8" y1="22" x2="22" y2="22" stroke="#d35400" strokeWidth="1" />
          <line x1="8" y1="36" x2="22" y2="36" stroke="#d35400" strokeWidth="1" />
          {/* 타워 하단 출입구 */}
          <rect x="8" y="55" width="14" height="15" fill="#a0522d" stroke="#d35400" strokeWidth="1.2" rx="0.5" />
          {/* 2. 우측 메인 타워동 (장엄한 수직 기동형 오렌지 벽돌 타워) */}
          <rect x="80" y="0" width="30" height="70" fill="#f5b041" stroke="#d35400" strokeWidth="2.5" rx="2" />
          {/* 우측동의 수직 수로형 통유리창 및 세로 격자 */}
          <rect x="88" y="8" width="14" height="42" fill="#ebfaf5" stroke="#d35400" strokeWidth="1.5" />
          <line x1="95" y1="8" x2="95" y2="50" stroke="#d35400" strokeWidth="1" />
          <line x1="88" y1="22" x2="102" y2="22" stroke="#d35400" strokeWidth="1" />
          <line x1="88" y1="36" x2="102" y2="36" stroke="#d35400" strokeWidth="1" />
          {/* 타워 하단 출입구 */}
          <rect x="88" y="55" width="14" height="15" fill="#a0522d" stroke="#d35400" strokeWidth="1.2" rx="0.5" />
        </g>
        {/* [NEW] 제1과학관 (sci1) Footprint - 현대적 과학 연구소 & 온실 */}
        <g transform="translate(720, 200) rotate(5)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))">
          {/* 연구소 날개동 */}
          <rect x="-20" y="30" width="25" height="55" fill="#eaecee" stroke="#34495e" strokeWidth="2.5" rx="2" />
          {/* 본체 실험동 */}
          <rect x="0" y="10" width="90" height="75" fill="#f4f6f7" stroke="#34495e" strokeWidth="2.5" rx="3" />
          {/* 옥상 특색 식물실험 온실 (아기자기한 포인트) */}
          <rect x="15" y="-12" width="45" height="22" fill="#e8f8f5" stroke="#1abc9c" strokeWidth="2" rx="2" />
          <line x1="15" y1="-1" x2="60" y2="-1" stroke="#1abc9c" strokeWidth="1" />
          <line x1="30" y1="-12" x2="30" y2="10" stroke="#1abc9c" strokeWidth="1" />
          <line x1="45" y1="-12" x2="45" y2="10" stroke="#1abc9c" strokeWidth="1" />
          {/* 현대 연구동 세로형 격자 격실 창문들 */}
          <rect x="5" y="20" width="12" height="45" fill="#eaf2f8" stroke="#34495e" strokeWidth="1.2" />
          <rect x="25" y="20" width="12" height="45" fill="#eaf2f8" stroke="#34495e" strokeWidth="1.2" />
          <rect x="45" y="20" width="12" height="45" fill="#eaf2f8" stroke="#34495e" strokeWidth="1.2" />
          <rect x="65" y="20" width="12" height="45" fill="#eaf2f8" stroke="#34495e" strokeWidth="1.2" />
          <line x1="5" y1="35" x2="17" y2="35" stroke="#34495e" strokeWidth="1" />
          <line x1="5" y1="50" x2="17" y2="50" stroke="#34495e" strokeWidth="1" />
          <line x1="25" y1="35" x2="37" y2="35" stroke="#34495e" strokeWidth="1" />
          <line x1="25" y1="50" x2="37" y2="50" stroke="#34495e" strokeWidth="1" />
          <line x1="45" y1="35" x2="57" y2="35" stroke="#34495e" strokeWidth="1" />
          <line x1="45" y1="50" x2="57" y2="50" stroke="#34495e" strokeWidth="1" />
          <line x1="65" y1="35" x2="77" y2="35" stroke="#34495e" strokeWidth="1" />
          <line x1="65" y1="50" x2="77" y2="50" stroke="#34495e" strokeWidth="1" />
        </g>

        {/* [NEW] 제2과학관 (sci2) Footprint - 과학기술 IT 및 데이터 공학 연구관 */}
        <g transform="translate(860, 230) rotate(15)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))">
          {/* 구름다리 연결 통로 표시 (제1과학관과 직접 연결) */}
          <rect x="-65" y="32" width="70" height="15" fill="#ffffff" stroke="#34495e" strokeWidth="2.5" strokeDasharray="3,2" />
          {/* 옥상 태양광 친환경 에너지 패널 데코 */}
          <line x1="15" y1="-8" x2="35" y2="-8" stroke="#7f8c8d" strokeWidth="2" />
          <line x1="25" y1="-8" x2="25" y2="0" stroke="#7f8c8d" strokeWidth="2" />
          <polygon points="10,-15 40,-15 35,-8 5,-8" fill="#34495e" stroke="#2c3e50" strokeWidth="1.2" />
          <line x1="65" y1="-8" x2="85" y2="-8" stroke="#7f8c8d" strokeWidth="2" />
          <line x1="75" y1="-8" x2="75" y2="0" stroke="#7f8c8d" strokeWidth="2" />
          <polygon points="60,-15 90,-15 85,-8 55,-8" fill="#34495e" stroke="#2c3e50" strokeWidth="1.2" />
          {/* 본체 전경 */}
          <rect x="0" y="0" width="105" height="85" fill="#f2f4f4" stroke="#34495e" strokeWidth="2.5" rx="3" />
          {/* 스마트 연구실 6분할 와이드 창문 */}
          <rect x="10" y="10" width="22" height="30" fill="#ebf5fb" stroke="#34495e" strokeWidth="1.5" rx="1" />
          <rect x="42" y="10" width="22" height="30" fill="#ebf5fb" stroke="#34495e" strokeWidth="1.5" rx="1" />
          <rect x="73" y="10" width="22" height="30" fill="#ebf5fb" stroke="#34495e" strokeWidth="1.5" rx="1" />
          <rect x="10" y="48" width="22" height="30" fill="#ebf5fb" stroke="#34495e" strokeWidth="1.5" rx="1" />
          <rect x="42" y="48" width="22" height="30" fill="#ebf5fb" stroke="#34495e" strokeWidth="1.5" rx="1" />
          <rect x="73" y="48" width="22" height="30" fill="#ebf5fb" stroke="#34495e" strokeWidth="1.5" rx="1" />
        </g>

        {/* [NEW] 인문사회관 (human) Footprint - 클래식 고딕 적벽돌 대형 학술관 */}
        <g transform="translate(700, 610) rotate(-6)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))">
          {/* 옥외 테라스 난간 및 클래식 플랫 크라운 */}
          <rect x="-5" y="8" width="175" height="8" fill="#d5dbdb" stroke="#7f8c8d" strokeWidth="2" rx="1" />
          <rect x="62" y="-5" width="40" height="13" fill="#eaecee" stroke="#7f8c8d" strokeWidth="2" rx="1" />
          {/* 적벽돌 메인 외벽 */}
          <rect x="0" y="16" width="165" height="52" fill="#cd5c5c" stroke="#900c3f" strokeWidth="2.5" rx="1" />
          {/* 1층 아치형 고딕 대형 유리창들 */}
          <path d="M 15 42 A 8 8 0 0 1 31 42 L 31 60 L 15 60 Z" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1.5" />
          <path d="M 45 42 A 8 8 0 0 1 61 42 L 61 60 L 45 60 Z" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1.5" />
          <path d="M 104 42 A 8 8 0 0 1 120 42 L 120 60 L 104 60 Z" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1.5" />
          <path d="M 134 42 A 8 8 0 0 1 150 42 L 150 60 L 134 60 Z" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1.5" />
          {/* 2층 격자형 로비창들 */}
          <rect x="15" y="24" width="16" height="12" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1.5" rx="1" />
          <rect x="45" y="24" width="16" height="12" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1.5" rx="1" />
          <rect x="104" y="24" width="16" height="12" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1.5" rx="1" />
          <rect x="134" y="24" width="16" height="12" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1.5" rx="1" />
          {/* 중앙 아치형 석조 중앙 현관 정문 */}
          <path d="M 72 32 A 10 10 0 0 1 92 32 L 92 68 L 72 68 Z" fill="#fdf2e9" stroke="#900c3f" strokeWidth="2" />
          <rect x="77" y="50" width="10" height="18" fill="#a0522d" stroke="#900c3f" strokeWidth="1" />
        </g>

        {/* [NEW] 조형예술관 (art) Footprint - 원형 유리 실린더 타워 & 쌍둥이 벽돌 날개동 랜드마크 */}
        <g transform="translate(930, 360) rotate(15)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))">
          {/* 1. 좌측 벽돌 날개동 (3층 구조 클래식 브라운/레드 벽돌조) */}
          <rect x="-70" y="15" width="70" height="48" fill="#cd5c5c" stroke="#900c3f" strokeWidth="2.5" rx="1.5" />
          {/* 좌측동 3개 층 창문들 */}
          <rect x="-60" y="21" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="-45" y="21" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="-30" y="21" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="-15" y="21" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />

          <rect x="-60" y="32" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="-45" y="32" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="-30" y="32" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="-15" y="32" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />

          <rect x="-60" y="43" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="-45" y="43" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="-30" y="43" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="-15" y="43" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />

          {/* 2. 우측 벽돌 날개동 (3층 구조 클래식 브라운/레드 벽돌조) */}
          <rect x="10" y="15" width="80" height="48" fill="#cd5c5c" stroke="#900c3f" strokeWidth="2.5" rx="1.5" />
          {/* 우측동 3개 층 창문들 */}
          <rect x="20" y="21" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="35" y="21" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="50" y="21" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="65" y="21" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />

          <rect x="20" y="32" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="35" y="32" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="50" y="32" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="65" y="32" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />

          <rect x="20" y="43" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="35" y="43" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="50" y="43" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />
          <rect x="65" y="43" width="10" height="6" fill="#ebf5fb" stroke="#900c3f" strokeWidth="1" />

          {/* 3. 중앙 원형 글라스 실린더 타워 (우뚝 솟아오른 랜드마크 타워) */}
          {/* 실린더 본체 */}
          <path d="M -5,-8 L -5,63 A 15,5 0 0,0 25,63 L 25,-8 Z" fill="#ebfaf5" stroke="#20c997" strokeWidth="2.5" />
          {/* 상단 둥근 캡 지붕 */}
          <ellipse cx="10" cy="-8" rx="15" ry="5" fill="#ffffff" stroke="#20c997" strokeWidth="2.5" />
          {/* 실린더 내 가로형 곡선창 프레임 */}
          <path d="M -5,8 A 15,4 0 0,0 25,8" fill="none" stroke="#20c997" strokeWidth="1.5" />
          <path d="M -5,24 A 15,4 0 0,0 25,24" fill="none" stroke="#20c997" strokeWidth="1.5" />
          <path d="M -5,40 A 15,4 0 0,0 25,40" fill="none" stroke="#20c997" strokeWidth="1.5" />
          <path d="M -5,56 A 15,4 0 0,0 25,56" fill="none" stroke="#20c997" strokeWidth="1.5" />
          {/* 세로 기둥 프레임 */}
          <line x1="2" y1="-8" x2="2" y2="65" stroke="#20c997" strokeWidth="1.2" />
          <line x1="18" y1="-8" x2="18" y2="65" stroke="#20c997" strokeWidth="1.2" />
          {/* 유리 비대칭 반사 하이라이트 데코 */}
          <path d="M 5,-2 A 10,2 0 0,0 15,-2" stroke="#fff" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
          <path d="M 5,14 A 10,2 0 0,0 15,14" stroke="#fff" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
          <path d="M 5,30 A 10,2 0 0,0 15,30" stroke="#fff" strokeWidth="2" opacity="0.6" strokeLinecap="round" />
        </g>

        {/* [NEW] 50주년기념관 (50th) Footprint - 미래적 유선형 글라스 곡선 랜드마크 */}
        <g transform="translate(460, 720) rotate(-5)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))">
          {/* 1. 하단 왼쪽 사선형 파스텔 옐로우 기단부 벽체 */}
          <polygon points="0,55 0,110 50,110 80,55" fill="#fcf3cf" stroke="#d4ac0d" strokeWidth="2" />
          <rect x="10" y="65" width="8" height="8" fill="#34495e" rx="1" />
          <rect x="25" y="65" width="8" height="8" fill="#34495e" rx="1" />
          <rect x="10" y="80" width="8" height="8" fill="#34495e" rx="1" />
          <rect x="25" y="80" width="8" height="8" fill="#34495e" rx="1" />
          <rect x="40" y="80" width="8" height="8" fill="#34495e" rx="1" />

          {/* 2. 하단 중앙 열린 공간의 백색 대리석 기둥들 (필로티 구조) */}
          <line x1="50" y1="55" x2="50" y2="110" stroke="#7f8c8d" strokeWidth="3" />
          <line x1="70" y1="55" x2="70" y2="110" stroke="#7f8c8d" strokeWidth="3" />
          <line x1="90" y1="55" x2="90" y2="110" stroke="#7f8c8d" strokeWidth="3" />
          <line x1="110" y1="55" x2="110" y2="110" stroke="#7f8c8d" strokeWidth="3" />

          {/* 3. 하단 오른쪽 전면 유리 로비 현관부 */}
          <rect x="120" y="55" width="45" height="55" fill="#d6eaf8" stroke="#3498db" strokeWidth="2" rx="2" />
          <line x1="142" y1="55" x2="142" y2="110" stroke="#3498db" strokeWidth="1.5" />

          {/* 4. 상층부 거대 곡선형 에메랄드 유리 파사드 메인 건축물 */}
          <path d="M 0,10 C 20,-15 150,-15 170,10 L 170,55 C 170,55 120,60 0,55 Z" fill="#ebfaf5" stroke="#20c997" strokeWidth="2.5" />
          <path d="M 0,15 C 20,-5 150,-5 170,15" fill="none" stroke="#20c997" strokeWidth="1.5" />
          {/* 전면 유리 파사드 세로 프레임 기둥들 */}
          <line x1="20" y1="4" x2="20" y2="56" stroke="#20c997" strokeWidth="1.5" />
          <line x1="40" y1="1" x2="40" y2="57" stroke="#20c997" strokeWidth="1.5" />
          <line x1="60" y1="0" x2="60" y2="58" stroke="#20c997" strokeWidth="1.5" />
          <line x1="80" y1="0" x2="80" y2="59" stroke="#20c997" strokeWidth="1.5" />
          <line x1="100" y1="0" x2="100" y2="59" stroke="#20c997" strokeWidth="1.5" />
          <line x1="120" y1="0" x2="120" y2="58" stroke="#20c997" strokeWidth="1.5" />
          <line x1="140" y1="2" x2="140" y2="57" stroke="#20c997" strokeWidth="1.5" />
          <line x1="155" y1="5" x2="155" y2="56" stroke="#20c997" strokeWidth="1.5" />

          {/* 5. 우측 흰색 벽면 및 빨간 로고 마크 */}
          <path d="M 170,10 L 180,12 L 180,55 L 170,55 Z" fill="#ffffff" stroke="#7f8c8d" strokeWidth="2" />
          {/* 서울여대 상징 삼각 빨간 로고 마크 포인트 */}
          <rect x="172" y="18" width="6" height="6" fill="#e74c3c" transform="rotate(45 175 21)" />
        </g>

        {/* [NEW] 학생누리관 (nuri) Footprint - 현대식 공중 부유 유리 큐브 & 스틸 기둥 랜드마크 */}
        <g transform="translate(580, 310) rotate(5)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))">
          {/* 1. 좌측 벽돌날개동 (어두운 브라운/레드 벽돌조 건물) */}
          <rect x="-30" y="30" width="40" height="80" fill="#a0522d" stroke="#5c2e16" strokeWidth="2" rx="1.5" />
          {/* 벽돌동 아기자기한 격자 창문들 */}
          <rect x="-22" y="42" width="10" height="12" fill="#ebf5fb" stroke="#5c2e16" strokeWidth="1" rx="1" />
          <rect x="-8" y="42" width="10" height="12" fill="#ebf5fb" stroke="#5c2e16" strokeWidth="1" rx="1" />
          <rect x="-22" y="62" width="10" height="12" fill="#ebf5fb" stroke="#5c2e16" strokeWidth="1" rx="1" />
          <rect x="-8" y="62" width="10" height="12" fill="#ebf5fb" stroke="#5c2e16" strokeWidth="1" rx="1" />
          <rect x="-22" y="82" width="10" height="12" fill="#ebf5fb" stroke="#5c2e16" strokeWidth="1" rx="1" />
          <rect x="-8" y="82" width="10" height="12" fill="#ebf5fb" stroke="#5c2e16" strokeWidth="1" rx="1" />

          {/* 2. 중앙/하단 유리 1층 정문 로비 */}
          <rect x="20" y="55" width="75" height="55" fill="#d6eaf8" stroke="#2980b9" strokeWidth="2" rx="2" />
          <line x1="45" y1="55" x2="45" y2="110" stroke="#2980b9" strokeWidth="1.5" />
          <line x1="70" y1="55" x2="70" y2="110" stroke="#2980b9" strokeWidth="1.5" />
          {/* 중앙 로비 회전문 데코 */}
          <rect x="52" y="88" width="16" height="22" fill="#fff" stroke="#2980b9" strokeWidth="1" rx="1" />

          {/* 3. 부유식 상단 거대 유리 박스를 지탱하는 경사 스틸 필러들 (사선 구조 기둥들) */}
          {/* 기둥 1 */}
          <line x1="15" y1="55" x2="-10" y2="110" stroke="#bdc3c7" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="15" y1="55" x2="-10" y2="110" stroke="#7f8c8d" strokeWidth="2.5" strokeLinecap="round" />
          {/* 기둥 2 */}
          <line x1="40" y1="55" x2="35" y2="110" stroke="#bdc3c7" strokeWidth="4" strokeLinecap="round" />
          <line x1="40" y1="55" x2="35" y2="110" stroke="#7f8c8d" strokeWidth="2" strokeLinecap="round" />
          {/* 기둥 3 */}
          <line x1="80" y1="55" x2="95" y2="110" stroke="#bdc3c7" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="80" y1="55" x2="95" y2="110" stroke="#7f8c8d" strokeWidth="2.5" strokeLinecap="round" />
          {/* 기둥 4 */}
          <line x1="105" y1="55" x2="115" y2="110" stroke="#bdc3c7" strokeWidth="4" strokeLinecap="round" />
          <line x1="105" y1="55" x2="115" y2="110" stroke="#7f8c8d" strokeWidth="2" strokeLinecap="round" />

          {/* 4. 공중에 붕 떠있는 상층부 거대 에메랄드 통유리 스퀘어 메인 빌딩 */}
          <rect x="5" y="0" width="115" height="55" fill="#e8f8f5" stroke="#1abc9c" strokeWidth="3" rx="2" />
          {/* 옥상 메탈 난간 */}
          <rect x="2" y="-5" width="121" height="5" fill="#bdc3c7" stroke="#7f8c8d" strokeWidth="1" />
          {/* 통유리 파사드 그리드 유리창 격자 표현 */}
          <line x1="5" y1="13" x2="120" y2="13" stroke="#1abc9c" strokeWidth="1.5" />
          <line x1="5" y1="27" x2="120" y2="27" stroke="#1abc9c" strokeWidth="1.5" />
          <line x1="5" y1="41" x2="120" y2="41" stroke="#1abc9c" strokeWidth="1.5" />
          {/* 세로 격자 프레임 */}
          <line x1="24" y1="0" x2="24" y2="55" stroke="#1abc9c" strokeWidth="1.2" />
          <line x1="43" y1="0" x2="43" y2="55" stroke="#1abc9c" strokeWidth="1.2" />
          <line x1="62" y1="0" x2="62" y2="55" stroke="#1abc9c" strokeWidth="1.2" />
          <line x1="81" y1="0" x2="81" y2="55" stroke="#1abc9c" strokeWidth="1.2" />
          <line x1="100" y1="0" x2="100" y2="55" stroke="#1abc9c" strokeWidth="1.2" />
          {/* 햇살 유리창 비대칭 반사 하이라이트 */}
          <line x1="10" y1="5" x2="20" y2="50" stroke="#fff" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />
          <line x1="48" y1="5" x2="58" y2="50" stroke="#fff" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />
          <line x1="86" y1="5" x2="96" y2="50" stroke="#fff" strokeWidth="2.5" opacity="0.6" strokeLinecap="round" />
        </g>

        {/* [NEW] 중앙도서관 (library) Footprint - 대형 클래식 그리스 석조 신전 도서관 */}
        <g transform="translate(680, 480) rotate(5)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))">
          {/* 최상단 코니스 플랫 그리스 신전 지붕 마루 */}
          <polygon points="-8,10 118,10 110,0 0,0" fill="#eaecee" stroke="#566573" strokeWidth="2" />
          <rect x="-5" y="10" width="120" height="8" fill="#bdc3c7" stroke="#566573" strokeWidth="2" />
          {/* 대리석 화강암 본체 외벽 */}
          <rect x="0" y="18" width="110" height="72" fill="#faf8f5" stroke="#566573" strokeWidth="2.5" rx="2" />
          {/* 6개의 대칭형 대리석 원형 석조 기둥 (Pillars) */}
          <rect x="8" y="18" width="8" height="72" fill="#ffffff" stroke="#7f8c8d" strokeWidth="1.5" />
          <rect x="26" y="18" width="8" height="72" fill="#ffffff" stroke="#7f8c8d" strokeWidth="1.5" />
          <rect x="44" y="18" width="8" height="72" fill="#ffffff" stroke="#7f8c8d" strokeWidth="1.5" />
          <rect x="58" y="18" width="8" height="72" fill="#ffffff" stroke="#7f8c8d" strokeWidth="1.5" />
          <rect x="76" y="18" width="8" height="72" fill="#ffffff" stroke="#7f8c8d" strokeWidth="1.5" />
          <rect x="94" y="18" width="8" height="72" fill="#ffffff" stroke="#7f8c8d" strokeWidth="1.5" />
          {/* 클래식 아치형 처마선 데코 */}
          <path d="M 8 28 Q 17 22 26 28 M 26 28 Q 35 22 44 28 M 58 28 Q 67 22 76 28 M 76 28 Q 85 22 94 28" fill="none" stroke="#7f8c8d" strokeWidth="1.5" />
          {/* 웅장한 아치형 중앙 정문 */}
          <path d="M 43 55 A 12 12 0 0 1 67 55 L 67 90 L 43 90 Z" fill="#d5dbdb" stroke="#566573" strokeWidth="2" />
          <line x1="55" y1="55" x2="55" y2="90" stroke="#566573" strokeWidth="1.5" />
        </g>

        {/* [NEW] 대강당 (grand) Footprint - 대형 원형 콘서트홀 & 돔 천장 대극장 */}
        <g transform="translate(410, 470) rotate(5)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))">
          {/* 하단 2단 원형 대리석 기단 */}
          <ellipse cx="50" cy="65" rx="55" ry="20" fill="#eaecee" stroke="#7f8c8d" strokeWidth="2" />
          <ellipse cx="50" cy="63" rx="50" ry="18" fill="#bdc3c7" stroke="#7f8c8d" strokeWidth="1" />
          {/* 투명 글라스 메인 극장동 외벽 */}
          <path d="M 5,25 C 5,25 5,60 50,65 C 95,60 95,25 95,25" fill="none" stroke="#9b5de5" strokeWidth="2.5" />
          <path d="M 5,25 C 20,40 80,40 95,25 L 95,50 C 95,50 80,62 50,63 C 20,62 5,50 5,50 Z" fill="#f5eef8" stroke="#9b5de5" strokeWidth="2.5" />
          {/* 와이드 통유리 세로 프레임선들 */}
          <line x1="20" y1="31" x2="20" y2="54" stroke="#9b5de5" strokeWidth="1.2" />
          <line x1="35" y1="34" x2="35" y2="59" stroke="#9b5de5" strokeWidth="1.2" />
          <line x1="50" y1="35" x2="50" y2="60" stroke="#9b5de5" strokeWidth="1.5" />
          <line x1="65" y1="34" x2="65" y2="59" stroke="#9b5de5" strokeWidth="1.2" />
          <line x1="80" y1="31" x2="80" y2="54" stroke="#9b5de5" strokeWidth="1.2" />
          {/* 상단 웅장한 대극장 돔 지붕 */}
          <path d="M 5,25 C 5,25 20,0 50,0 C 80,0 95,25 95,25 C 80,35 20,35 5,25 Z" fill="#ebdef0" stroke="#9b5de5" strokeWidth="2.5" />
          <path d="M 50,-8 L 50,0" stroke="#ff79a8" strokeWidth="3.5" strokeLinecap="round" />
          <circle cx="50" cy="-8" r="3.5" fill="#ffd700" stroke="#ff79a8" strokeWidth="1" />
        </g>

        {/* [NEW] 기독교관 (christ) Footprint */}
        <g transform="translate(430, 650) rotate(-15)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))">
          {/* 본체 지붕 */}
          <polygon points="65,0 105,0 85,-22" fill="#7f8c8d" stroke="#374151" strokeWidth="2.5" />
          {/* 본체 */}
          <path d="M 0 20 L 170 20 L 170 45 L 0 45 Z" fill="#ffffff" stroke="#4a4a4a" strokeWidth="2.5" strokeLinejoin="round" />
          <path d="M 70 20 L 100 20 L 100 0 L 70 0 Z" fill="#ffffff" stroke="#4a4a4a" strokeWidth="2.5" strokeLinejoin="round" />
          {/* 스테인드 글라스 아치창 */}
          <rect x="25" y="27" width="12" height="15" fill="#f5b041" stroke="#4a4a4a" strokeWidth="1.2" rx="1.5" />
          <rect x="135" y="27" width="12" height="15" fill="#f5b041" stroke="#4a4a4a" strokeWidth="1.2" rx="1.5" />
          {/* 골드 대형 십자가 */}
          <path d="M 85 -10 L 85 18 M 77 -3 L 93 -3" fill="none" stroke="#f1c40f" strokeWidth="3.5" strokeLinecap="round" />
        </g>

        {/* [NEW] 체육관 (gym) Footprint - 종합운동장 하단 인접 실내 체육관 */}
        <g transform="translate(80, 320) rotate(15)" filter="drop-shadow(0 6px 12px rgba(0,0,0,0.08))">
          {/* 아치 지붕 */}
          <path d="M 0 10 Q 40 -12 80 10 Z" fill="#16a085" stroke="#117a65" strokeWidth="2.5" />
          {/* 몸체 */}
          <rect x="0" y="10" width="80" height="40" fill="#eafbf7" stroke="#1abc9c" strokeWidth="2.5" rx="3" />
          {/* 체육관 원형 유리창 */}
          <circle cx="22" cy="30" r="8" fill="#fff" stroke="#1abc9c" strokeWidth="1.5" />
          <circle cx="58" cy="30" r="8" fill="#fff" stroke="#1abc9c" strokeWidth="1.5" />
        </g>

        {/* === [NEW] 서울여대 시그니처 SWU❤️ 조형물 데크 광장 (삼각숲 하단부 배치) === */}
        <g transform="translate(430, 390)" filter="drop-shadow(0 4px 10px rgba(0,0,0,0.1))">
          {/* 1. 아치형 나무 데크 기단 플랫폼 */}
          <path d="M -55,25 Q 0,12 55,25 L 50,42 Q 0,28 -50,42 Z" fill="#b07d62" stroke="#8c583e" strokeWidth="1.8" />
          {/* 데크 가로 나무 무늬 디테일 선들 */}
          <line x1="-45" y1="23" x2="-41" y2="40" stroke="#70432e" strokeWidth="1.2" />
          <line x1="-30" y1="21" x2="-26" y2="37" stroke="#70432e" strokeWidth="1.2" />
          <line x1="-15" y1="19" x2="-12" y2="35" stroke="#70432e" strokeWidth="1.2" />
          <line x1="0" y1="18" x2="1" y2="34" stroke="#70432e" strokeWidth="1.2" />
          <line x1="15" y1="19" x2="15" y2="35" stroke="#70432e" strokeWidth="1.2" />
          <line x1="30" y1="21" x2="28" y2="37" stroke="#70432e" strokeWidth="1.2" />
          <line x1="45" y1="23" x2="42" y2="40" stroke="#70432e" strokeWidth="1.2" />

          {/* 2. 서울여대 시그니처 3D SWU ❤️ 조형물 */}
          {/* 3D 깊이감을 주기 위한 그림자/중앙 레이어 (뒤에서 앞으로) */}
          
          {/* 3D Layer 1 (맨 뒤 - 가장 어두운 그림자 적색) */}
          <g transform="translate(0, 3)">
            <text 
              x="-14" 
              y="18" 
              fill="#8a180d" 
              fontSize="28" 
              fontWeight="900" 
              fontFamily="'Outfit', 'Noto Sans KR', 'Arial Black', sans-serif"
              textAnchor="middle"
              letterSpacing="1"
            >
              SWU
            </text>
            <path 
              d="M 23,12 C 18,7 13,7 13,2 C 13,-4 19,-8 23,-2 C 27,-8 33,-4 33,2 C 33,7 28,7 23,12 Z" 
              fill="#8a180d" 
            />
          </g>

          {/* 3D Layer 2 (중간 - 어두운 적색) */}
          <g transform="translate(-1, 2)">
            <text 
              x="-14" 
              y="18" 
              fill="#a82315" 
              fontSize="28" 
              fontWeight="900" 
              fontFamily="'Outfit', 'Noto Sans KR', 'Arial Black', sans-serif"
              textAnchor="middle"
              letterSpacing="1"
            >
              SWU
            </text>
            <path 
              d="M 23,12 C 18,7 13,7 13,2 C 13,-4 19,-8 23,-2 C 27,-8 33,-4 33,2 C 33,7 28,7 23,12 Z" 
              fill="#a82315" 
            />
          </g>

          {/* 3D Layer 3 (중간 앞 - 약간 밝은 적색) */}
          <g transform="translate(-2, 1)">
            <text 
              x="-14" 
              y="18" 
              fill="#c82d20" 
              fontSize="28" 
              fontWeight="900" 
              fontFamily="'Outfit', 'Noto Sans KR', 'Arial Black', sans-serif"
              textAnchor="middle"
              letterSpacing="1"
            >
              SWU
            </text>
            <path 
              d="M 23,12 C 18,7 13,7 13,2 C 13,-4 19,-8 23,-2 C 27,-8 33,-4 33,2 C 33,7 28,7 23,12 Z" 
              fill="#c82d20" 
            />
          </g>

          {/* 3D Layer 4 (맨 앞 - 전면의 선명한 붉은색과 흰색 외곽 테두리선) */}
          <g transform="translate(-3, 0)">
            <text 
              x="-14" 
              y="18" 
              fill="#e74c3c" 
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinejoin="round"
              fontSize="28" 
              fontWeight="900" 
              fontFamily="'Outfit', 'Noto Sans KR', 'Arial Black', sans-serif"
              textAnchor="middle"
              letterSpacing="1"
            >
              SWU
            </text>
            <path 
              d="M 23,12 C 18,7 13,7 13,2 C 13,-4 19,-8 23,-2 C 27,-8 33,-4 33,2 C 33,7 28,7 23,12 Z" 
              fill="#e74c3c" 
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* 하트 입체감/반짝임 데코 하이라이트 */}
            <path 
              d="M 16,1 Q 19,-3 22,0" 
              stroke="#ffadad" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              fill="none" 
              opacity="0.9" 
            />
          </g>
        </g>

        {/* 삼각숲 내부 아기자기한 소풍 일러스트 데코 */}
        <g transform="translate(240, 260) rotate(15)" opacity="0.95">
          {/* 체크무늬 빨간 돗자리 */}
          <rect x="-15" y="-10" width="30" height="20" fill="#e74c3c" rx="1.5" />
          <line x1="-15" y1="-5" x2="15" y2="-5" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2,2" />
          <line x1="-15" y1="5" x2="15" y2="5" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2,2" />
          <line x1="-5" y1="-10" x2="-5" y2="10" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2,2" />
          <line x1="5" y1="-10" x2="5" y2="10" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2,2" />
          {/* 노란 런치 박스 */}
          <rect x="-4" y="-3" width="8" height="6" fill="#f1c40f" rx="0.5" />
          <circle cx="2" cy="0" r="1.5" fill="#e67e22" />
        </g>

        {/* 노란색 비치 파라솔 데코 */}
        <g transform="translate(520, 260)">
          <circle cx="0" cy="0" r="12" fill="#f9ca24" stroke="#f0932b" strokeWidth="1" />
          <path d="M 0 0 L 12 0 M 0 0 L -12 0 M 0 0 L 0 12 M 0 0 L 0 -12 M 0 0 L 8.5 8.5 M 0 0 L -8.5 -8.5 M 0 0 L -8.5 8.5 M 0 0 L 8.5 -8.5" stroke="#ffffff" strokeWidth="1" />
          <circle cx="0" cy="0" r="2" fill="#ffffff" />
        </g>


        {[
          // 삼각숲 조경 나무들
          [470, 480, 6], [490, 495, 8], [550, 465, 7], [580, 450, 5], [520, 410, 8], [500, 440, 6],
          // 종합운동장 주변 나무들
          [100, 620, 10], [90, 580, 12], [280, 500, 9], [320, 540, 11],
          // 정문 진입로 조경
          [900, 820, 8], [920, 850, 7], [960, 820, 8], [940, 740, 9],
          // 누리관 광장 및 주변
          [320, 260, 10], [300, 290, 8], [340, 230, 9], [420, 290, 11], [400, 250, 7],
          // 과학관 뒷산 (배후 숲)
          [480, 80, 15], [540, 70, 18], [620, 60, 20], [700, 65, 17], [780, 75, 16], [850, 90, 14],
          [500, 100, 10], [570, 95, 12], [660, 85, 15], [740, 90, 13], [820, 100, 11],
          // 인문대 & 50주년기념관 배후
          [810, 550, 10], [800, 600, 12], [930, 620, 8], [1050, 650, 14], [1030, 710, 11], [1080, 760, 15]
        ].map((tree, i) => {
          const cx = tree[0];
          const cy = tree[1];
          const r = tree[2];
          return (
            <g key={i}>
              {/* 나무 갈색 줄기 기둥 */}
              <line x1={cx} y1={cy} x2={cx} y2={cy + r * 1.1} stroke="#a0522d" strokeWidth={r * 0.25} strokeLinecap="round" />
              {/* 아기자기하고 풍성한 파스텔톤 나뭇잎 레이어링 */}
              <circle cx={cx} cy={cy} r={r} fill="#2ecc71" opacity="0.9" />
              <circle cx={cx - r * 0.15} cy={cy - r * 0.15} r={r * 0.75} fill="#58d68d" opacity="0.95" />
            </g>
          );
        })}

        {/* [NEW] 잔디밭 곳곳에 화사하게 피어나는 피크민 스타일 야생 꽃밭들 */}
        {lawnFlowers}
      </svg>

        {/* 건물 핀 (꽃) - 완벽한 정합성으로 건물 설계도 단면 중앙 위에 바로 렌더링 */}
        {BUILDINGS.map(building => {
          const filteredPosts = getFilteredPostsForBuilding(building.id);
          const postCount = filteredPosts.length;
          const isHighlighted = highlightedBuildings.includes(building.id);
          const isBlooming = building.id === bloomingBuildingId;
          
          if (building.isReference) {
            return (
              <div 
                key={building.id} 
                className="building-marker reference-marker"
                style={{ top: building.top, left: building.left }}
                onClick={() => handlePinClick(building)}
              >
                <div className="reference-pin-graphic" style={building.isGate ? { borderColor: '#2e7d32', color: '#2e7d32', background: '#e8f5e9' } : {}}>
                  {building.isGate ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 21h18M3 21v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4M5 15V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                  )}
                </div>
                <div className="reference-building-label" style={building.isGate ? { backgroundColor: '#2e7d32', borderColor: '#1b5e20' } : {}}>{building.name}</div>
              </div>
            );
          }
          
          // 나눔 건물인 경우, 필터에 해당하지 않으면 흐리게 보이기 처리
          const isFaded = activeFilter !== 'all' && postCount === 0;

          return (
            <div 
              key={building.id} 
              className={`building-marker ${isHighlighted ? 'is-highlighted' : ''} ${isBlooming ? 'is-blooming' : ''} ${isFaded ? 'is-faded' : ''}`}
              style={{ 
                top: building.top, 
                left: building.left,
                opacity: isFaded ? 0.18 : 1,
                pointerEvents: isFaded ? 'none' : 'auto',
                transition: 'opacity 0.3s ease, transform 0.2s ease',
              }}
              onClick={() => handlePinClick(building)}
            >
              <FlowerPin count={postCount} buildingName={building.name} buildingId={building.id} />
            </div>
          );
        })}
      </div>

      {/* 상세 모달 */}
      {selectedBuilding && (
        <PostDetailModal 
          building={selectedBuilding} 
          posts={posts.filter(p => p.buildingId === selectedBuilding.id)} 
          onClose={closeDetailModal} 
        />
      )}

      {/* 플로팅 줌 컨트롤 버튼 */}
      <div className="zoom-controls">
        <button 
          onClick={handleZoomIn} 
          title="지도를 확대합니다"
          className="zoom-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <div className="zoom-divider" />
        <button 
          onClick={handleZoomOut} 
          title="지도를 축소합니다"
          className="zoom-btn"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CampusMap;
