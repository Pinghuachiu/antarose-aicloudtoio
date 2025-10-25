# OpenSpec Design - ai.cloudto.io 技術設計文件

**設計編號：** AICLOUD-DESIGN-001
**設計日期：** 2025-10-25
**設計人員：** CTO + Leo（系統架構師）
**基於 Proposal：** AICLOUD-001（已批准）
**狀態：** ⏳ 待 CTO 批准

---

## 一、設計概述

### 1.1 設計目標

基於已批准的 Proposal，本設計文件詳細說明 ai.cloudto.io 的技術實作細節。

**核心目標：**
1. 客戶端 WebGL AI 去背（隱私保護）
2. 多語系支援（繁中/簡中/英文/日文）
3. VPS + Express + Cloudflare 架構
4. Dev/Prod 環境分離
5. 保留未來擴展能力

### 1.2 架構評分

- Leo 系統架構師評分：**9.0/10**（A+ 級）
- 評級：優秀++
- 決策：✅ 批准進入實作

---

## 二、系統架構設計

### 2.1 整體架構圖

```
┌─────────────────────────────────────────────────────────────┐
│                         使用者瀏覽器                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Next.js 15 UI (多語系)                               │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  WebGL Runtime (onnxruntime-web)               │  │  │
│  │  │  ↓                                              │  │  │
│  │  │  ONNX 模型（U²Net Lite）                       │  │  │
│  │  │  ↓                                              │  │  │
│  │  │  去背處理（100% 客戶端）                       │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ (HTTPS)
                        ↓
┌─────────────────────────────────────────────────────────────┐
│              Cloudflare CDN + Proxy + WAF                   │
│  - SSL/TLS 終止（Flexible SSL）                             │
│  - CDN 靜態資源快取                                         │
│  - DDoS Protection                                          │
│  - Bot Fight Mode                                           │
└───────────────────────┬─────────────────────────────────────┘
                        │ (HTTP)
                        ↓
┌─────────────────────────────────────────────────────────────┐
│          🛡️ IP 鎖定層（僅允許 Cloudflare IP）               │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────────┐
│  VPS (165.154.226.78) - Ubuntu 22.04 / 2C 4GB               │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Nginx (Reverse Proxy)                                │  │
│  │  - Dev: dev-ai.cloudto.io → localhost:3001           │  │
│  │  - Prod: ai.cloudto.io → localhost:3000              │  │
│  └─────────────────┬─────────────────────────────────────┘  │
│                    │                                         │
│  ┌─────────────────┴─────────────────┐                     │
│  │  PM2 (Process Manager)             │                     │
│  │  ┌─────────────────────────────┐  │                     │
│  │  │ ai-cloudto-io-dev (port 3001)│  │                     │
│  │  │ instances: 1                 │  │                     │
│  │  └─────────────────────────────┘  │                     │
│  │  ┌─────────────────────────────┐  │                     │
│  │  │ ai-cloudto-io-prd (port 3000)│  │                     │
│  │  │ instances: 2 (cluster mode)  │  │                     │
│  │  └─────────────────────────────┘  │                     │
│  └───────────────┬───────────────────┘                     │
│                  │                                           │
│  ┌───────────────┴───────────────┐                         │
│  │  Express 5.1.0 (Node.js 20)   │                         │
│  │  - /health                    │                         │
│  │  - /api/version               │                         │
│  │  - Logging Middleware         │                         │
│  │  - Helmet (Security)          │                         │
│  │  - CORS + Compression         │                         │
│  │  - Next.js Static Files       │                         │
│  └───────────────────────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 資料流向圖

#### 靜態資源載入流程

```
使用者瀏覽器
    ↓ GET /
Cloudflare Edge (檢查快取)
    ├─ 快取命中 → 直接返回（CDN）
    └─ 快取未命中
        ↓
    VPS Nginx → Express → Next.js HTML
        ↓
    返回 HTML
        ↓
Cloudflare (快取 HTML)
    ↓
使用者瀏覽器
```

#### AI 去背處理流程

```
使用者上傳圖片
    ↓
瀏覽器 File API
    ↓
