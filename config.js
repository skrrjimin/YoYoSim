/**
 * ============================================================================
 * [포트폴리오 설정 & 콘텐츠 관리 파일] config.js
 * ============================================================================
 * HTML이나 복잡한 코드를 몰라도, 이 파일의 텍스트와 이미지 주소만 수정하면
 * 웹사이트의 이름, 프로필, 경력, SNS, 작품(포스트)이 모두 자동으로 바뀝니다!
 * 
 * 💡 팁:
 * - 텍스트는 따옴표 " " 또는 ' ' 사이에 적어주세요.
 * - 줄바꿈은 \n 을 적어주시면 줄이 바뀝니다.
 * - 내 컴퓨터의 사진을 쓸 때는:
 *   프로젝트 폴더 안의 images/ 폴더에 사진을 넣고 "images/내사진.jpg" 처럼 적으세요.
 * ============================================================================
 */

const SITE_CONFIG = {
  // --------------------------------------------------------------------------
  // 1. 사이트 기본 정보 & 헤더
  // --------------------------------------------------------------------------
  brand: {
    // 브라우저 탭에 뜨는 제목
    browserTitle: "Jimin | Visual Artist & Storyteller",
    
    // 사이트 좌측 상단 로고 이름 (예: 본인 닉네임, 스튜디오명)
    siteName: "Jimin",
    
    // 로고 아래 서브 텍스트 (직무나 역할)
    siteRole: "VISUAL ARTIST",
    
    // 사이트 검색 엔진(SEO) 설명 문구
    metaDescription: "화이트 미니멀 비주얼 아트 & 웹툰 포트폴리오. 콘셉트 아트, 일러스트레이션, 오리지널 캐릭터 기획.",
  },

  // --------------------------------------------------------------------------
  // 2. 카테고리 메뉴 목록
  //    (필요 시 순서를 바꾸거나 추가/수정할 수 있습니다. key는 영어 소문자로 작성)
  // --------------------------------------------------------------------------
  categories: [
    { key: "all", label: "ALL" },
    { key: "webtoon", label: "WEBTOON" },
    { key: "illustration", label: "ILLUSTRATION" },
    { key: "works", label: "WORKS" },
    { key: "oc", label: "OC" },
  ],

  // --------------------------------------------------------------------------
  // 3. ABOUT 페이지 (프로필, 경력, 스킬, 연락처)
  // --------------------------------------------------------------------------
  about: {
    // 상단 작은 태그
    statementTag: "[ ARTIST STATEMENT ]",

    // 아티스트 대표 슬로건 (헤드라인)
    headline: "CAPTURING RAW EMOTION\nTHROUGH CINEMATIC BRUSHES & FRAMES.",

    // 아티스트 소개글 본문
    bio: "웹툰 연출과 시네마틱 컨셉 아트를 기반으로 강렬한 명암비와 감각적인 색채를 탐구합니다. 스토리의 본질을 관통하는 한 컷의 시각적 긴장감을 추구하며, 디지털 회화와 3D 배경 기법을 결합하여 밀도 높은 비주얼 서사를 만듭니다.",

    // 프로필 사진 (웹 링크 URL 또는 "images/my-profile.jpg" 로컬 경로)
    profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    profileCaption: "Jimin — SEOUL, KOREA",

    // 경력 및 클라이언트 이력 (원하는 만큼 추가/삭제 가능)
    experiences: [
      {
        year: "2026 — PRESENT",
        role: "Lead Webtoon Art Director & Concept Artist",
        client: "Studio Neon Horizon / 네이버웹툰 오리지널 기획 연재 준비 중",
      },
      {
        year: "2022 — 2024",
        role: "Senior Concept Artist & Color Script Director",
        client: "Freelance / 글로벌 게임 시네마틱 트레일러 키아트 작업",
      },
      {
        year: "2020 — 2022",
        role: "Webtoon Visual Concept & Background Illustrator",
        client: "카카오페이지 및 외주 출판 프로젝트 작화/채색 총괄",
      },
      {
        year: "2019",
        role: "Selected Exhibition Artist",
        client: "Seoul Digital Art Fair 'Cinematic Perspectives' 단체전",
      },
    ],

    // 스킬 및 파이프라인
    skills: [
      {
        category: "Artwork & Concept",
        desc: "Cinematic Keyframe, Character Design, Webtoon,Storyboarding",
      },
      {
        category: "Software & Tools",
        desc: "Clip Studio Paint EX, Adobe Photoshop, Blender 3D, Substance 3D, Procreate, PureRef",
      },
      {
        category: "Languages",
        desc: "Korean (Native), English (Professional Working), Japanese (Basic Conversational)",
      },
    ],

    // 연락처 및 소셜 미디어 링크
    contact: {
      subText: "외주 프로젝트, 웹툰 기획 연재 협업, 아트 디렉팅 문의는 아래 이메일로 편하게 연락 주시기 바랍니다.",
      email: "contact@studiomiel.art",
      socials: [
        { label: "INSTAGRAM ↗", url: "https://instagram.com" },
        { label: "ARTSTATION ↗", url: "https://artstation.com" },
        { label: "X (TWITTER) ↗", url: "https://x.com" },
        { label: "GITHUB ↗", url: "https://github.com" },
      ],
    },
  },

  // --------------------------------------------------------------------------
  // 4. 푸터 설정
  // --------------------------------------------------------------------------
  footer: {
    year: 2025,
    copyrightText: "Jimin. ALL RIGHTS RESERVED.",
    note: "DESIGN INSPIRED BY ALBERTO MIELGO. BUILT FOR GITHUB PAGES.",
  },

  // --------------------------------------------------------------------------
  // 5. 작품(포스트) 목록 (PROJECTS)
  //    - 새로운 작품을 올릴 때는 이 배열에 { ... } 블록을 복사해서 추가하면 됩니다!
  // --------------------------------------------------------------------------
  projects: [
    {
      id: "neon-blade",                           // 고유 ID (영어, 숫자, 하이픈)
      title: "NEON BLADE : CHRONICLES",           // 작품 제목
      category: "webtoon",                       // 위 categories의 key 중 하나 ('webtoon', 'illustration', 'works', 'oc')
      categoryLabel: "WEBTOON / SERIALIZATION",  // 화면에 예쁘게 보일 카테고리 이름
      year: "2024",                              // 제작 연도
      featuredWide: true,                        // 메인 갤러리에서 2칸을 차지하는 와이드 강조 카드 여부 (true 또는 false)
      thumbnail: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1600&q=80", // 갤러리 목록 썸네일
      role: "Original Creator, Storyboard, All Artwork & Color (100%)", // 나의 기여도/역할
      tools: "Clip Studio Paint EX, Adobe Photoshop, Blender 3D",       // 작업 도구
      client: "Original IP / Webtoon Pitching Project",                 // 클라이언트 / 프로젝트 성격
      synopsis: "2088년 네오 서울, 거대 테크 기업의 인공기억 통제망에서 탈출한 사이버 로닌들의 생존 서사.\n초광각 카메라 앵글과 과감한 명암 대비, 거친 브러시 텍스처를 활용하여 알베르토 미엘고 특유의 시네마틱하고 역동적인 액션 컷을 구현한 오리지널 웹툰 기획작입니다.",
      images: [ // 클릭 시 상세 팝업에서 세로로 길게 보여줄 고화질 컷들
        {
          url: "https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1800&q=85",
          caption: "01. KEYFRAME PROMO ART — NEON ALLEY ENCOUNTER"
        },
        {
          url: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1800&q=85",
          caption: "02. CHAPTER 01 HIGHLIGHT SCENE — HIGH SPEED CHASE"
        },
        {
          url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1800&q=85",
          caption: "03. MOOD & COLOR SCRIPTING — CYAN & MAGENTA CONFLICT"
        },
        {
          url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=85",
          caption: "04. 3D BLENDER PRE-VIS & ROUGH STORYBOARD INTEGRATION"
        }
      ]
    },
    {
      id: "obsidian-echoes",
      title: "OBSIDIAN ECHOES",
      category: "illustration",
      categoryLabel: "ILLUSTRATION / CONCEPT ART",
      year: "2024",
      featuredWide: false,
      thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1000&q=80",
      role: "Visual Concept & Environment Painting (100%)",
      tools: "Photoshop, PureRef",
      client: "Personal Editorial Art",
      synopsis: "초현실주의적 미니멀리즘과 칠흑 같은 심해의 어둠을 테마로 한 디지털 일러스트레이션 시리즈.\n빛의 반사와 질감 표현에 집중하여 고요함 속에 숨겨진 날카로운 긴장감을 연출했습니다.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1800&q=85",
          caption: "01. MAIN VISUAL — GEOMETRIC SOLITUDE"
        },
        {
          url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1800&q=85",
          caption: "02. DETAIL CROP & BRUSH STROKE STUDY"
        }
      ]
    },
    {
      id: "project-vortex",
      title: "PROJECT VORTEX : TRAILER KEYART",
      category: "works",
      categoryLabel: "WORKS / COMMERCIAL",
      year: "2023",
      featuredWide: false,
      thumbnail: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1000&q=80",
      role: "Senior Concept Artist, Keyframe Colorist",
      tools: "Photoshop, Blender, Octane Render",
      client: "Global Game Studio / Cinematic Teaser",
      synopsis: "글로벌 AAA급 SF 타이틀 트레일러의 메인 키아트 및 컬러 스크립트 외주 작업.\n초음속 전투기의 격돌 순간과 대기권 돌입의 플라즈마 화염을 사실적이면서도 스타일리시하게 재해석했습니다.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&w=1800&q=85",
          caption: "01. OFFICIAL TEASER KEYFRAME ARTWORK"
        },
        {
          url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1800&q=85",
          caption: "02. THUMBNAIL EXPLORATION & COMPOSITION DRAFT"
        },
        {
          url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1800&q=85",
          caption: "03. ENVIRONMENT LIGHTING PASSES"
        }
      ]
    },
    {
      id: "oc-valkyrie",
      title: "VALKYRIE-09 : PILOT RIG",
      category: "oc",
      categoryLabel: "ORIGINAL CHARACTER / DESIGN",
      year: "2024",
      featuredWide: false,
      thumbnail: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1000&q=80",
      role: "Character Design, Fashion Concept, Lore Setting (100%)",
      tools: "Clip Studio Paint EX, iPad Procreate",
      client: "Original Character IP Project",
      synopsis: "미래형 기동 슈트를 착용하는 파일럿 '카이'의 오리지널 캐릭터 시트.\n테크웨어와 전통적인 바이커 자켓의 실루엣을 접목하여 실용적이면서도 독창적인 하이엔드 스트리트 룩을 정립했습니다.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1800&q=85",
          caption: "01. FULL BODY COSTUME RENDER & SILHOUETTE"
        },
        {
          url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1800&q=85",
          caption: "02. FACIAL EXPRESSION & HELMET INTERFACE DETAIL"
        }
      ]
    },
    {
      id: "shadow-apartment",
      title: "THE SHADOW APARTMENT",
      category: "webtoon",
      categoryLabel: "WEBTOON / SUSPENSE THRILLER",
      year: "2023",
      featuredWide: true,
      thumbnail: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1600&q=80",
      role: "Art Direction, Background Layout, Inking",
      tools: "Clip Studio Paint, SketchUp 3D, Photoshop",
      client: "Short Story Anthology Webtoon",
      synopsis: "재건축을 앞둔 낡은 복도식 아파트에서 벌어지는 기괴한 심리 서스펜스.\n밀폐된 공간이 주는 압박감과 형광등 불빛의 불규칙한 깜빡임을 노이즈 텍스처와 거친 펜선으로 시각화했습니다.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=1800&q=85",
          caption: "01. EPISODE COVER — CORRIDOR NOIR"
        },
        {
          url: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1800&q=85",
          caption: "02. DRAMATIC VERTICAL SCROLL SEQUENCE SAMPLE"
        },
        {
          url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=85",
          caption: "03. SHADOW PERSPECTIVE & SPATIAL SKETCHES"
        }
      ]
    },
    {
      id: "scarlet-monolith",
      title: "SCARLET MONOLITH",
      category: "illustration",
      categoryLabel: "ILLUSTRATION / DIGITAL PAINTING",
      year: "2023",
      featuredWide: false,
      thumbnail: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1000&q=80",
      role: "Illustration (100%)",
      tools: "Photoshop, Wacom Cintiq Pro",
      client: "Exhibition Feature Artwork",
      synopsis: "강렬한 진홍색 캔버스 위에 거대한 기하학적 형태와 인간의 미약한 실루엣을 대조시킨 작품.\n알베르토 미엘고의 유화적 블렌딩과 디지털 브러시 기법을 연구하며 제작한 순수 비주얼 아트워크입니다.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1800&q=85",
          caption: "01. FULL ARTWORK — SCARLET CONTRAST"
        },
        {
          url: "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1800&q=85",
          caption: "02. TEXTURE ZOOM & OIL BRUSH IMPASTO TEST"
        }
      ]
    },
    {
      id: "oc-renegade",
      title: "RENEGADE MONK : BEOM",
      category: "oc",
      categoryLabel: "ORIGINAL CHARACTER / FANTASY",
      year: "2024",
      featuredWide: false,
      thumbnail: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1000&q=80",
      role: "Character Design, Worldbuilding (100%)",
      tools: "Clip Studio Paint EX",
      client: "Original IP / Graphic Novel Prototype",
      synopsis: "조선 시대 요괴 사냥꾼 퇴마승 '범(BEOM)'의 캐릭터 원화.\n전통 한복의 묵직한 천 질감과 현대적 오버사이즈 실루엣을 조합하여 거칠고 묵직한 카리스마를 연출했습니다.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1800&q=85",
          caption: "01. CHARACTER FULL SHEET & WEAPON TURNAROUND"
        },
        {
          url: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1800&q=85",
          caption: "02. ACTION STANCE & TALISMAN EFFECTS"
        }
      ]
    },
    {
      id: "works-sound-visual",
      title: "NEURA ALBUM PACKAGING",
      category: "works",
      categoryLabel: "WORKS / ART DIRECTION",
      year: "2023",
      featuredWide: false,
      thumbnail: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1000&q=80",
      role: "Art Direction, Cover Artwork, Typography Layout",
      tools: "Photoshop, Illustrator, Blender",
      client: "Electronic Music Label / Vinyl & Digital EP",
      synopsis: "신스웨이브/일렉트로닉 아티스트의 EP 앨범 커버 및 바이닐 아트 디렉팅.\n차가운 크롬 텍스처와 디지털 노이즈를 입혀 음악의 사운드 질감을 시각적으로 극대화했습니다.",
      images: [
        {
          url: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1800&q=85",
          caption: "01. ALBUM FRONT COVER — CHROME REFLECTION"
        },
        {
          url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1800&q=85",
          caption: "02. VINYL PACKAGE MOCKUP & POSTER INSERT"
        }
      ]
    }
  ]
};
