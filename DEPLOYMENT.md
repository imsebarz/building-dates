# 🚀 Guía de Configuración del Pipeline CI/CD

## Pasos para configurar el despliegue en GitHub Pages

### 1. Subir el código a GitHub

```bash
# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "feat: Initial setup with CI/CD pipeline for GitHub Pages"

# Configurar rama principal
git branch -M main

# Agregar remote origin (reemplaza TU-USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU-USUARIO/building-dates.git

# Subir a GitHub
git push -u origin main
```

### 2. Configurar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Haz clic en **Settings** 
3. En el menú lateral, haz clic en **Pages**
4. En **Source**, selecciona **GitHub Actions**
5. ¡Listo! El despliegue será automático

### 3. Verificar el despliegue

1. Ve a la pestaña **Actions** en tu repositorio
2. Verás los workflows ejecutándose automáticamente
3. Una vez completado, tu sitio estará disponible en: `https://TU-USUARIO.github.io/building-dates/`

## 🔄 Workflows configurados

### `deploy.yml` - Despliegue Principal
- ✅ Se ejecuta automáticamente en push a `main`
- ✅ Construye y despliega a GitHub Pages
- ✅ Solo despliega si todos los tests pasan

### `test.yml` - Testing
- ✅ Se ejecuta en todos los push y pull requests
- ✅ Valida HTML, CSS, JavaScript
- ✅ Verifica estructura de archivos

### `maintenance.yml` - Mantenimiento
- ✅ Health checks semanales
- ✅ Despliegues manuales disponibles

## 🛠️ Scripts disponibles

```bash
npm test           # Ejecutar tests
npm run build      # Construir para producción
npm run dev        # Servidor de desarrollo
npm run validate   # Tests + lint
npm run preview    # Preview de la build
```

## 🔧 Personalización

Para personalizar el pipeline, edita los archivos en `.github/workflows/`:

- `deploy.yml` - Configuración de despliegue
- `test.yml` - Configuración de testing
- `maintenance.yml` - Tareas de mantenimiento

## 🎯 URLs importantes

- **Repositorio**: `https://github.com/TU-USUARIO/building-dates`
- **Sitio web**: `https://TU-USUARIO.github.io/building-dates/`
- **Actions**: `https://github.com/TU-USUARIO/building-dates/actions`

## 🚨 Troubleshooting

**Si el despliegue falla:**
1. Revisa los logs en Actions
2. Verifica que GitHub Pages esté habilitado
3. Asegúrate de que la rama sea `main`

**Si los tests fallan:**
1. Ejecuta `npm test` localmente
2. Corrige los errores mostrados
3. Haz commit y push de nuevo