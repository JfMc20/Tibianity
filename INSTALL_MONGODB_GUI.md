# Recordatorio: Instalar GUI para MongoDB

Para visualizar y gestionar la base de datos MongoDB de forma gráfica, se recomienda instalar una herramienta GUI como:

- **MongoDB Compass (Recomendado):** [https://www.mongodb.com/try/download/compass](https://www.mongodb.com/try/download/compass)
- Studio 3T: [https://studio3t.com/](https://studio3t.com/)
- NoSQL Booster: [https://nosqlbooster.com/](https://nosqlbooster.com/)

**Pasos con Compass:**
1. Descargar e instalar.
2. Conectar usando la `MONGO_URI` de las variables de entorno.
3. Asegurarse de que la IP local esté en la lista blanca de la base de datos (si aplica).

---

## TODO Frontend (Errores Rutas y UI Admin)

- [x] Corregir rutas de admin en `App.jsx`:
  - [x] `/admin` debe mostrar `AdminDashboard`.
  - [x] `/admin/profile` debe funcionar y mostrar `UserProfilePage`.
  - [x] Ruta raíz `/` para admin debe mostrar `LandingPage`.
- [x] Implementar toggle (ocultar/mostrar) para `SidePanelMenu` en `AdminLayout`. 