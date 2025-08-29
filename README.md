# 📖 BookSpace

## Deskripsi Proyek
BookSpace adalah aplikasi web sederhana untuk menampilkan daftar buku fiksi yang dapat dicari berdasarkan judul maupun kategori. Pengguna dapat melakukan registrasi dan login untuk mengakses dashboard. Setelah login, pengguna dapat menandai buku favorit, melihat detail buku, dan mengelola koleksi favorit mereka.  
Proyek ini dikembangkan sebagai bagian dari technical test frontend dengan menggunakan **Next.js (App Router)**, **Tailwind CSS**, dan state management sederhana.

---

## 🚀 Cara Menjalankan Secara Lokal
1. **Clone repository**
   ```bash
   git clone https://github.com/username/bookspace.git
   cd bookspace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Tambahkan file `.env.local`** dengan variabel berikut:
   ```env
   DUMMY_EMAIL=test@example.com
   DUMMY_PASSWORD=123456
   ```

4. **Jalankan development server**
   ```bash
   npm run dev
   ```
   Akses di [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Tech Stack
- **Framework**: [Next.js 13+ (App Router)](https://nextjs.org/)  
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)  
- **State Management**: React Context API untuk autentikasi  
- **Storage**: LocalStorage untuk menyimpan daftar favorit  
- **Mock API**: API Route Next.js (`/api/books`, `/api/login`, `/api/register`)  

---

## 📌 Fitur yang Dikembangkan
- **Authentication**:  
  - Register akun baru  
  - Login dengan validasi email & password  
  - Proteksi halaman dashboard (hanya user login yang bisa akses)  

- **Dashboard**:  
  - Pencarian buku berdasarkan judul  
  - Menambah/menghapus buku
  - Menampilkan grid daftar buku  

- **Favorites**:  
  - Menambah atau menghapus buku dari daftar favorit  
  - Menyimpan favorit per user di localStorage  

- **Book Detail**:  
  - Halaman detail setiap buku dengan deskripsi & cover  

- **UI/UX**:  
  - Navbar dinamis
  - Skeleton loading untuk grid buku  
  - Responsif (desktop & mobile)

