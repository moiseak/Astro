// 缓存版本号，当需要更新缓存时修改此版本号
const CACHE_VERSION = 'v1';
const CACHE_NAME = `blog-cache-${CACHE_VERSION}`;

// 需要缓存的资源列表 - 确保这些资源都存在
const urlsToCache = [
  '/',
  '/favicon.svg',
  // 使用正确的相对路径
  '/assets/styles/global.css'
];

// 安装 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        // 单独缓存每个资源，避免一个失败导致全部失败
        return Promise.all(
          urlsToCache.map(url => {
            return fetch(url)
              .then(response => {
                if (!response.ok) {
                  throw new Error(`缓存失败: ${url}`);
                }
                return cache.put(url, response);
              })
              .catch(error => {
                console.error(`无法缓存 ${url}:`, error);
              });
          })
        );
      })
      .then(() => self.skipWaiting()) // 强制新 SW 激活
  );
});

// 激活 Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 删除旧版本缓存
          if (cacheName !== CACHE_NAME) {
            console.log('删除旧缓存:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // 控制所有客户端
  );
});

// 处理请求
self.addEventListener('fetch', event => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;
  
  // 忽略浏览器扩展请求
  if (!(event.request.url.indexOf('http') === 0)) return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果在缓存中找到响应，则返回缓存的响应
        if (response) {
          console.log('从缓存返回:', event.request.url);
          return response;
        }
        
        // 如果缓存中没有响应，则从网络获取
        return fetch(event.request)
          .then(response => {
            // 检查是否是有效的响应
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // 克隆响应，因为响应是流，只能使用一次
            const responseToCache = response.clone();
            
            // 将响应添加到缓存
            caches.open(CACHE_NAME)
              .then(cache => {
                console.log('缓存新资源:', event.request.url);
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(error => {
            console.error('获取资源失败:', error);
            // 可以在这里返回一个离线页面
          });
      })
  );
});

// 当发现新版本时，通知用户刷新页面
self.addEventListener('message', event => {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});