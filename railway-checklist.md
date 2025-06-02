# ✅ Railway Deployment Checklist

Usa esta lista de verificación antes de hacer el deploy para asegurar que todo esté configurado correctamente.

## 📋 Pre-Deployment Checklist

### Backend Ready ✅
- [x] `backend/requirements.txt` incluye todas las dependencias
- [x] `backend/Procfile` configurado con gunicorn
- [x] `backend/nixpacks.toml` creado para optimización
- [x] `backend/app/main.py` configurado para Railway (CORS, environment variables)
- [x] `backend/app/database.py` preparado para PostgreSQL con fallback
- [x] Variables de entorno documentadas en `env.example`

### Frontend Ready ✅
- [x] `package.json` incluye script "start" para Railway
- [x] `vite.config.js` configurado para preview mode
- [x] `nixpacks.toml` creado en la raíz
- [x] `railway.json` configurado para deployment
- [x] `src/lib/api.js` usa variables de entorno para API URL

### Configuration Files ✅
- [x] `DEPLOY.md` - Guía completa de deployment
- [x] `README.md` - Documentación actualizada
- [x] `.gitignore` - Archivos correctos ignorados
- [x] Archivos de deployment anteriores eliminados (vercel.json, etc.)

## 🚀 Deployment Steps

### Step 1: Backend Deployment
```bash
# En Railway:
# 1. New Project → GitHub Repo
# 2. Root Directory: /backend
# 3. Add PostgreSQL Database
# 4. Variables automáticas: DATABASE_URL, RAILWAY_ENVIRONMENT_NAME, PORT
```

### Step 2: Frontend Deployment  
```bash
# En Railway:
# 1. New Service (mismo proyecto)
# 2. Root Directory: /
# 3. Variable: VITE_API_URL=https://backend-url.up.railway.app/api
```

### Step 3: Load Initial Data
```bash
# Via Railway console o CLI:
python cargar_datos.py
```

## 🔍 Post-Deployment Verification

### Backend Health Check
- [ ] `https://backend-url.up.railway.app/health` → Status 200
- [ ] `https://backend-url.up.railway.app/docs` → Swagger UI loads
- [ ] `https://backend-url.up.railway.app/api/indicadores` → Returns data

### Frontend Verification
- [ ] `https://frontend-url.up.railway.app` → Site loads
- [ ] Dashboard shows metrics
- [ ] Gantt charts render
- [ ] No CORS errors in browser console

### Data Verification
- [ ] 14 indicators loaded
- [ ] 83 hitos with proper states
- [ ] VPs: VPD, VPE, PRE
- [ ] Areas match organizational structure

## 🐛 Common Issues & Solutions

### Issue: Build Fails
```
Solution: Check logs for specific error
- Python: Verify requirements.txt
- Node: Verify package.json dependencies
```

### Issue: CORS Error
```
Solution: Add frontend URL to backend CORS origins
File: backend/app/main.py
Add: "https://frontend-url.up.railway.app"
```

### Issue: Database Connection
```
Solution: Verify PostgreSQL service is running
Check: DATABASE_URL environment variable exists
```

### Issue: API Not Found
```
Solution: Verify VITE_API_URL is set correctly
Must include /api at the end
Example: https://backend-url.up.railway.app/api
```

## 📊 Expected Results

After successful deployment:

**Data Distribution:**
- PRE: 4 indicators
- VPE: 4 indicators  
- VPD: 6 indicators
- Total: 83 hitos

**Hito States:**
- En Progreso: 35 hitos
- Completado: 17 hitos
- Por Comenzar: 31 hitos

**Types:**
- Estratégico: 9 indicators
- Gestion: 5 indicators

## 🎯 Final URLs

Replace with your actual URLs:

- **Frontend**: https://sistema-indicadores-frontend-production.up.railway.app
- **Backend**: https://sistema-indicadores-backend-production.up.railway.app
- **API Docs**: https://sistema-indicadores-backend-production.up.railway.app/docs

---

## 🎉 Ready for Deploy!

If all items above are checked ✅, your project is ready for Railway deployment!

Follow the detailed steps in `DEPLOY.md` for complete instructions. 