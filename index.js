const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// 1. 允许所有跨域请求
app.use(cors());

// 2. 配置代理中间件，将请求转发给火山引擎
app.use(
  '/',
  createProxyMiddleware({
    target: 'https://openspeech.bytedance.com',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      // 保证 Host 头是火山引擎的
      proxyReq.setHeader('Host', 'openspeech.bytedance.com');
    },
    onProxyRes: (proxyRes, req, res) => {
      // 保证返回时允许跨域
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
    onError: (err, req, res) => {
      console.error('代理发生错误:', err);
      res.status(500).send('代理服务器错误');
    }
  })
);

// Zeabur 默认通过 PORT 环境变量提供端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TTS 代理服务器已在端口 ${PORT} 启动`);
});
