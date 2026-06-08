# Technical Deep Dive — IDE Portfolio

> Tài liệu giải thích cơ chế, thuật toán và quyết định kỹ thuật của từng chức năng.
> Mục đích: giúp bạn hiểu sâu để trả lời tự tin khi HR / tech-lead hỏi chi tiết.

---

## 0. Tóm tắt 30 giây (đọc trước khi phỏng vấn)

> "Đây là một portfolio mô phỏng giao diện VS Code, build bằng **Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4**. Toàn bộ nội dung được tách khỏi UI thành các file JSON (data-driven), nên cập nhật thông tin không cần đụng vào code. Điểm nhấn kỹ thuật là một **AI Copilot** có backend riêng: ưu tiên trả lời từ FAQ bằng thuật toán matching nhiều tầng, nếu không khớp thì gọi LLM và **stream từng token về client theo thời gian thực** (NDJSON), kèm **rate limiting theo IP**, timeout và graceful degradation. Ngoài ra có deep-linking qua URL, full-text search client-side, theme system dùng CSS variables, và một terminal giả lập."

---

## 1. Kiến trúc tổng thể

### 1.1. Tech stack

| Lớp                  | Công nghệ                                      | Lý do chọn                                       |
| -------------------- | ---------------------------------------------- | ------------------------------------------------ |
| Framework            | Next.js 16 (App Router, Turbopack)             | SSR/SSG + API routes trong cùng 1 codebase       |
| UI                   | React 19 + TypeScript                          | Component-based, type-safe                       |
| Styling              | Tailwind CSS v4                                | Utility-first, kết hợp CSS variables cho theming |
| Component primitives | Radix UI + shadcn/ui                           | Accessibility (ARIA) có sẵn                      |
| Icons                | lucide-react                                   | Bộ icon nhất quán                                |
| Panels               | react-resizable-panels                         | Kéo-thả resize panel như IDE thật                |
| Hotkeys              | react-hotkeys-hook                             | Đăng ký phím tắt global                          |
| Markdown             | react-markdown + remark-gfm + rehype-highlight | Render câu trả lời AI có syntax highlight        |
| Drag & drop          | @dnd-kit                                       | Kéo sắp xếp lại tab                              |

### 1.2. Cấu trúc thư mục cốt lõi

```
app/
  api/chat/route.ts      → Backend AI endpoint (streaming + rate limit)
  page.tsx               → Entry, bọc trong <Suspense>
  layout.tsx             → Root layout, metadata SEO
components/portfolio/
  ide-layout.tsx         → "Bộ não" UI: quản lý toàn bộ state panel
  ai-copilot.tsx         → Chat UI + logic đọc stream + typewriter
  search-view.tsx        → Full-text search
  terminal.tsx           → Terminal giả lập
  theme-context.tsx      → Theme provider (CSS variables)
  *-content.tsx          → Nội dung từng "file" (home, about, projects...)
hooks/
  use-url-state.ts       → Đồng bộ state ↔ URL (deep linking)
  use-keybindings.ts     → Registry phím tắt
data/
  portfolio.json         → Toàn bộ nội dung portfolio
  ai-faq.json            → Câu hỏi/đáp FAQ + keywords
  ai-system-prompt.json  → Cấu hình system prompt cho LLM
lib/
  portfolio.ts           → Type + load portfolio.json
  ai-faq.ts              → Thuật toán matchFAQ
  ai-system-prompt.ts    → Build system prompt từ JSON
```

### 1.3. Triết lý "data-driven" (điểm thường được hỏi)

Toàn bộ nội dung nằm trong `data/*.json`, UI chỉ đọc qua một lớp type-safe (`lib/portfolio.ts`). Lợi ích:

- Đổi thông tin (job mới, project mới) → sửa JSON, không động vào component.
- Shape JSON được định nghĩa "phẳng và serializable" cố tình để **sau này có thể thay bằng API/CMS mà không phải sửa UI**.
- Search index, terminal, AI context... đều đọc cùng nguồn dữ liệu này → một nguồn sự thật duy nhất (single source of truth).

> **Câu hỏi HR hay hỏi:** "Nếu muốn lấy dữ liệu từ database thì sửa ở đâu?"
> **Trả lời:** Chỉ cần thay `portfolio` export trong `lib/portfolio.ts` bằng một fetch/async loader; interface `PortfolioData` giữ nguyên nên không component nào phải đổi.

