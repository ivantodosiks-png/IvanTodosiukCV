# Deployment Guide / Руководство по развёртыванию

## English

### Prerequisites
- Web server with PHP 7.4+ support
- MySQL/MariaDB database
- SSH access or FTP access to hosting

### Steps to Deploy

1. **Upload files to server:**
   - Upload all files EXCEPT:
     - `.env` (create on server)
     - `node_modules/` (not needed in production)
     - `.git/` (optional)
     - `.vscode/` (optional)

2. **Create database:**
   - Create new MySQL database
   - Import the following table:
   ```sql
   CREATE TABLE contacts (
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     message TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Update database credentials in `.env`:
   ```
   DB_HOST=your_host
   DB_USER=your_user
   DB_PASSWORD=your_password
   DB_NAME=your_database
   ```

4. **Set file permissions:**
   ```bash
   chmod 755 .
   chmod 644 index.html styles-terminal.css script.js favicon.svg *.svg
   chmod 755 Db/
   chmod 644 Db/submit.php
   ```

5. **Test the form:**
   - Visit your website
   - Try submitting the contact form
   - Check if data appears in database

6. **Disable debug on production:**
   - Ensure `display_errors` is OFF on production. Our `Db/submit.php` now logs errors but does not display them.
   - To be safe, remove or do not upload any `ini_set('display_errors', 1)` lines.
   - Check PHP `error_log` location on the server if you need to inspect errors.

### File Structure for Deployment
```
/public_html/
├── index.html
├── script.js
├── styles-terminal.css
├── styles.css
├── .htaccess
├── .env (create on server)
├── favicon.svg
├── icon-*.svg
├── images/
├── Db/
│   ├── .htaccess
│   └── submit.php
└── no/
    └── index.html
```

### Security Notes
- Never upload `.env` file with credentials
- Use `.htaccess` to protect PHP files
- Keep database credentials secure
- Regularly update database

---

## На русском

### Требования
- Веб-сервер с поддержкой PHP 7.4+
- MySQL/MariaDB база данных
- SSH или FTP доступ к хостингу

### Шаги развёртывания

1. **Загрузите файлы на сервер:**
   - Загрузите все файлы, КРОМЕ:
     - `.env` (создайте на сервере)
     - `node_modules/` (не нужен в продакшене)
     - `.git/` (опционально)
     - `.vscode/` (опционально)

2. **Создайте базу данных:**
   - Создайте новую базу MySQL
   - Создайте таблицу:
   ```sql
   CREATE TABLE contacts (
     id INT PRIMARY KEY AUTO_INCREMENT,
     name VARCHAR(255) NOT NULL,
     email VARCHAR(255) NOT NULL,
     message TEXT NOT NULL,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **Настройте окружение:**
   - Скопируйте файл `.env.example` в `.env`
   - Обновите данные БД:
   ```
   DB_HOST=ваш_хост
   DB_USER=имя_пользователя
   DB_PASSWORD=пароль
   DB_NAME=имя_базы
   ```

4. **Установите права доступа:**
   ```bash
   chmod 755 .
   chmod 644 index.html styles-terminal.css script.js favicon.svg *.svg
   chmod 755 Db/
   chmod 644 Db/submit.php
   ```

5. **Протестируйте форму:**
   - Откройте сайт в браузере
   - Попробуйте отправить контактную форму
   - Проверьте, что данные появились в БД

### Структура файлов для сервера
```
/public_html/
├── index.html
├── script.js
├── styles-terminal.css
├── styles.css
├── .htaccess
├── .env (создать на сервере)
├── favicon.svg
├── icon-*.svg
├── images/
├── Db/
│   ├── .htaccess
│   └── submit.php
└── no/
    └── index.html
```

### Примечания безопасности
- Никогда не загружайте `.env` файл с учётными данными
- Используйте `.htaccess` для защиты PHP файлов
- Храните учётные данные БД в безопасности
- Регулярно обновляйте БД
