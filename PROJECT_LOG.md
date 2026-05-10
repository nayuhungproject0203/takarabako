# Takarabako (Personal Knowledge Base) - Project Log

這份文件記錄了本專案（原為簡單的 Personal Knowledge Base，後定名為 Takarabako）的設計迭代過程、版本更新歷史，以及目前專案架構中各個資料夾與檔案的功用。

---

## 🚀 版本更新歷史與設計迭代過程

### v1.0.0 - 核心 MVP 建立 (Minimalist Knowledge Base)
- **設計目標**：打造一個極簡、低阻力、注重效能的個人知識庫。
- **核心功能**：使用 React + Vite 搭配 Tailwind CSS 開發，讓使用者能儲存文章、工具、影片等學習資源。
- **資料儲存**：無需後端，採用 `localStorage` 進行本地資料持久化。
- **分類方式**：初期採用單一、固定的「Topic (主題)」作為主要分類架構。

### v1.1.0 - 架構重構：標籤化系統 (Tag-Based Architecture)
- **設計目標**：解決單一「Topic」分類過於僵化的問題，轉向更靈活的多維度管理。
- **核心變更**：
  - **資料模型升級**：將僵硬的主題分類移除，改以靈活且允許多值的「Tags (標籤)」系統取代。
  - **側邊欄 (Sidebar) 重新設計**：將「Resource Type (資源類型)」提升為主要過濾器。當使用者選擇特定資源類型後，系統會自動動態生成與之相關的標籤 (Related Tags) 供進階篩選。
  - **品牌更新**：專案正式定名為「Takarabako (寶箱)」。

### v1.2.0 - 內容多樣化：引文 (Quote) 支援
- **設計目標**：滿足使用者儲存「金句/引文」的需求，這類內容通常不需要網址，且重視純文字展示。
- **核心變更**：
  - **新增 Quote 類型**：在現有資源類型中加入 `'quote'`。
  - **動態表單與資料驗證**：修改了新增/編輯表單，當類型選擇為 Quote 時，自動隱藏 Title 與 URL 欄位，改為顯示 Quote Text (必填)、Author (選填) 與 Source (選填)。
  - **客製化卡片渲染**：針對 Quote 類型的卡片進行特殊排版（加入 Blockquote 樣式、隱藏外部連結按鈕），並新增專屬的「一鍵複製 (Copy)」快捷操作。

### v1.3.0 - 視覺重構與架構升級：集合大廳與類型精簡 (Collection Dashboard & UI Polish)
- **設計目標**：解決首頁所有資源混雜導致不易閱讀的問題，並進一步精簡、收斂資源分類，使應用更像一個私人的「閱讀與工具大廳」。
- **核心變更**：
  - **全新首頁 (Collection Dashboard)**：預設首頁從「所有資源列表」改為「集合大廳」。利用精緻的分類卡片（顯示各類別描述與數量）作為導覽入口，兼顧搜尋的無縫切換。
  - **Quote 卡片視覺升級**：將引文 (Quote) 卡片重構為類似雜誌排版的「編輯風格 (Editorial)」，加寬版面、優化字體行距，並將作者與來源獨立為詮釋資料 (Metadata) 區塊。
  - **新增 Book (書籍) 類型**：支援儲存書籍資訊，包含書名與作者，並在卡片標題下方優雅地顯示作者名稱。
  - **名詞與類型精簡**：將原本的 `Article` 與 `Blog` 合併為更具深度的 `Essay`（文章 / 隨筆）。全站的「Add Resource」更名為「Add Item」，並加入自動化的資料平滑升級機制，確保舊資料能自動轉移到新類型。