---

## 2. IDE Layout — trái tim quản lý state

File: `components/portfolio/ide-layout.tsx`

### 2.1. Cơ chế

`IDELayoutInner` giữ toàn bộ state bằng `useState`: file đang mở (`activeFile`), danh sách tab (`openTabs`), và cờ hiển thị từng panel (`showExplorer`, `showCopilot`, `showSearch`, `showTerminal`...). Nó là **single owner** của state — các component con chỉ nhận callback.

### 2.2. Render có điều kiện theo "file"

Không có router cho từng file. Thay vào đó, `activeFile` là một string, và layout render component tương ứng:

```tsx
{
  activeFile === "home.tsx" && <HomeContent />;
}
{
  activeFile === "projects.js" && <ProjectsContent />;
}
// ...
```

Mỗi "file" trong explorer thực chất là một React component nội dung. Phần đuôi file (`.tsx`, `.js`, `.json`) chỉ để tạo cảm giác IDE thật + tô màu icon.

### 2.3. Responsive: docked vs overlay

- **Màn hình ≥ 1024px (lg):** panel được "dock" — dùng `react-resizable-panels`, kéo resize được.
- **Màn hình nhỏ:** panel render thành **drawer trượt** (overlay), bấm nền hoặc Esc để đóng.

Phát hiện breakpoint qua hook `useMediaQuery`. `layoutKey` thay đổi theo số panel đang dock để `autoSaveId` lưu đúng layout (kích thước panel được nhớ qua localStorage bởi thư viện).

> **Vì sao tách docked/overlay?** Trên mobile, panel cố định sẽ che mất editor. Drawer giải quyết bằng cách phủ tạm thời rồi tự đóng khi chọn file.

---

## 3. AI Copilot — chức năng phức tạp nhất (điểm nhấn phỏng vấn)

Gồm 2 phần: **backend** (`app/api/chat/route.ts`) và **frontend** (`components/portfolio/ai-copilot.tsx`).

### 3.1. Luồng xử lý tổng thể (3 tầng fallback)

```
User gửi câu hỏi
   │
   ▼
[Backend] Rate limit check (theo IP) ──fail──▶ 429 JSON
   │ pass
   ▼
[Backend] Validate (rỗng? quá dài 2000 ký tự?) ──fail──▶ 400/413 JSON
   │ pass
   ▼
Tầng 1: matchFAQ(message) ──khớp──▶ stream câu trả lời FAQ
   │ không khớp
   ▼
Tầng 2: Gọi LLM (OpenAI-compatible) với stream:true ──ok──▶ stream từng token
   │ lỗi
   ▼
Tầng 3: Fallback
   - Chưa cấu hình API key → trả lời "offline" có sẵn
   - Lỗi mạng/timeout → thông báo lỗi thân thiện
```

Điểm hay khi nói: **mọi tầng đều đi qua cùng một giao thức stream**, nên client chỉ có một code path xử lý — đơn giản và nhất quán.

### 3.2. Thuật toán matchFAQ (file `lib/ai-faq.ts`)

Đây là một **rule-based matcher 3 tầng**, trả về điểm số (score) cao nhất vượt ngưỡng (`threshold = 0.5`):

**Bước chuẩn hóa (`normalize`):**

- Chuyển về chữ thường.
- Xóa dấu câu bằng regex Unicode `/[^\p{L}\p{N}\s]/gu` (giữ chữ + số + khoảng trắng, hỗ trợ cả Unicode/tiếng Việt).
- Gộp khoảng trắng thừa.

**Tầng 1 — Exact match (score = 1.0):**
Nếu câu hỏi sau chuẩn hóa **trùng khít** câu hỏi gốc trong FAQ → trả ngay. Đây là case khi user bấm vào "suggested question" có sẵn.

**Tầng 2 — Substring containment (score 0.85–0.9):**

- Nếu message chứa câu hỏi FAQ hoặc ngược lại → 0.9.
- Nếu message chứa bất kỳ keyword nào của FAQ → 0.85.

**Tầng 3 — Token overlap (score = tỉ lệ trùng):**

- Tạo tập token từ câu hỏi + keywords (chỉ lấy token dài > 2 ký tự).
- Đếm bao nhiêu token trùng với token trong message.
- `score = số_token_trùng / tổng_token_FAQ`.

