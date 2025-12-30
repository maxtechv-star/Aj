// Client-side logic
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

function showError(msg){
  errorEl.textContent = msg;
  errorEl.classList.remove('hidden');
}
function clearError(){
  errorEl.textContent = '';
  errorEl.classList.add('hidden');
}

async function fetchTikTok(url){
  clearError();
  resultEl.classList.add('hidden');
  titleEl.textContent = 'Loading...';
  try{
    // Call the serverless proxy on the same origin (recommended for Vercel)
    const apiUrl = `/api/tiktok?url=${encodeURIComponent(url)}`;
    const res = await fetch(apiUrl);
    if (!res.ok) {
      const txt = await res.text().catch(()=>null);
      throw new Error(`API error: ${res.status} ${txt || ''}`);
    }
    const json = await res.json();
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
      downloadVideo.download = `${safeTitle}.mp4`;
      downloadVideo.classList.remove('disabled');
      openVideo.onclick = ()=> window.open(r.videoUrl, '_blank', 'noopener');
    } else {
      downloadVideo.removeAttribute('href');
      downloadVideo.classList.add('disabled');
    }
    if (r.musicUrl) {
      // Many music URLs are already audio_mpeg; provide link and try to set download filename
      downloadAudio.href = r.musicUrl;
      downloadAudio.download = `${safeTitle}.mp3`;
      downloadAudio.classList.remove('disabled');
    } else {
      downloadAudio.removeAttribute('href');
      downloadAudio.classList.add('disabled');
    }

    resultEl.classList.remove('hidden');
  }catch(err){
    titleEl.textContent = '';
    showError(err.message || 'Unknown error');
  }
}

fetchBtn.addEventListener('click', ()=>{
  const url = (tiktokUrlInput.value || '').trim();
  if (!url) {
    showError('Please paste a TikTok URL first.');
    return;
  }
  fetchTikTok(url);
});

// allow pressing enter
tiktokUrlInput.addEventListener('keydown', (e)=>{
  if (e.key === 'Enter') {
    fetchBtn.click();
  }
});

// small UX: prefill example on first load
if (!tiktokUrlInput.value) {
  tiktokUrlInput.value = 'https://vm.tiktok.com/...';
  hintEl.style.display = 'block';
}