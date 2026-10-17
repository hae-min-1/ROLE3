/**
 * 🎬 CLASSFLIX (넷플릭스 스타일 우리 반 1인 1역할 배정 시스템)
 * 역할 랜덤 매칭, TUDUM 사운드 효과, A4 인쇄, 구글 스프레드시트 연동
 */

// 1. 기본 세팅 예시 데이터 (학생 26명 & 1인 1역할 26개 - 동물 제외 순수 역할)
const DEFAULT_STUDENTS = [
  "1. 강민우", "2. 김서연", "3. 김도윤", "4. 김하은",
  "5. 박지후", "6. 박예은", "7. 이준우", "8. 이서아",
  "9. 정시우", "10. 정유나", "11. 최현우", "12. 최지아",
  "13. 한주원", "14. 한수아", "15. 윤도현", "16. 윤채원",
  "17. 임민준", "18. 임소율", "19. 송우진", "20. 송하린",
  "21. 오승우", "22. 오지유", "23. 신재원", "24. 신하윤",
  "25. 백건우", "26. 황다은"
];

const DEFAULT_ROLES = [
  { icon: "🧹", title: "칠판 도우미", desc: "수업 전후 칠판을 물걸레로 깨끗하게 닦고 지우개를 털어요." },
  { icon: "🥛", title: "우유·급식 도우미", desc: "급식 줄서기를 바르게 안내하고 우유 상자를 깔끔히 정리해요." },
  { icon: "💡", title: "에너지 지킴이", desc: "쉬는 시간과 이동 수업 시 조명과 냉난방기 전원을 확인해요." },
  { icon: "🪟", title: "창문 환기 대장", desc: "중간놀이와 점심시간에 창문을 열어 교실 공기를 맑게 해요." },
  { icon: "📚", title: "도서 관리관", desc: "학급 문고 책꽂이의 책을 번호대로 반듯하게 정돈해요." },
  { icon: "📌", title: "게시판 디렉터", desc: "가정통신문 및 친구들의 멋진 작품 게시판을 깔끔히 가꿔요." },
  { icon: "👟", title: "신발장 정리왕", desc: "친구들의 실내화와 운동화가 가지런히 놓이도록 살펴요." },
  { icon: "♻️", title: "분리수거 대장", desc: "종이, 플라스틱, 캔 분리수거함이 올바르게 쓰이는지 점검해요." },
  { icon: "🧽", title: "환경미화 관리사", desc: "빗자루와 쓰레받기, 걸레를 걸이대에 가지런히 정리해요." },
  { icon: "🌿", title: "식물 가꾸기", desc: "교실 화분에 시기에 맞춰 물을 주고 따뜻한 햇빛을 쬐어줘요." },
  { icon: "💻", title: "미디어·TV 도우미", desc: "수업용 전자칠판과 TV, 무선 마우스 충전 상태를 관리해요." },
  { icon: "🩹", title: "보건·체온 지킴이", desc: "비상 구급함을 확인하고 아픈 친구가 있으면 보건실을 안내해요." },
  { icon: "⚽", title: "체육 교구 반장", desc: "체육 시간 전 축구공, 줄넘기 등 체육 교구를 챙기고 반납해요." },
  { icon: "⏰", title: "시간 알리미", desc: "수업 시작 1분 전 종이 울리면 친구들에게 착석을 안내해요." },
  { icon: "📋", title: "출석부 도우미", desc: "아침 출석부 상태를 점검하고 선생님께 전달해 드려요." },
  { icon: "📝", title: "알림장 도우미", desc: "칠판 알림장 글씨를 바르게 정돈하고 친구들의 필기를 도와요." },
  { icon: "📐", title: "책상 줄 지킴이", desc: "모둠 책상과 의자 줄이 반듯하게 맞추어져 있는지 살펴요." },
  { icon: "☂️", title: "우산꽂이 도우미", desc: "비나 눈이 오는 날 우산이 엉키지 않게 가지런히 정리해요." },
  { icon: "🔍", title: "분실물 센터장", desc: "바닥에 떨어진 연필, 지우개 등 임자 없는 물건을 분실물함에 보관해요." },
  { icon: "🎵", title: "BGM 사운드 DJ", desc: "아침 등교 시간과 청소 시간에 활기찬 배경음악을 켜요." },
  { icon: "📄", title: "학습지 배부관", desc: "학습지와 안내장을 모둠별 인원수대로 신속하게 전달해요." },
  { icon: "💌", title: "칭찬 배달부", desc: "친구들의 따뜻한 칭찬 쪽지와 칭찬 스티커 판을 관리해요." },
  { icon: "🧴", title: "위생·손소독 도우미", desc: "손 소독제와 핸드타월 잔량을 확인하고 청결을 독려해요." },
  { icon: "🗄️", title: "사물함 점검관", desc: "사물함 문이 열려 있거나 위에 짐이 쌓이지 않도록 살펴요." },
  { icon: "🛡️", title: "안전 지킴이", desc: "복도나 교실에서 뛰거나 장난치는 친구를 부드럽게 말려요." },
  { icon: "👑", title: "총괄 행복 리더", desc: "선생님의 수업 진행을 돕고 모둠 토의 시간을 이끌어요." }
];

// 2. 애플리케이션 상태 (State)
let students = JSON.parse(localStorage.getItem('class_students')) || [...DEFAULT_STUDENTS];
// 동물 데이터가 포함된 이전 캐시가 있다면 깔끔한 DEFAULT_ROLES로 자동 갱신
let storedRoles = JSON.parse(localStorage.getItem('class_roles'));
let roles = (storedRoles && !storedRoles[0]?.animal) ? storedRoles : JSON.parse(JSON.stringify(DEFAULT_ROLES));
localStorage.setItem('class_roles', JSON.stringify(roles));

let assignments = JSON.parse(localStorage.getItem('class_assignments')) || [];
// assignments에도 animal이 포함되어 있다면 정리
if (assignments[0]?.role?.animal) {
  assignments = [];
  localStorage.removeItem('class_assignments');
}

let currentView = 'card'; // 'card' | 'table'
let soundEnabled = localStorage.getItem('class_sound') !== 'false';
let swapSourceIndex = null;

