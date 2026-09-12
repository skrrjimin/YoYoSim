/**
 * STUDIO MIEL | Alberto Mielgo Style Minimalist Dark Portfolio
 * GitHub Pages Ready - Pure Vanilla JavaScript
 * Dynamic Configuration Engine powered by config.js
 */

// ==========================================================================
// 1. DOM 요소 셀렉터
// ==========================================================================
// 메타 & 브랜딩
const pageTitle = document.getElementById("page-title");
const metaDesc = document.getElementById("meta-desc");
const ogTitle = document.getElementById("og-title");
const ogDesc = document.getElementById("og-desc");
const logoName = document.getElementById("logo-name");
const logoRole = document.getElementById("logo-role");
const brandLogo = document.getElementById("brand-logo");

// 네비게이션 & 햄버거
const navList = document.getElementById("nav-list");
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

// 메인 섹션
const gallerySection = document.getElementById("gallery-section");
const galleryGrid = document.getElementById("gallery-grid");
const emptyState = document.getElementById("empty-state");
const aboutSection = document.getElementById("about-section");

// ABOUT 섹션 요소
const aboutStatementTag = document.getElementById("about-statement-tag");
const aboutHeadline = document.getElementById("about-headline");
const aboutBio = document.getElementById("about-bio");
const aboutExperienceList = document.getElementById("about-experience-list");
const aboutSkillsWrap = document.getElementById("about-skills-wrap");
const aboutProfileImg = document.getElementById("about-profile-img");
const aboutProfileCaption = document.getElementById("about-profile-caption");
const aboutContactSub = document.getElementById("about-contact-sub");
const aboutContactEmail = document.getElementById("about-contact-email");
const contactEmailText = document.getElementById("contact-email-text");
const aboutSocialLinks = document.getElementById("about-social-links");

// 푸터
const currentYearEl = document.getElementById("current-year");
const footerCopyText = document.getElementById("footer-copy-text");
const footerNoteText = document.getElementById("footer-note-text");

// 작품 상세 모달 요소
const projectModal = document.getElementById("project-modal");
const modalBackdrop = document.getElementById("modal-backdrop");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalBody = document.getElementById("modal-body");

const modalHeaderCategory = document.getElementById("modal-header-category");
const modalHeaderTitle = document.getElementById("modal-header-title");
const modalDetailTitle = document.getElementById("modal-detail-title");
const modalDetailYear = document.getElementById("modal-detail-year");
const modalSpecCategory = document.getElementById("modal-spec-category");
const modalSpecRole = document.getElementById("modal-spec-role");
const modalSpecTools = document.getElementById("modal-spec-tools");
const modalSpecClient = document.getElementById("modal-spec-client");
const modalSynopsisText = document.getElementById("modal-synopsis-text");
const modalImagesStream = document.getElementById("modal-images-stream");

const modalPrevBtn = document.getElementById("modal-prev-btn");
const modalNextBtn = document.getElementById("modal-next-btn");
const pagPrevTitle = document.getElementById("pag-prev-title");
const pagNextTitle = document.getElementById("pag-next-title");


// ==========================================================================
// 2. 상태 관리 변수
// ==========================================================================
let currentCategory = "all";
let currentModalProjectIndex = -1;
let projectsData = [];