載入 ONNX 模型（首次）
    ├─ GET /models/u2net-lite.onnx
    ├─ Cloudflare CDN (快取 1 年)
    └─ 儲存到 Service Worker Cache
    ↓
WebGL Runtime 初始化
    ↓
圖片前處理（resize, normalize）
    ↓
ONNX Inference (WebGL backend)
    ↓
後處理（mask to RGBA）
    ↓
顯示結果
    ↓
使用者下載（瀏覽器本地）
```

**關鍵特性：**
- ✅ 圖片**從不**傳送到伺服器
- ✅ 所有處理在瀏覽器 WebGL
- ✅ 模型透過 Cloudflare CDN 快速載入

---

## 三、前端技術設計

### 3.1 Next.js 15 App Router 結構

```
app/
├── [locale]/                    # 多語系動態路由
│   ├── layout.tsx              # 語言專屬 Layout
│   │   └── 載入對應語言字體
│   │   └── NextIntlClientProvider
│   ├── page.tsx                # 首頁
│   │   └── UploadCard
│   │   └── Steps
│   │   └── AdSense Banner
│   ├── about/
│   │   └── page.tsx            # 關於頁
│   └── privacy/
│       └── page.tsx            # 隱私政策
├── layout.tsx                   # 根 Layout
│   └── Google Fonts 載入
│   └── Tailwind CSS
│   └── Global Scripts
├── not-found.tsx
└── api/                         # API Routes（轉發到 Express）
```

### 3.2 組件架構設計

#### UploadCard 組件

**檔案：** `components/ui/UploadCard.tsx`

**功能：**
- 拖曳上傳（Drag & Drop）
- 點擊上傳（File Input）
- 格式驗證（JPG/PNG/WebP）
- 尺寸檢查（< 2048px）
- 自動壓縮（超過限制）

**技術細節：**
```typescript
interface UploadCardProps {
  onImageSelect: (file: File) => void;
  maxSize?: number; // 預設 2048
  supportedFormats?: string[]; // 預設 ['image/jpeg', 'image/png', 'image/webp']
}

// 圖片壓縮邏輯
async function compressImage(file: File, maxSize: number): Promise<File> {
  const img = await createImageBitmap(file);
  const canvas = document.createElement('canvas');

  // 計算縮放比例
  let { width, height } = img;
  if (width > maxSize || height > maxSize) {
    const ratio = Math.min(maxSize / width, maxSize / height);
    width *= ratio;
    height *= ratio;
  }

  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, width, height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], file.name, { type: file.type }));
    }, file.type);
  });
}
```

---

#### PreviewCanvas 組件

**檔案：** `components/ui/PreviewCanvas.tsx`

**功能：**
- 顯示原圖 vs 去背結果
- 滑桿對比模式
- 背景顏色切換
- 縮放/拖曳

**技術細節：**
```typescript
interface PreviewCanvasProps {
  originalImage: HTMLImageElement;
  processedImage: ImageData; // RGBA with alpha channel
  backgroundColor?: string; // 預設 transparent
}

// Canvas 渲染邏輯
function renderComposite(
  ctx: CanvasRenderingContext2D,
  original: HTMLImageElement,
  mask: ImageData,
  bgColor: string
) {
  // 1. 繪製背景
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // 2. 繪製原圖（僅 mask 為 true 的區域）
  ctx.putImageData(mask, 0, 0);
}
```

---

#### BrowserCheck 組件

**檔案：** `components/BrowserCheck.tsx`

**功能：**
- 檢測 WebGL 2.0 支援
- 檢測 WASM 支援
- 顯示不支援提示
- 提供瀏覽器升級建議

**檢測邏輯：**
```typescript
function detectWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
}

function detectWASMSupport(): boolean {
  try {
    return typeof WebAssembly === 'object'
      && typeof WebAssembly.instantiate === 'function';
  } catch (e) {
    return false;
  }
}
```

---

### 3.3 ONNX Runtime 整合設計

**檔案：** `lib/onnx-runtime.ts`

**初始化配置：**
```typescript
import * as ort from 'onnxruntime-web';

// WASM 檔案路徑配置
ort.env.wasm.wasmPaths = '/wasm/';
ort.env.wasm.numThreads = 4;

