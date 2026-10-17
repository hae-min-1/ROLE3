/**
 * 🌿 지브리 감성 숲속 마을 1인 1역할 배정기 (Class 1-Person 1-Role Matcher)
 * 역할 랜덤 매칭, 동물 파트너, A4 인쇄, 구글 스프레드시트 연동 준비 로직
 */

// 1. 기본 세팅 예시 데이터 (학생 26명 & 숲속 동물 짝꿍 역할 26개)
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
  { icon: "🦝", animal: "너구리 반장", title: "칠판 도우미", desc: "물걸레로 칠판을 닦아 맑은 밤하늘처럼 깨끗하게 만들어요." },
  { icon: "🐻", animal: "숲속 아기곰", title: "우유·급식 도우미", desc: "친구들이 차례차례 급식 줄을 서도록 든든하게 안내해요." },
  { icon: "🦉", animal: "지혜의 부엉이", title: "에너지 지킴이", desc: "쉬는 시간과 이동 수업 때 전등과 냉난방기 전원을 살펴요." },
  { icon: "🕊️", animal: "산들바람 아기새", title: "창문 환기 대장", desc: "솔솔 불어오는 맑은 숲바람이 교실에 통하게 환기해요." },
  { icon: "🐿️", animal: "다람쥐 사서", title: "도서 정리 요정", desc: "도토리 모으듯 학급문고 책을 번호순으로 반듯하게 꽂아요." },
  { icon: "🦔", animal: "꼼꼼이 고슴도치", title: "게시판 관리관", desc: "가정통신문과 친구들의 멋진 그림 작품을 구김 없이 정돈해요." },
  { icon: "🐰", animal: "깡충이 토끼", title: "신발장 정리왕", desc: "실내화와 운동화가 가지런히 줄 맞춰 쉴 수 있게 도와줘요." },
  { icon: "🦫", animal: "부지런한 비버", title: "분리수거 대장", desc: "종이, 플라스틱, 캔이 알맞은 곳에 가도록 도와줘요." },
  { icon: "🦦", animal: "깔끔이 수달", title: "청소도구 관리사", desc: "빗자루와 쓰레받기, 걸레를 걸이대에 나란히 모아둬요." },
  { icon: "🦌", animal: "숲속 아기사슴", title: "식물 사랑이", desc: "화분 친구들에게 촉촉하게 물을 주고 따스한 햇빛을 쬐어줘요." },
  { icon: "🦊", animal: "총명한 아기여우", title: "컴퓨터·TV 도우미", desc: "수업용 전자칠판과 TV, 무선 마우스 충전 상태를 챙겨요." },
  { icon: "🐶", animal: "다정 멍멍이", title: "보건·체온 지킴이", desc: "구급함을 점검하고 아픈 친구 손을 잡고 보건실에 가요." },
  { icon: "🐒", animal: "날쌘돌이 원숭이", title: "체육 기구 반장", desc: "체육 시간 축구공과 줄넘기를 챙겨 나가고 바르게 반납해요." },
  { icon: "🐓", animal: "아침 알림 닭", title: "시간 알리미", desc: "수업 종이 울리면 친구들에게 바른 착석을 부드럽게 알려요." },
  { icon: "🐱", animal: "살금살금 고양이", title: "출석부 도우미", desc: "아침 출석부를 단정히 챙겨 선생님께 공손히 전달해요." },
  { icon: "🐹", animal: "볼빵빵 햄스터", title: "알림장 도우미", desc: "칠판 알림장을 또박또박 확인하고 친구들의 필기를 도와줘요." },
  { icon: "🐢", animal: "차분한 거북이", title: "책상 줄 지킴이", desc: "모둠 책상과 의자 줄이 반듯한 직선이 되도록 맞춰요." },
  { icon: "🐸", animal: "촉촉 개구리", title: "우산꽂이 도우미", desc: "비나 눈이 오는 날 우산이 엉키지 않게 가지런히 꽂아둬요." },
  { icon: "🦡", animal: "눈썰미 오소리", title: "분실물 지킴이", desc: "바닥에 떨어진 연필과 지우개를 분실물 바구니에 모아요." },
  { icon: "🐦", animal: "노래하는 파랑새", title: "음악 DJ 요정", desc: "아침 자습과 청소 시간에 활기찬 지브리 숲속 음악을 틀어요." },
  { icon: "🐝", animal: "붕붕이 꿀벌", title: "인쇄물 배부관", desc: "학습지와 안내장을 모둠별로 꽃가루 나르듯 빠르게 나눠줘요." },
  { icon: "🐧", animal: "마음 따뜻 펭귄", title: "칭찬 배달부", desc: "친구들의 따뜻한 칭찬 쪽지와 칭찬 스티커 판을 가꿔요." },
  { icon: "🦭", animal: "보송보송 물개", title: "손소독 도우미", desc: "손 소독제와 핸드타월을 챙기고 비누 손씻기를 격려해요." },
  { icon: "🐨", animal: "포근한 코알라", title: "사물함 점검관", desc: "사물함 문이 꼭 닫히고 위에 짐이 없도록 단정히 살펴줘요." },
  { icon: "🐼", animal: "듬직한 판다", title: "안전 지킴이", desc: "복도와 계단에서 사뿐사뿐 걷도록 친구들을 지켜줘요." },
  { icon: "🦁", animal: "용기 있는 사자", title: "행복 이끎이", desc: "선생님을 돕고 모둠 토의 시간을 따뜻하게 이끌어요." }
];

