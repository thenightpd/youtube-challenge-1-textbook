const lessons = [
  { track: "guide", group: "준비", id: "welcome", day: "안내", title: "챌린지 구조", file: "00_환영합니다.md" },
  { track: "guide", group: "준비", id: "rules", day: "공통", title: "단톡방 제출 방법", file: "00_제출규칙.md" },
  { track: "guide", group: "준비", id: "day0", day: "Day 1", title: "준비", file: "Day00_윈도우준비.md" },
  { track: "guide", group: "준비", id: "gbam", day: "Day 2", title: "그밤스튜디오 설치", file: "Day00b_그밤스튜디오설치.md", after: "day7" },
  { track: "guide", group: "일본 쇼츠 (4일)", id: "day7", day: "Day 3", title: "소재 찾기", file: "Day07_B_소재찾기.md", before: "gbam" },
  { track: "guide", group: "일본 쇼츠 (4일)", id: "day8", day: "Day 4", title: "대본·목소리·편집", file: "Day08_B_대본_편집.md" },
  { track: "guide", group: "일본 쇼츠 (4일)", id: "day9", day: "Day 5", title: "점검과 첫 업로드", file: "Day09_B_점검_업로드.md" },
  { track: "guide", group: "일본 쇼츠 (4일)", id: "haejja2", day: "Day 6", title: "2·3편 — 예약 걸어 두기", file: "Day05_B_해짜_2편.md", after: "day1" },
  { track: "guide", group: "주말 · 재미로", id: "day1", day: "Day 7", title: "주제와 목소리", file: "Day01_A_카드쇼츠.md", before: "haejja2" },
  { track: "guide", group: "주말 · 재미로", id: "day2", day: "Day 7", title: "스타일 3종 만들고 하나 고르기", file: "Day02_A_설명영상.md", after: "day10" },
  { track: "guide", group: "선택 과제", id: "day3", day: "선택", title: "내 색으로 바꾸기", file: "Day03_A_조립_업로드.md", before: "day2", after: "day10" },
  { track: "guide", group: "시니어 롱폼 (6일)", id: "day10", day: "Day 8", title: "9비트 대본", file: "Day10_D_대본.md", before: "day2" },
  { track: "guide", group: "시니어 롱폼 (6일)", id: "day11", day: "Day 9", title: "이미지 컷", file: "Day11_D_이미지_TTS.md" },
  { track: "guide", group: "시니어 롱폼 (6일)", id: "day15", day: "Day 10", title: "목소리와 시각표", file: "Day15_D_목소리_시각표.md" },
  { track: "guide", group: "시니어 롱폼 (6일)", id: "day12", day: "Day 11", title: "조립과 쇼츠, 업로드", file: "Day12_D_조립.md", after: "senior2" },
  { track: "guide", group: "선택 과제", id: "day13", day: "선택", title: "영상 컷과 인트로", file: "Day13_D_영상_인트로.md", before: "day12", after: "senior2" },
  { track: "guide", group: "시니어 롱폼 (6일)", id: "senior2", day: "Day 12", title: "2편 — 대본과 이미지", file: "Day06_D_시니어_2편.md", before: "day12" },
  { track: "guide", group: "시니어 롱폼 (6일)", id: "day16", day: "Day 13", title: "2편 — 목소리·조립·업로드", file: "Day16_D_시니어2편_목소리조립.md", after: "day14" },
  { track: "guide", group: "운영", id: "day14", day: "Day 14", title: "채널 2개 30일 운영안", file: "Day14_주력채널_운영안.md", before: "day16" },
  { track: "guide", group: "운영", id: "week3", day: "3주차", title: "수정과 다음 편 틀", file: "Week3_수정_다음편.md" },
  { track: "reference", group: "참고", id: "money", day: "수익화", title: "수익화 문", file: "참고_수익화.md" },
  { track: "reference", group: "참고", id: "tools", day: "도구", title: "도구·비용", file: "참고_도구비용표.md" },
  { track: "reference", group: "참고", id: "forms", day: "양식", title: "양식", file: "참고_양식.md" },
  { track: "reference", group: "참고", id: "stuck", day: "막힘", title: "막히면 여기", file: "99_막히면_여기.md" }
];

