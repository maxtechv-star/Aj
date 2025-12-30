const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// TikTok API endpoint
app.get('/api/tiktok', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({
      success: false,
      error: 'URL parameter is required'
    });
  }

  if (!url.includes('tiktok.com')) {
    return res.status(400).json({
      success: false,
      error: 'Invalid TikTok URL'
    });
  }

  try {
    const { data } = await axios.get(`https://tikwm.com/api/?url=${encodeURIComponent(url)}`);
    
    if (!data.data) {
      throw new Error('No data received from API');
    }

    const response = {
      success: true,
      result: {
        title: data.data.title,
        cover: data.data.cover,
        create_at: new Date(data.data.create_time * 1000).toLocaleString(),
        stats: {
          play: Number(data.data.play_count).toLocaleString(),
          like: Number(data.data.digg_count).toLocaleString(),
          comment: Number(data.data.comment_count).toLocaleString(),
          share: Number(data.data.share_count).toLocaleString()
        },
        music_info: {
          title: data.data.music_info.title,
          author: data.data.music_info.author
        },
        author: {
          name: data.data.author.nickname,
          username: '@' + data.data.author.unique_id,
          avatar: data.data.author.avatar
        },
        musicUrl: data.data.music,
        videoUrl: data.data.images ? null : data.data.play,
        images: data.data.images || null
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch TikTok data'
    });
  }
});

// Serve the main HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});