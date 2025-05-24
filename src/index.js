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



const DID = "7506797301241120274";
let VIDEO = "7477537590149713170";

async function view(video) {
    try {
        const version = [247, 312, 322, 357, 358, 415, 422, 444, 466][Math.floor(Math.random() * 9)];
        const device = ["SM-G9900", "sm-g950f", "SM-A136U1", "SM-M225FV", "SM-E426B", "SM-M526BR", "SM-M326B", "SM-A528B", "SM-F711B", "SM-F926B", "SM-A037G", "SM-A225F", "SM-M325FV", "SM-A226B", "SM-M426B", "SM-A525F"][Math.floor(Math.random() * 16)];
        const host = ["api16.tiktokv.com", "api.tiktokv.com", "api19.tiktokv.com", "api21.tiktokv.com"][Math.floor(Math.random() * 4)];

        const params = querystring.stringify({
            app_language: "fr",
            iid: "",
            device_id: DID,
            channel: "googleplay",
            device_type: device,
            ac: "wifi",
            os_version: Math.floor(Math.random() * (11 - 5 + 1)) + 5, // Random từ 5-11
            version_code: version,
            app_name: "trill",
            device_brand: "samsung",
            ssmix: "a",
            device_platform: "android",
            aid: 1180,
            as: "a1iosdfgh", // creds to @auut for params bypass
            cp: "androide1",
        });

        const data = `&manifest_version_code=${version}&update_version_code=${version}0&play_delta=1&item_id=${video}&version_code=${version}&aweme_type=0`;

        const response = await axios.post(
            `https://api21.tiktokv.com/aweme/v1/aweme/stats?app_language=fr&iid=&device_id=7506797301241120274&channel=googleplay&device_type=SM-F711B&ac=wifi&os_version=7&version_code=357&app_name=trill&device_brand=samsung&ssmix=a&device_platform=android&aid=1180&as=a1iosdfgh&cp=androide1`,
            data,
            {
                headers: {
                    "host": "api21.tiktokv.com",
                    "connection": "keep-alive",
                    "accept-encoding": "gzip",
                    "x-ss-req-ticket": Math.floor(Date.now() / 1000).toString(),
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "user-agent": `com.ss.android.ugc.trill/${version} (Linux; U; Android 11; fr_FR; ${device}; Build/RP1A.200720.012; Cronet/58.0.2991.0)`
                },
            }
        );

        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        console.log(
            `${`[${timestamp}]`} ` +
            `${'[VIEW]'} ` +
            `${`==> send +1 view to ${VIDEO}`}`
        );
        return {
            timestap : timestamp,
            type : "buff view",
            count : 1,
            message : "buff success + 1 view",
        }
    } catch (error) {
        console.log(error)
        // Bỏ qua lỗi, tương tự Python
    }
}

// Route để xem video
app.get('/videos/:videoName', async (req, res) => {
    const videoName = await req.params.videoName;
    const buffed = await view(videoName)

    return res.status(200).json(buffed)
});

// Khởi động server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
