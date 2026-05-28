import React, { useState, useEffect } from 'react';
import { X, PlusCircle } from 'lucide-react';
import FlowerPin from './FlowerPin';
import './CreatePostModal.css';

const BUILDINGS = [
  { id: 'sci1', name: '제1과학관' },
  { id: 'sci2', name: '제2과학관' },
  { id: 'human', name: '인문사회관' },
  { id: 'art', name: '조형예술관' },
  { id: '50th', name: '50주년기념관' },
  { id: 'nuri', name: '학생누리관' },
  { id: 'christ', name: '기독교관' },
  { id: 'barom', name: '바롬인성교육관' },
  { id: 'shalom', name: '기숙사(샬롬하우스)' },
  { id: 'intl', name: '국제생활관' },
  { id: 'grand', name: '대강당' },
];

const COLLEGES_AND_MAJORS = {
  '인문대학': [
    'AI융합콘텐츠전공',
    '프랑스문화콘텐츠전공',
    '독일문화콘텐츠전공',
    '국어국문학과',
    '영어영문학과',
    '중어중문학과',
    '일어일문학과',
    '사학과',
    '기독교학과'
  ],
  '사회과학대학': [
    '경제학과',
    '문헌정보학과',
    '사회복지학과',
    '아동학과',
    '행정학과',
    '언론영상학부',
    '스포츠운동과학과',
    'AI뇌융합학습전공',
    '응용심리전공'
  ],
  '과학기술융합대학': [
    '수학과',
    '화학과',
    '생명환경공학과',
    '바이오헬스융합학과',
    '원예생명조경학과',
    '식품생명공학과',
    '식품영양학과'
  ],
  '미래산업융합대학': [
    '경영학과',
    '패션산업학과',
    '디지털미디어학과',
    '사이버보안전공',
    '개인정보보호전공',
    '소프트웨어학과',
    '데이터사이언스학과',
    '산업디자인학과'
  ],
  '아트앤디자인스쿨': [
    '현대미술전공',
    '공예_컬렉터블디자인전공',
    '시각디자인전공',
    '첨단미디어디자인전공'
  ],
  '교양대학/기타': [
    '공통교양필수',
    '일반교양',
    '취업창업교양',
    '기타'
  ]
};

