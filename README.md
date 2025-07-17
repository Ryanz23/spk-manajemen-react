# SPK Frontend (React + Vite + TailwindCSS)

Ini adalah proyek frontend untuk aplikasi Sistem Pendukung Keputusan (SPK) yang dibangun menggunakan **React**, **Vite**, dan **Tailwind CSS**. Aplikasi ini terhubung dengan backend berbasis Express yang menyediakan data alternatif, kriteria, dan skor.

---

## 🔧 Teknologi yang Digunakan

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/) — untuk request API

---

## 🚀 Instalasi

**1. Clone repositori ini**

```bash
git clone https://github.com/kamu/spk-react.git
cd spk-react
```

**2. Install dependencies**

```bash
npm install
```

**3. Jalankan proyek**
```bash
npm run dev
```

---

## 🧪 Struktur Folder

```bash
spk-manajemen-react/
├── eslint.config.js
├── package.json
├── package-lock.json
├── public/
│   └── vite.svg
├── README.md
├── src/
│   ├── api/
│   ├── App.tsx
│   ├── assets/
│   ├── components/
│   ├── main.tsx
│   ├── pages/
│   ├── styles/
│   └── vite-env.d.ts
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## 🔗 Koneksi ke Backend

**1. Konfigurasi file `src/api/axios.ts`:**

```bash
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // Ganti sesuai URL backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
```

**2. Repository backend:**

```bash
https://github.com/Ryanz23/simple-backend-with-express
```

---

## 📄 Fitur Utama

- Melihat, menambahkan, mengubah, dan menghapus Kriteria
- Melihat, menambahkan, mengubah, dan menghapus Alternatif
- Menginput dan menampilkan Skor
- Berbasis REST API
- Styling modern dengan TailwindCSS

---

## 📍 Catatan

Pastikan backend kamu sudah berjalan di port yang sesuai (`localhost:3000` atau yang lain), dan endpointnya tersedia sebelum mengakses frontend ini.

---

## 🙌 Kontribusi

Pull request dan masukan selalu diterima! 😄  
[Ryanz23](https://github.com/Ryanz23)