# GiftU - Asistente de Regalos Móvil

GiftU es una aplicación móvil nativa (desarrollada con React Native) diseñada para ayudarte a seleccionar y recordar regalos para las personas en tus contactos. Te permite llevar un registro de ideas de regalos y fechas importantes, y te envía recordatorios para que no olvides ninguna ocasión especial.

## Características Principales

- **Integración de Contactos:** Navega por los contactos de tu dispositivo directamente desde la aplicación.
- **Pantalla de Detalles del Contacto:** Visualiza la información de tus contactos y gestiona ideas de regalos y fechas importantes específicas para cada uno.
- **Gestión de Fechas Importantes:**
    - Añade, visualiza y elimina fechas clave como cumpleaños, aniversarios, etc.
    - Las fechas se almacenan localmente en el dispositivo.
- **Ideas para Regalos:**
    - Anota ideas de regalos para cada contacto.
    - Estas notas se guardan localmente.
- **Notificaciones Locales:**
    - Recibe recordatorios para las fechas importantes que hayas guardado.
    - **Nota:** Actualmente, las notificaciones están completamente funcionales en Android. En iOS, la configuración nativa requiere un paso adicional (`pod install`) que no se pudo completar en el entorno de desarrollo actual, por lo que las notificaciones podrían no funcionar como se espera en iOS hasta que se complete dicha configuración.
- **Interfaz de Usuario Amigable:** Diseño inspirado en un mockup moderno, con una navegación clara y sencilla.

## Empezando (General)

Este es un proyecto React Native. Para ejecutarlo en un entorno de desarrollo local, generalmente seguirías estos pasos:

1.  **Clonar el repositorio.**
2.  **Instalar dependencias:**
    ```bash
    npm install
    # o
    yarn install
    ```
3.  **Configuración específica de la plataforma:**
    *   **iOS:** Navega a la carpeta `ios` y ejecuta `pod install`.
    *   **Android:** Asegúrate de tener el entorno de desarrollo Android configurado.
4.  **Ejecutar la aplicación:**
    ```bash
    npm run ios
    # o
    npm run android
    ```

## Próximos Pasos Potenciales

- Integración con IA para sugerencias de regalos automáticas.
- Sincronización en la nube de datos de regalos y fechas.
- Opciones de notificación más avanzadas (por ejemplo, recordatorios con varios días de antelación).

---

Este README provee una visión general del proyecto GiftU en su estado actual.