Lấy `Math.max` của cả 3 tầng, chọn FAQ có score cao nhất và ≥ threshold.

> **Vì sao không dùng AI cho mọi câu?** FAQ matching giúp: (1) trả lời tức thì không tốn tiền API cho câu phổ biến, (2) đảm bảo câu trả lời chuẩn cho thông tin quan trọng (email, kỹ năng), (3) vẫn hoạt động khi chưa cấu hình API key.

> **Hạn chế (nên thừa nhận nếu bị hỏi):** đây là matching từ khóa, không hiểu ngữ nghĩa. Nâng cấp thật sự sẽ là **embedding + vector similarity** (semantic search). Nhưng với vài chục FAQ, rule-based đủ tốt và không cần hạ tầng vector DB.

### 3.3. Streaming — cơ chế quan trọng nhất

**Tại sao streaming?** LLM sinh text tuần tự. Nếu chờ cả câu trả lời rồi mới hiện, user nhìn màn hình trống 3–10 giây. Streaming hiện chữ ngay khi token đầu tiên về → cảm giác phản hồi tức thì (giống ChatGPT).

#### Backend: giao thức NDJSON

Endpoint trả về **NDJSON** (Newline-Delimited JSON) — mỗi dòng là một JSON event:

```
{"type":"meta","source":"ai"}              ← luôn gửi đầu tiên, báo nguồn
{"type":"delta","content":"Xin"}           ← từng mẩu text
{"type":"delta","content":" chào"}
{"type":"done"}                            ← kết thúc
```

Backend dùng `ReadableStream`. Với LLM, nó gọi provider với `stream: true` (provider trả về **SSE** — Server-Sent Events), rồi:

1. `parseOpenAIDeltas()` đọc body stream, tách theo dòng `data: ...`, parse JSON, rút `choices[0].delta.content`.
2. Mỗi delta được bọc lại thành NDJSON của mình và enqueue vào stream gửi về client.

> **Vì sao đổi SSE của OpenAI sang NDJSON riêng?** Để gói cả 3 nguồn (FAQ/AI/fallback) vào một format thống nhất, và đính kèm metadata `source` mà client cần để hiển thị badge (FAQ/AI/Offline/Error).

**Headers quan trọng:**

- `Content-Type: application/x-ndjson` — báo client đây là stream.
- `Cache-Control: no-cache, no-transform` — cấm cache.
- `X-Accel-Buffering: no` — tắt buffering của nginx để chunk flush ngay (không bị gom lại).

#### Frontend: đọc stream + hàng đợi typewriter

File `ai-copilot.tsx`, hàm `sendMessage`:

1. Dùng `res.body.getReader()` đọc stream theo chunk.
2. Gom chunk vào buffer, tách theo `\n`, parse từng event.
3. Event `meta` → tạo bong bóng chat rỗng + bắt đầu hiệu ứng gõ chữ.
4. Event `delta` → **không hiển thị ngay**, mà đẩy vào một hàng đợi (`queueRef`).

**Thuật toán typewriter (`tick`):**

- Token từ mạng về theo từng burst (cụm) không đều. Nếu render thẳng, chữ giật cục.
- Một timer chạy mỗi **16ms** (~60fps), mỗi lần "nhả" vài ký tự từ hàng đợi ra màn hình.
- Số ký tự nhả mỗi tick **tự thích nghi**: `step = max(2, ceil(độ_dài_hàng_đợi / 8))`. Nếu backlog lớn (model trả nhanh) thì nhả nhanh hơn để không bị tụt lại; nếu ít thì gõ chậm rãi.
- Khi stream `done` và hàng đợi cạn → dọn timer, đặt lại trạng thái idle, focus lại ô input.

> **Đây là điểm "ăn tiền":** mình tách rõ **tốc độ mạng** (không kiểm soát được, về theo cụm) khỏi **tốc độ hiển thị** (mượt, đều). Hàng đợi đóng vai trò buffer trung gian. Con trỏ nhấp nháy trong lúc gõ, và chỉ hiện "typing indicator" (3 chấm) trước khi token đầu tiên về.

**Phân biệt stream vs lỗi:** client kiểm tra `content-type`. Nếu là `ndjson` → đọc stream. Nếu là JSON thường (rate limit 429, validation 400/413) → đọc `.json()` và hiện thông báo.

