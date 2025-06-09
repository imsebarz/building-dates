# 🏠 Lavada de Escalas - Sistema de Gestión

Sistema web para gestionar y generar escalas de limpieza de escaleras en edificios residenciales.

## ✨ Características

- **📅 Generación automática de escalas** - Distribución equitativa de fechas entre apartamentos
- **🎯 Drag & Drop** - Reordena los apartamentos arrastrándolos
- **⚡ Actualización en tiempo real** - Los cambios se reflejan inmediatamente
- **📱 Diseño responsivo** - Funciona en desktop y móvil
- **📄 Exportación a PDF** - Descarga las escalas como archivo PDF
- **⌨️ Atajos de teclado** - Ctrl/Cmd + ↑/↓ para reordenar apartamentos

## 🚀 Despliegue Automático con GitHub Pages

Este proyecto incluye un pipeline CI/CD completo para despliegue automático en GitHub Pages.

### 📋 Configuración Inicial

1. **Crear repositorio en GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Lavada de Escalas system"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/building-dates.git
   git push -u origin main
   ```

2. **Habilitar GitHub Pages**:
   - Ve a tu repositorio en GitHub
   - Settings → Pages
   - Source: GitHub Actions
   - ¡Listo! El despliegue será automático

### 🔄 Pipeline CI/CD

El pipeline incluye dos workflows principales:

#### 🧪 Workflow de Testing (`test.yml`)
- ✅ Validación de sintaxis HTML, CSS y JavaScript
- ✅ Verificación de estructura de archivos
- ✅ Tests de funcionalidad básica
- ✅ Análisis de seguridad
- 🚀 Se ejecuta en cada push y pull request

#### 🚀 Workflow de Despliegue (`deploy.yml`)
- 📦 Construcción optimizada para producción
- 🔍 Validación de archivos requeridos
- 📂 Copia de archivos al directorio `build/`
- 🌐 Despliegue automático a GitHub Pages
- 📋 Solo se ejecuta en la rama `main`

### 📝 Scripts Disponibles

```bash
# Desarrollo local
npm run dev          # Servidor local en puerto 8000
npm run serve        # Servidor con http-server

# Testing y validación
npm test             # Ejecutar tests
npm run lint         # Validar código
npm run validate     # Tests + lint

# Construcción y despliegue
npm run build        # Construir para producción
npm run preview      # Preview de la build
npm run deploy       # Validar + construir
```

### 🛠️ Desarrollo Local

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/TU-USUARIO/building-dates.git
   cd building-dates
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   # Abre http://localhost:8000
   ```

4. **Ejecutar tests**:
   ```bash
   npm test
   ```

### 📦 Estructura del Pipeline

```
.github/workflows/
├── deploy.yml       # Despliegue a GitHub Pages
└── test.yml         # Testing y validación

scripts/
├── build.js         # Script de construcción
└── test.js          # Script de testing

build/               # Directorio de producción (auto-generado)
├── index.html       # Escalas.html renombrado
├── style.css
├── index.js
├── src/
└── .nojekyll        # Para GitHub Pages
```

### 🔧 Configuración del Pipeline

El pipeline está configurado para:

- **🎯 Branches**: Se ejecuta en `main` y `master`
- **📝 Pull Requests**: Testing automático
- **🔒 Permisos**: Configurados para GitHub Pages
- **⚡ Optimización**: Construcción optimizada para producción
- **🛡️ Validación**: Tests completos antes del despliegue

### 🌐 URL de Despliegue

Una vez configurado, tu aplicación estará disponible en:
```
https://TU-USUARIO.github.io/building-dates/
```

### 🔄 Flujo de Trabajo

1. **Desarrollo**: Trabaja en tu rama local
2. **Testing**: Ejecuta `npm test` antes de hacer commit
3. **Push**: Sube cambios a GitHub
4. **CI/CD**: El pipeline se ejecuta automáticamente
5. **Despliegue**: Si todo pasa, se despliega automáticamente

### 🚨 Troubleshooting

**Error en el despliegue:**
- Verifica que GitHub Pages esté habilitado
- Revisa los logs en Actions
- Asegúrate de que todos los tests pasen

**Tests fallando:**
```bash
npm test  # Ver qué tests fallan
npm run lint  # Verificar sintaxis
```

**Build fallando:**
```bash
npm run build  # Probar build localmente
npm run preview  # Ver resultado
```

---

## 🚀 Uso Rápido

1. **Abre la aplicación**: Visita la URL de GitHub Pages
2. **Configura las fechas**: Fecha de inicio y final
3. **Selecciona y ordena apartamentos**: Marca/desmarca y arrastra para reordenar
4. **Genera y descarga**: Las escalas se actualizan automáticamente

## 🏗️ Estructura del Proyecto

```
building-dates/
├── Escalas.html          # Archivo principal → index.html en producción
├── index.js              # Lógica principal (versión standalone)
├── style.css             # Estilos de la interfaz
├── package.json          # Configuración y scripts
├── .github/workflows/    # Pipelines CI/CD
├── scripts/              # Scripts de construcción y testing
└── src/                  # Versión modular (para desarrollo)
    ├── app.js
    ├── config/
    ├── models/
    ├── services/
    ├── ui/
    └── utils/
```

## 🎨 Funcionalidades

### Gestión de Apartamentos
- **Selección flexible**: Marca/desmarca apartamentos según necesidad
- **Reordenamiento**: Cambia el orden de limpieza con drag & drop
- **Indicadores visuales**: Posición actual y feedback visual

### Generación de Escalas
- **Distribución automática**: Reparte fechas dominicales equitativamente
- **Rotación inteligente**: Cada apartamento toma turnos consecutivos
- **Actualización dinámica**: Cambios se reflejan inmediatamente

### Exportación PDF
- **Layout optimizado**: Diseño limpio y profesional
- **Múltiples apartamentos**: Soporte para cualquier cantidad
- **Nombre automático**: Archivos con fecha del período

## 🔧 Tecnologías

- **HTML5** - Estructura semántica
- **CSS3** - Diseño moderno con gradientes y animaciones
- **JavaScript ES6+** - Funcionalidad interactiva
- **jsPDF** - Generación de documentos PDF
- **Font Awesome** - Iconografía
- **GitHub Actions** - CI/CD Pipeline
- **GitHub Pages** - Hosting estático

## 📋 Requisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- JavaScript habilitado
- Para desarrollo: Node.js 16+ y npm

## 🎯 Casos de Uso

- **Edificios residenciales**: Gestión de limpieza de escaleras
- **Comunidades**: Organización de tareas compartidas
- **Administradores**: Planificación de mantenimiento
- **Vecinos**: Visualización clara de turnos

## 📝 Notas

- Las fechas se calculan automáticamente para domingos
- El orden de los apartamentos determina la rotación
- Los PDF incluyen período completo y nota informativa
- Compatible con sistemas file:// (sin necesidad de servidor)
- Despliegue automático en cada push a main

---

**Desarrollado para facilitar la gestión comunitaria** 🏘️  
**Con despliegue automático en GitHub Pages** 🚀
