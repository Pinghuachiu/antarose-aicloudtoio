# OpenSpec Tasks - ai.cloudto.io 任務分解

**基於：** proposal.md + design.md（已批准）
**日期：** 2025-10-25

---

## 任務分配

### 前端（Waylon）- 5 天

- [ ] T1.1: Next.js 15 專案初始化（App Router + TypeScript）- 0.5 天
- [ ] T1.2: next-intl 多語系整合 - 1 天
- [ ] T1.3: shadcn/ui 組件安裝與客製化 - 0.5 天
- [ ] T1.4: UploadCard 組件 - 1 天
- [ ] T1.5: PreviewCanvas 組件 - 1 天
- [ ] T1.6: ONNX Runtime 整合 - 1.5 天
- [ ] T1.7: BrowserCheck 組件 - 0.5 天

### 後端（Costa）- 2 天

- [ ] T2.1: Express Server 基礎架構 - 0.5 天
- [ ] T2.2: /health 和 /api/version endpoints - 0.5 天
- [ ] T2.3: 安全中間件（Helmet, CORS） - 0.5 天
- [ ] T2.4: 日誌系統 - 0.5 天

### DevOps（Louis）- 1 天

- [ ] T3.1: Nginx 配置（Dev + Prod）- 0.5 天
- [ ] T3.2: PM2 配置 - 0.5 天
- [ ] T3.3: Cloudflare DNS 設定 - 0.5 天
- [ ] T3.4: 部署到 Dev 環境 - 0.5 天

### QA（Lucia）- 2 天

- [ ] T4.1: E2E 測試腳本 - 1 天
- [ ] T4.2: 執行測試並回報 - 1 天

---

## 驗收標準

**Dev 環境驗收：**
- ✅ <https://dev-ai.cloudto.io> 可訪問
- ✅ 4 種語言正常切換
- ✅ 可上傳並去背圖片
- ✅ /health 回應 200
