# Pre-Launch Checklist / Чек-лист перед запуском

## English
- [ ] All HTML/CSS/JS files are properly linked
- [ ] `.env` file is created with database credentials
- [ ] `.env` file is added to `.gitignore`
- [ ] `.htaccess` files are in place for security
- [ ] `Db/submit.php` uses environment variables
- [ ] Database table `contacts` is created
- [ ] Contact form is tested locally
- [ ] Images and icons are loading correctly
- [ ] Mobile menu works properly
- [ ] Smooth scrolling works on all links
- [ ] No console errors in browser DevTools
- [ ] Page loads without `script-terminal.js` (removed)
- [ ] All SVG icons display correctly
- [ ] Favicon loads properly
- [ ] No hardcoded credentials in code
- [ ] All relative paths are correct
- [ ] `node_modules/` will not be uploaded
- [ ] `.git/` folder excluded from upload (optional)
- [ ] README.md is complete and informative

## На русском
- [ ] Все HTML/CSS/JS файлы правильно подключены
- [ ] Создан файл `.env` с учётными данными БД
- [ ] `.env` добавлен в `.gitignore`
- [ ] `.htaccess` файлы на месте для безопасности
- [ ] `Db/submit.php` использует переменные окружения
- [ ] В БД создана таблица `contacts`
- [ ] Контактная форма протестирована локально
- [ ] Изображения и иконки загружаются правильно
- [ ] Мобильное меню работает корректно
- [ ] Плавный скролл работает на всех ссылках
- [ ] Нет консольных ошибок в DevTools браузера
- [ ] Страница загружается без `script-terminal.js` (удалён)
- [ ] Все SVG иконки отображаются правильно
- [ ] Favicon загружается корректно
- [ ] Нет жёстко закодированных учётных данных в коде
- [ ] Все относительные пути правильные
- [ ] `node_modules/` не будет загружен на сервер
- [ ] Папка `.git/` исключена из загрузки (опционально)
- [ ] README.md полный и информативный

## Files Ready for Upload / Файлы готовые к загрузке

### Primary Files (Основные файлы)
- ✅ `index.html` - Main website
- ✅ `script.js` - JavaScript functionality (UPDATED - using script.js not script-terminal.js)
- ✅ `styles-terminal.css` - Terminal theme styles
- ✅ `styles.css` - Base styles

### Configuration (Конфигурация)
- ✅ `.env.example` - Template for environment variables
- ✅ `.htaccess` - Root security configuration
- ✅ `.gitignore` - Git exclusions

### Database (База данных)
- ✅ `Db/submit.php` - Form handler (UPDATED - reads from .env)
- ✅ `Db/.htaccess` - PHP security protection

### Assets (Ресурсы)
- ✅ `favicon.svg` - Website icon
- ✅ `icon-*.svg` - Social media icons
- ✅ `images/` - All images folder

### Documentation (Документация)
- ✅ `README.md` - Project README
- ✅ `DEPLOYMENT.md` - Deployment guide

### NOT to Upload (НЕ загружать)
- ❌ `node_modules/` - Dependencies not needed on server
- ❌ `.env` - Never upload with credentials (create on server)
- ❌ `.vscode/` - IDE config (can be excluded)
- ❌ `.git/` - Version control (can be excluded)
- ❌ `script-terminal.js` - OLD FILE (use script.js)

## Upload Methods / Способы загрузки

### Method 1: FTP Upload
1. Connect via FTP client (FileZilla, WinSCP, etc.)
2. Upload all files except those in "NOT to Upload" list
3. Create `.env` file on server with database credentials
4. Test the website

### Method 2: Git Deploy
1. Push code to GitHub/GitLab
2. Create `.env` file on server after clone
3. Test the website

### Method 3: SSH Upload
```bash
# Connect to server
ssh user@your-domain.com

# Upload files
rsync -avz --exclude='.env' --exclude='node_modules' --exclude='.git' . user@your-domain.com:~/public_html/

# Create .env on server with credentials
nano .env
```

## After Upload / После загрузки

1. ✅ Navigate to your domain
2. ✅ Check that pages load correctly
3. ✅ Test contact form submission
4. ✅ Verify data in database
5. ✅ Check browser console for errors
6. ✅ Test on mobile devices
7. ✅ Verify HTTPS is working (if available)
8. ✅ Set up SSL certificate (recommended)

## Database Setup / Настройка БД

Create this table in your database:

```sql
CREATE TABLE IF NOT EXISTS contacts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message LONGTEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_date (created_at)
);
```
