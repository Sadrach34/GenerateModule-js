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
  moduleNest,
} = require('./template');

/**
 * Script para generar automáticamente módulos CRUD en NestJS siguiendo Clean Architecture
 * basado en los modelos definidos en el esquema de Prisma
 *
 * Este script lee el archivo schema.prisma, extrae los modelos y sus campos,
 * y genera toda la estructura de carpetas y archivos necesarios para un módulo completo
 * incluyendo DTOs, casos de uso, entidades, repositorios, controladores y el módulo principal.
 */

// Importaciones de módulos de Node.js
const { execSync } = require('child_process'); // Para ejecutar comandos del sistema
const fs = require('fs'); // Para operaciones de sistema de archivos
const path = require('path'); // Para manejo de rutas

// Funciones de utilidad para manipulación de strings
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizePlural(str) {
  return str.charAt(0).toUpperCase() + str.slice(1) + 's';
}

function capitalizeMinusPlural(str) {
  return str.charAt(0).toLowerCase() + str.slice(1) + 's';
}

function capitalizeMinus(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Función para parsear el esquema de Prisma y extraer los modelos y sus campos
 * @param {string} schemaPath - Ruta al archivo schema.prisma
 * @returns {Array} - Array de objetos con información de los modelos
 */
function parsePrismaSchema(schemaPath) {
  try {
    // Leer el contenido del archivo schema.prisma
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');

    // Expresión regular para encontrar modelos en el esquema
    const modelRegex = /model\s+(\w+)\s+{([\s\S]*?)}/g;

    // Expresión regular para encontrar campos dentro de un modelo
    const fieldRegex = /\s*(\w+)\s+(\w+(?:\[\])?(?:\?)?)(\s+@[\s\S]*?)?$/gm;

    const models = [];
    let modelMatch;

    // Iterar sobre todos los modelos encontrados en el esquema
    while ((modelMatch = modelRegex.exec(schemaContent)) !== null) {
      const modelName = modelMatch[1];
      const modelBody = modelMatch[2];

      const fields = [];
      let fieldMatch;

      // Iterar sobre todos los campos del modelo actual
      while ((fieldMatch = fieldRegex.exec(modelBody)) !== null) {
        // Ignorar campos de relación (que no tienen tipo primitivo)
        const fieldName = fieldMatch[1];
        let fieldType = fieldMatch[2];
        const fieldAttributes = fieldMatch[3] || '';

        // Determinar si el campo es opcional
        const isOptional = fieldType.includes('?');

        const isArray = fieldType.includes('[]');

        // Limpiar el tipo de campo
        fieldType = fieldType.replace('?', '');

        // Mapear tipos de Prisma a tipos de TypeScript/class-validator
        let tsType = fieldType;
        let validatorType = '';

        switch (fieldType) {
          case 'String':
            tsType = 'string';
            validatorType = 'IsString';
            break;
          case 'Int':
          case 'Float':
            tsType = 'number';
            validatorType = fieldType === 'Int' ? 'IsInt' : 'IsNumber';
            break;
          case 'Boolean':
            tsType = 'boolean';
            validatorType = 'IsBoolean';
            break;
          case 'DateTime':
            tsType = 'Date';
            validatorType = 'IsDate';
            break;
          default:
            // Para tipos personalizados o enums
            tsType = fieldType;
            validatorType = 'IsString';
        }

        fields.push({
          name: fieldName,
          type: fieldType,
          tsType,
          validatorType,
          isOptional,
          isArray,
          attributes: fieldAttributes
        });
      }

      models.push({
        name: modelName,
        fields,
      });
    }

    return models;
  } catch (error) {
    console.error(`Error al parsear el esquema de Prisma: ${error.message}`);
    return [];
  }
}

/**
 * Función para generar el contenido de los DTOs basado en los campos del modelo
 * @param {string} name - Nombre del modelo
 * @param {Array} fields - Campos del modelo
 * @returns {string} - Contenido del DTO
 */
function generateDtoContent(name, fields) {
  let imports = new Set(['IsOptional']);
  let properties = '';

  fields.forEach((field) => {
    // Ignorar el campo id ya que normalmente no se incluye en los DTOs de creación
    if (!['createdAt', 'updatedAt', 'deletedAt'].includes(field.name)) {
      // Agregar el validador adecuado a las importaciones
      imports.add(field.validatorType);

      // Si es un array, agregar también IsArray
      if (field.isArray) {
        imports.add('IsArray');
        properties += `  @IsArray()\n`;
        if (field.validatorType !== 'IsArray') {
          properties += `  @${field.validatorType}({ each: true })\n`;
        }
      } else {
        properties += `  @${field.validatorType}()\n`;
      }

      // Agregar IsOptional si el campo es opcional
      if (field.isOptional) {
        properties += `  @IsOptional()\n`;
      }

      properties += `  ${field.name}${field.isOptional ? '?' : ''}: ${field.tsType};\n\n`;
    }
  });

  return `import { ${Array.from(imports).join(', ')} } from 'class-validator';\n\n/**\n * DTO para la creación de un nuevo ${capitalize(name)}\n *\n * Define los campos requeridos y sus validaciones para crear un ${capitalize(name)}\n */\nexport class Create${capitalize(name)}Dto {\n${properties}}\n`;
}

/**
 * Función para generar el contenido del DTO de actualización basado en los campos del modelo
 * @param {string} name - Nombre del modelo
 * @param {Array} fields - Campos del modelo
 * @returns {string} - Contenido del DTO de actualización
 */
function generateUpdateDtoContent(name, fields) {
  let imports = new Set(['IsOptional']);
  let properties = '';

  fields.forEach((field) => {
    // Ignorar el campo id y campos de timestamp
    if (
      field.name !== 'id' &&
      field.name !== 'createdAt' &&
      field.name !== 'deletedAt' &&
      field.name !== 'updatedAt'
    ) {
      imports.add(field.validatorType);

      properties += `  @IsOptional()\n`;

      // Si es un array, agregar también IsArray
      if (field.isArray) {
        imports.add('IsArray');
        properties += `  @IsArray()\n`;
        if (field.validatorType !== 'IsArray') {
          properties += `  @${field.validatorType}({ each: true })\n`;
        }
      } else {
        properties += `  @${field.validatorType}()\n`;
      }

      properties += `  ${field.name}?: ${field.tsType};\n\n`;
    }
  });

  return `import { ${Array.from(imports).join(', ')} } from 'class-validator';\nexport class Update${capitalize(name)}Dto {\n${properties}}\n`;
}

/**
 * Función para generar el contenido de la entidad de dominio basado en los campos del modelo
 * @param {string} name - Nombre del modelo
 * @param {Array} fields - Campos del modelo
 * @returns {string} - Contenido de la entidad de dominio
 */
function generateEntityContent(name, fields) {
  const filteredFields = fields.filter(field =>
    !['createdAt', 'updatedAt', 'deletedAt'].includes(field.name)
  );

  let properties = '';
  let constructorParams = '';
  let constructorAssignments = '';

  filteredFields.forEach((field, index) => {
    properties += `  public ${field.name}${field.isOptional ? '?' : ''}: ${field.tsType};\n`;

    constructorParams += `${field.name}${field.isOptional ? '?' : ''}: ${field.tsType}`;
    if (index < filteredFields.length - 1) {
      constructorParams += ', ';
    }

    constructorAssignments += `    this.${field.name} = ${field.name};\n`;
  });

  return `/**
* Entidad de dominio para ${capitalize(name)}
*/
export class ${capitalize(name)} {
${properties}
  constructor(${constructorParams}) {
${constructorAssignments}  }
}
`;
}


/**
 * Función para generar el contenido del repositorio de Prisma basado en los campos del modelo
 * @param {string} name - Nombre del modelo
 * @param {Array} fields - Campos del modelo
 * @returns {string} - Contenido del repositorio de Prisma
 */
function isScalar(tsType) {
  return ['string', 'number', 'boolean', 'Date', 'boolean | null', 'number | null', 'string | null'].includes(tsType);
}

function isCustomObject(tsType) {
  return /^[A-Z]/.test(tsType) && !isScalar(tsType) && !tsType.endsWith('[]');
}

function generatePrismaRepoContent(name, fields) {
  const entityName = capitalize(name);
  const instanceName = capitalizeMinus(name);

  let createDataMapping = '';
  let includeBlock = '';
  let constructorCreated = '';
  let constructorUpdated = '';
  let constructorDeleted = '';

  fields.forEach((field) => {
    const { name: fieldName, tsType } = field;
    const isRelationArray = tsType.endsWith('[]');
    const isTimestamp = ['createdAt', 'updatedAt', 'deletedAt'].includes(fieldName);
    const isOneToOneRelation = isCustomObject(tsType);
    const isIdField = fieldName === 'id';

    // ✅ CREAR DATA
    if (!isTimestamp && !isIdField) {
      if (isRelationArray) {
        // omitido (relaciones many-to-many no se manejan aquí)
      } else if (isOneToOneRelation) {
        // ✅ Solo agregar connect si NO existe el campo <relationName>Id
        const relatedIdField = fieldName + 'Id';
        const hasIdField = fields.some(f => f.name === relatedIdField);

        if (!hasIdField) {
          createDataMapping += `        ${fieldName}: { connect: { id: ${instanceName}.${relatedIdField} } },\n`;
        }
        // Si existe postId o userId, no se agrega nada aquí (ya están en el DTO)
      } else {
        // Escalares u obligatorios normales
        createDataMapping += `        ${fieldName}: ${instanceName}.${fieldName},\n`;
      }
    }

    // ✅ INCLUIR relaciones
    if (isRelationArray || isOneToOneRelation) {
      includeBlock += `        ${fieldName}: true,\n`;
    }

    if (isTimestamp) {
      // ❌ No agregar ningún timestamp al constructor
      return;
    }
    
    if (isIdField) {
      constructorCreated += `      created.${fieldName},\n`;
      constructorUpdated += `      updated.${fieldName},\n`;
      constructorDeleted += `      deleted.${fieldName},\n`;
    } else if (isRelationArray) {
      constructorCreated += `      [], // ${fieldName} - relación omitida\n`;
      constructorUpdated += `      [], // ${fieldName} - relación omitida\n`;
      constructorDeleted += `      [], // ${fieldName} - relación omitida\n`;
    } else {
      constructorCreated += `      created.${fieldName},\n`;
      constructorUpdated += `      updated.${fieldName},\n`;
      constructorDeleted += `      deleted.${fieldName},\n`;
    }
    
  });

  return repoPrisma(
    name,
    createDataMapping.trimEnd(),
    constructorCreated.trimEnd(),
    includeBlock.trimEnd(),
    constructorUpdated.trimEnd(),
    constructorDeleted.trimEnd()
  );
}


/**
 * Función para generar el contenido del caso de uso de creación basado en los campos del modelo
 * @param {string} name - Nombre del modelo
 * @param {Array} fields - Campos del modelo
 * @returns {string} - Contenido del caso de uso de creación
 */
function generateCreateUseCaseContent(name, fields) {
  const filteredFields = fields.filter(field =>
    !['createdAt', 'updatedAt', 'deletedAt'].includes(field.name)
  );

  let entityParams = '';

  filteredFields.forEach((field) => {
    if (field.name === 'id') {
      entityParams += `        0,\n`; // Siempre inicia el ID en 0
    } else {
      entityParams += `        data.${field.name},\n`;
    }
  });

  return useCaseCreate(name, entityParams.trimEnd());
}


/**
 * Función principal que ejecuta el script
 */
async function main() {
  try {
    // Verificar si readline-sync ya está instalado
    let readlineSyncInstalled = false;
    try {
      // Intentar verificar si readline-sync está en node_modules
      if (
        fs.existsSync(path.join(process.cwd(), 'node_modules', 'readline-sync'))
      ) {
        readlineSyncInstalled = true;
        console.log(
          '\n\x1b[33mATENCIÓN: Se detectó que readline-sync ya está instalado.\x1b[0m',
        );
        console.log(
          '\x1b[33mEste paquete será desinstalado automáticamente al finalizar el script.\x1b[0m',
        );
        console.log(
          '\x1b[33mSi desea conservarlo, presione Ctrl+C en los próximos 10 segundos para cancelar.\x1b[0m\n',
        );

        // Esperar 10 segundos antes de continuar
        console.log('\x1b[36mContinuando en 10 segundos...\x1b[0m');
        // await sleep(10000);
        console.log(
          '\x1b[32mContinuando con la ejecución del script...\x1b[0m\n',
        );
        console.log('\x1b[32mSe instalara class-validator\x1b[0m\n');
        // execSync("npm uninstall class-validator", { stdio: "inherit" });
        // execSync("npm install class-validator --save", { stdio: "inherit" });
      } else {
        // Si no está instalado, instalarlo
        console.log(
          '\x1b[36mInstalando dependencia temporal readline-sync...\x1b[0m',
        );
        execSync('npm install readline-sync --save', { stdio: 'inherit' });
      }
    } catch (error) {
      // Si hay algún error, intentar instalar de todas formas
      console.log(
        '\x1b[36mInstalando dependencia temporal readline-sync...\x1b[0m',
      );
      execSync('npm install readline-sync --save', { stdio: 'inherit' });
    }

    const readlineSync = require('readline-sync'); // Para interacción con el usuario en la consola

    // Ruta al archivo schema.prisma
    const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

    // Verificar si existe el archivo schema.prisma
    if (!fs.existsSync(schemaPath)) {
      console.error(
        `❌ No se encontró el archivo schema.prisma en ${schemaPath}`,
      );
      process.exit(1);
    }

    // Parsear el esquema de Prisma
    const models = parsePrismaSchema(schemaPath);

    if (models.length === 0) {
      console.error('❌ No se encontraron modelos en el esquema de Prisma.');
      process.exit(1);
    }

    // Mostrar los modelos disponibles
    console.log('📋 Modelos disponibles en el esquema de Prisma:');
    models.forEach((model, index) => {
      console.log(`${index + 1}. ${model.name}`);
    });

    // Solicitar al usuario que seleccione un modelo
    const modelIndex = readlineSync.question(
      '\nSeleccione el número del modelo que desea generar (o "all" para generar todos): ',
    );

    let selectedModels = [];

    if (modelIndex.toLowerCase() === 'all') {
      selectedModels = models;
    } else {
      const index = parseInt(modelIndex) - 1;
      if (isNaN(index) || index < 0 || index >= models.length) {
        console.error('❌ Selección inválida.');
        process.exit(1);
      }
      selectedModels = [models[index]];
    }

    // Definir la ruta base donde se crearán los archivos
    const basePath = path.join(__dirname, '..', 'src');

    // Iterar sobre los modelos seleccionados
    for (const model of selectedModels) {
      const name = model.name;
      console.log(`\n🚀 Generando módulo para el modelo: ${name}`);

      // Obtener la estructura de archivos para el modelo actual
      const fileStructure = structure(name);

      // Iterar sobre la estructura de archivos
      for (const relativeFilePath of fileStructure) {
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

          // Archivo del módulo de Prisma
          if (relativeFilePath === 'Connect/prisma.module.ts') {
            content = modulePrisma();
          }

          // Archivo del servicio de Prisma
          if (relativeFilePath === 'Connect/prisma.service.ts') {
            content = servicePrisma();
          }

          // DTO para crear un nuevo recurso
          if (
            relativeFilePath ===
            `modules/${capitalizePlural(name)}/application/dtos/create-${capitalizeMinusPlural(name)}.dto.ts`
          ) {
            content = generateDtoContent(name, model.fields);
          }

          // DTO para actualizar un recurso existente
          if (
            relativeFilePath ===
            `modules/${capitalizePlural(name)}/application/dtos/update-${capitalizeMinusPlural(name)}.dto.ts`
          ) {
            content = generateUpdateDtoContent(name, model.fields);
          }

          // Caso de uso para crear un nuevo recurso
          if (
            relativeFilePath ===
            `modules/${capitalizePlural(name)}/application/use-case/create-${capitalizeMinusPlural(name)}.use-case.ts`
          ) {
            content = generateCreateUseCaseContent(name, model.fields);
          }

          // Caso de uso para obtener recursos (listar todos y buscar por ID)
          if (
            relativeFilePath ===
            `modules/${capitalizePlural(name)}/application/use-case/get-${capitalizeMinusPlural(name)}.use-case.ts`
          ) {
            content = useCaseGet(name);
          }

          // Caso de uso para eliminación lógica (soft-delete) de recursos
          if (
            relativeFilePath ===
            `modules/${capitalizePlural(name)}/application/use-case/soft-deleted-${capitalizeMinusPlural(name)}.use-case.ts`
          ) {
            content = useCaseSoftDeleted(name);
          }

          // Caso de uso para actualizar recursos
          if (
            relativeFilePath ===
            `modules/${capitalizePlural(name)}/application/use-case/update-${capitalizeMinusPlural(name)}.use-case.ts`
          ) {
            content = useCaseUpdate(name);
          }

          // Definición de la entidad de dominio
          if (
            relativeFilePath ===
            `modules/${capitalizePlural(name)}/domain/entities/${capitalizeMinus(name)}.entity.ts`
          ) {
            content = generateEntityContent(name, model.fields);
          }

          // Definición del repositorio de dominio (interfaz abstracta)
          if (
            relativeFilePath ===
            `modules/${capitalizePlural(name)}/domain/repositories/${capitalizeMinusPlural(name)}.repository.ts`
          ) {
            content = repoDomain(name);
          }

          // Implementación del repositorio con Prisma (capa de infraestructura)
          if (
            relativeFilePath ===
            `modules/${capitalizePlural(name)}/infrastucture/prisma/${capitalizeMinus(name)}.repository.ts`
          ) {
            content = generatePrismaRepoContent(name, model.fields);
          }

          // Controlador en la capa de interfaces (API REST)
          if (
            relativeFilePath ===
            `modules/${capitalizePlural(name)}/interfaces/controllers/${capitalizeMinusPlural(name)}.controller.ts`
          ) {
            content = apiRest(name);
          }

          // Definición del módulo NestJS
          if (
            relativeFilePath ===
            `modules/${capitalizePlural(name)}/${capitalizeMinusPlural(name)}.module.ts`
          ) {
            content = moduleNest(name);
          }

          // Escribe el contenido generado en el archivo de destino
          fs.writeFileSync(fullPath, content);
          console.log(`✅ Creado: ${relativeFilePath}`);
        } else {
          console.log(`⚠️ Ya existe: ${relativeFilePath}`);
        }
      }

      // Actualización automática del módulo principal de la aplicación (app.module.ts)
      try {
        // Verificar si existe el archivo app.module.ts
        const appModulePath = path.join(basePath, 'app.module.ts');
        if (fs.existsSync(appModulePath)) {
          // Leer el contenido actual del módulo principal
          let appModuleContent = fs.readFileSync(appModulePath, 'utf8');

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
            /(imports\s*:\s*\[)(\s\S]*?)(\])/,
            (_, start, modules, end) => {
              const newModule = `  ${moduleName},`;
              // Evita duplicados verificando si el módulo ya está incluido
              if (modules.includes(moduleName)) {
                return `${start}${modules}${end}`;
              }
              // Agrega el nuevo módulo al array de imports manteniendo el formato
              return `${start}\n${modules.trimEnd()}\n${newModule}\n${end}`;
            },
          );

          // Guarda los cambios en el archivo app.module.ts
          fs.writeFileSync(appModulePath, appModuleContent, 'utf8');
          console.log(
            `✅ Actualizado: app.module.ts con el módulo ${moduleName}`,
          );
        } else {
          console.log(
            `⚠️ No se encontró el archivo app.module.ts. No se pudo actualizar automáticamente.`,
          );
        }
      } catch (error) {
        // Manejo de errores en caso de que no se pueda actualizar app.module.ts
        console.log(`⚠️ No se pudo actualizar app.module.ts: ${error.message}`);
      }
    }

    console.log('\n✅ Generación de módulos completada con éxito.');

    // Desinstalar readline-sync solo si no estaba previamente instalado
    if (!readlineSyncInstalled) {
      try {
        console.log('🧹 Limpiando dependencias temporales...');
        console.log(
          '\x1b[33mDesinstalando readline-sync en 10 segundos...\x1b[0m',
        );
        console.log(
          '\x1b[33mSi desea conservarlo, presione Ctrl+C para cancelar.\x1b[0m',
        );

        // Esperar 10 segundos antes de desinstalar
        // await sleep(10000);

        execSync('npm uninstall readline-sync', { stdio: 'inherit' });
        console.log('✅ Dependencias temporales eliminadas correctamente.');
      } catch (cleanupErr) {
        console.log(
          '⚠️ No se pudo eliminar readline-sync:',
          cleanupErr.message,
        );
      }
    } else {
      console.log(
        'ℹ️ No se ha desinstalado readline-sync porque ya estaba instalado antes de ejecutar el script.',
      );
      // const answer = readlineSync.question('Desea desinstalar readline-sync? (y/n)');
      const answer = 'n';
      if (answer === 'y') {
        try {
          console.log('🧹 Limpiando dependencias temporales...');
          execSync('npm uninstall readline-sync', { stdio: 'inherit' });
          console.log('✅ Dependencias temporales eliminadas correctamente.');
        } catch (cleanupErr) {
          console.log(
            '⚠️ No se pudo eliminar readline-sync:',
            cleanupErr.message,
          );
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error en la ejecución del script: ${error.message}`);
    process.exit(1);
  }
}

main();
