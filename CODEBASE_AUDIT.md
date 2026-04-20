# Push v5.2 代码质量审查清单

## TypeScript & 类型安全

### Global Search
```bash
# 检查是否有 'any' 类型
grep -r "any" src/ lib/ app/ --include="*.ts" --include="*.tsx"
# 应该返回 0 结果，或仅在必要时使用

# 检查是否有未处理的 Promise
grep -r "Promise" src/ lib/ app/ --include="*.ts" --include="*.tsx" | grep -v "await" | grep -v "catch"
# 应该检查是否所有 async 都有 await

# 检查 TypeScript 编译
npm run type-check
# 应该返回 0 error
```

### 检查清单
- [ ] `npm run type-check` 通过，0 errors
- [ ] 没有 `// @ts-ignore` 注释
- [ ] 所有函数都有返回类型标注（`:PromiseType<T>`）
- [ ] 所有 interface props 都有 JSDoc 注释
- [ ] 没有 `any` 类型（除非必要）
- [ ] 所有 async 函数都正确处理 error

---

## 设计系统一致性

### 颜色检查
```bash
# 搜索所有硬编码的颜色
grep -r "#[0-9a-fA-F]\{6\}" src/ lib/ app/ --include="*.tsx"
```

应该只看到这 5 个品牌色：
- [ ] `#c1121f` - Flag Red ✅
- [ ] `#780000` - Molten Lava ✅
- [ ] `#f5f2ec` - Pearl Stone ✅
- [ ] `#003049` - Deep Space Blue ✅
- [ ] `#669bbc` - Steel Blue ✅

其他允许的颜色：
- [ ] `#ffffff` - 白色（卡片背景）
- [ ] `#000000` / `#ffffff` - 文字颜色
- [ ] 灰色系：`#e5e7eb`, `#d1d5db`, `#6b7280`（UI 辅助）

### 字体检查
```bash
grep -r "fontFamily" src/ lib/ app/ --include="*.tsx"
```

应该只有：
- [ ] `fontFamily: 'Darky'` - 标题
- [ ] `fontFamily: 'CS Genio Mono'` - UI/正文
- [ ] 不应该有其他字体

### Border-radius 检查
```bash
grep -r "border-radius" src/ lib/ app/ --include="*.tsx" --include="*.css"
```

应该只有：
- [ ] `border-radius: 0` - 所有元素（直角）✅
- [ ] `border-radius: 4px` - **仅 ProgressBar** ✅
- [ ] `border-radius: 50%` - **仅 map pins 和特殊圆形元素** ✅

### 间距检查
```bash
# 检查是否都用 8px 基础网格
grep -r "padding:" src/ lib/ app/ --include="*.tsx"
grep -r "margin:" src/ lib/ app/ --include="*.tsx"
```

应该看到（都是 8 的倍数）：
- [ ] `p-4` (16px), `p-8` (32px), `p-12` (48px)
- [ ] `m-4`, `m-8`, `m-12`, `mb-12`, `gap-8`
- [ ] 不应该有 `p-5`, `p-6`, `p-7` 等非 8 的倍数

---

## 错误处理

### API Error Handling
```bash
# 检查是否所有 fetch 都有 try-catch
grep -r "fetch(" src/ lib/ app/ --include="*.ts" --include="*.tsx" -A 10 | grep -E "(try|catch)" 
```

检查清单：
- [ ] 所有 fetch 都在 try-catch 中
- [ ] catch 中都有 error 日志或 error state
- [ ] 所有 API 都有 fallback（mock 数据或默认值）
- [ ] 错误信息用户友好（不显示 stack trace）

### Database Error Handling
- [ ] 所有 db.select() 都有 catch
- [ ] 所有 db.insert() 都有 catch
- [ ] 数据库连接失败时不应该 crash app

### React Hook Error Handling
- [ ] useEffect 中的 async 都用 try-catch
- [ ] 所有 async 操作都有 loading state
- [ ] 所有 async 操作都有 error state

---

## 性能优化

- [ ] 图片组件用 `next/image` 而不是 `<img>`
- [ ] 长列表用 virtualization（如果 >100 项）
- [ ] useCallback 用于事件处理函数
- [ ] useMemo 用于复杂计算
- [ ] 检查是否有不必要的 re-render（用 React DevTools Profiler）

---

## 安全性

- [ ] 没有敏感信息在代码中（API key、密码等）
- [ ] 所有用户输入都验证（前端）
- [ ] 没有 SQL injection 风险（用 Supabase 的 client）
- [ ] CORS 配置正确
- [ ] 没有 XSS 风险（React 自动转义）

---

## 代码质量

```bash
# 检查 linting
npm run lint

# 检查构建
npm run build
```

- [ ] `npm run lint` 0 warnings
- [ ] `npm run build` 成功，没有 error
- [ ] 没有 `console.log()` 在生产代码中
- [ ] 没有 `debugger` 语句
- [ ] 没有 `// TODO` 或 `// FIXME` 注释（或已完成）

---

## 数据库

- [ ] 所有表都有 `created_at` 和 `updated_at` timestamps
- [ ] 所有 foreign keys 都有 INDEX
- [ ] 没有死数据（orphaned records）
- [ ] 所有数值字段有 CHECK constraints（如分数 0-1）

---

## 测试

```bash
npm run test
npm run test -- --coverage
```

- [ ] 所有 services 有单元测试
- [ ] 单元测试覆盖率 >80%
- [ ] 关键 API endpoints 有集成测试
- [ ] 没有 skip 的测试（`.skip` 或 `.only`）

---

## 部署前检查

- [ ] 没有 hardcoded URLs（用环境变量）
- [ ] 环境变量在 `.env.example` 中有列表
- [ ] 生产数据库 URL 不在代码中
- [ ] API endpoints 可以处理 high load（没有 N+1 queries）
- [ ] 数据库连接池配置正确

---

## 快速修复命令

```bash
# 1. 类型检查
npm run type-check

# 2. Lint 检查
npm run lint

# 3. 构建测试
npm run build

# 4. 运行测试
npm run test

# 5. 查看覆盖率
npm run test -- --coverage
```

如果有 error，逐个修复，然后重复上面的命令。