// ==========================================================================
// 3. config.js 기반 사이트 렌더링 초기화
// ==========================================================================
function renderSiteFromConfig() {
  if (typeof SITE_CONFIG === "undefined") {
    console.error("config.js 파일을 찾을 수 없습니다. 기본 설정을 확인해주세요.");
    return;
  }

  projectsData = SITE_CONFIG.projects || [];

  // 1) 브라우저 탭 타이틀 & SEO 정보
  if (SITE_CONFIG.brand) {
    if (pageTitle) pageTitle.textContent = SITE_CONFIG.brand.browserTitle || "PORTFOLIO";
    if (metaDesc) metaDesc.setAttribute("content", SITE_CONFIG.brand.metaDescription || "");
    if (ogTitle) ogTitle.setAttribute("content", SITE_CONFIG.brand.browserTitle || "");
    if (ogDesc) ogDesc.setAttribute("content", SITE_CONFIG.brand.metaDescription || "");

    // 상단 로고 & 역할
    if (logoName) logoName.textContent = SITE_CONFIG.brand.siteName || "STUDIO";
    if (logoRole) logoRole.textContent = SITE_CONFIG.brand.siteRole || "VISUAL ARTIST";
  }

  // 2) 카테고리 네비게이션 동적 렌더링
  if (navList && SITE_CONFIG.categories) {
    navList.innerHTML = "";
    SITE_CONFIG.categories.forEach((cat) => {
      const li = document.createElement("li");
      li.className = "nav-item";
      li.innerHTML = `
        <button class="nav-btn ${cat.key === 'all' ? 'active' : ''}" data-category="${cat.key}">
          ${cat.label}
        </button>
      `;
      navList.appendChild(li);
    });

    // 구분선 & ABOUT 메뉴 추가
    const sepLi = document.createElement("li");
    sepLi.className = "nav-item nav-item-separator";
    sepLi.textContent = "|";
    navList.appendChild(sepLi);

    const aboutLi = document.createElement("li");
    aboutLi.className = "nav-item";
    aboutLi.innerHTML = `
      <button class="nav-btn nav-btn-about" data-category="about">ABOUT</button>
    `;
    navList.appendChild(aboutLi);
  }

  // 3) ABOUT 섹션 렌더링
  if (SITE_CONFIG.about) {
    const ab = SITE_CONFIG.about;
    if (aboutStatementTag) aboutStatementTag.textContent = ab.statementTag || "[ ARTIST STATEMENT ]";
    if (aboutHeadline) aboutHeadline.innerHTML = (ab.headline || "").replace(/\n/g, "<br>");
    if (aboutBio) aboutBio.textContent = ab.bio || "";

    // 프로필 이미지
    if (aboutProfileImg) aboutProfileImg.src = ab.profileImage || "";
    if (aboutProfileCaption) aboutProfileCaption.textContent = ab.profileCaption || "";

    // 경력 리스트
    if (aboutExperienceList && Array.isArray(ab.experiences)) {
      aboutExperienceList.innerHTML = ab.experiences.map((exp) => `
        <li>
          <span class="exp-year">${exp.year}</span>
          <span class="exp-role">${exp.role}</span>
          <span class="exp-client">${exp.client}</span>
        </li>
      `).join("");
    }

    // 스킬 리스트
    if (aboutSkillsWrap && Array.isArray(ab.skills)) {
      aboutSkillsWrap.innerHTML = ab.skills.map((sk) => `
        <div class="skill-category">
          <span class="skill-label">${sk.category}</span>
          <p class="skill-desc">${sk.desc}</p>
        </div>
      `).join("");
    }

    // 컨택트 정보
    if (ab.contact) {
      if (aboutContactSub) aboutContactSub.textContent = ab.contact.subText || "";
      if (aboutContactEmail) {
        aboutContactEmail.href = `mailto:${ab.contact.email || ""}`;
        if (contactEmailText) contactEmailText.textContent = ab.contact.email || "";
      }

      if (aboutSocialLinks && Array.isArray(ab.contact.socials)) {
        aboutSocialLinks.innerHTML = ab.contact.socials.map((soc) => `
          <a href="${soc.url}" target="_blank" rel="noopener noreferrer" class="social-link">
            ${soc.label}
          </a>
        `).join("");
      }
    }
  }

  // 4) 푸터 정보
  if (SITE_CONFIG.footer) {
    if (currentYearEl) currentYearEl.textContent = SITE_CONFIG.footer.year || new Date().getFullYear();
    if (footerCopyText) footerCopyText.textContent = SITE_CONFIG.footer.copyrightText || "";
    if (footerNoteText) footerNoteText.textContent = SITE_CONFIG.footer.note || "";
  }
}


