const {
  structure,
  modulePrisma,
  servicePrisma,
  dtos,
  dtoUpdate,
  useCaseCreate,
  useCaseGet,
  useCaseSoftDeleted,
  useCaseUpdate,
  enidadDominio,
  repoDomain,
  repoPrisma,
  apiRest,
  moduleNest
} = require('./template');

/**
 * Script para generar automáticamente módulos CRUD en NestJS siguiendo Clean Architecture
 * 
 * Este script crea toda la estructura de carpetas y archivos necesarios para un módulo completo
 * incluyendo DTOs, casos de uso, entidades, repositorios, controladores y el módulo principal.
 * También configura la conexión con Prisma ORM y actualiza el app.module.ts para incluir el nuevo módulo.
 */

// Importaciones de módulos de Node.js
const { execSync } = require("child_process"); // Para ejecutar comandos del sistema
const fs = require("fs");                     // Para operaciones de sistema de archivos
const path = require("path");                  // Para manejo de rutas

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convierte la primera letra a mayúscula y añade una 's' al final
 * @param {string} str - String a capitalizar y pluralizar
 * @returns {string} String capitalizado y pluralizado
 */
function capitalizePlural(str) {
  return str.charAt(0).toUpperCase() + str.slice(1) + "s";
}

/**
 * Convierte la primera letra a minúscula y añade una 's' al final
 * @param {string} str - String a convertir a minúscula y pluralizar
 * @returns {string} String en minúscula y pluralizado
 */
function capitalizeMinusPlural(str) {
  return str.charAt(0).toLowerCase() + str.slice(1) + "s";
}

/**
 * Convierte la primera letra de un string a minúscula
 * @param {string} str - String a convertir a minúscula
 * @returns {string} String con la primera letra en minúscula
 */
