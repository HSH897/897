const https = require('https'); 
const fs = require('fs');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// 加载 SSL 证书和私钥
const options = {
    key: fs.readFileSync('C:/Users/897/server.key'), 
    cert: fs.readFileSync('C:/Users/897/server.cert')
};

// 启动 Next.js 应用
app.prepare().then(() => {
    const server = https.createServer(options, (req, res) => {
        handle(req, res);
    });

    server.listen(8443, (err) => {
        if (err) throw err;
        console.log('PWA running on https://localhost:8443');
    });
});
