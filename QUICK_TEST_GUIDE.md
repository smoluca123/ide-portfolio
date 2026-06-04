# 🎯 Quick Test Guide - 4 New Features

Server đang chạy tại: **http://localhost:3001**

---

## ✅ Test Feature 1: Welcome Screen (First Visit)

1. Mở trình duyệt: `http://localhost:3001`
2. Bạn sẽ thấy **Welcome.md** tab mở đầu tiên
3. Click vào các file trong **"Start Here"** section
4. Refresh lại page → Welcome sẽ không hiện nữa (vì đã visited)
5. **Reset để test lại**: Mở Console (F12) → gõ:
   ```js
   localStorage.removeItem("portfolio-welcomed");
   ```
   Refresh → Welcome sẽ xuất hiện lại

---

## ✅ Test Feature 2: Deep Linking (URL State)

### Test thủ công:

1. Mở file bất kỳ, ví dụ `projects.js`
2. Xem URL bar → sẽ thấy `?file=projects.js`
3. Đổi theme (góc dưới bên phải status bar)
4. URL sẽ update → `?file=projects.js&theme=<theme-name>`
5. Copy URL này
6. Mở tab mới và paste URL → state giống hệt!

### Test với URL có sẵn:

- `http://localhost:3001/?file=projects.js&theme=dracula`
- `http://localhost:3001/?file=Resume.pdf&theme=monokai`
- `http://localhost:3001/?file=experience.ts&theme=github-dark`

### Test browser back/forward:

1. Mở nhiều files khác nhau
2. Click nút **Back** của browser → file sẽ quay về
3. Click **Forward** → file tiến tới

---

## ✅ Test Feature 3: Search Workspace (Ctrl+Shift+F)

### Cách 1: Dùng keyboard

1. Press `Ctrl+Shift+F`
2. Left sidebar sẽ chuyển sang **Search view**
3. Gõ search query, ví dụ:
   - `React` → tìm tất cả nơi mention React
   - `FastAPI` → tìm trong experience/projects
   - `TypeScript` → tìm trong skills
   - `Email` → tìm trong contact
4. Click vào result → nhảy đến file tương ứng

### Cách 2: Dùng mouse

1. Click icon **🔍 Search** ở activity bar (thanh trái)
2. Search như trên

### Test cases tốt:

- `Python` → sẽ tìm trong experience + skills
- `Portfolio` → sẽ tìm trong hero + about
- `AWS` → sẽ tìm trong skills + experience
- `GitHub` → sẽ tìm trong contact + projects

---

## ✅ Test Feature 4: Resume Download

### Test download:

1. Click vào **Resume.pdf** trong file explorer (bên trái)
2. Hoặc press `Ctrl+P` → gõ "Resume" → Enter
3. Sẽ thấy resume preview card đẹp
4. Click nút **"Download Resume (PDF)"**
5. File sẽ tải về (hiện tại là mock file)

### Replace với resume thật:

1. Đưa file PDF của bạn vào `public/`
2. Rename thành `Aahana_Resume.pdf`
3. Hoặc đổi tên file trong `components/portfolio/resume-content.tsx` line 12:
   ```tsx
   link.href = "/Your_Custom_Name.pdf";
   ```

---

## 🎹 Keyboard Shortcuts Cheat Sheet

Test tất cả shortcuts sau:

| Key            | Action          | Expected Result              |
| -------------- | --------------- | ---------------------------- |
| `Ctrl+P`       | Command Palette | Modal mở, list files         |
| `Ctrl+B`       | Toggle Explorer | Sidebar trái mở/đóng         |
| `Ctrl+L`       | Toggle Copilot  | Panel phải mở/đóng (AI chat) |
| `Ctrl+``       | Toggle Terminal | Terminal dưới mở/đóng        |
| `Ctrl+Shift+F` | Search          | Sidebar chuyển sang search   |

---

## 🔍 Additional Manual Tests

### Test responsive:

1. Resize browser window → sidebar thành overlay drawer trên mobile
2. Click vào file → drawer tự động đóng

### Test themes:

1. Click theme name ở status bar (góc dưới phải)
2. Chọn theme khác → màu đổi ngay
3. URL sẽ update với `?theme=<name>`

### Test URL persistence:

1. Mở file + đổi theme
2. Copy URL
3. Đóng browser hoàn toàn
4. Mở lại và paste URL → state được restore

### Test search highlighting:

1. Search một keyword như "React"
2. Trong results, từ "React" sẽ được highlight màu accent
3. Click result → nhảy đến file

---

## 📸 What to Look For

### Welcome Screen should have:

- ✅ Big sparkle icon ở giữa
- ✅ "Start Here" section với 4 files có icon emoji
- ✅ "Keyboard Shortcuts" section bên phải
- ✅ 3 feature cards ở dưới (Interactive IDE, AI Assistant, Terminal)
- ✅ Pro tip với Ctrl+P ở cuối

### Search View should have:

- ✅ Search input với icon 🔍
- ✅ "Search in portfolio..." placeholder
- ✅ Empty state khi chưa search
- ✅ Results với file icon, section name, và highlighted text
- ✅ Result count: "X results in workspace"

### Resume View should have:

- ✅ Big file icon ở giữa
- ✅ "Resume / CV" heading
- ✅ Mock preview card với PDF icon
- ✅ Blue download button
- ✅ "Available for opportunities" badge (green)

---

## 🐛 Common Issues & Fixes

### Welcome không hiện:

```js
// Console (F12):
localStorage.clear();
location.reload();
```

### Search không tìm thấy:

- Đảm bảo gõ ít nhất 2 ký tự
- Thử keyword đơn giản: "React", "Python", "Email"

### Resume không download:

- Check file `public/Aahana_Resume.pdf` có tồn tại
- Xem Console (F12) có lỗi không

### URL không sync:

- Hard refresh: `Ctrl+Shift+R`
- Clear cache

---

## ✅ Checklist - Test All 4 Features

- [ ] Welcome screen hiện lần đầu
- [ ] Click file trong Welcome → navigate OK
- [ ] Welcome không hiện lần 2 (sau khi navigate)
- [ ] Mở file → URL có `?file=`
- [ ] Đổi theme → URL có `?theme=`
- [ ] Copy URL → paste tab mới → state giống
- [ ] Browser back/forward hoạt động
- [ ] `Ctrl+Shift+F` mở Search
- [ ] Search "React" → có results
- [ ] Click result → nhảy file đúng
- [ ] Highlighted text trong results
- [ ] Mở Resume.pdf từ explorer
- [ ] Mở Resume.pdf từ Ctrl+P
- [ ] Click Download → file tải về
- [ ] Test responsive (resize window)
- [ ] Tất cả keyboard shortcuts hoạt động

---

## 🎉 Success Criteria

Nếu tất cả tests trên pass → **4 features hoạt động hoàn hảo!**

Bạn có thể:

1. ✅ Share specific views qua URL
2. ✅ Search toàn bộ portfolio content
3. ✅ Download resume dễ dàng
4. ✅ Welcome first-time visitors properly

---

## 📝 Next: Replace Mock Data

Khi ready deploy:

1. **Replace resume**: `public/Aahana_Resume.pdf`
2. **Update portfolio data**: `data/portfolio.json`
3. **Customize welcome**: `components/portfolio/welcome-content.tsx`

Done! 🚀
