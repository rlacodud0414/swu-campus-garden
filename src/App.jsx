import React, { useState } from 'react';
import { X } from 'lucide-react';
import CampusMap from './components/CampusMap';
import CreatePostModal from './components/CreatePostModal';
import FloatingButton from './components/FloatingButton';
import Header from './components/Header';
import GardenLogModal from './components/GardenLogModal';
import './App.css';

// 서울여자대학교 실제 전공/교양 서적 100건+ 초호화 목업 데이터
const INITIAL_POSTS = [
  // === 제1과학관 (sci1 - 화학, 생명, 식품생명공학, 원예 등) - 15건 ===
  { id: 101, title: '일반화학실험 (9판)', condition: '새것', type: 'major', buildingId: 'sci1', buildingName: '제1과학관', contact: 'https://open.kakao.com/o/swusci1_1', major: '화학과' },
  { id: 102, title: '일반생물학 및 실험', condition: '거의 새것', type: 'major', buildingId: 'sci1', buildingName: '제1과학관', contact: 'example_bio@swu.ac.kr', major: '생명환경공학과' },
  { id: 103, title: '기초유기화학 (맥머리)', condition: '밑줄 약간', type: 'major', buildingId: 'sci1', buildingName: '제1과학관', contact: 'https://open.kakao.com/o/swusci1_2', major: '화학과' },
  { id: 104, title: '식품생명공학 개론 (2026 신규개정)', condition: '사용감 있음', type: 'major', buildingId: 'sci1', buildingName: '제1과학관', contact: '010-1234-5678', major: '생명환경공학과' },
  { id: 105, title: '단백질공학의 기초', condition: '필기 많음', type: 'major', buildingId: 'sci1', buildingName: '제1과학관', contact: 'https://open.kakao.com/o/swusci1_3', major: '과학기술융합대학' },
  { id: 106, title: '기초물리학 (북스힐)', condition: '거의 새것', type: 'major', buildingId: 'sci1', buildingName: '제1과학관', contact: '010-9876-5432', major: '과학기술융합대학' },
  { id: 107, title: '생화학 (Lehninger 7판)', condition: '밑줄 약간', type: 'major', buildingId: 'sci1', buildingName: '제1과학관', contact: 'biochem@swu.ac.kr', major: '화학과' },
  { id: 108, title: '분석화학 (Harris 9판)', condition: '사용감 있음', type: 'major', buildingId: 'sci1', buildingName: '제1과학관', contact: 'https://open.kakao.com/o/swusci1_4', major: '화학과' },
  { id: 109, title: '원예학개론 (새로운)', condition: '새것', type: 'major', buildingId: 'sci1', buildingName: '제1과학관', contact: 'garden_swu@naver.com', major: '원예생명조경학과' },
  { id: 110, title: '인체생리학 (수문사)', condition: '필기 많음', type: 'major', buildingId: 'sci1', buildingName: '제1과학관', contact: 'https://open.kakao.com/o/swusci1_5', major: '과학기술융합대학' },
  { id: 111, title: '고급생명과학 개론', condition: '새것', type: 'major', buildingId: 'sci1', buildingName: '제1과학관', contact: '010-5555-4444', major: '생명환경공학과' },
  { id: 112, title: '재배학범론', condition: '밑줄 약간', type: 'major', buildingId: 'sci1', buildingName: '제1과학관', contact: 'https://open.kakao.com/o/swusci1_6', major: '원예생명조경학과' },
  { id: 113, title: '생명과학 길라잡이', condition: '사용감 있음', type: 'major', buildingId: 'sci1', buildingName: '제1과학관', contact: 'biology_helper@daum.net', major: '생명환경공학과' },
  { id: 114, title: '식생활과 다이어트', condition: '새것', type: 'gened', buildingId: 'sci1', buildingName: '제1과학관', contact: 'https://open.kakao.com/o/swusci1_7', major: '과학기술융합대학' },
  { id: 115, title: '화학으로 본 세상', condition: '거의 새것', type: 'gened', buildingId: 'sci1', buildingName: '제1과학관', contact: 'chem_world@swu.ac.kr', major: '화학과' },

  // === 제2과학관 (sci2 - 컴퓨터학과, 소융, 정보, 수학, 미디어 등) - 18건 ===
  { id: 201, title: '소프트웨어학과 자료구조 (C언어로 풀이)', condition: '밑줄 약간', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: 'https://open.kakao.com/o/swusci2_1', major: '소프트웨어학과' },
  { id: 202, title: '알고리즘 기초 (Neapolitan)', condition: '새것', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: '010-4444-3333', major: '지능정보보호학부' },
  { id: 203, title: 'C언어 콘서트 (누구나 쉽게 배우는)', condition: '사용감 있음', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: 'https://open.kakao.com/o/swusci2_2', major: '컴퓨터학과' },
  { id: 204, title: '컴퓨터 구조와 설계 (Patterson)', condition: '필기 많음', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: '010-8888-9999', major: '컴퓨터학과' },
  { id: 205, title: '선형대수학 개론 (Anton)', condition: '거의 새것', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: 'linear_math@swu.ac.kr', major: '수학과' },
  { id: 206, title: '이산수학 (Rosen 8판)', condition: '밑줄 약간', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: 'https://open.kakao.com/o/swusci2_3', major: '수학과' },
  { id: 207, title: '데이터베이스 시스템 (Elmasri)', condition: '사용감 있음', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: '010-1111-2222', major: '지능정보보호학부' },
  { id: 208, title: '네트워크 보안과 암호학', condition: '새것', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: 'https://open.kakao.com/o/swusci2_4', major: '지능정보보호학부' },
  { id: 209, title: '명품 Java Programming', condition: '필기 많음', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: 'javamaster@naver.com', major: '컴퓨터학과' },
  { id: 210, title: '쉽게 배우는 운영체제', condition: '거의 새것', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: 'https://open.kakao.com/o/swusci2_5', major: '소프트웨어학과' },
  { id: 211, title: '해석학개론 (제4판)', condition: '밑줄 약간', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: '010-7777-8888', major: '수학과' },
  { id: 212, title: '인공지능: 현대적 접근방식', condition: '새것', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: 'https://open.kakao.com/o/swusci2_6', major: '컴퓨터학과' },
  { id: 213, title: '미적분학 1 (Stewart)', condition: '사용감 있음', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: 'stewart_calculus@swu.ac.kr', major: '수학과' },
  { id: 214, title: '수리통계학 및 연습', condition: '필기 많음', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: 'https://open.kakao.com/o/swusci2_7', major: '컴퓨터학과' },
  { id: 215, title: 'HTML5/CSS3 웹프로그래밍', condition: '새것', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: '010-9999-0000', major: '컴퓨터학과' },
  { id: 216, title: '컴퓨터 그래픽스 배움터', condition: '거의 새것', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: 'https://open.kakao.com/o/swusci2_8', major: '디지털미디어학과' },
  { id: 217, title: '파이썬 데이터 분석 기초', condition: '밑줄 약간', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: 'pydata_swu@naver.com', major: '데이터사이언스학과' },
  { id: 218, title: '소프트웨어 공학의 모든것', condition: '사용감 있음', type: 'major', buildingId: 'sci2', buildingName: '제2과학관', contact: 'https://open.kakao.com/o/swusci2_9', major: '소프트웨어학과' },

  // === 인문사회관 (human - 국문, 영문, 사학, 독문, 불문, 문정, 교육심리, 아동, 경영, 경제, 사회 등) - 32건 ===
  { id: 301, title: '경영학원론 (마경사)', condition: '새것', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_1', major: '경영학과' },
  { id: 302, title: '심리학개론 (현대)', condition: '거의 새것', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'psy_swu@swu.ac.kr', major: '교육심리학과' },
  { id: 303, title: '사회조사방법론 (백산)', condition: '밑줄 약간', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_2', major: '인문사회대학' },
  { id: 304, title: '한국현대소설론', condition: '사용감 있음', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: '010-6666-5555', major: '국어국문학과' },
  { id: 305, title: '서양사강의 (한울)', condition: '필기 많음', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_3', major: '사학과' },
  { id: 306, title: '정보조직론 (분류법)', condition: '거의 새것', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'lib_organize@naver.com', major: '문헌정보학과' },
  { id: 307, title: '맨큐의 미시경제학 (8판)', condition: '밑줄 약간', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_4', major: '경제학과' },
  { id: 308, title: 'IFRS 회계원리', condition: '사용감 있음', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: '010-2222-3333', major: '경영학과' },
  { id: 309, title: '아동발달론 (학지사)', condition: '새것', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'child_dev@swu.ac.kr', major: '아동학과' },
  { id: 310, title: '교육심리학 (현대)', condition: '필기 많음', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_5', major: '교육심리학과' },
  { id: 311, title: '현대 사회학 (기든스)', condition: '새것', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: '010-3333-4444', major: '인문사회대학' },
  { id: 312, title: '국어학개론 (탑)', condition: '밑줄 약간', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_6', major: '국어국문학과' },
  { id: 313, title: '마케팅 원론 (안광호)', condition: '사용감 있음', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'mkt_swu@daum.net', major: '경영학과' },
  { id: 314, title: '맨큐의 거시경제학 (9판)', condition: '새것', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_7', major: '경제학과' },
  { id: 315, title: '영문학사 개론', condition: '거의 새것', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: '010-9999-8888', major: '영어영문학과' },
  { id: 316, title: '사학개론: 역사란 무엇인가', condition: '밑줄 약간', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_8', major: '사학과' },
  { id: 317, title: '아동문학 이론과 실제', condition: '사용감 있음', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'child_lit@naver.com', major: '아동학과' },
  { id: 318, title: '도서관학 원론', condition: '필기 많음', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_9', major: '문헌정보학과' },
  { id: 319, title: '재무관리 (현대)', condition: '새것', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'finance_swu@swu.ac.kr', major: '경영학과' },
  { id: 320, title: '한국사 특강 (서울대)', condition: '거의 새것', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_10', major: '사학과' },
  { id: 321, title: '영작문 작성법 기초', condition: '밑줄 약간', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: '010-4444-5555', major: '영어영문학과' },
  { id: 322, title: '한국고전소설의 이해', condition: '사용감 있음', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_11', major: '국어국문학과' },
  { id: 323, title: '인간관계 심리학', condition: '필기 많음', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'psy_relation@daum.net', major: '교육심리학과' },
  { id: 324, title: '소비자행동론 (제6판)', condition: '새것', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_12', major: '인문사회대학' },
  { id: 325, title: '문화인류학개론', condition: '거의 새것', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: '010-8888-7777', major: '인문사회대학' },
  { id: 326, title: '기초 계량경제학', condition: '밑줄 약간', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_13', major: '경제학과' },
  { id: 327, title: '정보검색론과 실제', condition: '사용감 있음', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'infosearch@naver.com', major: '문헌정보학과' },
  { id: 328, title: '아동상담의 이론과 실제', condition: '필기 많음', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_14', major: '아동학과' },
  { id: 329, title: '특수교육학개론', condition: '새것', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: '010-1234-9876', major: '인문사회대학' },
  { id: 330, title: '서양문학의 흐름', condition: '거의 새것', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_15', major: '인문사회대학' },
  { id: 331, title: '동양사개론', condition: '밑줄 약간', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'east_history@swu.ac.kr', major: '사학과' },
  { id: 332, title: '비교문학론', condition: '사용감 있음', type: 'major', buildingId: 'human', buildingName: '인문사회관', contact: 'https://open.kakao.com/o/swuhuman_16', major: '인문사회대학' },

  // === 조형예술관 (art - 미술, 공예_컬렉터블디자인, 시각디자인 등) - 16건 ===
  { id: 401, title: '서양미술사 (곰브리치)', condition: '거의 새것', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: 'https://open.kakao.com/o/swuart_1', major: '현대미술전공' },
  { id: 402, title: '디자인학개론 (안그라픽스)', condition: '새것', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: 'design_art@swu.ac.kr', major: '시각디자인전공' },
  { id: 403, title: '색채학 (이론과 실제)', condition: '밑줄 약간', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: 'https://open.kakao.com/o/swuart_2', major: '시각디자인전공' },
  { id: 404, title: '공예_컬렉터블디자인 기초실기', condition: '사용감 있음', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: '010-7777-6666', major: '시각디자인전공' },
  { id: 405, title: '타이포그래피 기초와 실습', condition: '필기 많음', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: 'https://open.kakao.com/o/swuart_3', major: '시각디자인전공' },
  { id: 406, title: '섬유공예론 (미진사)', condition: '거의 새것', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: 'craft_yarn@naver.com', major: '공예_컬렉터블디자인전공' },
  { id: 407, title: '현대미술론 (세움)', condition: '밑줄 약간', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: 'https://open.kakao.com/o/swuart_4', major: '현대미술전공' },
  { id: 408, title: '입체조형의 기초이해', condition: '사용감 있음', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: '010-8888-5555', major: '아트앤디자인스쿨' },
  { id: 409, title: '발상과 표현기법', condition: '새것', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: 'https://open.kakao.com/o/swuart_5', major: '아트앤디자인스쿨' },
  { id: 410, title: '동양미술사 개론', condition: '필기 많음', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: 'oriental_art@daum.net', major: '현대미술전공' },
  { id: 411, title: '금속공예기법과 재료', condition: '새것', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: 'https://open.kakao.com/o/swuart_6', major: '공예_컬렉터블디자인전공' },
  { id: 412, title: '편집디자인 레이아웃', condition: '밑줄 약간', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: '010-3333-2222', major: '시각디자인전공' },
  { id: 413, title: '조소 실기 입문', condition: '사용감 있음', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: 'https://open.kakao.com/o/swuart_7', major: '현대미술전공' },
  { id: 414, title: '한국 미술의 미', condition: '거의 새것', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: 'korean_beauty@swu.ac.kr', major: '아트앤디자인스쿨' },
  { id: 415, title: '그래픽스 일러스트 입문', condition: '새것', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: 'https://open.kakao.com/o/swuart_8', major: '시각디자인전공' },
  { id: 416, title: '판화 기법과 실습', condition: '밑줄 약간', type: 'major', buildingId: 'art', buildingName: '조형예술관', contact: '010-9090-8080', major: '공예_컬렉터블디자인전공' },

  // === 50주년기념관 (50th - 2026학년도 신규 교양필수, 언론영상, 행정, 복지 등) - 27건 ===
  { id: 501, title: '바롬인성교육 I (서울여대 공식교재)', condition: '새것', type: 'gened', buildingId: '50th', buildingName: '50주년기념관', contact: 'https://open.kakao.com/o/swu50th_1', major: '공통교양필수' },
  { id: 502, title: '바롬인성교육 II (정식개정판)', condition: '거의 새것', type: 'gened', buildingId: '50th', buildingName: '50주년기념관', contact: 'barom_class@swu.ac.kr', major: '공통교양필수' },
  { id: 503, title: '대학영어(듣기말하기) (2026 신판)', condition: '밑줄 약간', type: 'gened', buildingId: '50th', buildingName: '50주년기념관', contact: 'https://open.kakao.com/o/swu50th_2', major: '공통교양필수' },
  { id: 504, title: 'AI와 창의적 문제해결 (2026교양필수)', condition: '사용감 있음', type: 'gened', buildingId: '50th', buildingName: '50주년기념관', contact: '010-2345-6789', major: '일반교양' },
  { id: 505, title: 'AI윤리: 인간과 AI의 공존', condition: '새것', type: 'gened', buildingId: '50th', buildingName: '50주년기념관', contact: 'https://open.kakao.com/o/swu50th_3', major: '일반교양' },
  { id: 506, title: '자유전공세미나 I (입문교재)', condition: '거의 새것', type: 'gened', buildingId: '50th', buildingName: '50주년기념관', contact: 'philosophy_swu@naver.com', major: '공통교양필수' },
  { id: 507, title: '자유전공세미나 II (다학제 탐구)', condition: '새것', type: 'gened', buildingId: '50th', buildingName: '50주년기념관', contact: 'https://open.kakao.com/o/swu50th_4', major: '공통교양필수' },
  { id: 508, title: '기독교개론 (2026 학사지정판)', condition: '사용감 있음', type: 'gened', buildingId: '50th', buildingName: '50주년기념관', contact: '010-3456-7890', major: '공통교양필수' },
  { id: 509, title: '사회복지개론 (나남)', condition: '새것', type: 'major', buildingId: '50th', buildingName: '50주년기념관', contact: 'welfare_swu@swu.ac.kr', major: '사회복지학과' },
  { id: 510, title: '뉴미디어와 미디어 기술', condition: '필기 많음', type: 'major', buildingId: '50th', buildingName: '50주년기념관', contact: 'https://open.kakao.com/o/swu50th_5', major: '언론영상학부' },
  { id: 511, title: '행정법총론 기초', condition: '새것', type: 'major', buildingId: '50th', buildingName: '50주년기념관', contact: '010-9988-7766', major: '행정학과' },
  { id: 512, title: '아동복지론 핵심', condition: '밑줄 약간', type: 'major', buildingId: '50th', buildingName: '50주년기념관', contact: 'https://open.kakao.com/o/swu50th_6', major: '사회복지학과' },
  { id: 513, title: '바롬인성교육 III (종합)', condition: '사용감 있음', type: 'gened', buildingId: '50th', buildingName: '50주년기념관', contact: 'barom3_swu@daum.net', major: '공통교양필수' },
  { id: 514, title: '기초 영상제작 및 촬영실습', condition: '새것', type: 'major', buildingId: '50th', buildingName: '50주년기념관', contact: 'https://open.kakao.com/o/swu50th_7', major: '언론영상학부' },
  { id: 515, title: '정책학 원론 (제3판)', condition: '거의 새것', type: 'major', buildingId: '50th', buildingName: '50주년기념관', contact: '010-7766-5544', major: '행정학과' },
  { id: 516, title: '사회복지실천론 이론', condition: '밑줄 약간', type: 'major', buildingId: '50th', buildingName: '50주년기념관', contact: 'https://open.kakao.com/o/swu50th_8', major: '사회복지학과' },
  { id: 517, title: '광고홍보학 원론', condition: '사용감 있음', type: 'major', buildingId: '50th', buildingName: '50주년기념관', contact: 'ad_swu@naver.com', major: '언론영상학부' },
  { id: 518, title: '생활 속의 법률과 권리', condition: '필기 많음', type: 'gened', buildingId: '50th', buildingName: '50주년기념관', contact: 'https://open.kakao.com/o/swu50th_9', major: '일반교양' },
  { id: 519, title: '예술철학의 역사', condition: '새것', type: 'gened', buildingId: '50th', buildingName: '50주년기념관', contact: 'art_philosophy@swu.ac.kr', major: '일반교양' },
  { id: 520, title: '현대사회와 젠더이슈', condition: '거의 새것', type: 'gened', buildingId: '50th', buildingName: '50주년기념관', contact: 'https://open.kakao.com/o/swu50th_10', major: '일반교양' },
  { id: 521, title: '지구환경의 사회학', condition: '밑줄 약간', type: 'gened', buildingId: '50th', buildingName: '50주년기념관', contact: '010-3333-5555', major: '일반교양' },
  { id: 522, title: '기사 작성과 편집기법', condition: '사용감 있음', type: 'major', buildingId: '50th', buildingName: '50주년기념관', contact: 'https://open.kakao.com/o/swu50th_11', major: '일반교양' },
  { id: 523, title: '재무행정론 개요', condition: '필기 많음', type: 'major', buildingId: '50th', buildingName: '50주년기념관', contact: 'admin_money@naver.com', major: '행정학과' },
  { id: 524, title: '노인복지론과 요양', condition: '새것', type: 'major', buildingId: '50th', buildingName: '50주년기념관', contact: 'https://open.kakao.com/o/swu50th_12', major: '사회복지학과' },
  { id: 525, title: '미디어 테크놀로지 이해', condition: '거의 새것', type: 'major', buildingId: '50th', buildingName: '50주년기념관', contact: '010-4455-6677', major: '언론영상학부' },
  { id: 526, title: '지방자치행정론', condition: '밑줄 약간', type: 'major', buildingId: '50th', buildingName: '50주년기념관', contact: 'https://open.kakao.com/o/swu50th_13', major: '행정학과' },
  { id: 527, title: '장애인 복지 정책론', condition: '사용감 있음', type: 'major', buildingId: '50th', buildingName: '50주년기념관', contact: 'disabled_welfare@swu.ac.kr', major: '행정학과' },

  // === 학생누리관 (nuri - 동아리, 취업지원, 생활교양 등) - 12건 ===
  { id: 601, title: '해커스 토익 보카 (노랭이)', condition: '거의 새것', type: 'gened', buildingId: 'nuri', buildingName: '학생누리관', contact: 'https://open.kakao.com/o/swunuri_1', major: '일반교양' },
  { id: 602, title: '커리어개발과 창업 전략', condition: '새것', type: 'gened', buildingId: 'nuri', buildingName: '학생누리관', contact: 'career_swu@swu.ac.kr', major: '취업창업교양' },
  { id: 603, title: '실용 글쓰기 검정대비', condition: '밑줄 약간', type: 'gened', buildingId: 'nuri', buildingName: '학생누리관', contact: 'https://open.kakao.com/o/swunuri_2', major: '일반교양' },
  { id: 604, title: '세계 역사와 다문화 이해', condition: '사용감 있음', type: 'gened', buildingId: 'nuri', buildingName: '학생누리관', contact: '010-4433-2211', major: '일반교양' },
  { id: 605, title: '생활 속의 실용 경제학', condition: '필기 많음', type: 'gened', buildingId: 'nuri', buildingName: '학생누리관', contact: 'https://open.kakao.com/o/swunuri_3', major: '일반교양' },
  { id: 606, title: '피트니스 및 웨이트 기초', condition: '거의 새것', type: 'gened', buildingId: 'nuri', buildingName: '학생누리관', contact: 'sports_helper@naver.com', major: '생활교양' },
  { id: 607, title: '대학 기초 기초수학', condition: '밑줄 약간', type: 'gened', buildingId: 'forest', buildingName: '삼각숲', contact: 'https://open.kakao.com/o/swunuri_4', major: '일반교양' },
  { id: 608, title: '컴퓨터 실용 활용과 엑셀', condition: '사용감 있음', type: 'gened', buildingId: 'forest', buildingName: '삼각숲', contact: '010-5566-7788', major: '일반교양' },
  { id: 609, title: '스피치와 현대적 토론기법', condition: '새것', type: 'gened', buildingId: 'forest', buildingName: '삼각숲', contact: 'https://open.kakao.com/o/swunuri_5', major: '생활교양' },
  { id: 610, title: '현대인과 올바른 직업관', condition: '필기 많음', type: 'gened', buildingId: 'nuri', buildingName: '학생누리관', contact: 'nuri_job@daum.net', major: '취업창업교양' },
  { id: 611, title: 'NCS 직무적성검사 실전문제', condition: '새것', type: 'gened', buildingId: 'nuri', buildingName: '학생누리관', contact: 'https://open.kakao.com/o/swunuri_6', major: '생활교양' },
  { id: 612, title: '동아리 리더십과 커뮤니티', condition: '밑줄 약간', type: 'gened', buildingId: 'nuri', buildingName: '학생누리관', contact: '010-8080-9090', major: '생활교양' }
];

const INITIAL_GUESTBOOK = [
  { id: 1, text: "인문관에서 전공 서적 무료로 나눠주신 선배님 덕분에 A+ 받았습니다! 정말 감사해요! 🌸", sender: "익명의 슈니" },
  { id: 2, text: "샬롬하우스 기숙사 앞에서 기분 좋게 에코백 나눔 교환 완료했어요. 따뜻한 거래 감사합니다! 🍀", sender: "도서관 요정" },
  { id: 3, text: "제2과학관 컴퓨터공학 교재 구하고 있었는데, 깨끗한 전공서적 주셔서 한 학기 든든해요! 💻", sender: "새내기 슈니" },
  { id: 4, text: "삼각숲 빨간 돗자리 앞에서 선배님이 맛있는 젤리도 같이 주셨어요! 풀림 최고! 🥰", sender: "초코슈니" },
  { id: 5, text: "책장에서 잠자고 있던 전공책이 다른 학우에게 피어난 걸 보니 너무 뿌듯해요. 🌸", sender: "기부 천사" },
  { id: 6, text: "언론영상 교재를 50주년기념관 로비에서 교환했는데 정말 친절하셨어요! 선한 온기 100도씨! 🔥", sender: "행복한 슈니" },
  { id: 7, text: "바롬 교육 교재 안 사도 되어서 돈 굳었어요! 나눔해주신 선배님 복 받으세요! 🎓", sender: "바롬이" },
  { id: 8, text: "조형예술관 미술서적 나눔해주셔서 감사합니다! 소중하게 읽을게요. 🎨", sender: "아트슈니" }
];

function App() {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [guestbook, setGuestbook] = useState(INITIAL_GUESTBOOK);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isGardenLogOpen, setIsGardenLogOpen] = useState(false);
  const [isGuestbookWriterOpen, setIsGuestbookWriterOpen] = useState(false);
  const [writerSender, setWriterSender] = useState('');
  const [writerText, setWriterText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [bloomingBuilding, setBloomingBuilding] = useState(null); // 방금 개화한 건물 ID 저장
  const [showCelebration, setShowCelebration] = useState(false); // 전체화면 축하 팝업 표시 여부

  const handleGuestbookSubmit = (e) => {
    e.preventDefault();
    if (!writerSender.trim() || !writerText.trim()) return;
    const newNote = {
      id: Date.now(),
      sender: writerSender.trim(),
      text: writerText.trim()
    };
    setGuestbook([newNote, ...guestbook]);
    setWriterSender('');
    setWriterText('');
    setIsGuestbookWriterOpen(false);
  };

  const handleAddPost = (newPost) => {
    // 생성된 base64 이미지데이터를 포함하여 posts 목록 업데이트
    setPosts([...posts, { ...newPost, id: Date.now() }]);
    setIsCreateModalOpen(false);

    // 1. 즉시 지도 위 해당 건물 포커스 및 2.2x 개화 애니메이션 시작
    setBloomingBuilding(newPost.buildingId);
    
    // 2. 1.2초 후 (사용자가 지도의 개화 반응을 충분히 감상한 뒤) 전체화면 축하 카드 노출
    setTimeout(() => {
      setShowCelebration(true);
    }, 1200);

    // 3. 총 4.2초 후 모든 개화/축하 상태 초기화
    setTimeout(() => {
      setBloomingBuilding(null);
      setShowCelebration(false);
    }, 4200);
  };

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
    { id: 'forest', name: '삼각숲' },
    { id: 'gym', name: '체육관' },
    { id: 'gate_main', name: '정문' },
    { id: 'gate_back', name: '후문' },
  ];

  // 검색 결과에 따른 하이라이트할 건물 ID 목록 추출
  const highlightedBuildings = searchQuery
    ? Array.from(
        new Set(
          posts
            .filter(post => 
              post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
              (post.major && post.major.toLowerCase().includes(searchQuery.toLowerCase()))
            )
            .map(post => post.buildingId)
        )
      )
    : [];

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        {/* 플로팅 검색 바 */}
        <div className="search-overlay">
          <div className="search-bar">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input 
              type="text" 
              placeholder="나눔받고 싶은 책 이름이나 학과(전공)를 검색해 보세요!" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')} title="검색 비우기">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <CampusMap 
          posts={posts} 
          highlightedBuildings={highlightedBuildings} 
          bloomingBuildingId={bloomingBuilding}
          onOpenGardenLog={() => setIsGardenLogOpen(true)}
        />

        {/* 온기 한마디 감사 방명록 플로팅 배너 */}
        <div className="guestbook-floating-banner">
          <div className="guestbook-title-badge">
            <span className="heart-pulse">❤️</span> 슈니들의 온기 한마디
          </div>
          <div className="guestbook-marquee-track">
            <div className="guestbook-marquee-content">
              {guestbook.concat(guestbook).map((note, idx) => (
                <span key={`${note.id}-${idx}`} className="guestbook-note-item">
                  <strong>{note.sender}</strong>: {note.text}
                </span>
              ))}
            </div>
          </div>
          <button className="guestbook-write-btn" onClick={() => setIsGuestbookWriterOpen(true)}>
            온기 쓰기 ✍️
          </button>
        </div>
      </main>
      
      <FloatingButton onClick={() => setIsCreateModalOpen(true)} />
      
      {isCreateModalOpen && (
        <CreatePostModal 
          onClose={() => setIsCreateModalOpen(false)} 
          onSubmit={handleAddPost} 
          posts={posts}
        />
      )}

      {/* 개화 도감 & 마이 가든 모달 */}
      {isGardenLogOpen && (
        <GardenLogModal 
          posts={posts} 
          onClose={() => setIsGardenLogOpen(false)} 
        />
      )}

      {/* 온기 감사 한마디 작성 모달 */}
      {isGuestbookWriterOpen && (
        <div className="guestbook-writer-overlay" onClick={() => setIsGuestbookWriterOpen(false)}>
          <div className="guestbook-writer-card animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="writer-header">
              <h3>✍️ 나눔 감사 온기 전하기</h3>
              <button className="close-btn" onClick={() => setIsGuestbookWriterOpen(false)} title="닫기">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleGuestbookSubmit} className="writer-form">
              <div className="input-group">
                <label>보내는 이 (닉네임)</label>
                <input 
                  type="text" 
                  placeholder="예: 22학번 슈니, 도서관 요정" 
                  value={writerSender}
                  onChange={e => setWriterSender(e.target.value)}
                  maxLength={15}
                  required
                />
              </div>
              <div className="input-group">
                <label>감사 메시지</label>
                <textarea 
                  placeholder="책을 나누어준 학우에게 감사한 마음을 듬뿍 전해보세요! (최대 100자)" 
                  value={writerText}
                  onChange={e => setWriterText(e.target.value)}
                  maxLength={100}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">
                온기 한마디 등록하기 🌸
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 꽃 피우기 축하 모션 전체화면 오버레이 */}
      {showCelebration && (
        <div className="bloom-celebration-overlay" onClick={() => { setShowCelebration(false); setBloomingBuilding(null); }}>
          <div className="celebration-card" onClick={e => e.stopPropagation()}>
            {/* 극적인 회전하는 꽃 그래픽 배치 */}
            <div className="celebration-flower-sparkle animate-bloom-spin">
              <svg width="90" height="90" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
                <circle cx="50" cy="50" r="40" fill="url(#celebrate-grad)" />
                <defs>
                  <radialGradient id="celebrate-grad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fff" />
                    <stop offset="40%" stopColor="#ffd1ff" />
                    <stop offset="100%" stopColor="#ff79a8" />
                  </radialGradient>
                </defs>
                {/* 5개 꽃잎 레이어 */}
                {[...Array(5)].map((_, idx) => (
                  <path 
                    key={idx}
                    d="M 50 50 C 30 30, 30 5, 50 10 C 70 5, 70 30, 50 50" 
                    fill="url(#celebrate-grad)" 
                    transform={`rotate(${idx * 72} 50 50)`}
                    opacity="0.9"
                    stroke="#fff"
                    strokeWidth="1.5"
                  />
                ))}
                <circle cx="50" cy="50" r="12" fill="#ffd700" filter="drop-shadow(0 0 5px rgba(255,215,0,0.8))" />
                <circle cx="50" cy="50" r="6" fill="#fff" />
              </svg>
            </div>
            <h2>선한 영향력이 피어났습니다!</h2>
            <p>
              <strong>{BUILDINGS.find(b => b.id === bloomingBuilding)?.name}</strong>에<br />
              새로운 나눔의 꽃이 활짝 개화하였습니다.
            </p>
            <div className="petals-container">
              {[...Array(16)].map((_, i) => (
                <div 
                  key={i} 
                  className="flying-petal" 
                  style={{
                    left: `${10 + (i * 5.5)}%`,
                    animationDelay: `${(i % 4) * 0.4}s`,
                    animationDuration: `${2.5 + (i % 3) * 0.5}s`
                  }} 
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