// ==========================================================================
// 4. 갤러리 렌더링 함수
// ==========================================================================
function renderGallery(category = "all") {
  let filtered = [];
  if (category === "all") {
    filtered = [...projectsData];
  } else {
    filtered = projectsData.filter((p) => p.category === category);
  }

  galleryGrid.innerHTML = "";

  if (filtered.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  filtered.forEach((project) => {
    const card = document.createElement("article");
    card.className = `project-card fade-in ${project.featuredWide ? "featured-wide" : ""}`;
    card.setAttribute("data-id", project.id);
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${project.title} - ${project.categoryLabel} 상세 보기`);

    card.innerHTML = `
      <div class="card-media">
        <img src="${project.thumbnail}" 
             alt="${project.title}" 
             class="card-img" 
             loading="lazy">
      </div>
      <div class="card-overlay">
        <div class="card-meta-top">
          <span class="card-cat-tag">[ ${project.category.toUpperCase()} ]</span>
          <span class="card-year">${project.year}</span>
        </div>
        <div class="card-info">
          <span class="card-category">${project.categoryLabel}</span>
          <h2 class="card-title">${project.title}</h2>
          <p class="card-desc">${project.role}</p>
        </div>
      </div>
    `;

    card.addEventListener("click", () => openModal(project.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(project.id);
      }
    });

    galleryGrid.appendChild(card);
  });
}


// ==========================================================================
// 5. 카테고리 뷰 전환 & 네비게이션 처리
// ==========================================================================
function switchCategory(category) {
  currentCategory = category;

  // 네비 버튼 활성화 토글
  const allNavButtons = document.querySelectorAll(".nav-btn");
  allNavButtons.forEach((btn) => {
    if (btn.dataset.category === category) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // 모바일 메뉴 닫기
  if (mainNav.classList.contains("open")) {
    toggleMobileMenu(false);
  }

  // ABOUT 페이지 전환
  if (category === "about") {
    gallerySection.classList.add("hidden");
    aboutSection.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, null, "#about");
    return;
  }

  // 갤러리 뷰 전환
  aboutSection.classList.add("hidden");
  gallerySection.classList.remove("hidden");
  renderGallery(category);
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (category === "all") {
    history.replaceState(null, null, " ");
  } else {
    history.replaceState(null, null, `#${category}`);
  }
}

// 모바일 메뉴 토글
function toggleMobileMenu(forceState = null) {
  const isOpen = forceState !== null ? forceState : !mainNav.classList.contains("open");
  mainNav.classList.toggle("open", isOpen);
  menuToggle.classList.toggle("active", isOpen);
  menuToggle.setAttribute("aria-expanded", isOpen);
}


// ==========================================================================
// 6. 프로젝트 상세 모달 (Alberto Mielgo Fullscreen Showcase)
// ==========================================================================
function openModal(projectId) {
  const projectIndex = projectsData.findIndex((p) => p.id === projectId);
  if (projectIndex === -1) return;

  currentModalProjectIndex = projectIndex;
  const project = projectsData[projectIndex];

  // 메타데이터 바인딩
  modalHeaderCategory.textContent = project.category.toUpperCase();
  modalHeaderTitle.textContent = project.title;

  modalDetailTitle.textContent = project.title;
  modalDetailYear.textContent = project.year;
  modalSpecCategory.textContent = project.categoryLabel;
  modalSpecRole.textContent = project.role;
  modalSpecTools.textContent = project.tools;
  modalSpecClient.textContent = project.client;
  modalSynopsisText.textContent = project.synopsis;

  // 세로 스크롤 대형 이미지 시퀀스 바인딩
  modalImagesStream.innerHTML = "";
  if (Array.isArray(project.images)) {
    project.images.forEach((imgObj, idx) => {
      const streamItem = document.createElement("div");
      streamItem.className = "stream-item";
      streamItem.innerHTML = `
        <img src="${imgObj.url}" 
             alt="${project.title} Artwork ${idx + 1}" 
             class="stream-img" 
             loading="lazy">
        ${imgObj.caption ? `<div class="stream-caption">${imgObj.caption}</div>` : ""}
      `;
      modalImagesStream.appendChild(streamItem);
    });
  }

  // 이전/다음 프로젝트 인덱스 계산
  const prevIndex = (projectIndex - 1 + projectsData.length) % projectsData.length;
  const nextIndex = (projectIndex + 1) % projectsData.length;

  pagPrevTitle.textContent = projectsData[prevIndex].title;
  pagNextTitle.textContent = projectsData[nextIndex].title;

  // 모달 열기 및 스크롤 탑
  projectModal.classList.add("active");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  modalBody.scrollTop = 0;

  history.replaceState(null, null, `#project-${project.id}`);
}

function closeModal() {
  projectModal.classList.remove("active");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");

  if (currentCategory === "about") {
    history.replaceState(null, null, "#about");
  } else if (currentCategory === "all") {
    history.replaceState(null, null, " ");
  } else {
    history.replaceState(null, null, `#${currentCategory}`);
  }
}

function navigateModal(direction) {
  if (currentModalProjectIndex === -1 || projectsData.length === 0) return;

  if (direction === "prev") {
    const newIndex = (currentModalProjectIndex - 1 + projectsData.length) % projectsData.length;
    openModal(projectsData[newIndex].id);
  } else if (direction === "next") {
    const newIndex = (currentModalProjectIndex + 1) % projectsData.length;
    openModal(projectsData[newIndex].id);
  }
}


// ==========================================================================
// 7. 이벤트 리스너 등록 & 초기화
// ==========================================================================
function initEvents() {
  // 네비게이션 버튼 동적 위임 클릭 이벤트
  navList.addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-btn");
    if (btn) {
      const category = btn.dataset.category;
      switchCategory(category);
    }
  });

  // 로고 클릭 시 홈
  brandLogo.addEventListener("click", (e) => {
    e.preventDefault();
    switchCategory("all");
  });

  // 모바일 메뉴 버튼 토글
  menuToggle.addEventListener("click", () => toggleMobileMenu());

  // 모달 닫기 및 내비게이션
  modalCloseBtn.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);
  modalPrevBtn.addEventListener("click", () => navigateModal("prev"));
  modalNextBtn.addEventListener("click", () => navigateModal("next"));

  // 키보드 단축키 지원
  window.addEventListener("keydown", (e) => {
    if (projectModal.classList.contains("active")) {
      if (e.key === "Escape") closeModal();
      else if (e.key === "ArrowLeft") navigateModal("prev");
      else if (e.key === "ArrowRight") navigateModal("next");
    }

    // 관리자 비밀 단축키: Ctrl + Shift + A 누르면 admin.html로 이동
    if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
      e.preventDefault();
      window.location.href = "admin.html";
    }
  });

  // URL 해시 라우팅 처리
  window.addEventListener("hashchange", handleInitialHash);
}

// URL 해시 파싱
function handleInitialHash() {
  const hash = window.location.hash.replace("#", "").trim();
  if (!hash) {
    switchCategory("all");
    return;
  }

  if (hash === "about") {
    switchCategory("about");
    return;
  }

  if (hash === "admin") {
    window.location.href = "admin.html";
    return;
  }

  if (hash.startsWith("project-")) {
    const projectId = hash.replace("project-", "");
    renderGallery("all");
    openModal(projectId);
    return;
  }

  const validCategories = (SITE_CONFIG.categories || []).map((c) => c.key);
  if (validCategories.includes(hash.toLowerCase())) {
    switchCategory(hash.toLowerCase());
  } else {
    switchCategory("all");
  }
}

// 앱 구동
function init() {
  renderSiteFromConfig();
  initEvents();
  handleInitialHash();
}

document.addEventListener("DOMContentLoaded", init);