// 🔊 넷플릭스 시그니처 "두둥 (TUDUM)" 사운드 효과 (Web Audio API)
const playTudumSound = () => {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const t = ctx.currentTime;

    // 1. 묵직한 서브 베이스 펀치 (Thud)
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(80, t);
    subOsc.frequency.exponentialRampToValueAtTime(35, t + 0.35);
    subGain.gain.setValueAtTime(0.4, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.65);

    // 2. 넷플릭스 특유의 드라마틱한 첼로/브라스 스웰 (TUDUM 화음)
    const chordFrequencies = [110, 164.81, 220, 329.63]; // A2, E3, A3, E4
    chordFrequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, t + 0.05);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, t);
      filter.frequency.exponentialRampToValueAtTime(1400, t + 0.25);
      filter.frequency.exponentialRampToValueAtTime(250, t + 1.2);

      gain.gain.setValueAtTime(0.001, t + 0.05);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 1.25);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t + 0.05);
      osc.stop(t + 1.3);
    });

    // 3. 고음 메탈릭 잔향 (Shimmer)
    const highOsc = ctx.createOscillator();
    const highGain = ctx.createGain();
    highOsc.type = 'triangle';
    highOsc.frequency.setValueAtTime(880, t + 0.1);
    highGain.gain.setValueAtTime(0.001, t + 0.1);
    highGain.gain.linearRampToValueAtTime(0.05, t + 0.25);
    highGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    highOsc.connect(highGain);
    highGain.connect(ctx.destination);
    highOsc.start(t + 0.1);
    highOsc.stop(t + 0.95);

  } catch (e) {
    console.warn("Audio context not supported", e);
  }
};

// 3. 무작위 역할 매칭 (Fisher-Yates Shuffle)
function assignRoles() {
  if (students.length === 0 || roles.length === 0) {
    showToast("⚠️ 학생 또는 역할 목록이 비어 있습니다.");
    return;
  }

  // 셔플
  const shuffledRoles = [...roles];
  for (let i = shuffledRoles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledRoles[i], shuffledRoles[j]] = [shuffledRoles[j], shuffledRoles[i]];
  }

  const newAssignments = [];
  const count = Math.min(students.length, shuffledRoles.length);

  for (let i = 0; i < count; i++) {
    newAssignments.push({
      student: students[i],
      role: shuffledRoles[i]
    });
  }

  if (students.length > shuffledRoles.length) {
    for (let i = count; i < students.length; i++) {
      newAssignments.push({
        student: students[i],
        role: { icon: "🤝", title: "스페셜 서포터", desc: "친구들의 역할을 함께 지원하며 완벽한 시즌을 이끄는 조력자예요." }
      });
    }
  }

  assignments = newAssignments;
  localStorage.setItem('class_assignments', JSON.stringify(assignments));

  playTudumSound();
  launchConfetti();
  renderApp();
  showToast(`두둥! 🎬 학생 26명의 1인 1역할 배정이 완료되었습니다!`);
}

// 4. 화면 렌더링
function renderApp() {
  updateStatusSummary();
  renderCardGrid();
  renderTableList();
  renderPrintTable();
}

function updateStatusSummary() {
  const countEl = document.getElementById('statusSummary');
  const studentCount = students.length;
  const roleCount = roles.length;
  const assignedCount = assignments.length;

  if (countEl) {
    if (assignedCount > 0) {
      countEl.innerHTML = `
        <span class="status-badge matched">
          <span style="color: var(--netflix-red); font-weight: 900;">N</span> 시즌 2026 캐스팅 완료: ${assignedCount}명 (${studentCount}명 기준)
        </span>
      `;
    } else {
      countEl.innerHTML = `
        <span class="status-badge">
          <span>🎬</span> 총 학생 ${studentCount}명 · 1인 1역할 ${roleCount}개 (방영 대기중)
        </span>
      `;
    }
  }
}

// 넷플릭스 포스터 카드 렌더링
function renderCardGrid() {
  const gridEl = document.getElementById('roleGrid');
  const searchQuery = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  if (!gridEl) return;

  if (assignments.length === 0) {
    gridEl.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 70px 20px; background: #1a1a1a; border-radius: 12px; border: 1px dashed #333333;">
        <div style="font-family: var(--font-logo); font-size: 56px; color: var(--netflix-red); margin-bottom: 8px;">CLASSFLIX</div>
        <h3 style="font-size: 22px; font-weight: 800; color: #ffffff; margin-bottom: 8px;">
          아직 역할이 캐스팅되지 않았습니다
        </h3>
        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 24px;">
          상단의 <strong>[▶ 역할 배정하기]</strong>를 누르면 넷플릭스 오리지널 캐스팅이 시작됩니다!
        </p>
        <button class="btn btn-primary" onclick="assignRoles()" style="font-size: 15px; padding: 12px 28px;">
          ▶ 지금 캐스팅 시작
        </button>
      </div>
    `;
    return;
  }

  const filtered = assignments.filter((item) => {
    if (!searchQuery) return true;
    const sName = (item.student || '').toLowerCase();
    const rTitle = (item.role?.title || '').toLowerCase();
    const rDesc = (item.role?.desc || '').toLowerCase();
    return sName.includes(searchQuery) || rTitle.includes(searchQuery) || rDesc.includes(searchQuery);
  });

  if (filtered.length === 0) {
    gridEl.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 50px 20px; background: #1a1a1a; border-radius: 12px; border: 1px solid #333;">
        <p style="color: var(--text-muted); font-size: 14px;">'${searchQuery}'에 해당하는 학생이나 역할을 찾을 수 없습니다.</p>
      </div>
    `;
    return;
  }

  gridEl.innerHTML = filtered.map((item, index) => {
    const match = item.student.match(/^(\d+)[\.\s]+(.+)$/);
    const num = match ? match[1] : (index + 1);
    const name = match ? match[2] : item.student;
    const isSwapping = swapSourceIndex === index;
    const animDelay = (index * 0.035).toFixed(3);
    const matchPercentage = 95 + ((index * 3) % 5); // 95% ~ 99% 일치

    return `
      <div class="role-card scale-up-card" style="animation-delay: ${animDelay}s; ${isSwapping ? 'border: 2px solid var(--netflix-red); box-shadow: 0 0 20px rgba(229, 9, 20, 0.6);' : ''}">
        <div class="card-top-banner">
          <div class="student-identity">
            <span class="student-badge-n">N</span>
            <span class="student-no">NO.${num}</span>
            <span class="student-name">${escapeHtml(name)}</span>
          </div>
          <div class="card-actions">
            <button class="btn-icon-mini" title="다른 학생과 역할 맞바꾸기" onclick="toggleSwap(${index})">
              ${isSwapping ? '❌ 취소' : '🔄 맞교환'}
            </button>
          </div>
        </div>

        <div class="card-body-content">
          <div class="role-header-line">
            <div class="match-score">
              <span>●</span> ${matchPercentage}% 일치
            </div>
            <div class="episode-tag">
              EP.${num}
            </div>
          </div>

          <div class="role-title-box">
            <div class="role-icon">${item.role.icon || '⭐'}</div>
            <div class="role-title">${escapeHtml(item.role.title)}</div>
          </div>

          <div class="role-desc">${escapeHtml(item.role.desc)}</div>
        </div>

        <div class="card-footer">
          <span class="netflix-badge">CLASSFLIX ORIGINAL</span>
          <span style="font-weight: 700; color: #46d369;">주연 배정 완료 ★</span>
        </div>
      </div>
    `;
  }).join('');
}

