const express = require('express');
const cors = require('cors');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

// 1. 【新增】：优先提供前端静态页面。
// 当你访问网页时，这行代码会负责把 index.html 发送给浏览器
app.use(express.static(path.join(__dirname)));

// 2. 【修改】：只把带有 /api 前缀的请求，才转发给火山引擎
app.use(
  '/api',
  createProxyMiddleware({
    target: 'https://openspeech.bytedance.com',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      proxyReq.setHeader('Host', 'openspeech.bytedance.com');
    },
    onProxyRes: (proxyRes, req, res) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    }
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`全栈服务器已启动，端口: ${PORT}`);
});
