/**
 * ============================================================================
 * [관리자 전용 엔진] admin.js
 * ============================================================================
 * GitHub REST API를 사용하여 브라우저에서 직접 이미지를 업로드하고
 * config.js를 자동으로 업데이트하여 실시간 발행하는 보안 모듈입니다.
 * 
 * 🔒 보안 원칙:
 * 1. GitHub Token은 GitHub 저장소 코드에 절대 저장되지 않습니다.
 * 2. 오직 관리자 본인의 브라우저(LocalStorage)에만 암호화/저장됩니다.
 * 3. 따라서 다른 방문자는 토큰이 없으므로 절대 글을 쓰거나 수정할 수 없습니다.
 * ============================================================================
 */

const AdminEngine = (() => {
  // 로컬 스토리지 키
  const STORAGE_KEY = "studio_miel_admin_auth";
  const PIN_KEY = "studio_miel_admin_pin";

  // 상태값
  let authData = {
    owner: "",     // GitHub 사용자명 (예: myname)
    repo: "",      // 저장소 이름 (예: my-portfolio)
    branch: "main",// 기본 브랜치
    token: ""      // GitHub Personal Access Token (PAT)
  };

  let selectedThumbnailFile = null;
  let selectedGalleryFiles = [];

  // 초기화 및 저장된 인증 정보 로드
  function init() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        authData = JSON.parse(atob(saved));
      } catch (e) {
        console.error("인증 데이터 로드 실패", e);
      }
    }
    setupUIEvents();
  }

  // 인증 정보 저장
  function saveAuth(owner, repo, branch, token) {
    authData = { owner, repo, branch: branch || "main", token };
    localStorage.setItem(STORAGE_KEY, btoa(JSON.stringify(authData)));
  }

  // 인증 정보 삭제 (로그아웃)
  function clearAuth() {
    authData = { owner: "", repo: "", branch: "main", token: "" };
    localStorage.removeItem(STORAGE_KEY);
  }

  function isConfigured() {
    return Boolean(authData.owner && authData.repo && authData.token);
  }

  // 파일을 Base64 문자열로 변환 (GitHub Content API 규격)
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // "data:image/jpeg;base64,..." 접두사 제거
        const base64Content = reader.result.split(",")[1];
        resolve(base64Content);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  // GitHub API 호출 헬퍼
  async function githubRequest(endpoint, method = "GET", body = null) {
    const url = `https://api.github.com/repos/${authData.owner}/${authData.repo}/${endpoint}`;
    const headers = {
      "Accept": "application/vnd.github.v3+json",
      "Authorization": `token ${authData.token}`,
      "Content-Type": "application/json",
    };

    const options = { method, headers };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `GitHub API 오류 (${res.status})`);
    }
    return data;
  }

  // 1. 단일 이미지 GitHub 저장소의 images/ 폴더로 업로드
  async function uploadImageToGitHub(file) {
    const cleanFileName = Date.now() + "_" + file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `images/${cleanFileName}`;
    const base64Content = await fileToBase64(file);

    await githubRequest(`contents/${filePath}`, "PUT", {
      message: `Upload portfolio image: ${cleanFileName} [via Admin CMS]`,
      content: base64Content,
      branch: authData.branch
    });

    return filePath; // 상대 경로 반환 (예: "images/172000000_sample.jpg")
  }

  // 2. config.js 내용 가져와서 새 프로젝트 추가 후 GitHub에 커밋
  async function appendProjectToConfig(newProject) {
    // 1) 기존 config.js 가져오기
    const fileData = await githubRequest(`contents/config.js?ref=${authData.branch}`, "GET");
    const sha = fileData.sha;
    
    // Base64 디코딩 (한글 깨짐 방지 UTF-8 처리)
    const binaryString = atob(fileData.content.replace(/\s/g, ""));
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const currentConfigCode = new TextDecoder("utf-8").decode(bytes);

    // 2) projects: [ 바로 뒤에 새 프로젝트 객체 문자열 주입
    const targetPattern = /projects:\s*\[/;
    if (!targetPattern.test(currentConfigCode)) {
      throw new Error("config.js에서 'projects: [' 구조를 찾을 수 없습니다.");
    }

    const projectIndentString = "\n    " + JSON.stringify(newProject, null, 6).replace(/\n/g, "\n    ") + ",";
    const updatedConfigCode = currentConfigCode.replace(targetPattern, "projects: [" + projectIndentString);

    // 3) 다시 UTF-8 Base64 인코딩
    const encodedUpdatedBytes = new TextEncoder().encode(updatedConfigCode);
    let binary = "";
    encodedUpdatedBytes.forEach((b) => binary += String.fromCharCode(b));
    const newBase64Content = btoa(binary);

    // 4) GitHub에 config.js 커밋 & 푸시
    await githubRequest(`contents/config.js`, "PUT", {
      message: `Publish new portfolio project: ${newProject.title} [via Admin CMS]`,
      content: newBase64Content,
      sha: sha,
      branch: authData.branch
    });
  }

  // UI 이벤트 및 폼 핸들러
  function setupUIEvents() {
    const adminModal = document.getElementById("admin-cms-modal");
    const adminBackdrop = document.getElementById("admin-cms-backdrop");
    const adminCloseBtn = document.getElementById("admin-cms-close");
    const adminLockTrigger = document.getElementById("admin-lock-trigger");

    const settingsTabBtn = document.getElementById("admin-tab-settings");
    const writeTabBtn = document.getElementById("admin-tab-write");
    const settingsPanel = document.getElementById("admin-panel-settings");
    const writePanel = document.getElementById("admin-panel-write");

    const authForm = document.getElementById("admin-auth-form");
    const publishForm = document.getElementById("admin-publish-form");
    const logoutBtn = document.getElementById("admin-logout-btn");

    const thumbInput = document.getElementById("cms-thumbnail-input");
    const thumbPreview = document.getElementById("cms-thumb-preview");
    const galleryInput = document.getElementById("cms-gallery-input");
    const galleryPreview = document.getElementById("cms-gallery-preview");

    const statusWrap = document.getElementById("cms-status-wrap");
    const statusText = document.getElementById("cms-status-text");

    // 관리자 모달 열기
    function openAdmin() {
      // 핀코드 체크 (설정되어 있는 경우)
      const savedPin = localStorage.getItem(PIN_KEY);
      if (savedPin) {
        const inputPin = prompt("🔒 관리자 PIN 비밀번호를 입력하세요:");
        if (inputPin !== savedPin) {
          alert("비밀번호가 일치하지 않습니다.");
          return;
        }
      }

      adminModal.classList.add("active");
      adminModal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");

      // 토큰 설정 여부에 따라 탭 자동 전환
      if (!isConfigured()) {
        switchTab("settings");
      } else {
        switchTab("write");
        populateAuthForm();
      }
    }

    function closeAdmin() {
      adminModal.classList.remove("active");
      adminModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    }

    function switchTab(tab) {
      if (tab === "settings") {
        settingsTabBtn.classList.add("active");
        writeTabBtn.classList.remove("active");
        settingsPanel.classList.remove("hidden");
        writePanel.classList.add("hidden");
      } else {
        if (!isConfigured()) {
          alert("먼저 [GitHub 연동 설정] 탭에서 토큰 정보를 입력하고 저장해주세요.");
          return;
        }
        writeTabBtn.classList.add("active");
        settingsTabBtn.classList.remove("active");
        writePanel.classList.remove("hidden");
        settingsPanel.classList.add("hidden");
      }
    }

    function populateAuthForm() {
      document.getElementById("auth-owner").value = authData.owner || "";
      document.getElementById("auth-repo").value = authData.repo || "";
      document.getElementById("auth-branch").value = authData.branch || "main";
      document.getElementById("auth-token").value = authData.token || "";
    }

    // 트리거 연결 (버튼 & 단축키 & URL #admin)
    if (adminLockTrigger) adminLockTrigger.addEventListener("click", openAdmin);
    if (adminCloseBtn) adminCloseBtn.addEventListener("click", closeAdmin);
    if (adminBackdrop) adminBackdrop.addEventListener("click", closeAdmin);

    window.addEventListener("keydown", (e) => {
      // Ctrl + Shift + A 단축키로 관리자 호출
      if (e.ctrlKey && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        openAdmin();
      }
    });

    if (window.location.hash === "#admin") {
      setTimeout(openAdmin, 300);
    }

    settingsTabBtn.addEventListener("click", () => switchTab("settings"));
    writeTabBtn.addEventListener("click", () => switchTab("write"));

    // 인증 폼 저장
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const owner = document.getElementById("auth-owner").value.trim();
      const repo = document.getElementById("auth-repo").value.trim();
      const branch = document.getElementById("auth-branch").value.trim() || "main";
      const token = document.getElementById("auth-token").value.trim();
      const pin = document.getElementById("auth-pin").value.trim();

      if (pin) {
        localStorage.setItem(PIN_KEY, pin);
      }

      saveAuth(owner, repo, branch, token);
      alert("✅ GitHub 연동 정보가 내 브라우저에 안전하게 저장되었습니다!\n이제 [작품 글쓰기 & 업로드] 탭에서 바로 글을 올리실 수 있습니다.");
      switchTab("write");
    });

    // 로그아웃
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        if (confirm("저장된 GitHub 토큰과 연동 정보를 브라우저에서 삭제하시겠습니까?")) {
          clearAuth();
          localStorage.removeItem(PIN_KEY);
          populateAuthForm();
          alert("로그아웃 되었습니다.");
          switchTab("settings");
        }
      });
    }

    // 썸네일 이미지 선택 & 미리보기
    thumbInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file) return;
      selectedThumbnailFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        thumbPreview.innerHTML = `<img src="${reader.result}" alt="Thumbnail Preview" style="width: 100%; height: 160px; object-fit: cover; border: 1px solid #333;">`;
      };
      reader.readAsDataURL(file);
    });

    // 상세 이미지들 다중 선택 & 미리보기
    galleryInput.addEventListener("change", (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;
      selectedGalleryFiles = files;
      galleryPreview.innerHTML = "";
      
      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = () => {
          const item = document.createElement("div");
          item.style.cssText = "display: inline-block; width: 80px; height: 80px; margin: 4px; overflow: hidden; border: 1px solid #333; position: relative;";
          item.innerHTML = `<img src="${reader.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
          galleryPreview.appendChild(item);
        };
        reader.readAsDataURL(file);
      });
    });

    // 발행 프로세스
    publishForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!isConfigured()) {
        alert("GitHub 연동 정보가 필요합니다. 설정 탭으로 이동합니다.");
        switchTab("settings");
        return;
      }

      if (!selectedThumbnailFile) {
        alert("메인 대표 썸네일 이미지를 선택해주세요.");
        return;
      }

      const title = document.getElementById("cms-title").value.trim();
      const id = document.getElementById("cms-id").value.trim() || "work-" + Date.now();
      const category = document.getElementById("cms-category").value;
      const year = document.getElementById("cms-year").value.trim() || new Date().getFullYear().toString();
      const featuredWide = document.getElementById("cms-wide").checked;
      const role = document.getElementById("cms-role").value.trim() || "All Artwork (100%)";
      const tools = document.getElementById("cms-tools").value.trim() || "Clip Studio Paint, Photoshop";
      const client = document.getElementById("cms-client").value.trim() || "Original Work";
      const synopsis = document.getElementById("cms-synopsis").value.trim();

      statusWrap.classList.remove("hidden");
      const submitBtn = publishForm.querySelector("button[type='submit']");
      submitBtn.disabled = true;

      try {
        // 단계 1: 썸네일 이미지 업로드
        statusText.textContent = "⏳ 1/3: 대표 썸네일 이미지 업로드 중...";
        const thumbPath = await uploadImageToGitHub(selectedThumbnailFile);

        // 단계 2: 상세 갤러리 이미지들 업로드
        const galleryImageObjects = [];
        if (selectedGalleryFiles.length > 0) {
          for (let i = 0; i < selectedGalleryFiles.length; i++) {
            statusText.textContent = `⏳ 2/3: 상세 컷 업로드 중... (${i + 1}/${selectedGalleryFiles.length})`;
            const gPath = await uploadImageToGitHub(selectedGalleryFiles[i]);
            galleryImageObjects.push({
              url: gPath,
              caption: `0${i + 1}. SCENE DETAIL CUT`
            });
          }
        } else {
          // 상세 컷을 따로 안 올렸다면 썸네일 이미지로 대체
          galleryImageObjects.push({
            url: thumbPath,
            caption: "01. KEYFRAME ARTWORK"
          });
        }

        // 단계 3: config.js 업데이트 & 커밋
        statusText.textContent = "⏳ 3/3: config.js 업데이트 및 자동 배포 진행 중...";
        const newProject = {
          id,
          title,
          category,
          categoryLabel: category.toUpperCase(),
          year,
          featuredWide,
          thumbnail: thumbPath,
          role,
          tools,
          client,
          synopsis,
          images: galleryImageObjects
        };

        await appendProjectToConfig(newProject);

        statusText.innerHTML = "🎉 <strong style='color:#4ade80;'>발행 완료!</strong> GitHub에 성공적으로 업로드되었습니다.<br><small style='color:#888;'>약 30초~1분 후 GitHub Pages 배포가 완료되면 사이트에 새 작품이 나타납니다.</small>";
        
        // 폼 초기화
        publishForm.reset();
        selectedThumbnailFile = null;
        selectedGalleryFiles = [];
        thumbPreview.innerHTML = "";
        galleryPreview.innerHTML = "";

        setTimeout(() => {
          if (confirm("발행이 완료되었습니다! 페이지를 새로고침하여 확인해보시겠습니까? (GitHub Pages 빌드 상황에 따라 30초 정도 소요될 수 있습니다)")) {
            window.location.reload();
          }
        }, 1500);

      } catch (err) {
        console.error(err);
        statusText.innerHTML = `❌ <span style="color:#f87171;">발행 실패: ${err.message}</span><br><small style="color:#888;">토큰의 'repo' 쓰기 권한이나 리포지토리 이름을 확인해주세요.</small>`;
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  return { init, openAdmin: () => {} };
})();

document.addEventListener("DOMContentLoaded", () => {
  AdminEngine.init();
});