// 목록형 테이블 뷰
function renderTableList() {
  const tableContainer = document.getElementById('roleTableContainer');
  const tableBody = document.getElementById('roleTableBody');
  if (!tableBody || !tableContainer) return;

  if (currentView !== 'table' || assignments.length === 0) {
    tableContainer.style.display = 'none';
    return;
  }

  tableContainer.style.display = 'block';
  tableBody.innerHTML = assignments.map((item, index) => {
    return `
      <tr>
        <td style="font-weight: 800; color: var(--netflix-red); width: 60px;">${index + 1}</td>
        <td style="font-weight: 800; width: 140px; color: #ffffff;">${escapeHtml(item.student)}</td>
        <td style="font-weight: 800; color: #ffffff; width: 180px;">
          <span style="font-size: 16px; margin-right: 6px;">${item.role.icon}</span>${escapeHtml(item.role.title)}
        </td>
        <td style="color: var(--text-muted); font-size: 13px;">${escapeHtml(item.role.desc)}</td>
        <td style="text-align: right; width: 90px;">
          <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 12px;" onclick="toggleSwap(${index})">
            맞교환
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 인쇄 전용 2열 A4 표 (토너 절약을 위해 화이트/블랙 고대비)
function renderPrintTable() {
  const printTableBody = document.getElementById('printRoleTableBody');
  const printDateEl = document.getElementById('printCurrentDate');
  const printTitleEl = document.getElementById('printClassTitle');
  const classTitleInput = document.getElementById('classTitleInput');

  if (printTitleEl && classTitleInput) {
    printTitleEl.textContent = classTitleInput.value || 'CLASSFLIX 우리 반 1인 1역할 편성표';
  }

  if (printDateEl) {
    const today = new Date();
    printDateEl.textContent = `편성일: ${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  }

  if (!printTableBody) return;

  const rows = [];
  const total = assignments.length;

  for (let i = 0; i < total; i++) {
    const item = assignments[i];
    rows.push(`
      <tr>
        <td class="center" style="width: 38px; font-weight: bold;">${i + 1}</td>
        <td class="center" style="width: 80px; font-weight: bold;">${escapeHtml(item.student.replace(/^\d+[\.\s]+/, ''))}</td>
        <td class="role-name" style="width: 130px;">${item.role.icon} ${escapeHtml(item.role.title)}</td>
        <td style="font-size: 9pt;">${escapeHtml(item.role.desc)}</td>
        <td class="center" style="width: 50px; color: #777;">[ 확인 ]</td>
      </tr>
    `);
  }

  printTableBody.innerHTML = rows.join('');
}

// 역할 맞교환
function toggleSwap(index) {
  if (swapSourceIndex === null) {
    swapSourceIndex = index;
    showToast(`🔄 [${assignments[index].student}] 학생을 선택했습니다. 역할을 맞바꿀 다른 카드를 클릭하세요.`);
    renderApp();
  } else if (swapSourceIndex === index) {
    swapSourceIndex = null;
    showToast("교환을 취소했습니다.");
    renderApp();
  } else {
    const student1 = assignments[swapSourceIndex].student;
    const student2 = assignments[index].student;

    const tempRole = assignments[swapSourceIndex].role;
    assignments[swapSourceIndex].role = assignments[index].role;
    assignments[index].role = tempRole;

    swapSourceIndex = null;
    localStorage.setItem('class_assignments', JSON.stringify(assignments));
    renderApp();
    showToast(`🎬 [${student1}] ↔ [${student2}] 캐스팅이 서로 맞교환되었습니다!`);
  }
}

function setViewMode(mode) {
  currentView = mode;
  document.getElementById('viewCardBtn')?.classList.toggle('active', mode === 'card');
  document.getElementById('viewTableBtn')?.classList.toggle('active', mode === 'table');

  const gridEl = document.getElementById('roleGrid');
  const tableEl = document.getElementById('roleTableContainer');

  if (mode === 'card') {
    if (gridEl) gridEl.style.display = 'grid';
    if (tableEl) tableEl.style.display = 'none';
  } else {
    if (gridEl) gridEl.style.display = 'none';
    if (tableEl) tableEl.style.display = 'block';
  }
  renderApp();
}

function triggerPrint() {
  if (assignments.length === 0) {
    if (confirm("아직 역할 배정이 되지 않았습니다. 지금 바로 배정하고 인쇄하시겠습니까?")) {
      assignRoles();
    } else {
      return;
    }
  }
  renderPrintTable();
  window.print();
}

// 8. 명단 및 역할 관리
function openEditorModal() {
  const modal = document.getElementById('editorModal');
  const studentsArea = document.getElementById('editorStudents');
  const rolesArea = document.getElementById('editorRoles');

  if (studentsArea) {
    studentsArea.value = students.join('\n');
  }
  if (rolesArea) {
    rolesArea.value = roles.map(r => `${r.icon || '⭐'} | ${r.title} | ${r.desc || ''}`).join('\n');
  }

  updateEditorCountCheck();
  modal?.classList.add('open');
}

function updateEditorCountCheck() {
  const studentsArea = document.getElementById('editorStudents');
  const rolesArea = document.getElementById('editorRoles');
  const banner = document.getElementById('countCheckBanner');

  if (!studentsArea || !rolesArea || !banner) return;

  const sCount = studentsArea.value.split('\n').filter(s => s.trim()).length;
  const rCount = rolesArea.value.split('\n').filter(r => r.trim()).length;

  if (sCount === rCount) {
    banner.className = 'count-check-banner matched';
    banner.innerHTML = `<span>✔️ 인원 수 일치!</span> <span>학생 ${sCount}명 = 역할 ${rCount}개</span>`;
  } else {
    banner.className = 'count-check-banner mismatch';
    banner.innerHTML = `<span>⚠️ 인원 수 차이: 학생 ${sCount}명, 역할 ${rCount}개 (${Math.abs(sCount - rCount)}개 차이)</span>`;
  }
}

function saveEditorChanges() {
  const studentsArea = document.getElementById('editorStudents');
  const rolesArea = document.getElementById('editorRoles');

  const newStudents = studentsArea.value
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);

  const newRoles = rolesArea.value
    .split('\n')
    .map(line => {
      const parts = line.split('|').map(p => p.trim());
      if (parts.length >= 2) {
        return {
          icon: parts[0] || '⭐',
          title: parts[1] || '학급 도우미',
          desc: parts[2] || ''
        };
      }
      return null;
    })
    .filter(Boolean);

  if (newStudents.length === 0 || newRoles.length === 0) {
    alert("학생 이름과 역할을 최소 1개 이상 입력해주세요.");
    return;
  }

  students = newStudents;
  roles = newRoles;
  localStorage.setItem('class_students', JSON.stringify(students));
  localStorage.setItem('class_roles', JSON.stringify(roles));

  closeModal('editorModal');
  showToast(`💾 캐스팅 명단 저장 완료: 학생 ${students.length}명, 역할 ${roles.length}개`);
  renderApp();
}

function resetToDefault() {
  if (confirm("기본 26명 학생과 26개 넷플릭스 스타일 역할로 초기화하시겠습니까?")) {
    students = [...DEFAULT_STUDENTS];
    roles = JSON.parse(JSON.stringify(DEFAULT_ROLES));
    localStorage.setItem('class_students', JSON.stringify(students));
    localStorage.setItem('class_roles', JSON.stringify(roles));
    openEditorModal();
    renderApp();
    showToast("초기 예시 데이터(26명/26개 역할)로 복원되었습니다.");
  }
}

// 9. 구글 스프레드시트 (Apps Script & GViz JSONP) 연동 모달 기능
function openSheetModal(mode) {
  const modal = document.getElementById('sheetModal');
  const urlInput = document.getElementById('appsScriptUrl');
  const savedUrl = localStorage.getItem('google_apps_script_url') || '';
  if (urlInput) urlInput.value = savedUrl;

  const modeBadge = document.getElementById('sheetModalMode');
  if (modeBadge) {
    modeBadge.textContent = mode === 'load' ? '🔄 시트에서 불러오기 준비' : '💾 시트에 결과 저장 준비';
  }

  const logEl = document.getElementById('sheetStatusLog');
  if (logEl) {
    logEl.style.display = 'none';
    logEl.innerHTML = '';
  }

  modal?.classList.add('open');
}

function saveAppsScriptUrl() {
  const urlInput = document.getElementById('appsScriptUrl');
  const url = (urlInput?.value || '').trim();
  localStorage.setItem('google_apps_script_url', url);
  showToast("🔗 Google 스프레드시트 주소가 저장되었습니다.");
}

// 모달 탭 전환 함수 (누락되었던 핵심 UI 함수)
function switchSheetTab(tabKey) {
  const tabs = ['link', 'paste', 'guide'];
  tabs.forEach(t => {
    const btn = document.getElementById('tabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
    const pane = document.getElementById('tabPane' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) btn.classList.toggle('active', t === tabKey);
    if (pane) {
      if (t === tabKey) {
        pane.classList.add('active');
        pane.style.display = 'flex';
      } else {
        pane.classList.remove('active');
        pane.style.display = 'none';
      }
    }
  });
}

/**
 * 🌟 구글 시트 GViz JSONP 로더 (CORS 제약 100% 완전 우회)
 * <script> 태그를 동적으로 생성하여 구글 Visualization API를 호출하므로
 * 브라우저 CORS 헤더 검사나 학교 방화벽 프록시 차단 없이 순수하게 동작합니다.
 */
function loadViaGvizJsonp(spreadsheetId, gid, sheetName) {
  return new Promise((resolve, reject) => {
    const callbackName = 'gvizCb_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
    const script = document.createElement('script');

    let gvizUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json;responseHandler:${callbackName}`;
    if (gid) {
      gvizUrl += `&gid=${gid}`;
    }
    if (sheetName) {
      gvizUrl += `&sheet=${encodeURIComponent(sheetName)}`;
    }

    let isHandled = false;

    // A. responseHandler 콜백 리스너
    window[callbackName] = function(data) {
      if (isHandled) return;
      isHandled = true;
      cleanup();

      if (!data) {
        reject(new Error("구글 시트에서 응답 데이터가 전달되지 않았습니다."));
        return;
      }
      if (data.status === 'error') {
        const errObj = (data.errors && data.errors[0]) || {};
        reject({
          isGvizError: true,
          reason: errObj.reason || 'error',
          message: errObj.detailed_message || errObj.message || '시트 접근 권한 오류'
        });
        return;
      }
      if (!data.table) {
        reject(new Error("시트에서 테이블 구조를 찾을 수 없습니다."));
        return;
      }
      resolve(data.table);
    };

    // B. Google Visualization 기본 핸들러(setResponse) 호환 대비
    window.google = window.google || {};
    window.google.visualization = window.google.visualization || {};
    window.google.visualization.Query = window.google.visualization.Query || {};
    const originalSetResponse = window.google.visualization.Query.setResponse;
    window.google.visualization.Query.setResponse = function(data) {
      if (window[callbackName] && !isHandled) {
        window[callbackName](data);
      }
      if (typeof originalSetResponse === 'function') {
        originalSetResponse(data);
      }
    };

    script.onerror = function(err) {
      if (isHandled) return;
      isHandled = true;
      cleanup();
      reject(new Error("구글 시트 스크립트 로드 실패 (권한 제한 또는 비공개 시트)"));
    };

    function cleanup() {
      delete window[callbackName];
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }

    const timer = setTimeout(() => {
      if (isHandled) return;
      isHandled = true;
      cleanup();
      reject(new Error("구글 시트 응답 시간 초과 (10초)"));
    }, 10000);

    document.head.appendChild(script);
  });
}

/**
 * GViz Table 객체를 2차원 배열로 변환 후 통합 파서로 전달
 */
function processGvizTable(table, sourceName = "구글 스프레드시트") {
  if (!table) return false;
  const grid = [];

  // 컬럼 헤더 라벨 검사
  if (table.cols && table.cols.some(c => c && c.label && c.label.trim())) {
    grid.push(table.cols.map(c => (c && c.label) ? String(c.label).trim() : ''));
  }

  // 행(row) 순회
  if (table.rows && Array.isArray(table.rows)) {
    table.rows.forEach(r => {
      if (!r || !r.c) return;
      const rowVals = r.c.map(cell => {
        if (!cell) return '';
        if (cell.f !== undefined && cell.f !== null) return String(cell.f).trim();
        if (cell.v !== undefined && cell.v !== null) return String(cell.v).trim();
        return '';
      });
      if (rowVals.some(v => v.length > 0)) {
        grid.push(rowVals);
      }
    });
  }

  return processGridData(grid, sourceName);
}

/**
 * 텍스트(TSV, CSV, 복사 붙여넣기 내용)를 2차원 행렬(grid)로 변환
 */
function processSheetTextData(text, sourceName = "스프레드시트") {
  if (!text || !text.trim()) {
    alert("데이터가 비어 있습니다.");
    return false;
  }

  const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (rawLines.length === 0) {
    alert("읽을 수 있는 데이터 행이 없습니다.");
    return false;
  }

  const grid = [];
  rawLines.forEach(line => {
    let cols = [];
    if (line.includes('\t')) {
      // 탭(스프레드시트 셀 복사 기본 형식)
      cols = line.split('\t').map(c => c.trim().replace(/^["']|["']$/g, ''));
    } else if (line.includes(',')) {
      // CSV 파서 (따옴표 내 쉼표 보존)
      const parsed = [];
      const regex = /(?:,|\n|^)("(?:(?:"")*[^"]*)*"|[^",\n]*|(?:\n|$))/g;
      let match;
      while ((match = regex.exec(line)) !== null) {
        let val = match[1];
        if (val === undefined) break;
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.slice(1, -1).replace(/""/g, '"');
        }
        parsed.push(val.trim());
        if (regex.lastIndex >= line.length) break;
      }
      cols = parsed.length > 0 ? parsed : line.split(',').map(c => c.trim());
    } else {
      cols = [line.trim()];
    }

    if (cols.some(c => c.length > 0)) {
      grid.push(cols);
    }
  });

  return processGridData(grid, sourceName);
}

/**
 * 🎯 지능형 시트 데이터 파서 (초등학교 학급 명부 및 역할 표 형식 자동 분석)
 * - 번호 열, 이름 열, 역할 열, 설명 열 자동 식별
 * - 헤더 유무 자동 판별 및 번호-이름 자동 결합 (예: 1 + 강민우 -> 1. 강민우)
 * - 이모지 자동 보존 및 추출
 */
function processGridData(grid, sourceName = "스프레드시트") {
  if (!grid || grid.length === 0) {
    alert("읽을 수 있는 데이터가 없습니다.");
    return false;
  }

  let startIndex = 0;
  let numCol = -1;
  let nameCol = -1;
  let roleCol = -1;
  let descCol = -1;

  const header = grid[0].map(h => (h || '').trim());
  const headerStr = header.join(' ');
  const isHeaderRow = /이름|성명|학생|번호|순번|No|no|역할|1인1역|1인 1역|직책|담당|활동|설명|Name|Student|Role|Desc/i.test(headerStr);

  if (isHeaderRow) {
    startIndex = 1;
    header.forEach((h, idx) => {
      if (numCol === -1 && /^(번호|순번|no|num|#)$/i.test(h)) numCol = idx;
      else if (nameCol === -1 && /이름|성명|학생|name|student/i.test(h)) nameCol = idx;
      else if (roleCol === -1 && /역할|1인1역|1인 1역|직책|담당|role/i.test(h)) roleCol = idx;
      else if (descCol === -1 && /설명|활동|내용|업무|desc/i.test(h)) descCol = idx;
    });
  }

  // 헤더 매칭이 안 된 경우, 첫 데이터 행 검사로 자동 판별
  if (nameCol === -1) {
    const sampleRow = grid[startIndex] || grid[0];
    if (sampleRow && sampleRow.length >= 2 && /^\d+$/.test(sampleRow[0])) {
      numCol = 0;
      nameCol = 1;
    } else {
      nameCol = 0;
    }
  }

  if (roleCol === -1) {
    if (nameCol === 0) {
      if (grid[0].length >= 2) roleCol = 1;
      if (grid[0].length >= 3) descCol = 2;
    } else if (nameCol === 1) {
      if (grid[0].length >= 3) roleCol = 2;
      if (grid[0].length >= 4) descCol = 3;
    }
  }

  const newStudents = [];
  const newRoles = [];

  for (let i = startIndex; i < grid.length; i++) {
    const row = grid[i];
    if (!row || row.length === 0) continue;

    let studentName = (nameCol !== -1 && row[nameCol]) ? row[nameCol].trim() : '';
    const numVal = (numCol !== -1 && row[numCol]) ? row[numCol].trim() : '';
    const roleTitle = (roleCol !== -1 && row[roleCol]) ? row[roleCol].trim() : '';
    const roleDesc = (descCol !== -1 && row[descCol]) ? row[descCol].trim() : '';

    if (studentName) {
      // 번호가 분리되어 있으면 "1. 강민우" 형태로 결합
      if (numVal && /^\d+$/.test(numVal) && !/^\d+[\.\s]/.test(studentName)) {
        studentName = `${numVal}. ${studentName}`;
      }
      newStudents.push(studentName);
    }

    if (roleTitle) {
      // 역할명에 이모지가 있으면 분리
      const emojiMatch = roleTitle.match(/^(\p{Extended_Pictographic}|\p{Emoji_Presentation})\s*(.*)$/u);
      let icon = "⭐";
      let cleanTitle = roleTitle;
      if (emojiMatch) {
        icon = emojiMatch[1];
        cleanTitle = emojiMatch[2].trim() || roleTitle;
      }
      newRoles.push({
        icon: icon,
        title: cleanTitle,
        desc: roleDesc || "우리 반을 위한 소중한 역할이에요."
      });
    }
  }

  if (newStudents.length === 0 && newRoles.length === 0) {
    alert("학생 또는 역할 데이터를 인식하지 못했습니다.\n시트의 열 구성을 확인해 주세요.");
    return false;
  }

  if (newStudents.length > 0) {
    students = newStudents;
    localStorage.setItem('class_students', JSON.stringify(students));
  }
  if (newRoles.length > 0) {
    roles = newRoles;
    localStorage.setItem('class_roles', JSON.stringify(roles));
  }

  closeModal('sheetModal');
  showToast(`🎉 [${sourceName}]에서 학생 ${newStudents.length}명, 역할 ${newRoles.length > 0 ? newRoles.length + '개' : '기존 유지'} 성공적으로 불러왔습니다!`);

  if (soundEnabled) {
    playNetflixTudum();
  }

  renderApp();
  return true;
}

// 1. 클립보드에서 원클릭으로 읽어오기 (가장 확실하고 간편한 1초 불러오기)
async function readFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    if (!text || !text.trim()) {
      alert("클립보드가 비어 있습니다.\n\n구글 스프레드시트에서 학생 명단 셀을 마우스로 드래그하여 복사(Ctrl+C)한 후 다시 이 버튼을 눌러주세요!");
      return;
    }
    processSheetTextData(text, "클립보드 복사 내용");
  } catch (err) {
    console.warn("Clipboard read permission prompt/fallback:", err);
    switchSheetTab('paste');
    const pasteArea = document.getElementById('pasteSheetData');
    pasteArea?.focus();
    showToast("📋 아래 [시트 복사·붙여넣기] 칸에 Ctrl+V로 붙여넣고 [적용하기]를 눌러주세요!");
  }
}

// 2. CSV / 엑셀 다운로드 파일 열기 (FileReader 이용으로 100% 로컬 동작)
function handleFileInput(e) {
  const file = e.target.files && e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const content = event.target.result;
    processSheetTextData(content, file.name);
  };
  reader.onerror = function() {
    alert("파일을 읽는 중 오류가 발생했습니다.");
  };
  reader.readAsText(file, 'utf-8');
  e.target.value = '';
}

// 3. 스프레드시트 텍스트 직접 붙여넣기 적용
function loadFromPastedData() {
  const pasteArea = document.getElementById('pasteSheetData');
  const text = (pasteArea?.value || '').trim();
  if (!text) {
    alert("스프레드시트에서 복사한 내용을 붙여넣어 주세요.");
    return;
  }
  processSheetTextData(text, "붙여넣은 시트 텍스트");
}

/**
 * 4. 스마트 구글 스프레드시트 불러오기 실행 엔진
 * 1단계: GViz JSONP (CORS 에러 없는 직접 스크립트 주입)
 * 2단계: 다중 CORS 프록시 우회
 * 3단계: 친절한 권한 진단 안내 및 1초 클립보드 원클릭 대안 제공
 */
async function executeSheetLoad() {
  let url = (document.getElementById('appsScriptUrl')?.value || '').trim();
  const logEl = document.getElementById('sheetStatusLog');

  if (!url) {
    alert("구글 스프레드시트 공유 링크 또는 Apps Script 웹 앱 URL을 입력해 주세요.");
    return;
  }

  // 따옴표나 공백 정리
  url = url.replace(/^["']|["']$/g, '').trim();

  saveAppsScriptUrl();
  showToast("⏳ 스프레드시트 데이터 불러오는 중...");

  if (logEl) {
    logEl.style.display = 'block';
    logEl.innerHTML = `<span style="color: #60a5fa;">⏳ 스프레드시트 안전 연결 중... (GViz Direct Engine)</span>`;
  }

  // ----------------------------------------------------
  // CASE A: 구글 스프레드시트 웹에 게시 링크 (/pub?output=csv 등)
  // ----------------------------------------------------
  if (url.includes('/pub') || url.includes('/pubhtml')) {
    let csvUrl = url;
    if (url.includes('/pubhtml')) {
      csvUrl = url.replace(/\/pubhtml([?#].*)?$/, '/pub?output=csv');
    } else if (!url.includes('output=csv')) {
      csvUrl += (url.includes('?') ? '&' : '?') + 'output=csv';
    }

    try {
      const res = await fetch(csvUrl);
      if (res.ok) {
        const text = await res.text();
        if (text && !text.includes('<!DOCTYPE html>')) {
          if (processSheetTextData(text, "웹에 게시된 스프레드시트")) {
            if (logEl) logEl.style.display = 'none';
            return;
          }
        }
      }
    } catch (e) {
      console.warn("Direct pub csv fetch failed, trying proxy", e);
    }
  }

  // ----------------------------------------------------
  // CASE B: 구글 스프레드시트 일반 링크 또는 ID
  // (https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/...)
  // ----------------------------------------------------
  const sheetMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const isDirectId = !url.includes('/') && /^[a-zA-Z0-9-_]{30,60}$/.test(url);
  const spreadsheetId = sheetMatch ? sheetMatch[1] : (isDirectId ? url : null);

  if (spreadsheetId && spreadsheetId !== 'e') {
    const gidMatch = url.match(/[#&?]gid=([0-9]+)/);
    const gid = gidMatch ? gidMatch[1] : '';

    const sheetNameMatch = url.match(/[#&?]sheet=([^&]+)/);
    const sheetName = sheetNameMatch ? decodeURIComponent(sheetNameMatch[1]) : '';

    // [1단계] GViz JSONP 시도 (CORS 없이 스크립트 태그로 직접 수신)
    try {
      if (logEl) {
        logEl.innerHTML = `<span style="color: #60a5fa;">⏳ GViz 엔진으로 시트 데이터를 수신하고 있습니다...</span>`;
      }
      const table = await loadViaGvizJsonp(spreadsheetId, gid, sheetName);
      if (table && table.rows && table.rows.length > 0) {
        const ok = processGvizTable(table, "구글 스프레드시트");
        if (ok) {
          if (logEl) logEl.style.display = 'none';
          return;
        }
      }
    } catch (gvizErr) {
      console.warn("GViz JSONP failed, reason:", gvizErr);
    }

    // [2단계] 다중 프록시를 통한 CSV 다운로드 우회 시도
    const gidParam = gid ? `&gid=${gid}` : '';
    const endpoints = [
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv${gidParam}`,
      `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv${gidParam}`
    ];

    const proxyBuilders = [
      (ep) => `https://corsproxy.io/?url=${encodeURIComponent(ep)}`,
      (ep) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(ep)}`,
      (ep) => `https://api.allorigins.win/raw?url=${encodeURIComponent(ep)}`
    ];

    for (const ep of endpoints) {
      for (const buildProxy of proxyBuilders) {
        try {
          const proxyUrl = buildProxy(ep);
          const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(5000) });
          if (res.ok) {
            const csvText = await res.text();
            if (csvText && csvText.trim().length > 0 && !csvText.includes('<!DOCTYPE html>') && !csvText.includes('accounts.google.com')) {
              const ok = processSheetTextData(csvText, "구글 스프레드시트 (안전 우회)");
              if (ok) {
                if (logEl) logEl.style.display = 'none';
                return;
              }
            }
          }
        } catch (proxyErr) {
          // 다음 프록시 시도
        }
      }
    }

    // [3단계] 구글에서 접근이 최종 차단된 경우: 친절한 원인 진단과 1초 원클릭 대안 제공
    if (logEl) {
      logEl.style.display = 'block';
      logEl.innerHTML = `
        <div style="background: rgba(229, 9, 20, 0.12); border: 1px solid #e50914; border-radius: 6px; padding: 14px;">
          <div style="color: #ff4d58; font-weight: 800; font-size: 13.5px; margin-bottom: 8px;">
            ⚠️ 구글 시트 접근 제한 안내 (권한 점검)
          </div>
          <div style="font-size: 12px; color: #e5e5e5; line-height: 1.6; margin-bottom: 12px;">
            <strong>구글 스프레드시트 [공유] 설정을 확인해 주세요:</strong><br />
            1. 시트 우측 상단 <strong>[공유]</strong> 버튼을 누릅니다.<br />
            2. [일반 액세스]가 <strong>'왕선초등학교(내 학교)'가 아니라 '링크가 있는 모든 사용자' (역할: 뷰어)</strong>로 되어 있어야 외부 웹 브라우저에서 읽을 수 있습니다.<br />
            <span style="color: #fca5a5;">(※ 학교/교육청 구글 계정은 기본값이 '학교 소속 사용자만'으로 잠겨 있을 수 있습니다)</span>
          </div>

          <div style="background: #181818; border: 1px dashed #555555; border-radius: 6px; padding: 12px;">
            <div style="font-size: 12px; font-weight: 800; color: #46d369; margin-bottom: 4px;">
              💡 권한 설정 바꾸기 번거로우신가요? 1초 초간단 해결법:
            </div>
            <div style="font-size: 11.5px; color: #cccccc; margin-bottom: 8px;">
              구글 시트에서 명단 셀을 마우스로 쭉 드래그하여 <strong>Ctrl+C (복사)</strong>하신 후 아래 버튼을 누르면 권한 설정 없이 즉시 1초 만에 불러옵니다!
            </div>
            <button type="button" class="btn btn-primary" style="width: 100%; justify-content: center; font-size: 12.5px; padding: 8px;" onclick="readFromClipboard()">
              📋 클립보드에서 1초 만에 바로 불러오기
            </button>
          </div>
        </div>
      `;
    }
    return;
  }

  // ----------------------------------------------------
  // CASE C: Google Apps Script Web App URL (script.google.com)
  // ----------------------------------------------------
  let scriptUrl = url;
  if (scriptUrl.endsWith('/dev')) {
    scriptUrl = scriptUrl.replace(/\/dev$/, '/exec');
  }

  let loadedData = null;

  // 1차 시도: Apps Script JSONP
  try {
    loadedData = await loadViaJsonp(scriptUrl);
  } catch (jsonpErr) {
    console.warn("Apps Script JSONP failed:", jsonpErr);
  }

  // 2차 시도: Direct fetch
  if (!loadedData) {
    try {
      const res = await fetch(scriptUrl, {
        method: 'GET',
        mode: 'cors',
        redirect: 'follow',
        signal: AbortSignal.timeout(6000)
      });
      if (res.ok) {
        loadedData = await res.json();
      }
    } catch (fetchErr) {
      console.warn("Apps Script direct fetch failed:", fetchErr);
    }
  }

  // 3차 시도: 프록시 우회
  if (!loadedData) {
    const proxies = [
      `https://corsproxy.io/?url=${encodeURIComponent(scriptUrl)}`,
      `https://api.allorigins.win/raw?url=${encodeURIComponent(scriptUrl)}`
    ];
    for (const p of proxies) {
      try {
        const res = await fetch(p, { signal: AbortSignal.timeout(6000) });
        if (res.ok) {
          loadedData = await res.json();
          if (loadedData) break;
        }
      } catch (err) {}
    }
  }

  if (loadedData) {
    if (loadedData.students && Array.isArray(loadedData.students)) {
      students = loadedData.students;
      localStorage.setItem('class_students', JSON.stringify(students));
    }
    if (loadedData.roles && Array.isArray(loadedData.roles)) {
      roles = loadedData.roles;
      localStorage.setItem('class_roles', JSON.stringify(roles));
    }

    closeModal('sheetModal');
    showToast(`✅ Apps Script 연동 성공! 학생 ${students.length}명, 역할 ${roles.length}개를 불러왔습니다.`);
    if (soundEnabled) playNetflixTudum();
    renderApp();
    if (logEl) logEl.style.display = 'none';
    return;
  }

  // Apps Script 모든 시도 실패
  if (logEl) {
    logEl.style.display = 'block';
    logEl.innerHTML = `
      <div style="background: rgba(229, 9, 20, 0.12); border: 1px solid #e50914; border-radius: 6px; padding: 14px;">
        <div style="color: #ff4d58; font-weight: 800; font-size: 13.5px; margin-bottom: 8px;">
          ⚠️ Apps Script 웹 앱 호출 실패 안내
        </div>
        <div style="font-size: 12px; color: #e5e5e5; line-height: 1.6; margin-bottom: 12px;">
          <strong>Apps Script [새 배포] 설정을 확인해 주세요:</strong><br />
          - 다음 사용자로 실행: <strong>나 (Me)</strong><br />
          - 액세스 권한: <strong>모든 사용자 (Anyone)</strong><br />
          - 주소 끝부분: 반드시 <strong>/exec</strong> 여야 합니다 (/dev는 외부 호출 차단됨)
        </div>
        <button type="button" class="btn btn-primary" style="width: 100%; justify-content: center; font-size: 12.5px; padding: 8px;" onclick="readFromClipboard()">
          📋 시트에서 복사(Ctrl+C) 후 클립보드로 바로 불러오기
        </button>
      </div>
    `;
  }
}

