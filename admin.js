/**
 * ============================================================================
 * [독립 관리자 스튜디오 모듈] admin.js
 * ============================================================================
 * admin.html 전용 모듈:
 * GitHub REST API를 사용하여 브라우저에서 직접 이미지를 업로드하고
 * config.js를 자동으로 업데이트하여 실시간 발행합니다.
 * 
 * 🔒 보안:
 * 1. GitHub Token은 GitHub 저장소에 절대 업로드되지 않습니다.
 * 2. 오직 관리자 본인 브라우저의 LocalStorage에만 암호화 보관됩니다.
 * 3. 다른 방문자는 토큰을 볼 수 없으며, 접근 권한이 없습니다.
 * ============================================================================
 */

const AdminEngine = (() => {
  const STORAGE_KEY = "studio_miel_admin_auth";
  const PIN_KEY = "studio_miel_admin_pin";

  let authData = {
    owner: "",
    repo: "",
    branch: "main",
    token: ""
  };

  let selectedThumbnailFile = null;
  let selectedGalleryFiles = [];

  function init() {
    // 1. PIN 비밀번호 확인 (설정된 경우)
    const savedPin = localStorage.getItem(PIN_KEY);
    if (savedPin) {
      const inputPin = prompt("🔒 관리자 PIN 비밀번호를 입력하세요:");
      if (inputPin !== savedPin) {
        alert("비밀번호가 일치하지 않습니다. 메인 페이지로 이동합니다.");
        window.location.href = "index.html";
        return;
      }
    }

    // 2. 저장된 인증 정보 로드
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        authData = JSON.parse(atob(saved));
      } catch (e) {
        console.error("인증 데이터 로드 실패", e);
      }
    }

    setupUIEvents();

    // 3. 토큰 설정 여부에 따라 초기 탭 지정
    if (!isConfigured()) {
      switchTab("settings");
    } else {
      switchTab("write");
      populateAuthForm();
    }
  }

  function saveAuth(owner, repo, branch, token) {
    authData = { owner, repo, branch: branch || "main", token };
    localStorage.setItem(STORAGE_KEY, btoa(JSON.stringify(authData)));
  }

  function clearAuth() {
    authData = { owner: "", repo: "", branch: "main", token: "" };
    localStorage.removeItem(STORAGE_KEY);
  }

  function isConfigured() {
    return Boolean(authData.owner && authData.repo && authData.token);
  }

  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Content = reader.result.split(",")[1];
        resolve(base64Content);
      };
      reader.onerror = (error) => reject(error);
    });
  }

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

  // 단일 이미지 GitHub 저장소의 images/ 폴더로 업로드
  async function uploadImageToGitHub(file) {
    const cleanFileName = Date.now() + "_" + file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const filePath = `images/${cleanFileName}`;
    const base64Content = await fileToBase64(file);

    await githubRequest(`contents/${filePath}`, "PUT", {
      message: `Upload portfolio image: ${cleanFileName} [via Admin CMS]`,
      content: base64Content,
      branch: authData.branch
    });

    return filePath;
  }

  // config.js에 새 프로젝트 객체 추가 후 커밋
  async function appendProjectToConfig(newProject) {
    const fileData = await githubRequest(`contents/config.js?ref=${authData.branch}`, "GET");
    const sha = fileData.sha;
    
    // Base64 디코딩 (한글 UTF-8 처리)
    const binaryString = atob(fileData.content.replace(/\s/g, ""));
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const currentConfigCode = new TextDecoder("utf-8").decode(bytes);

    const targetPattern = /projects:\s*\[/;
    if (!targetPattern.test(currentConfigCode)) {
      throw new Error("config.js에서 'projects: [' 구조를 찾을 수 없습니다.");
    }

    const projectIndentString = "\n    " + JSON.stringify(newProject, null, 6).replace(/\n/g, "\n    ") + ",";
    const updatedConfigCode = currentConfigCode.replace(targetPattern, "projects: [" + projectIndentString);

    const encodedUpdatedBytes = new TextEncoder().encode(updatedConfigCode);
    let binary = "";
    encodedUpdatedBytes.forEach((b) => binary += String.fromCharCode(b));
    const newBase64Content = btoa(binary);

    await githubRequest(`contents/config.js`, "PUT", {
      message: `Publish new portfolio project: ${newProject.title} [via Admin CMS]`,
      content: newBase64Content,
      sha: sha,
      branch: authData.branch
    });
  }

  function switchTab(tab) {
    const settingsTabBtn = document.getElementById("admin-tab-settings");
    const writeTabBtn = document.getElementById("admin-tab-write");
    const settingsPanel = document.getElementById("admin-panel-settings");
    const writePanel = document.getElementById("admin-panel-write");

    if (!settingsTabBtn || !writeTabBtn) return;

    if (tab === "settings") {
      settingsTabBtn.classList.add("active");
      writeTabBtn.classList.remove("active");
      settingsPanel.classList.remove("hidden");
      writePanel.classList.add("hidden");
      populateAuthForm();
    } else {
      if (!isConfigured()) {
        alert("먼저 [GitHub 연동 설정] 탭에서 토큰 정보를 입력하고 저장해주세요.");
        switchTab("settings");
        return;
      }
      writeTabBtn.classList.add("active");
      settingsTabBtn.classList.remove("active");
      writePanel.classList.remove("hidden");
      settingsPanel.classList.add("hidden");
    }
  }

  function populateAuthForm() {
    const ownerEl = document.getElementById("auth-owner");
    const repoEl = document.getElementById("auth-repo");
    const branchEl = document.getElementById("auth-branch");
    const tokenEl = document.getElementById("auth-token");
    const pinEl = document.getElementById("auth-pin");

    if (ownerEl) ownerEl.value = authData.owner || "";
    if (repoEl) repoEl.value = authData.repo || "";
    if (branchEl) branchEl.value = authData.branch || "main";
    if (tokenEl) tokenEl.value = authData.token || "";
    if (pinEl) pinEl.value = localStorage.getItem(PIN_KEY) || "";
  }

  function setupUIEvents() {
    const settingsTabBtn = document.getElementById("admin-tab-settings");
    const writeTabBtn = document.getElementById("admin-tab-write");

    const authForm = document.getElementById("admin-auth-form");
    const publishForm = document.getElementById("admin-publish-form");
    const logoutBtn = document.getElementById("admin-logout-btn");

    const thumbInput = document.getElementById("cms-thumbnail-input");
    const thumbPreview = document.getElementById("cms-thumb-preview");
    const galleryInput = document.getElementById("cms-gallery-input");
    const galleryPreview = document.getElementById("cms-gallery-preview");

    const statusWrap = document.getElementById("cms-status-wrap");
    const statusText = document.getElementById("cms-status-text");

    // 탭 클릭
    if (settingsTabBtn) settingsTabBtn.addEventListener("click", () => switchTab("settings"));
    if (writeTabBtn) writeTabBtn.addEventListener("click", () => switchTab("write"));

    // 설정 저장
    if (authForm) {
      authForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const owner = document.getElementById("auth-owner").value.trim();
        const repo = document.getElementById("auth-repo").value.trim();
        const branch = document.getElementById("auth-branch").value.trim() || "main";
        const token = document.getElementById("auth-token").value.trim();
        const pin = document.getElementById("auth-pin").value.trim();

        if (pin) {
          localStorage.setItem(PIN_KEY, pin);
        } else {
          localStorage.removeItem(PIN_KEY);
        }

        saveAuth(owner, repo, branch, token);
        alert("✅ GitHub 연동 정보가 내 브라우저에 안전하게 저장되었습니다!\n이제 [작품 글쓰기 & GitHub 즉시 업로드] 탭에서 바로 글을 올리실 수 있습니다.");
        switchTab("write");
      });
    }

    // 로그아웃
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        if (confirm("저장된 GitHub 토큰과 연동 정보를 브라우저에서 초기화하시겠습니까?")) {
          clearAuth();
          localStorage.removeItem(PIN_KEY);
          populateAuthForm();
          alert("연동 정보가 초기화되었습니다.");
          switchTab("settings");
        }
      });
    }

    // 썸네일 미리보기
    if (thumbInput) {
      thumbInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        selectedThumbnailFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          thumbPreview.innerHTML = `<img src="${reader.result}" alt="Thumbnail Preview" style="width: 100%; height: 180px; object-fit: cover; border: 1px solid #333;">`;
        };
        reader.readAsDataURL(file);
      });
    }

    // 상세 이미지 다중 미리보기
    if (galleryInput) {
      galleryInput.addEventListener("change", (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        selectedGalleryFiles = files;
        galleryPreview.innerHTML = "";
        
        files.forEach((file) => {
          const reader = new FileReader();
          reader.onload = () => {
            const item = document.createElement("div");
            item.style.cssText = "display: inline-block; width: 80px; height: 80px; margin: 4px; overflow: hidden; border: 1px solid #333;";
            item.innerHTML = `<img src="${reader.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
            galleryPreview.appendChild(item);
          };
          reader.readAsDataURL(file);
        });
      });
    }

    // 포스트 발행
    if (publishForm) {
      publishForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!isConfigured()) {
          alert("GitHub 연동 정보가 설정되지 않았습니다. 설정 탭으로 이동합니다.");
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
          // 1단계: 썸네일 업로드
          statusText.textContent = "⏳ 1/3: 대표 썸네일 이미지 업로드 중...";
          const thumbPath = await uploadImageToGitHub(selectedThumbnailFile);

          // 2단계: 상세 이미지들 업로드
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
            galleryImageObjects.push({
              url: thumbPath,
              caption: "01. KEYFRAME ARTWORK"
            });
          }

          // 3단계: config.js 업데이트 & 커밋
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

          statusText.innerHTML = "🎉 <strong style='color:#4ade80;'>발행 성공!</strong> GitHub에 안전하게 등록되었습니다.<br><small style='color:#aaaaaa;'>약 30초~1분 후 GitHub Pages 배포가 완료되면 메인 사이트에 나타납니다.</small>";
          
          publishForm.reset();
          selectedThumbnailFile = null;
          selectedGalleryFiles = [];
          thumbPreview.innerHTML = '<span class="preview-placeholder">선택된 썸네일 없음</span>';
          galleryPreview.innerHTML = '<span class="preview-placeholder">선택된 상세 이미지 없음</span>';

          setTimeout(() => {
            if (confirm("발행이 완료되었습니다! 내 포트폴리오 메인 페이지로 이동하여 확인하시겠습니까?")) {
              window.location.href = "index.html";
            }
          }, 1500);

        } catch (err) {
          console.error(err);
          statusText.innerHTML = `❌ <span style="color:#f87171;">발행 실패: ${err.message}</span><br><small style="color:#888;">토큰의 'repo' 권한이나 저장소 이름을 다시 확인해주세요.</small>`;
        } finally {
          submitBtn.disabled = false;
        }
      });
    }
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", () => {
  AdminEngine.init();
});