### 3.4. Rate limiting (backend)

**Thuật toán:** fixed-window counter theo IP, lưu in-memory bằng `Map`.

- Mỗi IP có một "bucket": `{ count, resetAt }`.
- Cấu hình: **15 request / 60 giây / IP**.
- Mỗi request: nếu hết cửa sổ thời gian (`now > resetAt`) → reset bucket. Nếu chưa và `count >= 15` → chặn (trả 429). Ngược lại `count++`.
- `sweepRateLimitBuckets()` chạy mỗi request để xóa bucket hết hạn, tránh `Map` phình vô hạn (memory leak).

**Lấy IP:** đọc header `x-forwarded-for` (lấy IP đầu tiên trong chuỗi proxy), fallback `x-real-ip`.

> **Hạn chế (phải thừa nhận):** in-memory chỉ đúng cho **single instance**. Trên serverless/multi-instance (Vercel), mỗi instance có Map riêng → giới hạn không chính xác. Code đã ghi chú: production scale thật cần **Redis/Upstash** (shared store). Với portfolio cá nhân, in-memory là đủ và không thêm dependency.

> Đây cũng là chống lạm dụng cơ bản: ai đó spam để đốt API credit của bạn sẽ bị chặn.

### 3.5. Các biện pháp an toàn khác

- **Timeout 20s** qua `AbortController` — hủy request nếu provider treo.
- **Giới hạn độ dài input** 2000 ký tự (chống đốt token).
- **Giới hạn lịch sử hội thoại** 20 lượt gần nhất (`MAX_HISTORY`) — giữ prompt size ổn định.
- **API key chỉ ở server** (`process.env.OPENAI_API_KEY`) — không bao giờ lộ ra client.
- **Không leak lỗi provider** ra client — lỗi gốc chỉ `console.error` ở server, client nhận thông báo thân thiện đã được map sẵn.
- Hỗ trợ provider OpenAI-compatible (đổi `OPENAI_BASE_URL`) như OpenRouter, kèm header `HTTP-Referer`/`X-Title` khi cần.

### 3.6. System prompt (file `lib/ai-system-prompt.ts`)

System prompt không hardcode mà **build từ JSON có cấu trúc** (`data/ai-system-prompt.json`): gồm `persona` + các `sections` (mỗi section có title + danh sách items). Hàm `buildSystemPrompt` ghép thành text có format gạch đầu dòng. Dễ chỉnh sửa hành vi AI mà không sửa code.

---

## 4. Deep Linking — đồng bộ state ↔ URL

File: `hooks/use-url-state.ts` + tích hợp trong `ide-layout.tsx`.

### 4.1. Cơ chế

State của IDE (file đang mở, theme, panel nào đang bật) được phản ánh vào query params của URL:

```
/?file=projects.js&theme=dracula&copilot=true
```

- `getURLState()` đọc params hiện tại (an toàn cho SSR — kiểm tra `searchParams` tồn tại).
- `setURLState()` cập nhật params bằng `URLSearchParams`, rồi `router.push(url, { scroll: false })` — **shallow routing**, không reload trang.

### 4.2. Hai chiều đồng bộ

- **URL → State (lúc mount):** đọc params, áp dụng file/theme/panel. Cho phép mở link chia sẻ và thấy đúng view.
- **State → URL (khi thay đổi):** một `useEffect` theo dõi state, **debounce 100ms** rồi mới ghi URL.

> **Vì sao debounce?** State có thể đổi liên tục (resize, toggle nhanh). Debounce gom lại, tránh spam history và tránh vòng lặp vô hạn (URL đổi → trigger effect → đổi URL...).

> **Vì sao cần `<Suspense>` ở `app/page.tsx`?** `useSearchParams` của Next.js yêu cầu Suspense boundary để tránh lỗi hydration khi SSR. Đây là lý do `IDELayout` được bọc trong Suspense.

**Lợi ích:** link chia sẻ được (gửi nhà tuyển dụng đúng project), nút back/forward của trình duyệt hoạt động tự nhiên.

---

## 5. Full-text Search

File: `components/portfolio/search-view.tsx`. Phím tắt **Ctrl+Shift+F**.

### 5.1. Cơ chế

