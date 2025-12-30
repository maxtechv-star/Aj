const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

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

    res.status(200).json(response);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch TikTok data'
    });
  }
};