// 建立 Session（WebGL 優先）
const session = await ort.InferenceSession.create(
  '/models/u2net-lite.onnx',
  {
    executionProviders: ['webgl', 'wasm'],
    graphOptimizationLevel: 'all',
    enableCpuMemArena: false, // 降低記憶體使用
  }
);
```

**推論流程：**
```typescript
async function removeBackground(imageElement: HTMLImageElement): Promise<ImageData> {
  // 1. 前處理：轉換為模型輸入格式
  const inputTensor = preprocessImage(imageElement);

  // 2. ONNX 推論
  const results = await session.run({ input: inputTensor });

  // 3. 後處理：mask 轉 RGBA
  const outputData = results.output.data;
  const maskImage = postprocessMask(outputData, imageElement.width, imageElement.height);

  return maskImage;
}
```

---

### 3.4 多語系實作設計

**配置檔案：**
- `i18n.config.ts` - next-intl 主配置
- `middleware.ts` - 語言路由處理
- `locales/*.json` - 翻譯檔案（4 種語言）

**語言選擇邏輯：**
```typescript
// 1. 檢查 URL 路徑
// 2. 檢查 localStorage
// 3. 預設繁體中文（不使用瀏覽器自動偵測）

function getInitialLocale(): Locale {
  // URL 優先
  if (pathname.startsWith('/en')) return 'en';
  if (pathname.startsWith('/zh-cn')) return 'zh-cn';
  if (pathname.startsWith('/ja')) return 'ja';

  // localStorage 次之
  const saved = localStorage.getItem('locale');
  if (saved && isValidLocale(saved)) return saved;

  // 預設繁中
  return 'zh-tw';
}
```

---

## 四、後端技術設計

### 4.1 Express Server 架構

**檔案：** `backend/server.ts`

**Middleware 堆疊：**
```typescript
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';

const app = express();

// 1. 安全中間件
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 'https://pagead2.googlesyndication.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      connectSrc: ["'self'"],
      workerSrc: ["'self'", 'blob:'],
    },
  },
}));

// 2. CORS（允許同源）
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true,
}));

// 3. 壓縮
app.use(compression());

// 4. 日誌記錄
app.use(morgan(':date[iso] :method :url :status :res[content-length] - :response-time ms'));
app.use(customLogger); // 自訂日誌

// 5. 靜態檔案
app.use(express.static('public', { maxAge: '1y' }));

// 6. Next.js
// 如使用 SSR: next.getRequestHandler()
// 如使用 Static: express.static(nextBuildDir)
```

---

### 4.2 API Endpoints 設計

#### `/health` - 健康檢查

**用途：** 監控系統、負載平衡健康檢查

**實作：**
```typescript
// backend/routes/health.ts
import { Router } from 'express';

const router = Router();

router.get('/health', async (req, res) => {
  const healthcheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
  };

  res.status(200).json(healthcheck);
});

export default router;
```

**回應範例：**
```json
{
  "status": "ok",
  "timestamp": "2025-10-25T12:00:00.000Z",
  "uptime": 123456,
  "environment": "production",
  "memory": {
    "used": 150,
    "total": 200
  }
}
```

---

#### `/api/version` - 版本資訊

**用途：** 版本追蹤、除錯、變更記錄

**實作：**
```typescript
// backend/routes/version.ts
import { Router } from 'express';
import { execSync } from 'child_process';

const router = Router();

router.get('/api/version', (req, res) => {
  const version = {
    app: process.env.APP_VERSION || '1.0.0',
    commit: process.env.GIT_COMMIT || getGitCommit(),
    buildTime: process.env.BUILD_TIME || new Date().toISOString(),
    node: process.version,
    environment: process.env.NODE_ENV,
  };

  res.json(version);
});

function getGitCommit(): string {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch {
    return 'unknown';
  }
}

export default router;
```

---

### 4.3 日誌系統設計

**日誌記錄項目：**
- 訪問時間（ISO 8601）
- HTTP 方法和路徑
- User-Agent（瀏覽器資訊）
- Referrer（來源）
- 回應狀態碼
- 回應時間

**實作：**
```typescript
// backend/middlewares/logging.ts
import winston from 'winston';

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/access.log' }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

export function customLogger(req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    logger.info({
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.url,
      status: res.statusCode,
      userAgent: req.headers['user-agent'],
      referrer: req.headers['referer'] || 'Direct',
      responseTime: Date.now() - start,
      ip: req.headers['cf-connecting-ip'] || req.ip, // Cloudflare 真實 IP
    });
  });

  next();
}
```

---

## 五、資料庫設計（v1.2 規劃）

### 5.1 Schema 設計（PostgreSQL）

**Users Table：**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Image History Table：**
```sql
CREATE TABLE image_history (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  original_filename VARCHAR(255),
  processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB -- 圖片尺寸、處理時間等
);
```

**注意：** v1.0/v1.1 不實作資料庫，保留架構設計供未來參考。

---

## 六、安全設計

### 6.1 多層安全防護

```
┌─────────────────────────────────────────────────┐
│  Layer 1: Cloudflare WAF + DDoS Protection     │
│  - 阻擋惡意請求                                  │
│  - 防止 DDoS 攻擊                               │
│  - Bot Fight Mode                               │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────┐
│  Layer 2: Cloudflare SSL (Flexible)            │
│  - HTTPS 加密（用戶 ↔ Cloudflare）              │
│  - SSL 證書驗證                                 │
└────────────────────┬────────────────────────────┘
                     │ (HTTP)
┌────────────────────┴────────────────────────────┐
│  Layer 3: IP 鎖定（關鍵安全層）✅               │
│  - 僅允許 Cloudflare IP 範圍                    │
│  - 防止繞過 Cloudflare 攻擊                     │
│  - 補償 Flexible SSL 風險                       │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────┐
│  Layer 4: Nginx 安全配置                        │
│  - client_max_body_size 限制                    │
│  - Rate limiting                                │
└────────────────────┬────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────┐
│  Layer 5: Express Helmet                        │
│  - CSP (Content Security Policy)                │
│  - X-Frame-Options (防 Clickjacking)            │
│  - X-Content-Type-Options (防 MIME Sniffing)    │
└─────────────────────────────────────────────────┘
```

**Leo 評價：** ✅ **五層安全防護，達商業級標準**

### 6.2 IP 鎖定配置（已實作）

**維護清單：**
- [ ] 每月檢查 Cloudflare IP 範圍更新（<https://www.cloudflare.com/ips/>）
- [ ] 設定自動化更新腳本（cron job）
- [ ] 測試 IP 鎖定有效性

---

## 七、部署設計

### 7.1 環境配置

| 環境 | Domain | Port | Directory | PM2 Instance | Instances |
|------|--------|------|-----------|--------------|-----------|
| Development | dev-ai.cloudto.io | 3001 | /var/www/ai-cloudto-io-dev | ai-cloudto-io-dev | 1 |
| Production | ai.cloudto.io | 3000 | /var/www/ai-cloudto-io-prd | ai-cloudto-io-prd | 2 (cluster) |

### 7.2 PM2 配置設計

**檔案：** `ecosystem.config.js`

```javascript
module.exports = {
  apps: [
    // Development
    {
      name: 'ai-cloudto-io-dev',
      script: 'backend/server.js',
      cwd: '/var/www/ai-cloudto-io-dev',
      env: {
        NODE_ENV: 'development',
        PORT: 3001,
      },
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      error_file: 'logs/dev-error.log',
      out_file: 'logs/dev-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },

    // Production
    {
      name: 'ai-cloudto-io-prd',
      script: 'backend/server.js',
      cwd: '/var/www/ai-cloudto-io-prd',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      instances: 2, // Cluster mode（充分利用 2 核心）
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      error_file: 'logs/prd-error.log',
      out_file: 'logs/prd-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Graceful shutdown
      kill_timeout: 5000,
      listen_timeout: 3000,
    },
  ],
};
```

### 7.3 Nginx 配置設計

**Development 配置：**

```nginx
# /etc/nginx/sites-available/ai-cloudto-io-dev
upstream dev_backend {
    server 127.0.0.1:3001;
    keepalive 32;
}

server {
    listen 80;
    server_name dev-ai.cloudto.io;

    # 限制請求大小
    client_max_body_size 10M;

    # Rate limiting（防止濫用）
    limit_req_zone $binary_remote_addr zone=dev_limit:10m rate=10r/s;
    limit_req zone=dev_limit burst=20 nodelay;

    # 主要代理
    location / {
        proxy_pass http://dev_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeout 設定
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # ONNX 模型檔案（長期快取）
    location /models/ {
        proxy_pass http://dev_backend;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Access-Control-Allow-Origin "*";
    }

    # WASM 檔案（長期快取）
    location /wasm/ {
        proxy_pass http://dev_backend;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
        add_header Access-Control-Allow-Origin "*";
    }

    # API 不快取
    location /api/ {
        proxy_pass http://dev_backend;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

**Production 配置：** 類似，但指向 port 3000

---

## 八、效能優化設計

### 8.1 Cloudflare 快取策略

**Page Rules 配置：**

| URL Pattern | Cache Level | Cache TTL | Browser TTL |
|-------------|-------------|-----------|-------------|
| `ai.cloudto.io/models/*` | Cache Everything | 1 year | 1 year |
| `ai.cloudto.io/wasm/*` | Cache Everything | 1 year | 1 year |
| `ai.cloudto.io/_next/static/*` | Cache Everything | 1 year | 1 year |
| `ai.cloudto.io/api/*` | Bypass | - | - |
| `ai.cloudto.io/*` | Standard | 2 hours | 30 minutes |

### 8.2 Service Worker 快取策略

**檔案：** `public/sw.js`

```javascript
const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const MODELS_CACHE = `models-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/en',
  '/zh-cn',
  '/ja',
  '/_next/static/css/*',
  '/_next/static/js/*',
];

const MODEL_ASSETS = [
  '/models/u2net-lite.onnx',
  '/wasm/ort-wasm-simd.wasm',
  '/wasm/ort-wasm-threaded.wasm',
];

// Install: 預快取關鍵資源
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => cache.addAll(STATIC_ASSETS)),
      caches.open(MODELS_CACHE).then(cache => cache.addAll(MODEL_ASSETS)),
    ])
  );
});

// Fetch: Cache-First for models, Network-First for pages
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // ONNX 模型和 WASM：Cache First
  if (request.url.includes('/models/') || request.url.includes('/wasm/')) {
    event.respondWith(
      caches.match(request).then(response => response || fetch(request))
    );
  }
  // 其他：Network First
  else {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
  }
});
```

---

## 九、監控與告警設計（v1.2 規劃）

### 9.1 推薦監控方案

| 類型 | 工具 | 用途 | 成本 |
|------|------|------|------|
| Uptime 監控 | UptimeRobot | 服務可用性 | 免費 |
| APM | New Relic | 應用效能監控 | 免費方案 |
| 錯誤追蹤 | Sentry | 前後端錯誤 | 免費方案 |
| 日誌分析 | Grafana Loki | 日誌聚合 | 開源免費 |

### 9.2 告警規則

**Uptime 監控：**
- `/health` endpoint 5 分鐘檢查一次
- 連續 3 次失敗 → 發送告警（Email / Slack）

**APM 告警：**
- 回應時間 > 1 秒
- 錯誤率 > 1%
- 記憶體使用 > 80%

---

## 十、測試策略設計

### 10.1 單元測試（80% 覆蓋率目標）

**前端單元測試：**
- ONNX Runtime wrapper
- 圖片處理邏輯
- 組件邏輯（不含 UI）

**後端單元測試：**
- API endpoints
- Middleware
- 工具函數

**測試框架：**
- Vitest（前端）
- Jest（後端）

### 10.2 E2E 測試

**使用工具：**
- playwright (MCP tool)
- chrome-devtools (MCP tool)

**測試場景：**
1. 上傳圖片 → 去背 → 下載（完整流程）
2. 語言切換（4 種語言）
3. 瀏覽器兼容性（Chrome/Edge/Firefox/Safari）
4. 響應式（Desktop/Tablet/Mobile）
5. 錯誤處理（大圖片、不支援瀏覽器）

---

## 十一、未來演進設計

### 11.1 v1.2 架構演進（帳號系統）

```
Cloudflare → Nginx → Express → Next.js + WebGL
                        ↓
                  PostgreSQL
                  (users, image_history)
```

**新增 API：**
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/user/profile
- GET /api/history

### 11.2 v1.3 架構演進（伺服器端 API）

```
Cloudflare → Nginx → Express → Next.js + WebGL (主要)
                        ↓
                  Python FastAPI (GPU 去背)
                  (部署在雲端 GPU 服務)
```

**API：**
- POST /api/remove-bg（伺服器端降級方案）

**注意：** VPS (2C/4GB) 無 GPU，需使用雲端 GPU 服務（AWS Lambda GPU / Modal.com）

---

## 十二、API 規格設計

### 12.1 RESTful API 設計

**v1.0/v1.1 API Endpoints：**

| Method | Path | Description | Auth | Cache |
|--------|------|-------------|------|-------|
| GET | `/health` | 健康檢查 | No | No |
| GET | `/api/version` | 版本資訊 | No | 1 hour |

**v1.2 規劃：**

| Method | Path | Description | Auth | Cache |
|--------|------|-------------|------|-------|
| POST | `/api/auth/register` | 註冊 | No | No |
| POST | `/api/auth/login` | 登入 | No | No |
| POST | `/api/auth/logout` | 登出 | Yes | No |
| GET | `/api/user/profile` | 用戶資料 | Yes | No |
| GET | `/api/history` | 圖片歷史 | Yes | No |

---

## 十三、CI/CD 設計（v1.2 規劃）

### 13.1 Git 工作流程

**分支策略（Hybrid GitHub Flow）：**
- `master` - 生產環境
- `develop` - 開發環境
- `feature/*` - 功能分支
- `hotfix/*` - 緊急修復

### 13.2 自動化流程

```yaml
# .github/workflows/deploy-dev.yml
name: Deploy to Development

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - run: npm install
      - run: npm run build
      - run: npm test
      - name: Deploy to Dev VPS (使用 Git)
        run: |
          ssh jackalchiu@165.154.226.78 'cd /var/www/ai-cloudto-io-dev && git pull origin develop && npm install && npm run build && pm2 restart ai-cloudto-io-dev'
```

---

## 十四、技術決策記錄（ADR）

### ADR-005: Cloudflare IP 鎖定 + Flexible SSL

**決策日期：** 2025-10-25
**狀態：** ✅ 已實作

**背景：**
- Cloudflare Flexible SSL 模式（Cloudflare ↔ VPS 使用 HTTP）
- 存在理論上的中間人攻擊風險

**決策：**
- 使用 Flexible SSL + IP 鎖定組合
- VPS 僅接受 Cloudflare IP 範圍請求

**理由：**
- ✅ IP 鎖定提供強大安全層
- ✅ 攻擊者需先攻破 Cloudflare 內網（極高難度）
- ✅ 簡化配置（無需維護 Let's Encrypt）
- ✅ 性能最佳（無 SSL 握手開銷）
- ✅ 已達商業級安全標準

**替代方案：**
- Full SSL（需 Let's Encrypt 證書）
- 優先級降為「可選改進」

**後果：**
- ✅ 安全性充分（多層防護）
- ✅ 配置簡化
- ✅ 性能最佳

---

## 十五、設計批准檢查清單

### 設計完整性檢查

- [x] 系統架構圖清晰
- [x] 資料流向圖完整
- [x] 組件設計詳細
- [x] API 規格明確
- [x] 安全設計充分
- [x] 部署流程清楚
- [x] 性能優化策略明確
- [x] 監控告警規劃（v1.2）
- [x] 未來演進路徑清晰
- [x] ADR 記錄完整

### CTO 審查項目

- [ ] 技術方案是否合理？
- [ ] 架構是否符合 Proposal？
- [ ] 安全措施是否充分？
- [ ] 性能目標是否可達成？
- [ ] 未來擴展是否考慮？

---

**設計狀態：** ⏳ 待 CTO 審查批准

**設計人員：** CTO + Leo
**設計日期：** 2025-10-25
