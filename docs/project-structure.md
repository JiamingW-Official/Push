# Push — Next.js 14 App Router 目录结构

## 技术选型速查

| 层 | 方案 | 备注 |
|---|---|---|
| 框架 | Next.js 14 App Router | Server Components 默认 |
| 样式 | Vanilla CSS + CSS Variables | 无 Tailwind、无 UI 库 |
| 字体 | Darky + CS Genio Mono | 本地 @font-face，public/fonts/ |
| 地图 | react-leaflet + OpenStreetMap | 免费无限制 |
| 后端/Auth | Supabase (email/password) | 免费 tier |
| 动画 | GSAP + Lenis | 与 Design.md 一致 |

---

## 目录结构

```
push/
├── app/
│   │
│   ├── (marketing)/                    # Route group — 不出现在 URL
│   │   ├── layout.tsx                  # Landing layout（含 header/footer）
│   │   └── page.tsx                    # / → Landing page
│   │
│   ├── (creator)/                      # Route group
│   │   ├── layout.tsx                  # Creator layout（最简，无公共导航）
│   │   ├── signup/
│   │   │   └── page.tsx                # /signup → Creator signup 表单
│   │   └── dashboard/
│   │       └── page.tsx                # /dashboard → Creator 地图 + Campaign 列表
│   │
│   ├── (merchant)/                     # Route group
│   │   ├── layout.tsx                  # Merchant layout
│   │   └── signup/
│   │       └── page.tsx                # /signup → Merchant signup 表单
│   │                                   # ⚠️ /signup 路径与 creator 冲突，见下方说明
│   │
│   ├── layout.tsx                      # Root layout — <html>, 字体 class, globals.css
│   └── globals.css                     # 全局 CSS variables + @font-face + reset
│
├── components/
│   ├── ui/                             # 纯展示原子组件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── FormField.tsx               # label + input + error message
│   │   └── CampaignCard.tsx            # Campaign 列表卡片
│   │
│   └── layout/                         # 页面级结构组件
│       ├── Header.tsx                  # Landing page 导航（Headroom.js）
│       ├── Footer.tsx                  # Landing page 页脚
│       └── MapView.tsx                 # react-leaflet 地图（Client Component）
│
├── lib/
│   ├── supabase.ts                     # createClient — browser + server 两个实例
│   └── utils.ts                        # cn(), formatDate(), 等通用工具
│
├── public/
│   └── fonts/
│       ├── Darky.woff2                 # 标题字体
│       └── CSGenioMono.woff2           # 正文字体
│
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## Route 冲突说明

Creator `/signup` 和 Merchant `/signup` 在 App Router 中同属根路径下，**会冲突**。解决方案二选一：

**方案 A（推荐）— 区分路径：**
```
(creator)/creator/signup/page.tsx   → /creator/signup
(merchant)/merchant/signup/page.tsx → /merchant/signup
```

**方案 B — 单一 signup 页 + query param：**
```
app/signup/page.tsx  → /signup?role=creator | /signup?role=merchant
```

推荐方案 A，语义清晰，后续可独立扩展。

---

## globals.css 结构

```css
/* 1. @font-face */
@font-face {
  font-family: 'Darky';
  src: url('/fonts/Darky.woff2') format('woff2');
  font-display: swap;
}

@font-face {
  font-family: 'CSGenioMono';
  src: url('/fonts/CSGenioMono.woff2') format('woff2');
  font-display: swap;
}

/* 2. CSS Variables */
:root {
  /* Brand Colors */
  --color-flag-red:     #c1121f;
  --color-molten-lava:  #780000;
  --color-pearl-stone:  #f5f2ec;
  --color-deep-space:   #003049;
  --color-steel-blue:   #669bbc;

  /* Typography */
  --font-display: 'Darky', serif;
  --font-body:    'CSGenioMono', monospace;

  /* Spacing (8px grid) */
  --space-1:  8px;
  --space-2:  16px;
  --space-3:  24px;
  --space-4:  32px;
  --space-6:  48px;
  --space-8:  64px;
  --space-10: 80px;
  --space-15: 120px;

  /* Layout */
  --content-width: 1180px;
  --border-radius: 0;          /* Push: 直角系统 */
}

/* 3. Reset */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: var(--font-body);
  background-color: var(--color-papaya-whip);
  color: var(--color-deep-space);
}
```

---

## react-leaflet 地图注意事项

- `MapView.tsx` 必须标记 `'use client'`（Leaflet 依赖 `window`）
- 在 `globals.css` 中 import leaflet CSS：`@import 'leaflet/dist/leaflet.css';`
- Map pin 的 `border-radius` 允许 `50%`（Design.md 例外项）
- SSR 时用 `dynamic(() => import('../components/layout/MapView'), { ssr: false })` 引入

---

## Supabase lib/supabase.ts 结构

```ts
// Browser client (Client Components)
import { createBrowserClient } from '@supabase/ssr'
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

// Server client (Server Components / Route Handlers)
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
export const createServerSupabaseClient = () =>
  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    { cookies: { get: (name) => cookies().get(name)?.value } }
  )
```

所需环境变量：
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```
