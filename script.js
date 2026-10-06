// Enhanced script with Electron integration
const stats = [
  { label: 'Active', value: '09', meta: '+3 today' },
  { label: 'Resume safe', value: '100%', meta: 'Auto recover' },
  { label: 'Avg speed', value: '2.8 MB/s', meta: 'Across all files' },
  { label: 'Auto-processed', value: '15', meta: 'Optimized' }
];

let downloads = [
  {
    id: 1,
    name: 'Summer_Promo_4K.mp4',
    type: 'video',
    size: '1.9 GB',
    progress: 62,
    speed: '2.6 MB/s',
    eta: '00:08:12',
    state: 'Downloading',
    tag: 'resume-ready',
    segments: 90,
    completedSegments: 56,
    fileIcon: '▶'
  },
  {
    id: 2,
    name: 'Podcast_Finale_Studio.mp3',
    type: 'audio',
    size: '240 MB',
    progress: 81,
    speed: '1.1 MB/s',
    eta: '00:03:46',
    state: 'Enhancing',
    tag: 'processing',
    segments: 90,
    completedSegments: 73,
    fileIcon: '♫'
  },
  {
    id: 3,
    name: 'Client_Notes_Draft.txt',
    type: 'text',
    size: '14 MB',
    progress: 97,
    speed: '420 KB/s',
    eta: '00:00:16',
    state: 'Finalizing',
    tag: 'syncing',
    segments: 90,
    completedSegments: 88,
    fileIcon: 'T'
  },
  {
    id: 4,
    name: 'Launch_Sequence.mov',
    type: 'video',
    size: '820 MB',
    progress: 36,
    speed: '1.4 MB/s',
    eta: '00:12:18',
    state: 'Queued',
    tag: 'paused',
    segments: 90,
    completedSegments: 32,
    fileIcon: '●'
  }
];

const processingSteps = [
  { title: 'Video stabilization', detail: 'Frames aligned', status: 'complete' },
  { title: 'Audio mastering', detail: 'Noise reduced', status: 'complete' },
  { title: 'Text normalization', detail: 'Smart formatting', status: 'active' },
  { title: 'Archive packaging', detail: 'Ready for export', status: 'pending' }
];

const statsGrid = document.getElementById('statsGrid');
const downloadList = document.getElementById('downloadList');
const processingList = document.getElementById('processingList');
const segmentGrid = document.getElementById('segmentGrid');

async function initializeApp() {
  if (window.electron && window.electron.app) {
    try {
      const appInfo = await window.electron.app.getInfo();
      document.title = appInfo.name;
      console.log(`Initialized: ${appInfo.name} v${appInfo.version}`);
      
      const savedState = await window.electron.app.loadState();
      if (savedState && savedState.downloads) {
        downloads = savedState.downloads;
      }
    } catch (error) {
      console.log('Desktop features not available, running in web mode.');
    }
  }
  
  render();
}

function renderStats() {
  statsGrid.innerHTML = stats
    .map(
      (item) => `
        <article class="stat-card">
          <span class="label">${item.label}</span>
          <span class="value">${item.value}</span>
          <span class="meta">${item.meta}</span>
        </article>
      `
    )
    .join('');
}

function renderDownloads() {
  downloadList.innerHTML = downloads
    .map((item) => {
      const tagClass =
        item.tag === 'resume-ready'
          ? 'success'
          : item.tag === 'processing'
          ? 'warning'
          : item.tag === 'syncing'
          ? 'warning'
          : '';

      return `
        <article class="download-card">
          <div class="file-line">
            <div class="file-name">
              <div class="file-icon">${item.fileIcon}</div>
              <div class="file-meta">
                <strong>${item.name}</strong>
                <span>${item.size} • ${item.type.toUpperCase()}</span>
              </div>
            </div>
            <div class="file-action">
              <button class="mini-btn" data-action="toggle" data-id="${item.id}">
                ${item.state === 'Queued' ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>

          <div class="progress-block">
            <div class="progress-header">
              <span>${item.state}</span>
              <span>${item.progress}%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${item.progress}%"></div>
            </div>
          </div>

          <div class="details-row">
            <span>${item.speed}</span>
            <span>ETA ${item.eta}</span>
            <span class="tag ${tagClass}">${item.tag.replace('-', ' ')}</span>
          </div>
        </article>
      `;
    })
    .join('');

  document.querySelectorAll('[data-action="toggle"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const id = Number(event.currentTarget.dataset.id);
      const target = downloads.find((entry) => entry.id === id);
      if (!target) return;

      if (target.state === 'Queued') {
        target.state = 'Downloading';
        target.tag = 'resume-ready';
      } else {
        target.state = 'Queued';
        target.tag = 'paused';
      }

      render();
      saveState();
    });
  });
}

function renderProcessing() {
  processingList.innerHTML = processingSteps
    .map(
      (step) => `
        <li class="processing-item">
          <div>
            <strong>${step.title}</strong>
            <span>${step.detail}</span>
          </div>
          <div class="processing-status ${step.status}">
            ${step.status === 'complete' ? '✓ Ready' : step.status === 'active' ? '⟳ Active' : '⊙ Queued'}
          </div>
        </li>
      `
    )
    .join('');
}

function renderSegments() {
  const cells = Array.from({ length: 90 }, (_, index) => {
    let className = 'segment-cell';
    if (index < 56) className += ' active';
    if (index < 74) className += ' done';
    return `<div class="${className}" title="Segment ${index + 1}"></div>`;
  });

  segmentGrid.innerHTML = cells.join('');
}

function render() {
  renderStats();
  renderDownloads();
  renderProcessing();
  renderSegments();
}

async function saveState() {
  if (window.electron && window.electron.app) {
    try {
      await window.electron.app.saveState({ downloads });
    } catch (error) {
      console.log('State save skipped (web mode)');
    }
  } else {
    localStorage.setItem('adelAdlyDownloads', JSON.stringify(downloads));
  }
}

window.addEventListener('beforeunload', () => {
  saveState();
});

setInterval(() => {
  downloads.forEach((item) => {
    if (item.state === 'Downloading' || item.state === 'Enhancing') {
      item.progress = Math.min(item.progress + 2, 100);
      item.completedSegments = Math.min(item.completedSegments + 2, item.segments);
      if (item.progress >= 100) {
        item.state = 'Completed';
        item.tag = 'resume-ready';
      }
    }

    if (item.state === 'Finalizing') {
      item.progress = Math.min(item.progress + 1, 100);
    }
  });

  if (downloads.some((item) => item.state === 'Downloading' || item.state === 'Enhancing')) {
    render();
  }
}, 2600);

// Initialize app
initializeApp();

console.log('✓ Adel Adly Salama Download Manager loaded');
console.log('✓ Universal Windows support enabled');
console.log('✓ No activation key required - Fully unlocked');