- **Search client-side hoàn toàn**, không có backend/API.
- Dùng `useMemo` để build kết quả mỗi khi `query` đổi (chỉ chạy khi query ≥ 2 ký tự).
- Duyệt qua **mọi mảng dữ liệu** trong `portfolio.json` (hero, about, experiences, projects, skills, contact, readme, welcome) và kiểm tra substring (case-insensitive) bằng `.toLowerCase().includes(query)`.
- Mỗi kết quả lưu: `file` (mở file nào khi click), `section`, `content`, `match`.

### 5.2. Highlight

Hàm `highlightMatch` tách text bằng regex `(${match})` với cờ `gi`, rồi bọc phần trùng trong `<mark>` có màu accent. Click kết quả → gọi `onFileSelect` → layout mở đúng "file" chứa nội dung đó.

> **Vì sao client-side?** Dữ liệu portfolio nhỏ (vài KB), nằm sẵn trong bundle. Search client cho kết quả **tức thì**, không round-trip mạng, không cần index server. Với dữ liệu lớn hơn mới cần search engine (Algolia, Elasticsearch).

> **Hạn chế:** đây là substring match đơn giản, không fuzzy (gõ sai chính tả là trượt), không xếp hạng theo độ liên quan. Đủ dùng cho phạm vi portfolio.

---

## 6. Theme System

File: `components/portfolio/theme-context.tsx` + `themes.ts`.

### 6.1. Cơ chế CSS Variables

- Mỗi theme là một `ThemePalette` (object màu: background, foreground, accent, terminal colors...).
- Khi đổi theme, `applyThemeVars()` **ghi tất cả màu vào CSS variables** trên thẻ `<html>` (`root.style.setProperty`).
- Tailwind token (`bg-background`, `text-foreground`) và custom token (`--surface`, `--accent-pink`) đều trỏ vào các biến này → **đổi 1 chỗ, cả app đổi màu** không cần re-render component nào.
- `data-theme` attribute đặt trên `<html>` làm hook cho CSS đặc thù theme (scrollbar...).

### 6.2. Persistence

Theme đang chọn lưu vào `localStorage` (key `portfolio-theme`). Lúc mount đọc lại; nếu không có hoặc không hợp lệ → dùng `defaultThemeId`.

> **Vì sao CSS variables thay vì class/context?** Đổi biến CSS là thao tác native của trình duyệt, **không tốn re-render React**. Nếu truyền màu qua context, mọi component dùng màu sẽ re-render khi đổi theme.

`cycleTheme()` cho phép nhảy theme tuần tự — dùng bởi nút và lệnh `theme` trong terminal.

---

## 7. Terminal giả lập

File: `components/portfolio/terminal.tsx`.

### 7.1. Cơ chế

- Một "shell" giả: lệnh được định nghĩa trong object `COMMANDS` (help, about, skills, projects, contact, whoami, pwd, date, theme, clear, exit).
- `executeCommand` so khớp string lệnh, push output vào mảng `history`, render ra.
- Một số lệnh có hành vi đặc biệt: `clear` (xóa history), `exit` (đóng panel sau 500ms), `theme` (gọi `cycleTheme`), `date` (lấy giờ thực).
- Output của lệnh như `about`, `contact` được **lấy động từ `portfolio.json`** (không hardcode).

### 7.2. Các tính năng UX của terminal thật

- **Lịch sử lệnh:** mảng `commandHistory`, dùng phím **↑/↓** để duyệt lại (qua `historyIndex`).
- **Autocomplete:** phím **Tab** lọc các lệnh bắt đầu bằng input. Một match → tự điền; nhiều match → hiện gợi ý.
- **Tab bar:** TERMINAL / PROBLEMS / OUTPUT (mô phỏng panel dưới của VS Code).
- Auto-scroll xuống đáy khi có output mới.

---

## 8. Keybindings

File: `hooks/use-keybindings.ts`.

### 8.1. Cơ chế

- Một **registry tập trung** (`KEYBINDINGS`) khai báo mọi phím tắt: id, tổ hợp phím, mô tả, label hiển thị.
- `useKeybindings(handlers)` lặp qua registry và gọi `useHotkeys` cho từng binding. Component sở hữu state (layout) truyền vào các handler tương ứng.
- `mod` = Cmd trên macOS, Ctrl trên Windows/Linux (giống quy ước VS Code).

