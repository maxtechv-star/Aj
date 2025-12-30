document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const themeToggle = document.getElementById('themeToggle');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const urlInput = document.getElementById('urlInput');
    const fetchBtn = document.getElementById('fetchBtn');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const resultsSection = document.getElementById('resultsSection');
    const videoThumbnail = document.getElementById('videoThumbnail');
    const videoPlayer = document.getElementById('videoPlayer');
    const videoSource = document.getElementById('videoSource');
    const playOverlay = document.getElementById('playOverlay');
    const videoTitle = document.getElementById('videoTitle');
    const statsContainer = document.getElementById('statsContainer');
    const authorAvatar = document.getElementById('authorAvatar');
    const authorName = document.getElementById('authorName');
    const authorUsername = document.getElementById('authorUsername');
    const musicTitle = document.getElementById('musicTitle');
    const musicAuthor = document.getElementById('musicAuthor');
    const createDate = document.getElementById('createDate');
    const videoDownloadBtn = document.getElementById('videoDownloadBtn');
    const audioDownloadBtn = document.getElementById('audioDownloadBtn');

    // Theme Toggle
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });

    // Sidebar Toggle
    function loadSidebar() {
        const sidebarHTML = `
            <div class="sidebar-header">
                <div class="sidebar-logo">
                    <i class="fas fa-download"></i>
                    <h2>AJ MEDIA DOWNLOADER</h2>
                </div>
                <button class="sidebar-close" id="sidebarClose">
                    <i class="fas fa-times"></i>
                </button>
                <p style="color: var(--text-secondary); font-size: 14px;">Developers Information</p>
            </div>
            
            <div class="developers-section">
                <h3 class="section-title">
                    <i class="fas fa-code"></i>
                    <span>Developers</span>
                </h3>
                
                <div class="developer-card">
                    <div class="developer-content">
                        <img src="https://github.com/Itzpatron.png" alt="AJ Abudal" class="developer-avatar">
                        <div class="developer-info">
                            <h3>AJ Abudal</h3>
                            <span class="developer-role">Frontend Developer</span>
                            <div class="developer-social">
                                <a href="https://github.com/Itzpatron" target="_blank" class="social-link">
                                    <i class="fab fa-github"></i> GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="developer-card">
                    <div class="developer-content">
                        <img src="https://github.com/VeronDev.png" alt="Uthuman" class="developer-avatar">
                        <div class="developer-info">
                            <h3>Uthuman</h3>
                            <span class="developer-role">Backend Developer</span>
                            <div class="developer-social">
                                <a href="https://github.com/VeronDev" target="_blank" class="social-link">
                                    <i class="fab fa-github"></i> GitHub
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="developers-section">
                <h3 class="section-title">
                    <i class="fas fa-info-circle"></i>
                    <span>About</span>
                </h3>
                <div style="color: var(--text-secondary); font-size: 14px; line-height: 1.6;">
                    <p>AJ MEDIA DOWNLOADER is a free tool that allows you to download TikTok videos without watermark.</p>
                    <p style="margin-top: 15px;">API Powered by: <strong>@VeronDev</strong></p>
                    <p style="margin-top: 15px; font-size: 12px; color: var(--text-light);">
                        Note: This tool is for educational purposes. Always respect content creators' rights.
                    </p>
                </div>
            </div>
        `;
        
        sidebar.innerHTML = sidebarHTML;
        
        // Add close button event listener
        const sidebarClose = document.getElementById('sidebarClose');
        if (sidebarClose) {
            sidebarClose.addEventListener('click', closeSidebar);
        }
    }

    function toggleSidebar() {
        sidebar.classList.toggle('active');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    sidebarToggle.addEventListener('click', toggleSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);

    // Video Play Toggle
    playOverlay.addEventListener('click', () => {
        videoThumbnail.style.display = 'none';
        playOverlay.style.display = 'none';
        videoPlayer.style.display = 'block';
        videoPlayer.play();
    });

    // TikTok API Integration
    function isValidTikTokUrl(url) {
        const tiktokPatterns = [
            /https?:\/\/(www\.|vm\.)?tiktok\.com\/[@#\w\d\.\-]+\/video\/\d+/i,
            /https?:\/\/(www\.|vm\.)?tiktok\.com\/t\/[\w\d]+/i,
            /https?:\/\/vt\.tiktok\.com\/[\w\d]+/i,
            /https?:\/\/vm\.tiktok\.com\/[\w\d]+/i
        ];
        return tiktokPatterns.some(pattern => pattern.test(url));
    }

    async function fetchTikTokData() {
        const url = urlInput.value.trim();
        
        if (!url) {
            showError("Please enter a TikTok URL");
            return;
        }
        
        if (!isValidTikTokUrl(url)) {
            showError("Please enter a valid TikTok URL. Example: https://vm.tiktok.com/ZSHKoXJsb6rmS-QB4FY/");
            return;
        }
        
        // Show loading, hide results and error
        loadingSpinner.classList.add('active');
        resultsSection.classList.remove('active');
        errorMessage.classList.remove('active');
        
        try {
            // Encode the URL
            const encodedUrl = encodeURIComponent(url);
            const apiUrl = `https://veron-apis.zone.id/downloader/tiktok?url=${encodedUrl}`;
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                displayTikTokData(data);
            } else {
                throw new Error("Failed to fetch TikTok data. The API returned an error.");
            }
        } catch (error) {
            console.error('Error fetching TikTok data:', error);
            showError(`Failed to fetch TikTok data: ${error.message}. Please try again.`);
        } finally {
            loadingSpinner.classList.remove('active');
        }
    }

    function displayTikTokData(data) {
        const result = data.result;
        
        // Set video information
        videoTitle.textContent = result.title || "No title available";
        
        // Set video thumbnail and source
        if (result.cover) {
            videoThumbnail.src = result.cover;
            videoThumbnail.style.display = 'block';
        }
        
        if (result.videoUrl) {
            videoSource.src = result.videoUrl;
            videoPlayer.load();
        }
        
        // Reset video player display
        playOverlay.style.display = 'flex';
        videoPlayer.style.display = 'none';
        
        // Set stats
        const stats = result.stats || {};
        statsContainer.innerHTML = `
            <div class="stat">
                <i class="fas fa-play"></i>
                <span class="stat-value">${stats.play || "0"}</span>
                <span class="stat-label">Plays</span>
            </div>
            <div class="stat">
                <i class="fas fa-heart"></i>
                <span class="stat-value">${stats.like || "0"}</span>
                <span class="stat-label">Likes</span>
            </div>
            <div class="stat">
                <i class="fas fa-comment"></i>
                <span class="stat-value">${stats.comment || "0"}</span>
                <span class="stat-label">Comments</span>
            </div>
            <div class="stat">
                <i class="fas fa-share"></i>
                <span class="stat-value">${stats.share || "0"}</span>
                <span class="stat-label">Shares</span>
            </div>
        `;
        
        // Set author info
        const author = result.author || {};
        if (author.avatar) {
            authorAvatar.src = author.avatar;
        }
        authorName.textContent = author.name || "Unknown";
        authorUsername.textContent = author.username || "@unknown";
        
        // Set music info
        const music = result.music_info || {};
        musicTitle.textContent = music.title || "No music information";
        musicAuthor.textContent = music.author || "Unknown artist";
        
        // Set creation date
        createDate.textContent = result.create_at || "Unknown date";
        
        // Set download links
        if (result.videoUrl) {
            videoDownloadBtn.href = result.videoUrl;
            videoDownloadBtn.download = `tiktok_video_${Date.now()}.mp4`;
        }
        
        if (result.musicUrl) {
            audioDownloadBtn.href = result.musicUrl;
            audioDownloadBtn.download = `tiktok_audio_${Date.now()}.mp3`;
        }
        
        // Show results section
        resultsSection.classList.add('active');
        
        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.add('active');
        
        // Hide error after 5 seconds
        setTimeout(() => {
            errorMessage.classList.remove('active');
        }, 5000);
    }

    // Event Listeners
    fetchBtn.addEventListener('click', fetchTikTokData);
    
    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            fetchTikTokData();
        }
    });

    // Example URL for testing
    urlInput.value = "https://vm.tiktok.com/ZSHKoXJsb6rmS-QB4FY/";

    // Initialize
    initTheme();
    loadSidebar();

    // Add click handlers for download buttons to show success message
    videoDownloadBtn.addEventListener('click', (e) => {
        if (!videoDownloadBtn.href || videoDownloadBtn.href === '#') {
            e.preventDefault();
            showError("Video URL not available. Please fetch the video first.");
        }
    });

    audioDownloadBtn.addEventListener('click', (e) => {
        if (!audioDownloadBtn.href || audioDownloadBtn.href === '#') {
            e.preventDefault();
            showError("Audio URL not available. Please fetch the video first.");
        }
    });

    // Add some sample stats animation for demo
    function animateStats() {
        const stats = document.querySelectorAll('.stat');
        stats.forEach((stat, index) => {
            setTimeout(() => {
                stat.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    stat.style.transform = 'scale(1)';
                }, 300);
            }, index * 100);
        });
    }

    // Expose fetchTikTokData for testing
    window.fetchTikTokData = fetchTikTokData;
    window.animateStats = animateStats;
});