### v1.4.0 - 智慧輸入：網址自動偵測與 Metadata 填寫 (URL Auto-Fill & Detection)
- **設計目標**：減少使用者新增資源時的手動輸入負擔，提升操作流暢度，同時維持無後端的輕量化純前端架構。
- **核心變更**：
  - **智慧網址判斷**：實作 `urlParser.ts` 工具，當使用者在表單貼上網址時，會自動判斷網域並切換至對應的類型（例如：`youtube.com` → Video, `substack.com` → Newsletter, `goodreads.com` → Book）。
  - **YouTube Metadata 自動抓取**：利用 YouTube 官方無 CORS 限制的 oEmbed API，在貼上影片網址後自動抓取並填入「影片標題」與「頻道名稱」。
  - **無縫表單體驗**：為 Video 類型新增了選填的 `Creator / Channel` 欄位來存放頻道資訊，並在網址欄位加入即時的 Loading 提示。所有自動填寫行為皆不會覆蓋使用者的手動輸入，保留最大彈性。

---

## 📁 專案目錄與檔案結構說明

### 根目錄核心檔案
- **`src/App.tsx`**
  專案的核心應用程式元件。負責管理全域狀態（如所有資源資料、搜尋字串、選中的標籤與類型、Modal 開關狀態），並組合各個佈局與元件。包含主要的資源篩選與排序邏輯。
- **`src/types.ts`**
  定義 TypeScript 的型別與介面。包含 `ResourceType`（如 tool, article, quote 等）以及 `Resource` 資料模型介面。
- **`src/main.tsx`**
  React 應用程式的進入點，負責將 `<App />` 渲染至 DOM 中。
- **`src/index.css`**
  全域 CSS 樣式表，包含 Tailwind CSS 的基礎指令 (`@tailwind`) 以及一些全域的樣式定義。
- **`src/vite-env.d.ts`**
  提供 Vite 環境變數與相關特性的 TypeScript 型別支援。

### `src/hooks/` (自訂 Hooks)
- **`useLocalStorage.ts`**
  處理本地儲存的 Custom Hook。負責將狀態自動同步至瀏覽器的 `localStorage`，確保重新整理後資料不會遺失。

### `src/utils/` (輔助工具)
- **`urlParser.ts`**
  負責處理網址相關邏輯的工具檔案。包含 `detectItemType`（根據網域判斷資源類型）與 `fetchYouTubeMetadata`（透過 oEmbed API 獲取 YouTube 影片標題與作者）。

### `src/components/layout/` (佈局與整體結構元件)
- **`Header.tsx`**
  網頁頂部導覽列元件，包含專案 Logo/標題、全域文字搜尋列 (Search Bar) 以及「新增資源」按鈕。
- **`SidebarFilter.tsx`**
  側邊欄篩選器元件。呈現「Resource Type」選項以及動態計算出的「Related Tags」，供使用者進行點擊篩選。
- **`CategoryFilter.tsx`**
  *(Legacy)* 早期基於 Topic 分類時使用的過濾器元件。

### `src/components/resource/` (資源處理與展示元件)
- **`ResourceCard.tsx`**
  資源展示卡片元件。負責渲染單筆資料的介面，包含標題、網址連結、類型圖示、標籤、建立時間，以及針對「Quote」類型特製的排版與複製按鈕。提供編輯與刪除的觸發點。
- **`ResourceForm.tsx`**
  新增與編輯資源的表單元件。負責資料輸入與格式驗證。具有動態切換欄位的功能（例如：切換為 Quote 類型時，表單欄位會自動變成引文、作者、來源）。
- **`TagInput.tsx`**
  專門用來處理「標籤輸入」的客製化輸入元件。允許使用者輸入文字後按下 Enter 產生標籤，並提供點擊刪除標籤的互動介面。

### `src/components/ui/` (共用基礎介面元件)
- **`Input.tsx`**
  封裝過且風格統一的基礎輸入元件群，匯出了 `Input` (單行輸入框)、`Textarea` (多行輸入框) 與 `Select` (下拉式選單)。
- **`Button.tsx`**
  基礎按鈕元件。內建不同的視覺樣式變體 (Variants)，確保全站按鈕設計風格一致。
- **`Modal.tsx`**
  可重複使用的對話框 (Dialog/Modal) 容器元件，附帶半透明背景與關閉按鈕，用於包裝 `ResourceForm` 等彈出式內容。
