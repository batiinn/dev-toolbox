# 🧰 Dev Toolbox — Geliştirici Araç Kutusu

> Geliştiriciler için **çevrimdışı** çalışan, gizlilik odaklı araç kutusu.
> JSON, JWT, Base64, hash, regex ve 34 araç — hepsi tarayıcınızda. **Veriniz asla dışarı çıkmaz.**

[English below ↓](#-english)

---

## 🇹🇷 Türkçe

Her geliştiricinin günde defalarca ihtiyaç duyduğu küçük araçlar tek bir yerde:
JSON formatla, JWT çöz, Base64'e çevir, hash al, cron ifadesini Türkçe oku...
Çoğu online araç bu verileri kendi sunucularına gönderir. **Dev Toolbox göndermez** —
tüm işlemler tarayıcınızda yapılır, internet bağlantısı olmadan da çalışır (PWA).

### ✨ Öne çıkanlar

- 🔒 **%100 client-side** — hiçbir veri sunucuya gitmez, analitik yok
- 📴 **Çevrimdışı çalışır** — PWA olarak telefona/masaüstüne kurulabilir; fontlar bile self-hosted
- 🇹🇷 **TR + EN** arayüz, Türkçe'ye özel araçlar (deasciifier, Türkçe-uyumlu slugify, Türkçe cron)
- ⌘ **Komut paleti** — `Ctrl/Cmd + K` ile her araca anında ulaşın
- 🕘 **Son kullanılanlar** + tek tıkla kopyalama (toast bildirimi)
- ⚡ **Hızlı** — her araç ayrı yüklenir (code-splitting); başlangıç paketi küçük
- 🌗 Koyu / açık tema · ♿ erişilebilir (klavye + odak halkaları)

### 🧩 Araçlar (34)

| Kategori | Araçlar |
|---|---|
| **Kodlama / Çözme** | Base64, URL, HTML Entity, JWT Çözücü, JSON String Escape, Resim → Base64 |
| **Üreteçler** | UUID (v4/v7), Parola, Hash (MD5/SHA-1/256/512, dosya destekli), Lorem Ipsum, QR Kod |
| **Dönüştürücüler** | JSON ↔ YAML, JSON → CSV/TSV, Zaman Damgası, Sayı Tabanı, Renk (HEX/RGB/HSL), Renk Paleti, CSS Birimi (px↔rem↔em) |
| **Biçimlendiriciler** | JSON (beautify/minify), SQL, XML, Markdown Önizleme |
| **Metin** | Harf Biçimi (camel/snake/kebab...), Satır İşlemleri, Slug, Türkçe→ASCII, Metin Diff, Metin İstatistikleri |
| **Web / Geliştirici** | Regex Test, Cron Açıklayıcı (+ sıradaki çalışmalar), URL Çözümleyici, cURL → fetch, chmod Hesaplayıcı, HTTP Durum Kodları (TR) |

### 🚀 Kurulum

```bash
git clone https://github.com/batiinn/dev-toolbox.git
cd dev-toolbox
npm install
npm run dev        # http://localhost:5173
```

### 📜 Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Üretim derlemesi (`dist/`) |
| `npm run preview` | Derlemeyi yerelde önizle |
| `npm run test` | Birim testlerini çalıştır |

### 🛠️ Teknoloji

React 19 · TypeScript · Vite · Tailwind CSS · react-i18next · vite-plugin-pwa

### 🤝 Katkı

Yeni bir araç eklemek çok kolay:

1. Saf mantığı `src/lib/` içine yaz (UI'dan bağımsız, test edilebilir).
2. `src/tools/<kategori>.tsx` içine UI bileşenini ekle.
3. `src/tools/registry.ts` içine kaydet.
4. `src/i18n/tr.json` ve `en.json` içine isim/açıklama ekle.

PR'lar ve öneriler memnuniyetle karşılanır.

---

## 🇬🇧 English

A **privacy-first, offline** toolbox for developers. JSON, JWT, Base64, hash, regex
and 34 tools — all running in your browser. **Your data never leaves the page.**

Most online dev tools send your input to their servers. Dev Toolbox doesn't:
everything runs client-side and works without an internet connection (PWA).

### Highlights

- 🔒 100% client-side — no server, no analytics
- 📴 Works offline — installable PWA
- 🇹🇷🇬🇧 Turkish + English UI, with Turkish-specific tools
- ⌘ Command palette — reach any tool with `Ctrl/Cmd + K`
- 🌗 Dark / light theme

### Getting started

```bash
npm install
npm run dev
```

## 📄 License

[MIT](LICENSE) © 2026 Batın