function capitalizeMinus(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  // Verificar si readline-sync ya está instalado
  let readlineSyncInstalled = false;
  try {
    // Intentar verificar si readline-sync está en node_modules
    if (fs.existsSync(path.join(process.cwd(), 'node_modules', 'readline-sync'))) {
      readlineSyncInstalled = true;
      console.log('\n\x1b[33mATENCIÓN: Se detectó que readline-sync ya está instalado.\x1b[0m');
      console.log('\x1b[33mEste paquete será desinstalado automáticamente al finalizar el script.\x1b[0m');
      console.log('\x1b[33mSi desea conservarlo, presione Ctrl+C en los próximos 10 segundos para cancelar.\x1b[0m\n');

      // Esperar 10 segundos antes de continuar
      console.log('\x1b[36mContinuando en 10 segundos...\x1b[0m');
      await sleep(10000);
      console.log('\x1b[32mContinuando con la ejecución del script...\x1b[0m\n');
    } else {
      // Si no está instalado, instalarlo
      console.log('\x1b[36mInstalando dependencia temporal readline-sync...\x1b[0m');
      execSync("npm install readline-sync --save", { stdio: "inherit" });
    }
  } catch (error) {
    // Si hay algún error, intentar instalar de todas formas
    console.log('\x1b[36mInstalando dependencia temporal readline-sync...\x1b[0m');
    execSync("npm install readline-sync --save", { stdio: "inherit" });
  }


  const readlineSync = require("readline-sync"); // Para interacción con el usuario en la consola

  // Obtener el nombre del módulo desde los argumentos de línea de comandos
  const name = process.argv[2];

  // Validar que se haya proporcionado un nombre
  if (!name) {
    console.error("❌ Debes proporcionar un nombre. Ej: npm run create:module user");
    process.exit(1); // Salir con código de error
  }

  // Definir la ruta base donde se crearán los archivos
  const basePath = path.join(__dirname, "..", "src");

  /**
   * Iteración sobre la estructura definida para crear carpetas y archivos
   * 
   * Para cada ruta en la estructura:
   * 1. Construye la ruta completa
   * 2. Crea los directorios necesarios si no existen
   * 3. Crea el archivo con su contenido específico si no existe
   */
  const fileStructure = structure(name);
  fileStructure.forEach((relativeFilePath) => {
    // Construir la ruta completa del archivo
    const fullPath = path.join(basePath, relativeFilePath);
    // Obtener el directorio del archivo
    const dir = path.dirname(fullPath);

    // Crear la carpeta si no existe (con creación recursiva de directorios padres)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Creado directorio: ${dir}`);
    }

    // Crear el archivo con contenido específico si no existe
    if (!fs.existsSync(fullPath)) {
      // Contenido por defecto para cualquier archivo
      let content = `// ${path.basename(fullPath)} generado automáticamente\n`;

      /**
       * Generación de archivos para la conexión con Prisma ORM
       * 
       * Estos archivos configuran la integración de Prisma con NestJS:
       * - prisma.module.ts: Define el módulo de Prisma y exporta el servicio
       * - prisma.service.ts: Implementa el servicio que extiende PrismaClient
       */

      // Archivo del módulo de Prisma
      if (relativeFilePath === 'Connect/prisma.module.ts') {
        content = modulePrisma();
      }

      // Archivo del servicio de Prisma
      if (relativeFilePath === 'Connect/prisma.service.ts') {
        content = servicePrisma();
      }

      // DTO para crear un nuevo recurso
      if (relativeFilePath === `modules/${capitalizePlural(name)}/application/dtos/create-${capitalizeMinusPlural(name)}.dto.ts`) {
        content = dtos(name);
      }

      // DTO para actualizar un recurso existente
      if (relativeFilePath === `modules/${capitalizePlural(name)}/application/dtos/update-${capitalizeMinusPlural(name)}.dto.ts`) {
        content = dtoUpdate(name)
      }

      // Caso de uso para crear un nuevo recurso
      if (relativeFilePath === `modules/${capitalizePlural(name)}/application/use-case/create-${capitalizeMinusPlural(name)}.use-case.ts`) {
        content = useCaseCreate(name)
      }

      // Caso de uso para obtener recursos (listar todos y buscar por ID)
      if (relativeFilePath === `modules/${capitalizePlural(name)}/application/use-case/get-${capitalizeMinusPlural(name)}.use-case.ts`) {
        content = useCaseGet(name)
      }

      // Caso de uso para eliminación lógica (soft-delete) de recursos
      if (relativeFilePath === `modules/${capitalizePlural(name)}/application/use-case/soft-deleted-${capitalizeMinusPlural(name)}.use-case.ts`) {
        content = useCaseSoftDeleted(name)
      }

      // Caso de uso para actualizar recursos
      if (relativeFilePath === `modules/${capitalizePlural(name)}/application/use-case/update-${capitalizeMinusPlural(name)}.use-case.ts`) {
        content = useCaseUpdate(name)
      }

      // Definición de la entidad de dominio
      if (relativeFilePath === `modules/${capitalizePlural(name)}/domain/entities/${capitalizeMinus(name)}.entity.ts`) {
        content = enidadDominio(name)
      }

      // Definición del repositorio de dominio (interfaz abstracta)
      if (relativeFilePath === `modules/${capitalizePlural(name)}/domain/repositories/${capitalizeMinusPlural(name)}.repository.ts`) {
        content = repoDomain(name)
      }

      // Implementación del repositorio con Prisma (capa de infraestructura)
      if (relativeFilePath === `modules/${capitalizePlural(name)}/infrastucture/prisma/${capitalizeMinus(name)}.repository.ts`) {
        content = repoPrisma(name)
      }

      // Controlador en la capa de interfaces (API REST)
      if (relativeFilePath === `modules/${capitalizePlural(name)}/interfaces/controllers/${capitalizeMinusPlural(name)}.controller.ts`) {
        content = apiRest(name)
      }

      // Definición del módulo NestJS
      if (relativeFilePath === `modules/${capitalizePlural(name)}/${capitalizeMinusPlural(name)}.module.ts`) {
        content = moduleNest(name)
      }

      // Actualización automática del módulo principal de la aplicación (app.module.ts)
      // para registrar el nuevo módulo creado
      let appModuleContent;
      try {
        // Leer el contenido actual del módulo principal
        appModuleContent = fs.readFileSync('src/app.module.ts', 'utf8');

        // Preparar el nombre del módulo y la línea de importación
        const moduleName = `${capitalize(name)}Module`;
        const importLine = `import { ${moduleName} } from './modules/${capitalizePlural(name)}/${capitalizeMinusPlural(name)}.module';\n`;


        // Agrega la importación si no existe en el archivo
        if (!appModuleContent.includes(importLine)) {
          appModuleContent = importLine + appModuleContent;
        }

        // Agrega el módulo al array de imports del decorador @Module si no está presente
        // Utiliza una expresión regular para encontrar el array de imports y modificarlo
        appModuleContent = appModuleContent.replace(
          /(imports\s*:\s*\[)([\s\S]*?)(\])/,
          (_, start, modules, end) => {
            const newModule = `  ${moduleName},`;
            // Evita duplicados verificando si el módulo ya está incluido
            if (modules.includes(moduleName)) {
              return `${start}${modules}${end}`;
            }
            // Agrega el nuevo módulo al array de imports manteniendo el formato
            return `${start}\n${modules.trimEnd()}\n${newModule}\n${end}`;
          }
        );

        // Guarda los cambios en el archivo app.module.ts
        fs.writeFileSync('src/app.module.ts', appModuleContent, 'utf8');
      } catch (error) {
        // Manejo de errores en caso de que no se pueda actualizar app.module.ts
        console.log(`⚠️ No se pudo actualizar app.module.ts: ${error.message}`);
      }

      // Escribe el contenido generado en el archivo de destino
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Creado: ${relativeFilePath}`);
    } else {
      console.log(`⚠️ Ya existe: ${relativeFilePath}`);
    }
  });
  // Instalación automática de Prisma como dependencia de desarrollo
  // Esto asegura que el proyecto tenga todas las herramientas necesarias para trabajar con la base de datos
  try {
    // Verificar si Prisma ya está instalado y configurado
    const isPrismaInstalled = fs.existsSync('node_modules/prisma');
    const isPrismaInitialized = fs.existsSync('prisma') && fs.existsSync('.env');

    if (isPrismaInstalled && isPrismaInitialized) {
      console.log('✅ Prisma ya está instalado y configurado.');
      console.log('Muchas gracias por usar generateModule para nest.js. AQUI 1');
      console.log('Solo si ya no crearas mas modulos, puedes eliminar readline-sync si no es necesario para tu proyecto');
      const answer = readlineSync.question('Desea desinstalar readline-sync? (y/n)');
      if (answer === 'y') {
        try {
          console.log("🧹 Limpiando dependencias temporales...");
          execSync("npm uninstall readline-sync", { stdio: "inherit" });
          console.log("✅ Dependencias temporales eliminadas correctamente.");
        } catch (cleanupErr) {
          console.log("⚠️ No se pudo eliminar readline-sync:", cleanupErr.message);
        }
      }
      return;
    }

    console.log('Prisma ' + (isPrismaInstalled ? 'está instalado pero no inicializado.' : 'no está instalado.'));
    console.log('Quieres ' + (isPrismaInstalled ? 'inicializar' : 'instalar') + ' Prisma? (y/n)');
    const answer = readlineSync.question('');

    if (answer !== 'y') {
      console.log('❌ Operación de Prisma cancelada.');
      console.log('Muchas gracias por usar generateModule para nest.js. AQUI 2');
      return;
    }

    if (!isPrismaInstalled) {
      console.log("📦 Instalando Prisma como dependencia de desarrollo...");
      execSync("npm install prisma -D", { stdio: "inherit" });
    }

    if (!isPrismaInitialized) {
      console.log("🚀 Inicializando Prisma...");
      execSync("npx prisma init", { stdio: "inherit" });
    }

    if (!isPrismaInstalled && !isPrismaInitialized) {
      console.log("✅ Prisma instalado e inicializado correctamente.");
    } else if (!isPrismaInstalled) {
      console.log("✅ Prisma instalado correctamente.");
    } else {
      console.log("✅ Prisma inicializado correctamente.");
    }
  } catch (err) {
    // Manejo de errores en caso de que falle la operación con Prisma
    console.error("❌ Error en la operación con Prisma:", err);
    console.log("Por favor, intenta ejecutar manualmente los comandos necesarios.");
  }

  // Desinstalar readline-sync solo si no estaba previamente instalado
  if (!readlineSyncInstalled) {
    try {
      console.log("🧹 Limpiando dependencias temporales...");
      console.log("\x1b[33mDesinstalando readline-sync en 10 segundos...\x1b[0m");
      console.log("\x1b[33mSi desea conservarlo, presione Ctrl+C para cancelar.\x1b[0m");

      // Esperar 10 segundos antes de desinstalar
      await sleep(10000);

      execSync("npm uninstall readline-sync", { stdio: "inherit" });
      console.log("✅ Dependencias temporales eliminadas correctamente.");
    } catch (cleanupErr) {
      console.log("⚠️ No se pudo eliminar readline-sync:", cleanupErr.message);
    }
  } else {
    console.log("ℹ️ No se ha desinstalado readline-sync porque ya estaba instalado antes de ejecutar el script.");
    const answer = readlineSync.question('Desea desinstalar readline-sync? (y/n)');
    if (answer === 'y') {
      try {
        console.log("🧹 Limpiando dependencias temporales...");
        execSync("npm uninstall readline-sync", { stdio: "inherit" });
        console.log("✅ Dependencias temporales eliminadas correctamente.");
      } catch (cleanupErr) {
        console.log("⚠️ No se pudo eliminar readline-sync:", cleanupErr.message);
      }
    }
  }
}

main();