const CreatePostModal = ({ onClose, onSubmit, posts = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    condition: '새것',
    type: 'major',
    buildingId: 'sci1',
    contact: ''
  });

  const [selectedCollege, setSelectedCollege] = useState('인문대학');
  const [selectedMajor, setSelectedMajor] = useState(COLLEGES_AND_MAJORS['인문대학'][0]);
  const [imagePreview, setImagePreview] = useState(null); // base64 이미지 인코딩 저장용
  const [previewCount, setPreviewCount] = useState(1);

  // 단과대학에 따른 프리뷰용 빌딩 ID (꽃 모양 매칭) 계산
  const getPreviewBuildingId = () => {
    switch (selectedCollege) {
      case '인문대학': return 'human'; // daisy (Red/Yellow)
      case '사회과학대학': return 'intl'; // pansy (Emerald/Green)
      case '과학기술융합대학': return 'sci2'; // bellflower (Purple/Lilac)
      case '미래산업융합대학': return 'sci1'; // pansy (Sky Blue)
      case '아트앤디자인스쿨': return 'art'; // sakura (Pink)
      case '교양대학/기타': return 'nuri'; // clover (Green/Lime)
      default: return 'sci1';
    }
  };

  // 선택된 건물에 따라 예상 꽃 피어나기 횟수 계산
  useEffect(() => {
    const currentCount = posts.filter(p => p.buildingId === formData.buildingId).length;
    setPreviewCount(currentCount + 1);
  }, [formData.buildingId, posts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 과목 분류 변경 시 단과대학도 연동하여 디폴트값 설정
    if (name === 'type') {
      if (value === 'gened') {
        setSelectedCollege('교양대학/기타');
        setSelectedMajor(COLLEGES_AND_MAJORS['교양대학/기타'][0]);
      } else {
        setSelectedCollege('인문대학');
        setSelectedMajor(COLLEGES_AND_MAJORS['인문대학'][0]);
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // base64 인코딩 주소 추출
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCollegeChange = (e) => {
    const college = e.target.value;
    setSelectedCollege(college);
    const majors = COLLEGES_AND_MAJORS[college] || [];
    setSelectedMajor(majors[0] || '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const buildingName = BUILDINGS.find(b => b.id === formData.buildingId)?.name || '';
    onSubmit({ 
      ...formData, 
      buildingName,
      major: selectedMajor,
      imagePreview: imagePreview // base64 이미지 첨부
    });
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>새 나눔 등록하기</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <form className="modal-body form-body" onSubmit={handleSubmit}>
          
          <div className="flower-preview-section">
            <h3 className="preview-title">예상 개화 모습</h3>
            <p className="preview-desc">여러분의 나눔이 모여 선한 영향력이 꽃피어납니다!</p>
            <div className="preview-flower-wrapper">
              <FlowerPin count={previewCount} buildingName="" buildingId={getPreviewBuildingId()} isPreview={true} />
            </div>
            <div className="preview-badge">
              총 누적 나눔: <strong>{previewCount}</strong>건 달성 예정!
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="title">책 제목 / 과목명</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              placeholder="예: 일반물리학 10판" 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>

          {/* 책 사진 추가용 파일 업로더 디자인 */}
          <div className="form-group">
            <label>책 실물 사진 등록 (선택)</label>
            <div className="image-upload-container">
              <label htmlFor="image-upload" className="image-upload-label">
                {imagePreview ? (
                  <div className="uploaded-preview-wrapper">
                    <img src={imagePreview} alt="교재 실물 사진 미리보기" className="uploaded-preview-img" />
                    <span className="upload-change-text">사진 교체하기</span>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <svg className="upload-camera-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    <span>교재 표지 및 실물 사진 추가하기 (클릭)</span>
                  </div>
                )}
              </label>
              <input 
                type="file" 
                id="image-upload" 
                accept="image/*" 
                onChange={handleFileChange} 
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">과목 분류</label>
              <select id="type" name="type" value={formData.type} onChange={handleChange}>
                <option value="major">전공</option>
                <option value="gened">교양</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="condition">책 상태</label>
              <select id="condition" name="condition" value={formData.condition} onChange={handleChange}>
                <option value="새것">새것</option>
                <option value="거의 새것">거의 새것</option>
                <option value="밑줄 약간">밑줄 약간</option>
                <option value="필기 많음">필기 많음</option>
                <option value="사용감 있음">사용감 있음</option>
              </select>
            </div>
          </div>

          <div className="form-row animate-slide-down">
            <div className="form-group">
              <label htmlFor="college">단과대학 선택</label>
              <select id="college" value={selectedCollege} onChange={handleCollegeChange}>
                {Object.keys(COLLEGES_AND_MAJORS).map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="major">소속 학과 / 전공</label>
              <select id="major" value={selectedMajor} onChange={(e) => setSelectedMajor(e.target.value)}>
                {(COLLEGES_AND_MAJORS[selectedCollege] || []).map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="buildingId">나눔 건물 (전공 건물 또는 교양 진행 건물)</label>
            <select id="buildingId" name="buildingId" value={formData.buildingId} onChange={handleChange}>
              {BUILDINGS.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="contact">연락 수단 (오픈채팅 링크, 이메일 등)</label>
            <input 
              type="text" 
              id="contact" 
              name="contact" 
              placeholder="https://open.kakao.com/o/..." 
              value={formData.contact} 
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" className="submit-btn">
            <PlusCircle size={20} />
            꽃 피우기 (나눔 등록)
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;
