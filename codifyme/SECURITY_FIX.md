# 🔒 Security Fix - API Keys & Secrets

## ⚠️ URGENT: Your API keys were exposed!

I've secured your repository by:

1. ✅ Created `.gitignore` to prevent committing sensitive files
2. ✅ Created `application.properties.example` as a template
3. ✅ Blocked `application.properties` from being committed

## 🛠️ What You Need to Do NOW:

### Step 1: Remove Secrets from Git History (CRITICAL)

Your API key is already in Git history. You need to:

**Option A: If you haven't pushed to GitHub yet:**
```bash
cd "c:\Users\itsni\Desktop\GitHub Projects\AntiGravity\codifyme"

# Remove application.properties from Git tracking
git rm --cached backend/src/main/resources/application.properties

# Commit the change
git add .gitignore
git commit -m "chore: remove sensitive data and add gitignore"
```

**Option B: If you already pushed to GitHub:**

1. **IMMEDIATELY Revoke your Gemini API Key:**
   - Go to: https://makersuite.google.com/app/apikey
   - Delete the exposed key: `AIzaSyASB9tM1uza8XK_9a65Z6tBQ9eVGMAELoI`
   - Generate a new one

2. **Clean Git history:**
```bash
# Install BFG Repo Cleaner or use git filter-branch
# This removes the file from all commits
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch backend/src/main/resources/application.properties" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history)
git push origin --force --all
```

### Step 2: Set Up Environment Variables

**For Development (Recommended):**

Create a file: `backend/src/main/resources/application-local.properties`
```properties
DB_USERNAME=root
DB_PASSWORD=Opendear@123
JWT_SECRET=verysecretkeythatshouldbechangedinproductionandstoredsecurely
GEMINI_API_KEY=your_new_api_key_here
```

Then update your IDE to use the `local` profile:
- IntelliJ: Run Configuration → Active Profiles → `local`
- Eclipse: Run Configuration → Arguments → VM Arguments → `-Dspring.profiles.active=local`

**For Production:**

Set environment variables:
```bash
# Windows
set DB_USERNAME=root
set DB_PASSWORD=your_password
set JWT_SECRET=your_jwt_secret
set GEMINI_API_KEY=your_api_key

# Linux/Mac
export DB_USERNAME=root
export DB_PASSWORD=your_password
export JWT_SECRET=your_jwt_secret
export GEMINI_API_KEY=your_api_key
```

### Step 3: Update application.properties

Replace the content of `backend/src/main/resources/application.properties` with:

```properties
spring.application.name=codifyme-backend

# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/codifyme?useSSL=false&serverTimezone=UTC
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD}
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.show-sql=true

# Security
jwt.secret=${JWT_SECRET}

# Gemini AI Configuration
gemini.api.key=${GEMINI_API_KEY}

# Server
server.port=8080
```

### Step 4: Verify .gitignore is Working

```bash
# Check what will be committed
git status

# application.properties should NOT appear in the list
# If it does, run:
git rm --cached backend/src/main/resources/application.properties
```

## 📋 Files Created:

1. **`.gitignore`** - Prevents committing sensitive files
2. **`application.properties.example`** - Template for others to use
3. **`SECURITY_FIX.md`** - This file with instructions

## ✅ Checklist:

- [ ] Revoke exposed Gemini API key
- [ ] Generate new Gemini API key
- [ ] Remove application.properties from Git tracking
- [ ] Create application-local.properties with secrets
- [ ] Update application.properties to use environment variables
- [ ] Verify .gitignore is working
- [ ] Test application still works
- [ ] Commit and push changes

## 🔐 Best Practices Going Forward:

1. **Never commit:**
   - API keys
   - Passwords
   - Database credentials
   - JWT secrets
   - Any sensitive data

2. **Always use:**
   - Environment variables
   - `.env` files (gitignored)
   - Secret management services (AWS Secrets Manager, Azure Key Vault)
   - Different credentials for dev/staging/production

3. **Use `.example` files:**
   - Commit `application.properties.example`
   - Never commit actual `application.properties`

## 🚨 If Your Key Was Already Exposed:

1. **Revoke it immediately** at https://makersuite.google.com/app/apikey
2. **Generate a new key**
3. **Update your local configuration**
4. **Monitor for unauthorized usage**

---

**Need Help?** Let me know if you need assistance with any of these steps!