// 2. 애플리케이션 상태 (State)
let students = JSON.parse(localStorage.getItem('class_students')) || [...DEFAULT_STUDENTS];
// 기본 역할에 동물 데이터가 누락되어 있을 경우 DEFAULT_ROLES로 자동 보정
let roles = JSON.parse(localStorage.getItem('class_roles')) || JSON.parse(JSON.stringify(DEFAULT_ROLES));
if (!roles[0] || !roles[0].animal) {
  roles = JSON.parse(JSON.stringify(DEFAULT_ROLES));
  localStorage.setItem('class_roles', JSON.stringify(roles));
}

let assignments = JSON.parse(localStorage.getItem('class_assignments')) || [];
let currentView = 'card'; // 'card' | 'table'
let soundEnabled = localStorage.getItem('class_sound') !== 'false';
let swapSourceIndex = null;

// 지브리 오르골 풍 사운드 효과 (Web Audio API)
const playChimeSound = () => {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    // E4, G4, B4, E5, G5 (따뜻한 오르골/카림바 아르페지오)
    const notes = [329.63, 392.00, 493.88, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const startTime = ctx.currentTime + idx * 0.09;
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.55);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
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

  // 역할 복사 및 셔플
  const shuffledRoles = [...roles];
  for (let i = shuffledRoles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledRoles[i], shuffledRoles[j]] = [shuffledRoles[j], shuffledRoles[i]];
  }

  // 1:1 매칭
  const newAssignments = [];
  const count = Math.min(students.length, shuffledRoles.length);

  for (let i = 0; i < count; i++) {
    newAssignments.push({
      student: students[i],
      role: shuffledRoles[i]
    });
  }

  // 만약 학생 수가 역할보다 많으면 나머지 학생은 '숲속 자율 협력 도우미' 배정
  if (students.length > shuffledRoles.length) {
    for (let i = count; i < students.length; i++) {
      newAssignments.push({
        student: students[i],
        role: { icon: "🐾", animal: "숲속 나그네", title: "자율 협력 도우미", desc: "친구들의 역할을 함께 거들고 돕는 든든한 숲속 수호천사예요." }
      });
    }
  }

  assignments = newAssignments;
  localStorage.setItem('class_assignments', JSON.stringify(assignments));

  playChimeSound();
  launchConfetti();
  renderApp();
  showToast(`🍃 숲속 동물 짝꿍 26명의 1인 1역할이 배정되었습니다!`);
}

// 4. 화면 렌더링 함수
function renderApp() {
  updateStatusSummary();
  renderCardGrid();
  renderTableList();
  renderPrintTable();
}

// 상태 뱃지 업데이트
function updateStatusSummary() {
  const countEl = document.getElementById('statusSummary');
  const studentCount = students.length;
  const roleCount = roles.length;
  const assignedCount = assignments.length;

  if (countEl) {
    if (assignedCount > 0) {
      countEl.innerHTML = `
        <span class="status-badge matched">
          <span>🌿</span> 배정 완료: ${assignedCount}명 (${studentCount}명 기준)
        </span>
      `;
    } else {
      countEl.innerHTML = `
        <span class="status-badge">
          <span>📋</span> 학생 ${studentCount}명 · 숲속 역할 ${roleCount}개 (배정 대기중)
        </span>
      `;
    }
  }
}

