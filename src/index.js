const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

class workers {
    constructor(url, filePath) {
        this.url = url
        this.filePath = filePath
    }
    // Hàm tải video từ URL và lưu vào server
    async downloadVideo() {
        const writer = fs.createWriteStream(this.filePath);

        const response = await axios({
            url: this.url,
            method: 'GET',
            responseType: 'stream', // Dữ liệu trả về là stream
        });

        // Pipe stream của response vào file
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    }
}

// API upload video từ URL
app.post('/upload-from-url', async (req, res) => {
    const videoUrl = req.query.url; // Lấy URL video từ query parameter
    const name = req.query.filename
    if (!videoUrl && !name) {
        return res.status(400).send('Missing video URL');
    }

    // const fileName = `video_${Date.now()}.mp4`; // Tạo tên file
    const fileName = `quan_${name}.mp4`; // Tạo tên file
    const filePath = path.join(__dirname, 'uploads', fileName); // Đường dẫn lưu video

    try {
        // Tải video và lưu vào thư mục uploads
        await new workers(videoUrl, filePath).downloadVideo();

        // Trả về URL hoặc thông tin video
        res.status(200).send({
            message: 'Video uploaded successfully',
            videoUrl: `/videos/${fileName}`,
        });

        // Lập lịch xóa video sau 5 phút (300000 ms)
        setTimeout(() => {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting video:', err);
                } else {
                    console.log(`Video ${fileName} deleted after 1 minutes`);
                }
            });
        }, 60000); // 5 phút (300,000 ms)

    } catch (err) {
        console.error('Error downloading video:', err);
        res.status(500).send('Error downloading video');
    }
});

// Route để xem video
app.get('/videos/:videoName', (req, res) => {
    const videoName = req.params.videoName;
    const videoPath = path.join(__dirname, 'uploads', videoName);

    // Kiểm tra nếu file video tồn tại
    fs.exists(videoPath, (exists) => {
        if (!exists) {
            return res.status(404).send('Video not found');
        }

        // Gửi video tới client
        res.sendFile(videoPath);
    });
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
