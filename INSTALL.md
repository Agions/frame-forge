# 安装 Novella (Novella AI)

## macOS

### 选项一：Homebrew（推荐）

```bash
# 克隆并安装
brew tap Agions/tap https://github.com/Agions/homebrew-tap
brew install --cask novella
```

### 选项二：下载 DMG

从 [GitHub Releases](https://github.com/Agions/novella/releases/latest) 下载最新的 `.dmg` 文件，将 `Novella.app` 拖入 `/Applications`。

### 选项三：安装脚本

```bash
bash -c "$(curl -fsSL https://raw.githubusercontent.com/Agions/novella/main/scripts/install.sh)"
```

---

## Windows

从 [GitHub Releases](https://github.com/Agions/novella/releases/latest) 下载最新的 `.exe`（NSIS 安装程序）或 `.msi`，运行即可。

---

## Linux

### Debian / Ubuntu

```bash
curl -sL https://raw.githubusercontent.com/Agions/novella/main/scripts/install.sh | bash
```

或从 [GitHub Releases](https://github.com/Agions/novella/releases/latest) 下载 `.deb` 并运行：

```bash
sudo dpkg -i novella_*.deb
```

### Arch Linux (AUR)

```bash
yay -S novella
```

---

## 源码构建

```bash
git clone https://github.com/Agions/novella.git
cd novella
pnpm install
pnpm tauri build
```

构建产物位于 `src-tauri/target/release/bundle/`。