// Apps Script 전용 JSONP 헬퍼 함수
function loadViaJsonp(url) {
  return new Promise((resolve, reject) => {
    const callbackName = 'appsScriptJsonp_' + Date.now();
    const script = document.createElement('script');
    const sep = url.includes('?') ? '&' : '?';
    script.src = `${url}${sep}callback=${callbackName}`;

    window[callbackName] = function(data) {
      delete window[callbackName];
      if (document.body.contains(script)) document.body.removeChild(script);
      resolve(data);
    };

    script.onerror = function() {
      delete window[callbackName];
      if (document.body.contains(script)) document.body.removeChild(script);
      reject(new Error("JSONP load failed"));
    };

    setTimeout(() => {
      if (window[callbackName]) {
        delete window[callbackName];
        if (document.body.contains(script)) document.body.removeChild(script);
        reject(new Error("JSONP timeout"));
      }
    }, 7000);

    document.body.appendChild(script);
  });
}

// 5. 스프레드시트에 결과 저장 (no-cors 전송)
async function executeSheetSave() {
  if (assignments.length === 0) {
    alert("저장할 배정 결과가 없습니다. 먼저 [▶ 역할 배정하기]를 진행해 주세요.");
    return;
  }

  let url = (document.getElementById('appsScriptUrl')?.value || '').trim();
  const classTitle = document.getElementById('classTitleInput')?.value || 'CLASSFLIX 우리 반 1인 1역할';

  if (!url) {
    if (confirm("저장할 Apps Script 웹 앱 URL이 입력되지 않았습니다.\n대신 클립보드에 표 형식으로 복사하여 구글 시트에 바로 Ctrl+V 하시겠습니까?")) {
      copyToClipboardTable();
    }
    return;
  }

  if (url.includes('docs.google.com/spreadsheets/d/')) {
    alert(
      "입력하신 주소는 스프레드시트 링크입니다. 브라우저가 시트에 직접 저장하려면 Apps Script 웹 앱 URL이 필요합니다.\n\n대신 지금 바로 [📋 표 복사] 버튼을 누른 뒤 구글 시트에서 Ctrl+V 하시면 표 형태로 완벽히 붙여넣어집니다!"
    );
    copyToClipboardTable();
    return;
  }

  if (url.endsWith('/dev')) {
    url = url.replace(/\/dev$/, '/exec');
  }

  saveAppsScriptUrl();
  showToast("⏳ 스프레드시트에 결과를 전송하는 중...");

  try {
    const payload = JSON.stringify({
      title: classTitle,
      date: new Date().toISOString(),
      assignments: assignments.map((a, i) => ({
        index: i + 1,
        student: a.student,
        role: a.role.title,
        icon: a.role.icon,
        desc: a.role.desc
      }))
    });

    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: payload
    });

    closeModal('sheetModal');
    showToast("🎉 스프레드시트에 배정 결과 저장 요청을 보냈습니다!");

  } catch (err) {
    console.error(err);
    alert("스프레드시트 전송 중 오류가 발생했습니다.\n\n대신 하단의 [📋 표 복사] 버튼을 누르시면 구글 시트에 Ctrl+V로 즉시 붙여넣을 수 있습니다!");
  }
}

