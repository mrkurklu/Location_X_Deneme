# Location X Management System

Bu proje, lokasyon bazlı stok ve satış yönetim sistemi için geliştirilmiştir.

## Vercel Deployment

Bu projeyi Vercel'de deploy etmek için aşağıdaki environment variables'ları ayarlamanız gerekmektedir:

### Gerekli Environment Variables

Vercel dashboard'unda Settings > Environment Variables bölümünde aşağıdaki değişkenleri ekleyin:

```bash
# NextAuth.js Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://your-app.vercel.app

# MongoDB Configuration
MONGODB_URI=your-mongodb-connection-string

# Admin User Configuration (optional)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Custom Configuration
CUSTOM_KEY=your-custom-key
```

### NEXTAUTH_SECRET Oluşturma

Terminal'de aşağıdaki komutu çalıştırarak güvenli bir secret oluşturun:

```bash
openssl rand -base64 32
```

### MongoDB Atlas Bağlantısı

1. MongoDB Atlas'ta bir cluster oluşturun
2. Database Access bölümünde bir kullanıcı oluşturun
3. Network Access bölümünde IP whitelist'e `0.0.0.0/0` ekleyin (tüm IP'lere izin verir)
4. Connect butonuna tıklayıp connection string'i alın
5. Bu string'i `MONGODB_URI` olarak Vercel'e ekleyin

### Deployment Adımları

1. Projeyi GitHub'a push edin
2. Vercel'de yeni proje oluşturun
3. GitHub repository'nizi seçin
4. Environment variables'ları ekleyin
5. Deploy edin

## Local Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Özellikler

- Kullanıcı yönetimi ve rol tabanlı erişim kontrolü
- Stok yönetimi
- Satış takibi
- Tahmini stok hesaplama
- Responsive tasarım
- Dark/Light tema desteği
