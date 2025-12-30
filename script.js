// Client-side logic with proxy + fallback support and clearer error handling

const fetchBtn = document.getElementById('fetchBtn');
const tiktokUrlInput = document.getElementById('tiktokUrl');
const resultEl = document.getElementById('result');
const coverEl = document.getElementById('cover');
const titleEl = document.getElementById('title');
const authorAvatarEl = document.getElementById('authorAvatar');
const authorNameEl = document.getElementById('authorName');
const authorUsernameEl = document.getElementById('authorUsername');
const playEl = document.getElementById('play');
const likeEl = document.getElementById('like');
const commentEl = document.getElementById('comment');
const shareEl = document.getElementById('share');
const createAtEl = document.getElementById('create_at');
const downloadVideo = document.getElementById('downloadVideo');
const downloadAudio = document.getElementById('downloadAudio');
const openVideo = document.getElementById('openVideo');
const errorEl = document.getElementById('error');
const hintEl = document.getElementById('hint');

const devToggle = document.getElementById('devToggle');
const devList = document.getElementById('devList');
devToggle.addEventListener('click', () => devList.classList.toggle('hidden'));

function showError(msg){
  errorEl.textContent = msg;
  errorEl.classList.remove('hidden');
}
function clearError(){
  errorEl.textContent = '';
  errorEl.classList.add('hidden');
}

function markDisabled(el, disabled = true){
  if (!el) return;
  if (disabled) {
    el.classList.add('disabled');
    if (el.tagName === 'BUTTON') el.disabled = true;
    else el.removeAttribute('href');
  } else {
    el.classList.remove('disabled');
    if (el.tagName === 'BUTTON') el.disabled = false;
  }
}

async function tryFetchProxy(fullUrl) {
  // try the same-origin serverless proxy first
  const proxy = `/api/tiktok?url=${encodeURIComponent(fullUrl)}`;
  try {
    const res = await fetch(proxy, { cache: 'no-cache' });
    if (!res.ok) {
      // if 404/500, return an object to signal failure with status
      const txt = await res.text().catch(()=>null);
      throw new Error(`Proxy error ${res.status}: ${txt || res.statusText}`);
    }
    const j = await res.json();
    return j;
  } catch (err) {
    // bubble up the error to allow fallback
    throw err;
  }
}

async function tryFetchDirect(fullUrl) {
  // direct call to upstream (may be blocked by CORS)
  const upstream = `https://veron-apis.zone.id/downloader/tiktok?url=${encodeURIComponent(fullUrl)}`;
  const res = await fetch(upstream, { mode: 'cors', cache: 'no-cache' });
  if (!res.ok) {
    const txt = await res.text().catch(()=>null);
    throw new Error(`Upstream error ${res.status}: ${txt || res.statusText}`);
  }
  return await res.json();
}

async function fetchTikTok(url) {
  clearError();
  resultEl.classList.add('hidden');
  titleEl.textContent = 'Loading...';
  // disable buttons while loading
  markDisabled(downloadVideo, true);
  markDisabled(downloadAudio, true);
  openVideo.disabled = true;

  try {
    let json;
    // prefer proxy (works on Vercel). If it fails (no /api deployed), try direct (may be CORS blocked).
    try {
      json = await tryFetchProxy(url);
    } catch (proxyErr) {
      console.warn('Proxy fetch failed, trying direct upstream:', proxyErr);
      // show a friendly note, then try direct
      showError('Proxy not available — attempting direct fetch (may be blocked by CORS).');
      json = await tryFetchDirect(url);
      // clear the previous error if direct succeeded
      clearError();
    }

    if (!json || !json.success || !json.result) {
      throw new Error('No result returned from API');
    }

    const r = json.result;
    // populate UI
    coverEl.src = r.cover || '';
    titleEl.textContent = r.title || 'No title';
    authorAvatarEl.src = (r.author && r.author.avatar) || '';
    authorNameEl.textContent = (r.author && r.author.name) || '';
    authorUsernameEl.textContent = (r.author && r.author.username) || '';
    playEl.textContent = r.stats?.play || '-';
    likeEl.textContent = r.stats?.like || '-';
    commentEl.textContent = r.stats?.comment || '-';
    shareEl.textContent = r.stats?.share || '-';
    createAtEl.textContent = r.create_at || '';

    // Download links
    const safeTitle = (r.title || 'tiktok').replace(/[^\w\s\-]/g,'').slice(0,60).replace(/\s+/g,'_');
    if (r.videoUrl) {
      downloadVideo.href = r.videoUrl;
      // Download attribute sometimes ignored for cross-origin URLs; still set it.
      downloadVideo.setAttribute('download', `${safeTitle}.mp4`);
      markDisabled(downloadVideo, false);
      openVideo.onclick = () => window.open(r.videoUrl, '_blank', 'noopener');
      openVideo.disabled = false;
    } else {
      markDisabled(downloadVideo, true);
      openVideo.disabled = true;
    }
    if (r.musicUrl) {
      downloadAudio.href = r.musicUrl;
      downloadAudio.setAttribute('download', `${safeTitle}.mp3`);
      markDisabled(downloadAudio, false);
    } else {
      markDisabled(downloadAudio, true);
    }

    resultEl.classList.remove('hidden');
  } catch (err) {
    titleEl.textContent = '';
    showError(err.message || 'Unknown error');
  } finally {
    // nothing
  }
}

fetchBtn.addEventListener('click', () => {
  const url = (tiktokUrlInput.value || '').trim();
  if (!url) {
    showError('Please paste a TikTok URL first.');
    return;
  }
  fetchTikTok(url);
});

// allow pressing enter
tiktokUrlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    fetchBtn.click();
  }
});

// small UX: prefill example on first load
if (!tiktokUrlInput.value) {
  tiktokUrlInput.value = 'https://vm.tiktok.com/...';
  hintEl.style.display = 'block';
}