function copyToClipboardTable() {
  if (assignments.length === 0) {
    showToast("복사할 배정 결과가 없습니다.");
    return;
  }

  const header = "번호\t학생 이름\t담당 역할\t역할 설명\n";
  const rows = assignments.map((item, idx) => {
    return `${idx + 1}\t${item.student}\t${item.role.icon} ${item.role.title}\t${item.role.desc}`;
  }).join('\n');

  navigator.clipboard.writeText(header + rows).then(() => {
    showToast("📋 스프레드시트용 표가 클립보드에 복사되었습니다! 시트에서 Ctrl+V 하세요.");
  }).catch(() => {
    alert("클립보드 접근 권한이 없습니다.");
  });
}

function downloadCSV() {
  if (assignments.length === 0) {
    showToast("다운로드할 배정 결과가 없습니다.");
    return;
  }

  const bom = "\uFEFF";
  let csv = bom + "번호,학생 이름,담당 역할,역할 설명\n";

  assignments.forEach((item, idx) => {
    const sName = `"${item.student.replace(/"/g, '""')}"`;
    const rTitle = `"${(item.role.icon + ' ' + item.role.title).replace(/"/g, '""')}"`;
    const rDesc = `"${item.role.desc.replace(/"/g, '""')}"`;
    csv += `${idx + 1},${sName},${rTitle},${rDesc}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `우리반_CLASSFLIX_1인1역할_배정결과_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("📥 CSV 파일이 성공적으로 다운로드되었습니다.");
}

function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  localStorage.setItem('class_sound', soundEnabled);
  const btn = document.getElementById('soundToggleBtn');
  if (btn) {
    btn.innerHTML = soundEnabled ? '🔔 두둥 사운드 켜짐' : '🔕 사운드 꺼짐';
  }
  showToast(soundEnabled ? "넷플릭스 '두둥' 효과음이 켜졌습니다." : "효과음이 꺼졌습니다.");
}

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 10. 넷플릭스 시네마틱 레드 & 실버 스파크 효과 (Canvas)
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#e50914', '#f40612', '#ffffff', '#e5e5e5', '#ff4d58', '#b81d24'];

  for (let i = 0; i < 95; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height * 0.45,
      w: Math.random() * 8 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.72) * 18,
      gravity: 0.35,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let animationFrame;
  let start = performance.now();

  function update(now) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.vRot;
      p.opacity -= 0.009;

      if (p.opacity > 0) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(p.opacity, 0);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });

    if (active && (now - start < 3000)) {
      animationFrame = requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  cancelAnimationFrame(animationFrame);
  animationFrame = requestAnimationFrame(update);
}

// 11. 초기화 실행
window.addEventListener('DOMContentLoaded', () => {
  const classInput = document.getElementById('classTitleInput');
  if (classInput) {
    const savedTitle = localStorage.getItem('class_title');
    if (savedTitle) classInput.value = savedTitle;
    classInput.addEventListener('input', (e) => {
      localStorage.setItem('class_title', e.target.value);
      renderPrintTable();
    });
  }

  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderCardGrid();
    });
  }

  document.getElementById('editorStudents')?.addEventListener('input', updateEditorCountCheck);
  document.getElementById('editorRoles')?.addEventListener('input', updateEditorCountCheck);

  window.addEventListener('resize', () => {
    const canvas = document.getElementById('confettiCanvas');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });

  const soundBtn = document.getElementById('soundToggleBtn');
  if (soundBtn) {
    soundBtn.innerHTML = soundEnabled ? '🔔 두둥 사운드 켜짐' : '🔕 사운드 꺼짐';
  }

  renderApp();
});
