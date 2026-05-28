import React, { useMemo, useEffect, useState } from 'react';
import './FlowerPin.css';

const FlowerPin = ({ count, buildingName, buildingId, isPreview = false }) => {
  const [animationKey, setAnimationKey] = useState(0);

  // 미리보기 렌더링 시 모션을 위해 키를 변경
  useEffect(() => {
    if (isPreview) {
      setAnimationKey(prev => prev + 1);
    }
  }, [buildingId, count, isPreview]);

  let stage = 0; 
  if (count > 0 && count < 5) stage = 1;      
  else if (count >= 5 && count < 10) stage = 2; 
  else if (count >= 10 && count < 18) stage = 3; 
  else if (count >= 18 && count < 26) stage = 4;            
  else if (count >= 26) stage = 5;

  // 건물별 고유 테마 색상 및 형태 정의
  const getTheme = () => {
    switch (buildingId) {
      case 'sci1': return { c1: '#00c6ff', c2: '#0072ff', c3: '#7be1ff', type: 'pansy' };
      case 'sci2': return { c1: '#8E2DE2', c2: '#4A00E0', c3: '#d3a5ff', type: 'bellflower' };
      case 'human': return { c1: '#f12711', c2: '#f5af19', c3: '#ffeb3b', type: 'daisy' };
      case 'art': return { c1: '#ff0844', c2: '#ffb199', c3: '#ffd1ff', type: 'sakura' };
      case '50th': return { c1: '#e65c00', c2: '#F9D423', c3: '#ffffff', type: 'tulip' };
      case 'nuri': return { c1: '#11998e', c2: '#38ef7d', c3: '#b2ffda', type: 'clover' };
      case 'christ': return { c1: '#f9d423', c2: '#ff4e50', c3: '#ffd3d5', type: 'tulip' };
      case 'barom': return { c1: '#ff758c', c2: '#ff7eb3', c3: '#ffccd5', type: 'sakura' };
      case 'shalom': return { c1: '#654ea3', c2: '#eaafc8', c3: '#ffffff', type: 'bellflower' };
      case 'intl': return { c1: '#00b09b', c2: '#96c93d', c3: '#ffffff', type: 'pansy' };
      case 'forest': return { c1: '#ffd700', c2: '#ff9f43', c3: '#ffeaa7', type: 'daisy' };
      default: return { c1: '#00b09b', c2: '#96c93d', c3: '#ffffff', type: 'daisy' };
    }
  };

  const theme = getTheme();
  
  const baseSize = isPreview ? 45 : 42;
  const stageScale = [0.75, 0.90, 1.05, 1.20, 1.35, 1.50][stage]; 
  const size = baseSize * stageScale;

  // 흩뿌려지는 작은 꽃들 (Pikmin 효과) - count 수만큼 주변에 생성
  const scatteredFlowers = useMemo(() => {
    if (count <= 0) return [];
    
    // 잔꽃 개수 대폭 늘려 풍성함 극대화
    const displayCount = Math.min(6 + count * 4, 60); 
    const flowers = [];
    
    // 시드 기반 난수 생성 (일관된 위치 유지)
    const random = (seed) => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    const maxRadius = isPreview ? 40 : 50;
    const center = isPreview ? 50 : 60;

    for (let i = 0; i < displayCount; i++) {
      const angle = random(i * buildingId.charCodeAt(0)) * Math.PI * 2;
      const radius = 12 + random(i * 2 + buildingId.charCodeAt(0)) * maxRadius; // 중심으로부터 반경
      const x = Math.cos(angle) * radius + center; // 컨테이너 중심
      const y = Math.sin(angle) * radius + center;
      
      // 잔꽃 크기를 아기자기하고 귀엽게 조정 (8px ~ 16px)
      const smallSize = 8 + random(i * 3) * 8;
      const colors = [theme.c1, theme.c2, theme.c3, '#fff'];
      const color = colors[Math.floor(random(i * 4) * colors.length)];
      
      // 잔꽃 형태도 4가지로 다채롭게 적용 (0: 클로버, 1: 별꽃, 2: 데이지, 3: 튤립/하트)
      const shapeType = Math.floor(random(i * 7) * 4);
      let svgContent = null;
      
      if (shapeType === 0) {
        // 클로버 형태 (4잎)
        svgContent = (
          <svg width={smallSize} height={smallSize} viewBox="0 0 20 20">
            <circle cx="10" cy="5" r="4.5" fill={color} opacity="0.9" />
            <circle cx="15" cy="10" r="4.5" fill={color} opacity="0.9" />
            <circle cx="10" cy="15" r="4.5" fill={color} opacity="0.9" />
            <circle cx="5" cy="10" r="4.5" fill={color} opacity="0.9" />
            <circle cx="10" cy="10" r="3.5" fill="#fff" />
          </svg>
        );
      } else if (shapeType === 1) {
        // 별 모양 꽃
        svgContent = (
          <svg width={smallSize} height={smallSize} viewBox="0 0 20 20">
            <path d="M 10 2 L 12.5 7.5 L 18.5 8 L 14 12 L 15.5 18 L 10 14.5 L 4.5 18 L 6 12 L 1.5 8 L 7.5 7.5 Z" fill={color} opacity="0.9" />
            <circle cx="10" cy="10" r="2.5" fill="#fff" />
          </svg>
        );
      } else if (shapeType === 2) {
        // 데이지 (8잎 꽃)
        svgContent = (
          <svg width={smallSize} height={smallSize} viewBox="0 0 20 20">
            <g fill={color} opacity="0.9">
              <circle cx="10" cy="4" r="2.5" />
              <circle cx="14.2" cy="5.8" r="2.5" />
              <circle cx="16" cy="10" r="2.5" />
              <circle cx="14.2" cy="14.2" r="2.5" />
              <circle cx="10" cy="16" r="2.5" />
              <circle cx="5.8" cy="14.2" r="2.5" />
              <circle cx="4" cy="10" r="2.5" />
              <circle cx="5.8" cy="5.8" r="2.5" />
            </g>
            <circle cx="10" cy="10" r="3.5" fill="#ffeb3b" />
          </svg>
        );
      } else {
        // 튤립/하트 형태
        svgContent = (
          <svg width={smallSize} height={smallSize} viewBox="0 0 20 20">
            <path d="M 10 2 C 6 2, 3 7, 10 18 C 17 7, 14 2, 10 2 Z" fill={color} opacity="0.9" />
            <path d="M 8 4 C 5.5 5, 5.5 9, 10 18 C 6.5 9, 6.5 5.5, 8 4 Z" fill={theme.c2} opacity="0.75" />
            <path d="M 12 4 C 14.5 5, 14.5 9, 10 18 C 13.5 9, 13.5 5.5, 12 4 Z" fill={theme.c2} opacity="0.75" />
            <circle cx="10" cy="8" r="2" fill="#fff" />
          </svg>
        );
      }

      flowers.push(
        <div 
          key={i} 
          className="scattered-flower" 
          style={{ 
            left: `${x}px`, 
            top: `${y}px`,
            animationDelay: `${random(i * 5) * 0.5}s`
          }}
        >
          {svgContent}
        </div>
      );
    }
    return flowers;
  }, [count, buildingId, theme, isPreview]);

  const renderFlowerSVG = () => {
    if (stage === 0) {
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
          <circle cx="50" cy="50" r="15" fill={theme.c2} opacity="0.5" filter="drop-shadow(0 0 5px rgba(0,0,0,0.3))" />
          <circle cx="50" cy="50" r="8" fill={theme.c1} />
        </svg>
      );
    }

    // 공통 그래디언트 및 광원 정의
    const renderDefs = () => (
      <defs>
        <radialGradient id={`grad-${buildingId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={theme.c3} />
          <stop offset="50%" stopColor={theme.c1} />
          <stop offset="100%" stopColor={theme.c2} />
        </radialGradient>
        <radialGradient id={`glow-${buildingId}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={theme.c1} stopOpacity="0.85" />
          <stop offset="100%" stopColor={theme.c2} stopOpacity="0" />
        </radialGradient>
      </defs>
    );

    if (stage === 1) {
      // Stage 1: 1송이 단독 개화 (나눔 1-4개)
      return (
        <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
          {renderDefs()}
          <g transform="translate(0, 0) scale(1.0)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 1, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="10" fill="#fff" filter="drop-shadow(0 0 5px rgba(255,255,255,0.8))" />
            <circle cx="100" cy="100" r="5" fill={theme.c2} />
          </g>
        </svg>
      );
    }

    if (stage === 2) {
      // Stage 2: 2송이 다정 꽃 클러스터 (나눔 5-9개, e.g. 학생누리관)
      return (
        <svg width={size} height={size} viewBox="0 0 200 200" style={{ overflow: 'visible' }}>
          {renderDefs()}
          {/* 서브 꽃 (왼쪽 아래) */}
          <g transform="translate(-25, 22) scale(0.72)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 1, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="8" fill="#fff" />
            <circle cx="100" cy="100" r="4" fill={theme.c2} />
          </g>
          {/* 메인 꽃 (중앙) */}
          <g transform="translate(0, 0) scale(1.0)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 2, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="14" fill="#fff" filter="drop-shadow(0 0 10px rgba(255,255,255,0.8))" />
            <circle cx="100" cy="100" r="7" fill={theme.c2} />
          </g>
        </svg>
      );
    }

    if (stage === 3) {
      // Stage 3: 3송이 풍성 꽃 클러스터 (나눔 10-17개, e.g. 제1과학관, 조형예술관)
      return (
        <svg width={size} height={size} viewBox="0 0 200 200" className="animate-float" style={{ overflow: 'visible' }}>
          {renderDefs()}
          <circle cx="100" cy="100" r="60" fill={`url(#glow-${buildingId})`} className="pulse-aura" />
          
          {/* 서브 꽃 1 (왼쪽 아래) */}
          <g transform="translate(-28, 25) scale(0.7)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 1, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="8" fill="#fff" />
            <circle cx="100" cy="100" r="4" fill={theme.c2} />
          </g>
          {/* 서브 꽃 2 (오른쪽 위) */}
          <g transform="translate(28, -25) scale(0.6)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 1, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="6" fill="#fff" />
            <circle cx="100" cy="100" r="3" fill={theme.c2} />
          </g>
          {/* 메인 꽃 (중앙) */}
          <g transform="translate(0, 0) scale(1.0)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 3, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="16" fill="#fff" filter="drop-shadow(0 0 10px rgba(255,255,255,0.8))" />
            <circle cx="100" cy="100" r="8" fill={theme.c2} />
          </g>
        </svg>
      );
    }

    if (stage === 4) {
      // Stage 4: 5송이 화려한 꽃다발 클러스터 (나눔 18-25개, e.g. 제2과학관)
      return (
        <svg width={size} height={size} viewBox="0 0 200 200" className="animate-float" style={{ overflow: 'visible' }}>
          {renderDefs()}
          <circle cx="100" cy="100" r="75" fill={`url(#glow-${buildingId})`} className="pulse-aura" />

          {/* 서브 꽃 1 (왼쪽 아래) */}
          <g transform="translate(-32, 28) scale(0.7)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 2, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="12" fill="#fff" />
            <circle cx="100" cy="100" r="6" fill={theme.c2} />
          </g>
          {/* 서브 꽃 2 (오른쪽 위) */}
          <g transform="translate(32, -28) scale(0.65)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 2, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="10" fill="#fff" />
            <circle cx="100" cy="100" r="5" fill={theme.c2} />
          </g>
          {/* 서브 꽃 3 (오른쪽 아래) */}
          <g transform="translate(28, 30) scale(0.6)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 1, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="8" fill="#fff" />
            <circle cx="100" cy="100" r="4" fill={theme.c2} />
          </g>
          {/* 서브 꽃 4 (왼쪽 위) */}
          <g transform="translate(-28, -30) scale(0.55)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 1, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="6" fill="#fff" />
            <circle cx="100" cy="100" r="3" fill={theme.c2} />
          </g>
          {/* 메인 꽃 (중앙) */}
          <g transform="translate(0, 0) scale(1.0)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 3, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="18" fill="#fff" filter="drop-shadow(0 0 10px rgba(255,255,255,0.8))" />
            <circle cx="100" cy="100" r="9" fill={theme.c2} />
          </g>
        </svg>
      );
    }

    if (stage === 5) {
      // Stage 5: 초호화 8송이 슈퍼블룸 꽃밭 꽃다발 클러스터 (나눔 26개 이상 핵심 빌딩 - 인문사회관, 50주년기념관)
      return (
        <svg width={size} height={size} viewBox="0 0 200 200" className="animate-float" style={{ overflow: 'visible' }}>
          {renderDefs()}
          <circle cx="100" cy="100" r="90" fill={`url(#glow-${buildingId})`} className="pulse-aura" />

          {/* 서브 꽃 1 (왼쪽 아래) */}
          <g transform="translate(-36, 32) scale(0.75)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 2, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="12" fill="#fff" />
            <circle cx="100" cy="100" r="6" fill={theme.c2} />
          </g>
          {/* 서브 꽃 2 (오른쪽 위) */}
          <g transform="translate(36, -32) scale(0.68)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 2, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="10" fill="#fff" />
            <circle cx="100" cy="100" r="5" fill={theme.c2} />
          </g>
          {/* 서브 꽃 3 (오른쪽 아래) */}
          <g transform="translate(32, 34) scale(0.72)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 2, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="12" fill="#fff" />
            <circle cx="100" cy="100" r="6" fill={theme.c2} />
          </g>
          {/* 서브 꽃 4 (왼쪽 위) */}
          <g transform="translate(-32, -34) scale(0.6)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 1, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="8" fill="#fff" />
            <circle cx="100" cy="100" r="4" fill={theme.c2} />
          </g>
          {/* 서브 꽃 5 (정방향 위) */}
          <g transform="translate(0, -44) scale(0.55)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 1, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="6" fill="#fff" />
            <circle cx="100" cy="100" r="3" fill={theme.c2} />
          </g>
          {/* 서브 꽃 6 (정방향 아래) */}
          <g transform="translate(0, 44) scale(0.58)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 1, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="8" fill="#fff" />
            <circle cx="100" cy="100" r="4" fill={theme.c2} />
          </g>
          {/* 서브 꽃 7 (정방향 오른쪽) */}
          <g transform="translate(44, 0) scale(0.55)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 1, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="6" fill="#fff" />
            <circle cx="100" cy="100" r="3" fill={theme.c2} />
          </g>
          {/* 메인 꽃 (중앙 거대 꽃) */}
          <g transform="translate(0, 0) scale(1.0)" style={{ transformOrigin: '100px 100px' }}>
            {renderPetals(theme.type, 3, `url(#grad-${buildingId})`, theme.c3)}
            <circle cx="100" cy="100" r="22" fill="#fff" filter="drop-shadow(0 0 10px rgba(255,255,255,0.8))" />
            <circle cx="100" cy="100" r="11" fill={theme.c2} />
          </g>
        </svg>
      );
    }
  };

  const renderPetals = (type, stage, fillGrad, highlightColor) => {
    const petals = [];
    const layers = stage; 
    
    for (let l = 1; l <= layers; l++) {
      // 잎과 꽃잎의 개수를 플랫하고 귀엽게 4개 또는 5개로 한정 (뾰족하거나 복잡한 gear 현상 방지)
      const numPetals = type === 'clover' ? 4 : 5;
      
      // 레이어별 반지름이 200x200 뷰박스 내부(100+-80)에 완벽히 머물도록 튜닝
      const radius = 15 + (l * 14) + (stage === 4 && l === layers ? 15 : 0); 
      
      for (let i = 0; i < numPetals; i++) {
        // 각 레이어마다 꽃잎 각도를 어긋나게 25도씩 회전시켜서 겹쳤을 때 풍성하고 자연스러운 겹꽃잎 구현
        const angle = (360 / numPetals) * i + (l * 25); 
        
        let pathD = '';
        if (type === 'sakura') {
          // 벚꽃 모양 (끝이 갈라지고 부드럽고 둥근 두 개의 엽)
          pathD = `M 100 100 
            C ${100 - radius*0.5} ${100 - radius*0.3}, ${100 - radius*0.45} ${100 - radius*0.95}, ${100 - radius*0.12} ${100 - radius*0.9} 
            Q 100 ${100 - radius*0.75} ${100 + radius*0.12} ${100 - radius*0.9} 
            C ${100 + radius*0.45} ${100 - radius*0.95}, ${100 + radius*0.5} ${100 - radius*0.3}, 100 100`;
        } else if (type === 'daisy') {
          // 데이지 (끝이 완벽하게 둥글둥글하고 포근한 꽃잎)
          pathD = `M 100 100 
            C ${100 - radius*0.4} ${100 - radius*0.2}, ${100 - radius*0.4} ${100 - radius*0.95}, 100 ${100 - radius} 
            C ${100 + radius*0.4} ${100 - radius*0.95}, ${100 + radius*0.4} ${100 - radius*0.2}, 100 100`;
        } else if (type === 'pansy') {
          // 팬지/수국 (풍성하고 너비가 넓은 부채꼴 모양의 둥근 꽃잎)
          pathD = `M 100 100 
            C ${100 - radius*0.6} ${100 - radius*0.15}, ${100 - radius*0.7} ${100 - radius*0.85}, 100 ${100 - radius} 
            C ${100 + radius*0.7} ${100 - radius*0.85}, ${100 + radius*0.6} ${100 - radius*0.15}, 100 100`;
        } else if (type === 'bellflower') {
          // 도라지꽃/별꽃 (끝이 아주 부드럽고 곡선미를 지닌 라운딩 별 모양 꽃잎)
          pathD = `M 100 100 
            C ${100 - radius*0.3} ${100 - radius*0.3}, ${100 - radius*0.3} ${100 - radius*0.85}, ${100 - radius*0.08} ${100 - radius*0.92}
            Q 100 ${100 - radius} ${100 + radius*0.08} ${100 - radius*0.92}
            C ${100 + radius*0.3} ${100 - radius*0.85}, ${100 + radius*0.3} ${100 - radius*0.3}, 100 100`;
        } else if (type === 'tulip') {
          // 튤립 (봉오리처럼 오목하고 윗단이 둥근 곡선을 그리는 물결 모양 꽃잎)
          pathD = `M 100 100 
            C ${100 - radius*0.3} ${100 - radius*0.2}, ${100 - radius*0.45} ${100 - radius*0.9}, ${100 - radius*0.15} ${100 - radius*0.95} 
            Q 100 ${100 - radius*0.8} ${100 + radius*0.15} ${100 - radius*0.95} 
            C ${100 + radius*0.45} ${100 - radius*0.90}, ${100 + radius*0.3} ${100 - radius*0.2}, 100 100`;
        } else if (type === 'clover') {
          // 네잎클로버 (부드럽고 둥글둥글한 하트 모양의 이파리)
          pathD = `M 100 100 
            C ${100 - radius*0.5} ${100 - radius*0.25}, ${100 - radius*0.5} ${100 - radius*0.95}, ${100 - radius*0.1} ${100 - radius*0.9} 
            Q 100 ${100 - radius*0.75} ${100 + radius*0.1} ${100 - radius*0.9} 
            C ${100 + radius*0.5} ${100 - radius*0.95}, ${100 + radius*0.5} ${100 - radius*0.25}, 100 100`;
        }

        petals.push(
          <path 
            key={`${l}-${i}`} 
            d={pathD} 
            fill={fillGrad} 
            transform={`rotate(${angle} 100 100)`} 
            opacity={0.7 + (l*0.08)} 
            stroke={highlightColor}
            strokeWidth="1"
          />
        );
      }
    }
    return <g className={isPreview ? "animate-bloom-spin" : ""}>{petals}</g>;
  };

  return (
    <div 
      key={animationKey} 
      className={`flower-pin ${isPreview ? 'is-preview dramatic-bloom' : ''}`} 
      style={{ zIndex: stage }}
    >
      {/* 흩뿌려지는 잔꽃들 */}
      {count > 0 && (
        <div className="scattered-flowers">
          {scatteredFlowers}
        </div>
      )}

      {/* 중앙 메인 꽃 */}
      <div className="flower-graphic">
        {renderFlowerSVG()}
        {count > 0 && !isPreview && (
          <div className="flower-badge" style={{ backgroundColor: theme.c2 }}>{count}</div>
        )}
      </div>
      {!isPreview && <div className="building-label" style={{ color: theme.c2, borderColor: theme.c1 }}>{buildingName}</div>}
    </div>
  );
};

export default FlowerPin;
