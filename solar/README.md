# 🌍 Solar System Explorer

Aplicación web interactiva para explorar los planetas del sistema solar desarrollada con Angular 17+.

## ✨ Características Principales

- 📱 Diseño responsive con tarjetas de planetas
- 🔍 Sistema de búsqueda y filtrado dinámico
- 📊 Paginación con estado persistente en URL
- ⭐ Sistema de favoritos con almacenamiento local
- 🎯 Animaciones y transiciones fluidas
- 🌐 Información detallada de cada planeta

## 🛠️ Tecnologías

- **Framework**: Angular 17
  - Standalone Components
  - Signals para estado reactivo
  - Control Flow syntax
- **Estilos**: SCSS con variables CSS
- **Animaciones**: @angular/animations
- **Despliegue**: Firebase Hosting

## 🚀 Inicio Rápido

1. **Clonar el repositorio**
```bash
git clone https://github.com/juanklowData/Solar.git
```

2. **Instalar dependencias**
```bash
cd Solar
npm install
```

3. **Iniciar servidor de desarrollo**
```bash
ng serve
```

4. **Abrir aplicación**
```
http://localhost:4200
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   ├── planet-list/
│   │   │   └── planet-list.component.ts
│   │   ├── planet-card/
│   │   │   └── planet-card.component.ts
│   │   ├── planet-detail/
│   │   │   └── planet-detail.component.ts
│   │   └── space-header/
│   │       └── space-header.component.ts
│   ├── services/
│   │   ├── planet.service.ts
│   │   └── favorites.service.ts
│   ├── interfaces/
│   │   └── planet.interface.ts
│   ├── app.routes.ts
│   └── app.config.ts
├── assets/
│   ├── images/
│   └── styles/
└── environments/
```

## 🔧 Decisiones Técnicas

### Arquitectura
- Componentes Standalone para mejor modularidad
- Lazy loading para optimización de carga
- Signals para manejo de estado reactivo

### Rendimiento
- Caché de imágenes
- Paginación del lado del cliente
- Optimización de bundle size

### UX/UI
- Diseño intuitivo y moderno
- Feedback visual con animaciones
- Modo oscuro optimizado para astronomía

## 📱 Responsive Design

- Mobile First approach
- Breakpoints adaptables
- Optimización de imágenes por dispositivo

## 🔒 Almacenamiento Local

- Sistema de favoritos persistente
- Caché de búsquedas recientes
- Estado de la aplicación

## 🤝 Contribuir

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

## 👤 Autor

Juan Carlos Cruz
- GitHub: [@juanklowData](https://github.com/juanklowData)