// 카드 그리드 렌더링
function renderCardGrid() {
  const gridEl = document.getElementById('roleGrid');
  const searchQuery = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  if (!gridEl) return;

  if (assignments.length === 0) {
    gridEl.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #fcfaf5; border-radius: 20px; border: 2px dashed #d5c8b2;">
        <div style="font-size: 52px; margin-bottom: 12px;">🌿 🐾 🌰</div>
        <h3 style="font-family: var(--font-title); font-size: 22px; color: var(--forest-deep); margin-bottom: 8px;">
          숲속 마을 1인 1역할 배정소에 오신 것을 환영합니다
        </h3>
        <p style="color: var(--text-muted); font-size: 14px; margin-bottom: 22px;">
          상단의 <strong>[🎲 숲속 역할 배정하기]</strong> 버튼을 누르면 26마리 동물 친구들과 함께 신나게 역할을 맡게 돼요!
        </p>
        <button class="btn btn-primary" onclick="assignRoles()">지금 배정하기 🍃</button>
      </div>
    `;
    return;
  }

  // 검색 필터 적용
  const filtered = assignments.filter((item, idx) => {
    if (!searchQuery) return true;
    const sName = (item.student || '').toLowerCase();
    const rTitle = (item.role?.title || '').toLowerCase();
    const rDesc = (item.role?.desc || '').toLowerCase();
    const rAnimal = (item.role?.animal || '').toLowerCase();
    return sName.includes(searchQuery) || rTitle.includes(searchQuery) || rDesc.includes(searchQuery) || rAnimal.includes(searchQuery);
  });

  if (filtered.length === 0) {
    gridEl.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; background: white; border-radius: 14px; border: 1.5px solid #e7dfd0;">
        <p style="color: var(--text-muted); font-size: 14px;">'${searchQuery}'에 해당하는 학생이나 동물 역할을 찾을 수 없습니다.</p>
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
    const animalName = item.role.animal || '숲속 친구';

    return `
      <div class="role-card scale-up-card" style="animation-delay: ${animDelay}s; ${isSwapping ? 'border: 2px solid var(--forest-leaf); background: #f0f7f2;' : ''}">
        <div class="card-header">
          <div class="student-identity">
            <span class="student-no">${num}</span>
            <span class="student-name">${escapeHtml(name)}</span>
          </div>
          <div class="card-actions">
            <button class="btn-icon-mini" title="다른 친구와 역할 맞바꾸기" onclick="toggleSwap(${index})">
              ${isSwapping ? '❌ 취소' : '🔄 맞교환'}
            </button>
          </div>
        </div>

        <div class="role-content">
          <div class="role-icon">${item.role.icon || '🐾'}</div>
          <div class="role-info">
            <div class="animal-partner-tag">
              <span>🐾 짝꿍: ${escapeHtml(animalName)}</span>
            </div>
            <div class="role-title">${escapeHtml(item.role.title)}</div>
            <div class="role-desc">${escapeHtml(item.role.desc)}</div>
          </div>
        </div>

        <div class="card-footer">
          <span class="badge-tag">숲속 배움터</span>
          <span style="color: var(--forest-green); font-weight: 700;">도토리 모으듯 성실히 🌰</span>
        </div>
      </div>
    `;
  }).join('');
}

// 테이블 목록 뷰 렌더링
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
        <td style="font-weight: 700; color: var(--wood-dark); width: 60px;">${index + 1}</td>
        <td style="font-weight: 700; width: 140px; color: var(--forest-deep);">${escapeHtml(item.student)}</td>
        <td style="font-weight: 700; color: var(--wood-warm); width: 140px;">
          <span style="font-size: 16px; margin-right: 4px;">${item.role.icon}</span>${escapeHtml(item.role.animal || '')}
        </td>
        <td style="font-weight: 700; color: var(--text-main); width: 160px;">
          ${escapeHtml(item.role.title)}
        </td>
        <td style="color: var(--text-muted); font-size: 13px;">${escapeHtml(item.role.desc)}</td>
        <td style="text-align: right; width: 90px;">
          <button class="btn btn-secondary" style="padding: 4px 10px; font-size: 12px;" onclick="toggleSwap(${index})">
            바꾸기
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// 인쇄 전용 2열 A4 표 렌더링
function renderPrintTable() {
  const printTableBody = document.getElementById('printRoleTableBody');
  const printDateEl = document.getElementById('printCurrentDate');
  const printTitleEl = document.getElementById('printClassTitle');
  const classTitleInput = document.getElementById('classTitleInput');

  if (printTitleEl && classTitleInput) {
    printTitleEl.textContent = classTitleInput.value || '우리 반 숲속 1인 1역할 안내판';
  }

  if (printDateEl) {
    const today = new Date();
    printDateEl.textContent = `배정일: ${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`;
  }

  if (!printTableBody) return;

  const rows = [];
  const total = assignments.length;

  for (let i = 0; i < total; i++) {
    const item = assignments[i];
    rows.push(`
      <tr>
        <td class="center" style="width: 36px; font-weight: bold;">${i + 1}</td>
        <td class="center" style="width: 75px; font-weight: bold;">${escapeHtml(item.student.replace(/^\d+[\.\s]+/, ''))}</td>
        <td class="center" style="width: 100px; font-weight: bold;">${item.role.icon} ${escapeHtml(item.role.animal || '')}</td>
        <td class="role-name" style="width: 120px;">${escapeHtml(item.role.title)}</td>
        <td style="font-size: 9pt;">${escapeHtml(item.role.desc)}</td>
        <td class="center" style="width: 48px; color: #888;">[ 확인 ]</td>
      </tr>
    `);
  }

  printTableBody.innerHTML = rows.join('');
}

// 5. 역할 맞교환 (Swap) 기능
function toggleSwap(index) {
  if (swapSourceIndex === null) {
    swapSourceIndex = index;
    showToast(`🔄 [${assignments[index].student}] 학생의 역할을 선택했습니다. 바꿀 다른 친구 카드를 클릭하세요.`);
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
    showToast(`🍃 [${student1}] ↔ [${student2}] 역할이 서로 교환되었습니다!`);
  }
}

// 6. 뷰 모드 토글
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

// 7. 인쇄하기 함수
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

// 8. 명단 및 역할 관리 모달
function openEditorModal() {
  const modal = document.getElementById('editorModal');
  const studentsArea = document.getElementById('editorStudents');
  const rolesArea = document.getElementById('editorRoles');

  if (studentsArea) {
    studentsArea.value = students.join('\n');
  }
  if (rolesArea) {
    rolesArea.value = roles.map(r => `${r.icon || '🐾'} | ${r.animal || '동물친구'} | ${r.title} | ${r.desc || ''}`).join('\n');
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
      if (parts.length >= 3) {
        return {
          icon: parts[0] || '🐾',
          animal: parts[1] || '숲속 친구',
          title: parts[2] || '학급 도우미',
          desc: parts[3] || ''
        };
      } else if (parts.length === 2) {
        return {
          icon: parts[0] || '🐾',
          animal: '숲속 친구',
          title: parts[1] || '학급 도우미',
          desc: ''
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
  showToast(`💾 숲속 명단 저장 완료: 학생 ${students.length}명, 역할 ${roles.length}개`);
  renderApp();
}

function resetToDefault() {
  if (confirm("기본 26명 학생과 26마리 지브리 숲속 동물 짝꿍 역할로 초기화하시겠습니까?")) {
    students = [...DEFAULT_STUDENTS];
    roles = JSON.parse(JSON.stringify(DEFAULT_ROLES));
    localStorage.setItem('class_students', JSON.stringify(students));
    localStorage.setItem('class_roles', JSON.stringify(roles));
    openEditorModal();
    renderApp();
    showToast("초기 지브리 동물 예시 데이터(26명/26마리)로 복원되었습니다.");
  }
}

// 9. 구글 스프레드시트 (Apps Script) 연동 모달 기능
function openSheetModal(mode) {
  const modal = document.getElementById('sheetModal');
  const urlInput = document.getElementById('appsScriptUrl');
  const savedUrl = localStorage.getItem('google_apps_script_url') || '';
  if (urlInput) urlInput.value = savedUrl;

  const modeBadge = document.getElementById('sheetModalMode');
  if (modeBadge) {
    modeBadge.textContent = mode === 'load' ? '🔄 숲속 시트에서 불러오기 준비' : '💾 시트에 배정 결과 저장 준비';
  }

  modal?.classList.add('open');
}

function saveAppsScriptUrl() {
  const urlInput = document.getElementById('appsScriptUrl');
  const url = (urlInput?.value || '').trim();
  localStorage.setItem('google_apps_script_url', url);
  showToast("🔗 Google Apps Script URL이 브라우저에 저장되었습니다.");
}

async function executeSheetLoad() {
  const url = (document.getElementById('appsScriptUrl')?.value || '').trim();
  if (!url) {
    alert("구글 Apps Script 웹 앱 URL을 입력해 주세요.\n(아직 배포 전이라면 하단의 '표 복사' 또는 'CSV 다운로드'를 활용하실 수 있습니다)");
    return;
  }

  saveAppsScriptUrl();
  showToast("⏳ 구글 스프레드시트에서 데이터를 불러오는 중...");

  try {
    const res = await fetch(url, { method: 'GET', mode: 'cors' });
    const data = await res.json();

    if (data.students && Array.isArray(data.students)) {
      students = data.students;
      localStorage.setItem('class_students', JSON.stringify(students));
    }
    if (data.roles && Array.isArray(data.roles)) {
      roles = data.roles;
      localStorage.setItem('class_roles', JSON.stringify(roles));
    }

    closeModal('sheetModal');
    showToast(`✅ 시트 연동 성공! 학생 ${students.length}명, 역할 ${roles.length}개를 불러왔습니다.`);
    renderApp();
  } catch (err) {
    console.error(err);
    alert("시트 불러오기 중 통신 오류가 발생했습니다.\n\n구글 Apps Script 배포 시 '웹 앱 액세스 권한'이 '모든 사용자(Anyone)'로 설정되어 있는지 확인해 주세요.");
  }
}

async function executeSheetSave() {
  if (assignments.length === 0) {
    alert("저장할 배정 결과가 없습니다. 먼저 [🎲 숲속 역할 배정하기]를 진행해 주세요.");
    return;
  }

  const url = (document.getElementById('appsScriptUrl')?.value || '').trim();
  const classTitle = document.getElementById('classTitleInput')?.value || '우리 반 숲속 1인 1역할';

  if (!url) {
    if (confirm("Google Apps Script URL이 설정되지 않았습니다.\n대신 클립보드에 표 형식으로 복사하여 스프레드시트에 바로 붙여넣으시겠습니까?")) {
      copyToClipboardTable();
    }
    return;
  }

  saveAppsScriptUrl();
  showToast("⏳ 스프레드시트에 결과를 전송하는 중...");

  try {
    const payload = {
      title: classTitle,
      date: new Date().toISOString(),
      assignments: assignments.map((a, i) => ({
        index: i + 1,
        student: a.student,
        animal: a.role.animal,
        role: a.role.title,
        icon: a.role.icon,
        desc: a.role.desc
      }))
    };

    await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    closeModal('sheetModal');
    showToast("🎉 스프레드시트에 성공적으로 배정 결과가 기록되었습니다!");
  } catch (err) {
    console.error(err);
    alert("저장 요청을 보냈습니다. (CORS 보안 설정에 따라 확인 창이 뜰 수 있으며, 시트 기록 여부를 확인하세요).\n\n실패 시 '클립보드 복사' 버튼으로 구글 시트에 바로 Ctrl+V 하실 수 있습니다.");
  }
}

function copyToClipboardTable() {
  if (assignments.length === 0) {
    showToast("복사할 배정 결과가 없습니다.");
    return;
  }

  const header = "번호\t학생 이름\t동물 짝꿍\t담당 역할\t역할 설명\n";
  const rows = assignments.map((item, idx) => {
    return `${idx + 1}\t${item.student}\t${item.role.icon} ${item.role.animal || ''}\t${item.role.title}\t${item.role.desc}`;
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
  let csv = bom + "번호,학생 이름,동물 짝꿍,담당 역할,역할 설명\n";

  assignments.forEach((item, idx) => {
    const sName = `"${item.student.replace(/"/g, '""')}"`;
    const animal = `"${(item.role.icon + ' ' + (item.role.animal || '')).replace(/"/g, '""')}"`;
    const rTitle = `"${item.role.title.replace(/"/g, '""')}"`;
    const rDesc = `"${item.role.desc.replace(/"/g, '""')}"`;
    csv += `${idx + 1},${sName},${animal},${rTitle},${rDesc}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `우리반_숲속_1인1역할_배정결과_${new Date().toISOString().slice(0, 10)}.csv`;
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
    btn.innerHTML = soundEnabled ? '🔔 오르골 켜짐' : '🔕 오르골 꺼짐';
  }
  showToast(soundEnabled ? "숲속 오르골 소리가 켜졌습니다." : "오르골 소리가 꺼졌습니다.");
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

// 10. 지브리 숲속 나뭇잎 & 도토리 꽃가루 효과 (Canvas)
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  // 숲속 풀잎 초록, 황금 도토리빛, 햇살 노랑, 산들바람 하늘색
  const colors = ['#4f8b5c', '#76a035', '#a1cf64', '#e5982e', '#cf7b19', '#fde047', '#38bdf8', '#ebdccc'];

  for (let i = 0; i < 95; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height * 0.45,
      w: Math.random() * 10 + 6,
      h: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 19,
      vy: (Math.random() - 0.72) * 17,
      gravity: 0.32,
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 9,
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
        // 나뭇잎 형태 타원
        ctx.beginPath();
        ctx.ellipse(0, 0, p.w / 2, p.h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
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
    soundBtn.innerHTML = soundEnabled ? '🔔 오르골 켜짐' : '🔕 오르골 꺼짐';
  }

  renderApp();
});
