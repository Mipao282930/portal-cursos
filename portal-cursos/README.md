# AulaTec: matrículas con Laragon y MySQL

## Preparar la base de datos

1. Inicia **Apache** y **MySQL** desde Laragon.
2. Abre phpMyAdmin desde Laragon e importa [`sql/aulatec.sql`](./sql/aulatec.sql). El script crea la base `aulatec`, las tablas `cursos` y `matriculas`, y los seis cursos del catálogo.

También puedes ejecutarlo desde la terminal de Laragon:

```powershell
mysql -u root < sql\aulatec.sql
```

Si tu usuario de MySQL tiene contraseña, añade `-p` al comando.

## Configurar la API PHP

En la carpeta del proyecto, copia `api\config.example.php` como `api\config.local.php`. Este último archivo está excluido de Git para no publicar contraseñas. Ajusta allí el host, nombre, usuario y contraseña de MySQL según tu instalación.

Para crear un hash de contraseña de administrador, abre la terminal de Laragon y ejecuta:

```powershell
php -r "echo password_hash('EscribeAquiUnaClaveLarga', PASSWORD_DEFAULT), PHP_EOL;"
```

Copia el hash resultante en `admin.password_hash` de `api\config.local.php` y establece el usuario que quieras en `admin.username`. No dejes vacío el hash: la pantalla de inscritos no permitirá iniciar sesión hasta configurarlo.

## Iniciar el portal

Desde la carpeta del proyecto, ejecuta:

```powershell
npm run dev
```

Abre la dirección que muestra Vite. El proxy de desarrollo conecta con Apache en `localhost` y traduce la ruta al directorio del proyecto. El endpoint predeterminado del frontend es `/portal-cursos/api`. Si publicas el frontend y la API bajo otra ruta, crea un archivo `.env` con `VITE_API_URL` apuntando a la ruta pública de la API y vuelve a compilar.

## Uso

- Las matrículas enviadas desde **Matrícula** se validan en PHP y se guardan en MySQL.
- **Inscritos** muestra públicamente nombre, curso, turno y fecha de inscripción, ordenados del más reciente al más antiguo. No expone DNI, teléfono ni correo.
- Para consultar directamente los registros en MySQL:

```sql
USE aulatec;
SELECT m.id, m.nombre, m.email, m.dni, m.telefono, c.nombre AS curso,
       m.turno, m.creado_en
FROM matriculas AS m
JOIN cursos AS c ON c.id = m.curso_id
ORDER BY m.creado_en DESC;
```