// GFM의 물결표 취소선(~a~)을 끈다 — "4~5분 … 25~32장" 같은 범위 표기 두 개가 한 문단에 있으면 사이가 지워지기 때문.
if (window.marked?.use) window.marked.use({ tokenizer: { del: () => undefined } });

const nav = document.querySelector("#lessonNav");
const content = document.querySelector("#content");
const loading = document.querySelector("#loading");
const pager = document.querySelector("#pager");
const sidebar = document.querySelector("#sidebar");
const overlay = document.querySelector("#overlay");

function readCompleted() {
  try {
    const saved = JSON.parse(localStorage.getItem("yt-challenge-1-completed") || "[]");
    return new Set(Array.isArray(saved) ? saved : []);
  } catch {
    return new Set();
  }
}

const completed = readCompleted();

function renderNav(activeId) {
  const activeLesson = lessons.find(lesson => lesson.id === activeId) || lessons[0];
  document.querySelectorAll(".tab").forEach(tab => {
    const active = tab.dataset.track === activeLesson.track;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  nav.innerHTML = lessons.filter(lesson => lesson.track === activeLesson.track).map((lesson, index, list) => {
    const heading = index === 0 || list[index - 1].group !== lesson.group
      ? `<div class="nav-group">${lesson.group}</div>`
      : "";
    return heading + `
    <a class="nav-link ${lesson.id === activeId ? "active" : ""}" href="#${lesson.id}" ${lesson.id === activeId ? 'aria-current="page"' : ""}>
      <span class="nav-day">${lesson.day}</span>
      <span>${lesson.title}</span>
      <span class="nav-check">${completed.has(lesson.id) ? "✓" : ""}</span>
    </a>`;
  }).join("");
}

// 이전/다음은 같은 묶음(group) 안에서만 움직인다. 묶음 끝에서는 before/after 로 지정한 곳으로.
// day3·day13 은 "선택 과제"로 따로 묶여 있어 본 줄기(before/after)가 자동으로 건너뛴다.
// 그 밖의 모든 묶음 경계(예: 그밤스튜디오→일본 쇼츠, 시니어 2편→운영)도 양쪽에 before/after 를 명시해야
// 이어진다 — 묶음이 다르면 배열 순서가 이어져 있어도 자동으로 연결되지 않는다.
function neighbor(lesson, direction) {
  const list = lessons.filter(item => item.track === lesson.track);
  const index = list.findIndex(item => item.id === lesson.id);
  const candidate = list[index + direction];
  if (candidate && candidate.group === lesson.group) return candidate;
  const jump = direction > 0 ? lesson.after : lesson.before;
  return jump ? lessons.find(item => item.id === jump) || null : null;
}

function normalizeKoreanStrong(markdown) {
  let inFence = false;
  return markdown.split("\n").map(line => {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      return line;
    }
    if (inFence) return line;
    return line.replace(/(^|[\s([{|>:\-–—])\*\*([^*\n]+)\*\*(?=[가-힣])/g, "$1<strong>$2</strong>");
  }).join("\n");
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1400);
}

function enhanceArticle() {
  content.querySelectorAll('a[href$=".mp4"]').forEach(link => {
    if (!link.textContent.trim().startsWith("▶")) return;
    const video = document.createElement("video");
    video.className = "lesson-video";
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.poster = link.getAttribute("href").replace(/\.mp4$/, "-poster.jpg");
    video.src = link.getAttribute("href");
    video.setAttribute("aria-label", link.textContent.trim());
    link.replaceWith(video);
  });

  content.querySelectorAll("table").forEach(table => {
    const wrap = document.createElement("div");
    wrap.className = "table-wrap";
    table.parentNode.insertBefore(wrap, table);
    wrap.appendChild(table);
  });

  content.querySelectorAll("pre").forEach(pre => {
    const button = document.createElement("button");
    button.className = "copy-button";
    button.type = "button";
    button.textContent = "복사";
    button.setAttribute("aria-label", "내용 복사");
    button.addEventListener("click", async () => {
      const value = pre.querySelector("code")?.innerText || pre.innerText;
      try {
        await navigator.clipboard.writeText(value);
        showToast("복사했습니다");
      } catch {
        showToast("글자를 직접 선택해 복사해 주세요");
      }
    });
    pre.appendChild(button);
  });

  content.querySelectorAll("a").forEach(link => {
    if (link.hostname && link.hostname !== location.hostname) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
  });
}

function closeMenu() {
  sidebar.classList.remove("open");
  overlay.classList.remove("open");
  document.querySelector("#menuButton").setAttribute("aria-expanded", "false");
}

async function loadLesson() {
  const id = location.hash.replace("#", "") || "welcome";
  const lesson = lessons.find(item => item.id === id) || lessons[0];

  renderNav(lesson.id);
  loading.hidden = false;
  loading.textContent = "교재를 불러오고 있습니다…";
  content.hidden = true;
  pager.hidden = true;

  try {
    const response = await fetch(encodeURI(lesson.file));
    if (!response.ok) throw new Error("교재 파일을 찾을 수 없습니다.");
    const markdown = await response.text();
    const parser = window.marked?.parse
      ? value => window.marked.parse(normalizeKoreanStrong(value), { gfm: true, breaks: false })
      : window.markdownFallback;
    if (!parser) throw new Error("교재 변환기를 불러오지 못했습니다.");

    content.innerHTML = parser(markdown);
    enhanceArticle();
    document.title = `${lesson.title} | 유튜브 자동화 챌린지 1기`;

    const prev = neighbor(lesson, -1);
    const next = neighbor(lesson, 1);
    document.querySelector("#prevButton").disabled = !prev;
    document.querySelector("#nextButton").disabled = !next;
    document.querySelector("#prevButton").onclick = () => { if (prev) location.hash = prev.id; };
    document.querySelector("#nextButton").onclick = () => { if (next) location.hash = next.id; };

    const hero = document.querySelector(".hero-block");
    if (lesson.track === "reference") {
      hero.querySelector(".hero-eyebrow").textContent = "유튜브 자동화 챌린지 1기 · 참고";
      hero.querySelector(".hero-title").textContent = "도구 · 양식 · 막히면 여기";
    } else {
      hero.querySelector(".hero-eyebrow").textContent = "유튜브 자동화 챌린지 1기";
      hero.querySelector(".hero-title").textContent = lesson.group;
    }

    const completeButton = document.querySelector("#completeButton");
    completeButton.textContent = completed.has(lesson.id) ? "✓ 확인 완료" : "✓ 여기까지 했어요";
    completeButton.setAttribute("aria-pressed", String(completed.has(lesson.id)));
    completeButton.onclick = () => {
      completed.add(lesson.id);
      try {
        localStorage.setItem("yt-challenge-1-completed", JSON.stringify([...completed]));
      } catch {
        // 저장이 막힌 브라우저에서도 현재 화면의 표시는 유지합니다.
      }
      renderNav(lesson.id);
      completeButton.textContent = "✓ 확인 완료";
      completeButton.setAttribute("aria-pressed", "true");
      showToast("진도를 저장했습니다");
    };

    loading.hidden = true;
    content.hidden = false;
    pager.hidden = false;
    window.scrollTo(0, 0);
    closeMenu();
  } catch (error) {
    loading.textContent = `교재를 열지 못했습니다: ${error.message}`;
    loading.setAttribute("role", "alert");
  }
}

document.querySelector("#menuButton").addEventListener("click", () => {
  sidebar.classList.toggle("open");
  overlay.classList.toggle("open");
  document.querySelector("#menuButton").setAttribute("aria-expanded", String(sidebar.classList.contains("open")));
});
overlay.addEventListener("click", closeMenu);
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeMenu();
});
window.addEventListener("hashchange", loadLesson);
loadLesson();