| Phím         | Hành động            |
| ------------ | -------------------- |
| Ctrl+P       | Command palette      |
| Ctrl+B       | Toggle file explorer |
| Ctrl+L       | Toggle AI copilot    |
| Ctrl+`       | Toggle terminal      |
| Ctrl+Shift+F | Search workspace     |

> **Lưu ý kỹ thuật:** gọi `useHotkeys` trong vòng lặp thường vi phạm Rules of Hooks. Ở đây an toàn vì `KEYBINDINGS` là **hằng số module-level** → số lần gọi hook luôn cố định, cùng thứ tự mỗi render. Điều này được ghi chú rõ trong code.
> `enableOnFormTags: true` để phím tắt vẫn chạy khi con trỏ đang ở ô input/terminal.

---

## 9. Welcome Screen (trải nghiệm lần đầu)

File: `components/portfolio/welcome-content.tsx`, logic trong `ide-layout.tsx`.

### Cơ chế

- Lần đầu truy cập: mở tab `Welcome.md` mặc định.
- Dùng `localStorage` key `portfolio-welcomed` để nhớ. Khi user điều hướng sang file khác → đặt cờ đã xem.
- Lần sau quay lại: bỏ qua welcome, mở thẳng `home.tsx`.
- Vẫn mở lại được thủ công từ file explorer.

---

## 10. SEO & PWA

- `app/layout.tsx`: metadata (title, description, Open Graph...).
- `app/sitemap.ts`, `app/robots.ts`: sitemap + robots tự sinh.
- `app/manifest.ts`: web manifest (PWA-ready).
- `@vercel/analytics`: đo lường traffic.

---

## 11. Bộ câu hỏi phỏng vấn dự kiến + gợi ý trả lời

**Q: Streaming hoạt động thế nào end-to-end?**
A: Provider LLM trả SSE → backend parse, gói lại thành NDJSON gửi qua `ReadableStream` → frontend đọc bằng `getReader()`, đẩy delta vào hàng đợi → timer 16fps nhả vài ký tự mỗi tick để hiện mượt. Tách biệt tốc độ mạng và tốc độ render.

**Q: Vì sao không stream thẳng SSE của OpenAI về client?**
A: Cần gói cả FAQ và fallback vào cùng một format, kèm metadata `source`. NDJSON tự định nghĩa cho phép thống nhất một code path ở client và không lộ chi tiết provider.

**Q: Rate limit của bạn có nhược điểm gì?**
A: In-memory nên chỉ đúng với single instance; multi-instance cần Redis. Fixed-window cũng có "burst ở rìa cửa sổ" (cho phép gấp đôi quanh ranh giới); sliding window/token bucket sẽ mượt hơn. Với portfolio thì đánh đổi này chấp nhận được.

**Q: FAQ matching có phải AI không?**
A: Không, đó là rule-based scoring 3 tầng (exact / substring / token-overlap). Nâng cấp ngữ nghĩa thật sự cần embeddings + vector search.

**Q: Làm sao tránh vòng lặp vô hạn khi sync URL?**
A: Debounce 100ms, và effect chỉ ghi URL chứ không đọc lại để set state trong cùng chu kỳ; việc đọc URL chỉ làm một lần lúc mount.

**Q: Đổi theme có làm chậm app không?**
A: Không, vì chỉ ghi CSS variables trên `<html>` — trình duyệt tự repaint, không re-render cây React.

**Q: Bảo mật API key thế nào?**
A: Key chỉ tồn tại ở server (env var), client không bao giờ thấy. Mọi lời gọi LLM đi qua route `/api/chat`.

**Q: Search có scale không?**
A: Hiện client-side substring, đủ cho dữ liệu nhỏ trong bundle. Dữ liệu lớn cần search service (Algolia/Elastic) hoặc index phía server.

---

## 12. Những điểm nên chủ động thừa nhận (cho thấy sự trung thực kỹ thuật)

- Rate limit in-memory không phù hợp multi-instance → cần Redis cho production scale.
- FAQ là keyword matching, không hiểu ngữ nghĩa.
- Search không fuzzy, không ranking.
- "File" trong IDE là render có điều kiện, không phải router thật (đánh đổi: đơn giản, nhưng mỗi file không có URL path riêng — bù lại bằng deep-linking qua query param).

Thừa nhận hạn chế kèm hướng nâng cấp thường gây ấn tượng tốt hơn là khẳng định "không có nhược điểm".
