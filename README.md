# **Mercado del Cerezo: Sistema de Gestión de Tienda**

---

## **Tecnologías Principales**
El sistema se componen de tres partes principales:
  - **Frontend:** Angular  
  - **Backend:** Spring Boot  
  - **Base de Datos:** MySQL  

---

## **Requisitos Previos**
Asegurar que esté instalado:
  - **Java** (para el Backend)
  - **Node.js y npm** (para Angular)
  - **Servidor MySQL**
  - **Git**

---

## **Inicialización y Ejecución**
Para poner en marcha el sistema, es crucial inicializar el Backend y la Base de Datos primero, ya que el Frontend (Angular) depende de ellos para funcionar correctamente.

  __1.__ **Backend y Base de Datos (Spring Boot + MySQL)**  
  **Clonar el Repositorio del Backend:**  
  https://github.com/F3LL5/TP-Final.git

  **I. Crear la Base de Datos:**  
  - Adjuntamos un script sql dentro del github del backend, llamado “bdd.sql”, que crea todas las tablas si se ejecuta todo el script.  
  - El backend tiene configurado por defecto la ruta localhost para la ip.  
  - Asegurarse de que la configuración de la conexión a la base de datos (credenciales, nombre de la DB) en el proyecto Spring Boot sea correcta (en `application.properties`).  

  **II. Ejecutar el Backend:**  
  - Compilar y ejecutar el proyecto Spring Boot (desde IntelliJ o como hicimos nosotros, con Visual Studio).  
  - La terminal del backend avisará que se creó un usuario predeterminado con las credenciales “123” y contraseña “0000” y con esto, ya está listo para ejecutar las peticiones http.  

  __2.__ **Frontend (Angular)**  
  **Clonar el Repositorio del Frontend:**  
  https://github.com/eijojuliana/tp-final-frontend.git
      
  **I. Importante:** Asegúrate de estar en una carpeta diferente a la del Backend.  
  **II. Iniciar el Servidor de Desarrollo:**  
  - Utiliza el comando `ng s` para iniciar el servidor de Angular.  
  - El frontend estará disponible en tu navegador, generalmente en **http://localhost:4200/**.

---

## **Roles del Sistema**
El sistema cuenta con diferenciación de permisos según el rol del usuario:

**Rol** | **Permisos**
--- | ---
**Administrador** | Acceso total al sistema. Puede gestionar usuarios, roles, configuraciones, tiendas y todos los módulos sin restricciones.
**Dueño** | Puede gestionar empleados, clientes, proveedores, productos, inventario, pedidos, ventas, caja, cuentas bancarias, estadísticas y auditorías. No puede administrar roles ni configuraciones del sistema.
**Empleado** | Permisos limitados: puede gestionar clientes, proveedores, productos, inventario, lotes, pedidos, ventas y caja. No puede acceder a estadísticas, auditorías, configuración de la tienda, cuentas bancarias ni gestionar usuarios.

---

## **Enlaces Adicionales**
- **Documentación Completa:**
https://docs.google.com/document/d/1x_8psamhjdivdOzqkt954OhniXRr_84OO9_pVlv9Tg4/edit?usp=sharing 
- **Repositorio Backend (Spring Boot):**  
https://github.com/F3LL5/TP-Final  
- **Repositorio Frontend (Angular):**  
https://github.com/eijojuliana/tp-final-frontend

