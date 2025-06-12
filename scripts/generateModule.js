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
    execSync('timeout /t 10', { stdio: 'inherit' });
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

/**
 * Funciones de utilidad para manipulación de strings
 * Estas funciones ayudan a formatear correctamente los nombres de clases, variables y archivos
 */

/**
 * Convierte la primera letra de un string a mayúscula
 * @param {string} str - String a capitalizar
 * @returns {string} String con la primera letra en mayúscula
 */
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
 * Definición de la estructura de carpetas y archivos a generar
 * 
 * Esta estructura sigue los principios de Clean Architecture:
 * - Connect: Configuración de Prisma ORM
 * - Application: Lógica de aplicación (DTOs, casos de uso)
 * - Domain: Entidades y contratos de repositorios
 * - Infrastructure: Implementaciones concretas (repositorios)
 * - Interfaces: Controladores y puntos de entrada
 */
const structure = [
  // Archivos de conexión a la base de datos con Prisma
  `Connect/prisma.module.ts`,
  `Connect/prisma.service.ts`,

  // DTOs para validación de datos de entrada
  `modules/${capitalizePlural(name)}/application/dtos/create-${capitalizeMinusPlural(name)}.dto.ts`,
  `modules/${capitalizePlural(name)}/application/dtos/update-${capitalizeMinusPlural(name)}.dto.ts`,

  // Casos de uso (lógica de negocio)
  `modules/${capitalizePlural(name)}/application/use-case/create-${capitalizeMinusPlural(name)}.use-case.ts`,
  `modules/${capitalizePlural(name)}/application/use-case/get-${capitalizeMinusPlural(name)}.use-case.ts`,
  `modules/${capitalizePlural(name)}/application/use-case/soft-deleted-${capitalizeMinusPlural(name)}.use-case.ts`,
  `modules/${capitalizePlural(name)}/application/use-case/update-${capitalizeMinusPlural(name)}.use-case.ts`,

  // Entidades de dominio y contratos de repositorio
  `modules/${capitalizePlural(name)}/domain/entities/${capitalizeMinus(name)}.entity.ts`,
  `modules/${capitalizePlural(name)}/domain/repositories/${capitalizeMinusPlural(name)}.repository.ts`,

  // Implementación concreta del repositorio con Prisma
  `modules/${capitalizePlural(name)}/infrastucture/prisma/${capitalize(name)}.repository.ts`,

  // Controladores para la API REST
  `modules/${capitalizePlural(name)}/interfaces/controllers/${capitalizeMinusPlural(name)}.controller.ts`,

  // Archivo principal del módulo
  `modules/${capitalizePlural(name)}/${capitalizeMinusPlural(name)}.module.ts`
];

/**
 * Iteración sobre la estructura definida para crear carpetas y archivos
 * 
 * Para cada ruta en la estructura:
 * 1. Construye la ruta completa
 * 2. Crea los directorios necesarios si no existen
 * 3. Crea el archivo con su contenido específico si no existe
 */
structure.forEach((relativeFilePath) => {
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
      content = `import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],  // Registra el servicio de Prisma
  exports: [PrismaService],    // Lo exporta para que otros módulos puedan usarlo
})
export class PrismaModule {}
`;
    }

    // Archivo del servicio de Prisma
    if (relativeFilePath === 'Connect/prisma.service.ts') {
      content = `import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Se conecta automáticamente a la base de datos al inicializar el módulo
  async onModuleInit() {
    await this.$Connect();
  }
}
`;
    }

    /**
     * Generación de DTOs (Data Transfer Objects)
     * 
     * Los DTOs definen la estructura de los datos que se reciben en las peticiones:
     * - create-*.dto.ts: Para operaciones de creación
     * - update-*.dto.ts: Para operaciones de actualización (con campos opcionales)
     * 
     * Estos archivos incluyen importaciones de class-validator para validación de datos
     */

    // DTO para crear un nuevo recurso
    if (relativeFilePath === `modules/${capitalizePlural(name)}/application/dtos/create-${capitalizeMinusPlural(name)}.dto.ts`) {
      content = `import { IsString, IsNumber, IsOptional, IsDate, IsInt } from 'class-validator';
    
/**
 * DTO para la creación de un nuevo ${capitalize(name)}
 * 
 * Define los campos requeridos y sus validaciones para crear un ${capitalize(name)}
 * Ejemplo de uso:
 * @IsString()
 * name: string;
 */
export class Create${capitalize(name)}Dto {
  // Añade aquí las propiedades necesarias con sus decoradores de validación
}
`;
    }

    // DTO para actualizar un recurso existente
    if (relativeFilePath === `modules/${capitalizePlural(name)}/application/dtos/update-${capitalizeMinusPlural(name)}.dto.ts`) {
      content = `import {
  IsOptional,
  IsString,
  IsNumber,
  IsDate,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO para actualizar un ${capitalize(name)} existente
 * 
 * Todos los campos son opcionales para permitir actualizaciones parciales
 * Ejemplo de uso:
 * @IsOptional()
 * @IsString()
 * name?: string;
 */
export class Update${capitalize(name)}Dto {
  // Añade aquí las propiedades opcionales con sus decoradores de validación
}
`;
    }

    /**
     * Generación de casos de uso (Use Cases)
     * 
     * Los casos de uso implementan la lógica de negocio de la aplicación
     * siguiendo el principio de responsabilidad única.
     */

    // Caso de uso para crear un nuevo recurso
    if (relativeFilePath === `modules/${capitalizePlural(name)}/application/use-case/create-${capitalizeMinusPlural(name)}.use-case.ts`) {
      content = `import { HttpException, Injectable } from '@nestjs/common';
import { ${capitalize(name)}Repository } from '../../domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalizePlural(name)} } from '../../domain/entities/${capitalizeMinus(name)}.entity';
import { Create${capitalize(name)}Dto } from '../dtos/create-${capitalizeMinusPlural(name)}.dto';

/**
 * Caso de uso para la creación de un nuevo ${capitalize(name)}
 * 
 * Implementa la lógica de negocio para crear un ${capitalize(name)}:
 * 1. Validar que no exista un ${capitalize(name)} con el mismo nombre
 * 2. Crear la entidad de dominio
 * 3. Persistir en el repositorio
 */
@Injectable()
export class Create${capitalize(name)}UseCase {
  constructor(private ${capitalizeMinus(name)}Repository: ${capitalize(name)}Repository) {}

  /**
   * Crea un nuevo ${capitalize(name)}
   * @param data - DTO con los datos para crear el ${capitalize(name)}
   * @returns La entidad ${capitalize(name)} creada
   * @throws HttpException si ya existe un ${capitalize(name)} con el mismo nombre o si ocurre un error
   */
  async create${capitalize(name)}(data: Create${capitalize(name)}Dto): Promise<${capitalizePlural(name)}> {
    try {
      // Validación de existencia previa (opcional)
      const existing${capitalize(name)} = await this.${capitalizeMinus(name)}Repository.findByName(
        //data.name, // Descomenta y ajusta según las propiedades de tu entidad
      );
      if (existing${capitalize(name)}) {
        throw new HttpException(
          { Error: 'Ya existe un ${capitalize(name)} con este nombre' },
          400,
        );
      }

      // Crear entidad de dominio con los datos recibidos
      const new${capitalize(name)} = new ${capitalizePlural(name)}(
        //ejemplo - Ajusta según las propiedades de tu entidad
        // 0,
        // data.name,
        // data.price,
        // data.stock,
        // data.expiration,
        // data.description,
        // data.image,
      );

      // Delegar la persistencia al repositorio
      return await this.${capitalizeMinus(name)}Repository.create(new${capitalize(name)});
    } catch (error) {
      // Reenviar excepciones HTTP tal cual
      if (error instanceof HttpException) throw error;
      
      // Convertir otros errores en HttpException con mensaje descriptivo
      const message = error && error.message ? error.message : String(error);
      throw new HttpException(
        { Error: \`Error al crear el ${capitalize(name)}: \${message} \` },
        500,
      );
    }
  }
}
`;
    }

    // Caso de uso para obtener recursos (listar todos y buscar por ID)
    if (relativeFilePath === `modules/${capitalizePlural(name)}/application/use-case/get-${capitalizeMinusPlural(name)}.use-case.ts`) {
      content = `import { HttpException, Injectable } from '@nestjs/common';
import { ${capitalize(name)}Repository } from '../../domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalizePlural(name)} } from '../../domain/entities/${capitalizeMinus(name)}.entity';

/**
 * Caso de uso para obtener ${capitalizeMinusPlural(name)}
 * 
 * Implementa la lógica para:
 * - Obtener todos los ${capitalizeMinusPlural(name)}
 * - Buscar un ${capitalizeMinus(name)} específico por su ID
 */
@Injectable()
export class Get${capitalize(name)}UseCase {
  constructor(private ${capitalizeMinus(name)}Repository: ${capitalize(name)}Repository) {}

  /**
   * Obtiene todos los ${capitalizeMinusPlural(name)} disponibles
   * @returns Lista de ${capitalizeMinusPlural(name)}
   * @throws HttpException si no hay ${capitalizeMinusPlural(name)} o si ocurre un error
   */
  async getAll${capitalize(name)}(): Promise<${capitalize(name)}[]> {
    try {
      // Obtener todos los registros no eliminados
      const ${capitalizeMinusPlural(name)} = await this.${capitalizeMinus(name)}Repository.findAll();

      // Verificar si hay resultados
      if (!${capitalizeMinusPlural(name)}.length) {
        throw new HttpException({ Error: 'No hay ${capitalizeMinusPlural(name)} disponibles' }, 404);
      }

      return ${capitalizeMinusPlural(name)};
    } catch (error) {
      // Reenviar excepciones HTTP tal cual
      if (error instanceof HttpException) {
        throw error;
      }
      // Convertir otros errores en HttpException
      throw new HttpException(
        {
          Error: \`Error al obtener los ${capitalizeMinusPlural(name)}: \${(error as Error).message}\`,
        },
        500,
      );
    }
  }

  /**
   * Busca un ${capitalizeMinus(name)} por su ID
   * @param id - ID del ${capitalizeMinus(name)} a buscar
   * @returns El ${capitalizeMinus(name)} encontrado
   * @throws HttpException si el ID no es válido, si no existe el ${capitalizeMinus(name)} o si ocurre un error
   */
  async get${capitalize(name)}ById(id: number): Promise<${capitalizeMinusPlural(name)}> {
    try {
      // Asegúrate de que id sea un número
      const numericId = Number(id); // Esto convierte a número si es una cadena

      if (isNaN(numericId)) {
        throw new HttpException(
          { Error: 'El id proporcionado no es válido' },
          400,
        );
      }

      // Llamamos al repositorio, pasando un número como id
      const ${capitalizeMinus(name)} = await this.${capitalizeMinus(name)}Repository.findById(numericId);

      if (!${capitalizeMinus(name)}) {
        throw new HttpException(
          { Error: 'El ${capitalize(name)} no existe o fue eliminado' },
          404,
        );
      }

      return ${capitalizeMinus(name)};
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: \`Error al obtener el ${capitalize(name)}: \${(error as Error).message}\`,
        },
        500,
      );
    }
  }
}
`;
    }

    // Caso de uso para eliminación lógica (soft-delete) de recursos
    if (relativeFilePath === `modules/${capitalizePlural(name)}/application/use-case/soft-deleted-${capitalizeMinusPlural(name)}.use-case.ts`) {
      content = `import { HttpException, Injectable } from '@nestjs/common';
import { ${capitalize(name)}Repository } from '../../domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalizePlural(name)} } from '../../domain/entities/${capitalizeMinus(name)}.entity';

/**
 * Caso de uso para eliminación lógica de ${capitalizeMinusPlural(name)}
 * 
 * Implementa la lógica para marcar un ${capitalizeMinus(name)} como eliminado sin borrarlo físicamente
 * de la base de datos (soft-delete).
 */
@Injectable()
export class SoftDeleted${capitalize(name)}UseCase {
  constructor(private ${capitalizeMinus(name)}Repository: ${capitalize(name)}Repository) {}

  /**
   * Marca un ${capitalizeMinus(name)} como eliminado
   * @param id - ID del ${capitalizeMinus(name)} a eliminar
   * @returns El ${capitalizeMinus(name)} eliminado
   * @throws HttpException si el ID no es válido, si no existe el ${capitalizeMinus(name)} o si ocurre un error
   */
  async delete${capitalize(name)}(id: number): Promise<${capitalizePlural(name)}> {
    try {
      const ${capitalizeMinus(name)} = await this.${capitalizeMinus(name)}Repository.findById(id);

      if (!${capitalizeMinus(name)}) {
        throw new HttpException(
          { Error: 'El ${capitalize(name)} no existe o fue eliminado' },
          404,
        );
      }

      return await this.${capitalizeMinus(name)}Repository.delete(id);
    } catch (error) {
      throw new HttpException(
        {
          Error: \`Error intentalo más tarde. Error: \${(error as Error).message}\`,
        },
        500,
      );
    }
  }
}
`;
    }

    // Caso de uso para actualizar recursos
    if (relativeFilePath === `modules/${capitalizePlural(name)}/application/use-case/update-${capitalizeMinusPlural(name)}.use-case.ts`) {
      content = `import { Injectable, HttpException } from '@nestjs/common';
import { ${capitalize(name)}Repository } from '../../domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalizePlural(name)} } from '../../domain/entities/${capitalizeMinus(name)}.entity';
import { Update${capitalize(name)}Dto } from '../dtos/update-${capitalizeMinusPlural(name)}.dto';

/**
 * Caso de uso para actualizar ${capitalizeMinusPlural(name)}
 * 
 * Implementa la lógica para modificar un ${capitalizeMinus(name)} existente
 * utilizando el DTO de actualización para validar los datos de entrada
 */
@Injectable()
export class Update${capitalize(name)}UseCase {
  constructor(private ${capitalizeMinus(name)}Repository: ${capitalize(name)}Repository) {}

  /**
   * Actualiza un ${capitalizeMinus(name)} existente
   * @param id - ID del ${capitalizeMinus(name)} a actualizar
   * @param data - Datos de actualización validados mediante DTO
   * @returns El ${capitalizeMinus(name)} actualizado
   * @throws HttpException si el ID no es válido, si no existe el ${capitalizeMinus(name)} o si ocurre un error
   */
  async update${capitalize(name)}(id: number, data: Update${capitalize(name)}Dto): Promise<${capitalizePlural(name)}> {
    try {
      // Asegurar que el ID es un número
      const numericId = Number(id);

      if (isNaN(numericId)) {
        throw new HttpException(
          { Error: 'El id proporcionado no es válido' },
          400,
        );
      }

      const existing${capitalize(name)} = await this.${capitalizeMinus(name)}Repository.findById(numericId); // Usar numericId aquí

      if (!existing${capitalize(name)}) {
        throw new HttpException({ Error: 'El ${capitalizeMinus(name)}o no existe' }, 404);
      }

      // Lógica de actualización...
      const updated${capitalize(name)}Data = {
        id: numericId,
        name: data.name || existing${capitalize(name)}.name,
        price: data.price !== undefined ? data.price : existing${capitalize(name)}.price,
        stock: data.stock !== undefined ? data.stock : existing${capitalize(name)}.stock,
        expiration:
          data.expiration !== undefined
            ? data.expiration
            : existing${capitalize(name)}.expiration,
        description:
          data.description !== undefined
            ? data.description
            : existing${capitalize(name)}.description,
        image: data.image !== undefined ? data.image : existing${capitalize(name)}.image,
      };

      return this.${capitalizeMinus(name)}Repository.update(numericId, updated${capitalize(name)}Data); // Pasar numericId
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: \`Error al actualizar el ${capitalizeMinus(name)}o: \${(error as Error).message}\`,
        },
        500,
      );
    }
  }
}

`;
    }

    // Definición de la entidad de dominio
    if (relativeFilePath === `modules/${capitalizePlural(name)}/domain/entities/${capitalizeMinusPlural(name)}.entity.ts`) {
      content = `/**
 * Entidad de dominio para ${capitalizeMinusPlural(name)}
 * 
 * Esta clase representa el modelo de dominio para ${capitalizeMinusPlural(name)},
 * conteniendo todas las propiedades y comportamientos esenciales del negocio,
 * independiente de la infraestructura o frameworks utilizados.
 */
export class ${capitalizePlural(name)} {
  constructor(
    // Ejemplo de propiedades - descomenta y personaliza según tus necesidades
    // public id: number,
    // public name: string,
    // public price: number,
    // public stock: number,
    // public expiration: Date,
    // public description?: string, // Propiedades opcionales con ?
    // public image?: string,
  ) {}

  // Puedes añadir métodos de dominio aquí para encapsular la lógica de negocio
  // relacionada con esta entidad
}
`;
    }

    // Definición del repositorio de dominio (interfaz abstracta)
    if (relativeFilePath === `modules/${capitalizePlural(name)}/domain/repositories/${capitalizeMinusPlural(name)}.repository.ts`) {
      content = `import { ${capitalizePlural(name)} } from '../entities/${capitalizeMinus(name)}.entity';

/**
 * Repositorio abstracto para ${capitalizeMinusPlural(name)}
 * 
 * Define el contrato que deben implementar todos los repositorios concretos
 * que manejen ${capitalizeMinusPlural(name)}. Siguiendo el principio de inversión de dependencias,
 * la capa de dominio define la interfaz y la capa de infraestructura proporciona
 * la implementación concreta.
 */
export abstract class ${capitalize(name)}Repository {
  /**
   * Crea un nuevo ${capitalizeMinus(name)}
   * @param ${capitalizeMinus(name)} - Datos del ${capitalizeMinus(name)} a crear
   * @returns El ${capitalizeMinus(name)} creado
   */
  abstract create(${capitalizeMinus(name)}: ${capitalizePlural(name)}): Promise<${capitalizePlural(name)}>;
  
  /**
   * Obtiene todos los ${capitalizeMinusPlural(name)}
   * @returns Lista de ${capitalizeMinusPlural(name)}
   */
  abstract findAll(): Promise<${capitalizePlural(name)}[]>;
  
  /**
   * Busca un ${capitalizeMinus(name)} por su ID
   * @param id - ID del ${capitalizeMinus(name)} a buscar
   * @returns El ${capitalizeMinus(name)} encontrado o null si no existe
   */
  abstract findById(id: number): Promise<${capitalizePlural(name)} | null>;
  
  /**
   * Busca un ${capitalizeMinus(name)} por su nombre
   * @param name - Nombre del ${capitalizeMinus(name)} a buscar
   * @returns El ${capitalizeMinus(name)} encontrado o null si no existe
   */
  abstract findByName(name: string): Promise<${capitalizePlural(name)} | null>;
  
  /**
   * Actualiza un ${capitalizeMinus(name)} existente
   * @param id - ID del ${capitalizeMinus(name)} a actualizar
   * @param ${capitalizeMinus(name)} - Nuevos datos del ${capitalizeMinus(name)}
   * @returns El ${capitalizeMinus(name)} actualizado
   */
  abstract update(id: number, ${capitalizeMinus(name)}: ${capitalizePlural(name)}): Promise<${capitalizePlural(name)}>;
  
  /**
   * Elimina lógicamente un ${capitalizeMinus(name)} (soft-delete)
   * @param id - ID del ${capitalizeMinus(name)} a eliminar
   * @returns El ${capitalizeMinus(name)} eliminado
   */
  abstract delete(id: number): Promise<${capitalizePlural(name)}>;
}

`;
    }

    // Implementación del repositorio con Prisma (capa de infraestructura)
    if (relativeFilePath === `modules/${capitalizePlural(name)}/infrastucture/prisma/${capitalize(name)}.repository.ts`) {
      content = `import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Connect/prisma.service';
import { ${capitalize(name)}Repository } from 'src/modules/${capitalizeMinusPlural(name)}/domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalizePlural(name)} } from 'src/modules/${capitalizeMinusPlural(name)}/domain/entities/${capitalizeMinus(name)}.entity';

/**
 * Implementación del repositorio de ${capitalizeMinusPlural(name)} usando Prisma ORM
 * 
 * Esta clase implementa la interfaz definida en el dominio y proporciona
 * la implementación concreta utilizando Prisma como ORM para interactuar
 * con la base de datos.
 */
@Injectable()
export class ${capitalize(name)}PrismaRepository implements ${capitalize(name)}Repository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Crea un nuevo ${capitalizeMinus(name)} en la base de datos
   * @param ${capitalizeMinus(name)} - Datos del ${capitalizeMinus(name)} a crear
   * @returns El ${capitalizeMinus(name)} creado como entidad de dominio
   */
  async create(${capitalizeMinus(name)}: ${capitalizePlural(name)}): Promise<${capitalizePlural(name)}> {
    // Crear el registro en la base de datos usando Prisma
    const created = await this.prisma.${capitalizeMinus(name)}.create({
      data: {
        // Ejemplo - descomenta y adapta según tu modelo
        // name: ${capitalizeMinus(name)}.name,
        // price: ${capitalizeMinus(name)}.price,
        // stock: ${capitalizeMinus(name)}.stock,
        // description: ${capitalizeMinus(name)}.description || null,
        // deletedAt: null, // Inicialmente no está eliminado
        // expiration: ${capitalizeMinus(name)}.expiration,
        // image: ${capitalizeMinus(name)}.image,
      },
    });
    
    // Mapear el resultado de Prisma a la entidad de dominio
    return new ${capitalizePlural(name)}(
      // Ejemplo - descomenta y adapta según tu modelo
      // created.id,
      // created.name,
      // created.price,
      // created.stock,
      // created.expiration,
      // created.description || undefined,
      // created.image || undefined,
    );
  }

  /**
   * Obtiene todos los ${capitalizeMinusPlural(name)} no eliminados
   * @returns Lista de ${capitalizeMinusPlural(name)} como entidades de dominio
   */
  async findAll(): Promise<${capitalizePlural(name)}[]> {
    // Buscar todos los registros no eliminados lógicamente
    const ${capitalizeMinusPlural(name)} = await this.prisma.${capitalizeMinus(name)}.findMany({
      where: { deletedAt: null }, // Solo registros no eliminados
    });

    // Mapear los resultados de Prisma a entidades de dominio
    return ${capitalizeMinusPlural(name)}.map(
      (P) =>
        new ${capitalizePlural(name)}(
          // Ejemplo
          // P.id,
          // P.name,
          // P.price,
          // P.stock,
          // P.expiration,
          // P.description || undefined,
          // P.image || undefined,
        ),
    );
  }
  /**
   * Busca un ${capitalizeMinus(name)} por su ID
   * @param id - ID del ${capitalizeMinus(name)} a buscar
   * @returns El ${capitalizeMinus(name)} encontrado como entidad de dominio o null si no existe
   */
  async findById(id: number): Promise<${capitalizePlural(name)} | null> {
    // Buscar un registro no eliminado por su ID
    const ${capitalizeMinus(name)} = await this.prisma.${capitalizeMinus(name)}.findFirst({
      where: {
        id,
        deletedAt: null, // Solo registros no eliminados
      },
    });
    
    // Si no se encuentra, devolver null
    if (!${capitalizeMinus(name)}) return null;
    
    // Mapear el resultado de Prisma a la entidad de dominio
    return new ${capitalizePlural(name)}(
      // Ejemplo - descomenta y adapta según tu modelo
      // ${capitalizeMinus(name)}.id,
      // ${capitalizeMinus(name)}.name,
      // ${capitalizeMinus(name)}.price,
      // ${capitalizeMinus(name)}.stock,
      // ${capitalizeMinus(name)}.expiration,
      // ${capitalizeMinus(name)}.description || undefined,
      // ${capitalizeMinus(name)}.image || undefined,
    );
  }
  
  /**
   * Actualiza un ${capitalizeMinus(name)} existente
   * @param id - ID del ${capitalizeMinus(name)} a actualizar
   * @param ${capitalizeMinus(name)} - Nuevos datos del ${capitalizeMinus(name)}
   * @returns El ${capitalizeMinus(name)} actualizado como entidad de dominio
   */
  async update(id: number, ${capitalizeMinus(name)}: ${capitalizePlural(name)}): Promise<${capitalizePlural(name)}> {
    const updated = await this.prisma.${capitalizeMinus(name)}.update({
      where: { id },
      data: {
        // Ejemplo
        // name: ${capitalizeMinus(name)}.name,
        // price: ${capitalizeMinus(name)}.price,
        // stock: ${capitalizeMinus(name)}.stock,
        // description: ${capitalizeMinus(name)}.description,
        // expiration: ${capitalizeMinus(name)}.expiration,
        // image: ${capitalizeMinus(name)}.image,
      },
    });
    return new ${capitalizePlural(name)}(
      // Ejemplo
      // updated.id,
      // updated.name,
      // updated.price,
      // updated.stock,
      // updated.expiration,
      // updated.description || undefined,
      // updated.image || undefined,
    );
  }
  /**
   * Elimina lógicamente un ${capitalizeMinus(name)} (soft-delete)
   * @param id - ID del ${capitalizeMinus(name)} a eliminar
   * @returns El ${capitalizeMinus(name)} eliminado como entidad de dominio
   */
  async delete(id: number): Promise<${capitalizePlural(name)}> {
    // Actualizar el registro estableciendo la fecha de eliminación
    const deleted = await this.prisma.${capitalizeMinus(name)}.update({
      where: { id },
      data: {
        deletedAt: new Date(), // Marca de tiempo para soft-delete
      },
    });
    
    // Mapear el resultado de Prisma a la entidad de dominio
    return new ${capitalizePlural(name)}(
      // Ejemplo - descomenta y adapta según tu modelo
      // deleted.id,
      // deleted.name,
      // deleted.price,
      // deleted.stock,
      // deleted.expiration,
      // deleted.description || undefined,
      // deleted.image || undefined,
    );
  }
  
  /**
   * Busca un ${capitalizeMinus(name)} por su nombre
   * @param name - Nombre del ${capitalizeMinus(name)} a buscar
   * @returns El ${capitalizeMinus(name)} encontrado como entidad de dominio o null si no existe
   */
  async findByName(name: string): Promise<${capitalizePlural(name)} | null> {
    // Buscar un registro no eliminado por su nombre
    const ${capitalizeMinus(name)} = await this.prisma.${capitalizeMinus(name)}.findFirst({
      where: {
        name, // Buscar por el nombre exacto
        deletedAt: null, // Solo registros no eliminados
      },
    });
    
    // Si no se encuentra, devolver null
    if (!${capitalizeMinus(name)}) return null;
    
    // Mapear el resultado de Prisma a la entidad de dominio
    return new ${capitalizePlural(name)}(
      // Ejemplo - descomenta y adapta según tu modelo
      // ${capitalizeMinus(name)}.id,
      // ${capitalizeMinus(name)}.name,
      // ${capitalizeMinus(name)}.price,
      // ${capitalizeMinus(name)}.stock,
      // ${capitalizeMinus(name)}.expiration,
      // ${capitalizeMinus(name)}.description || undefined,
      // ${capitalizeMinus(name)}.image || undefined,
    );
  }
}
`;
    }

    // Controlador en la capa de interfaces (API REST)
    if (relativeFilePath === `modules/${capitalizePlural(name)}/interfaces/controllers/${capitalizeMinusPlural(name)}.controller.ts`) {
      content = `import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { Create${capitalize(name)}UseCase } from '../../application/use-case/create-${capitalizeMinusPlural(name)}.use-case';
import { Get${capitalize(name)}UseCase } from '../../application/use-case/get-${capitalizeMinusPlural(name)}.use-case';
import { Update${capitalize(name)}UseCase } from '../../application/use-case/update-${capitalizeMinusPlural(name)}.use-case';
import { SoftDeleted${capitalize(name)}UseCase } from '../../application/use-case/soft-deleted-${capitalizeMinusPlural(name)}.use-case';
import { Create${capitalize(name)}Dto } from '../../application/dtos/create-${capitalizeMinusPlural(name)}.dto';
import { Update${capitalize(name)}Dto } from '../../application/dtos/update-${capitalizeMinusPlural(name)}.dto';
import { ${capitalize(name)} } from '@prisma/client';
import { ${capitalizePlural(name)} } from '../../domain/entities/${capitalizeMinus(name)}.entity';

/**
 * Controlador REST para ${capitalizeMinusPlural(name)}
 * 
 * Expone los endpoints de la API para realizar operaciones CRUD sobre ${capitalizeMinusPlural(name)}
 * siguiendo los principios de Clean Architecture, donde el controlador actúa como
 * adaptador entre la capa de aplicación y el mundo exterior (HTTP).
 */
@Controller('${capitalizeMinusPlural(name)}')
export class ${capitalize(name)}Controller {
  constructor(
    private readonly Get: Get${capitalize(name)}UseCase,
    private readonly created: Create${capitalize(name)}UseCase,
    private readonly updated: Update${capitalize(name)}UseCase,
    private readonly deleted: SoftDeleted${capitalize(name)}UseCase,
  ) {}

  /**
   * Obtiene todos los ${capitalizeMinusPlural(name)}
   * @route GET /${capitalizeMinusPlural(name)}
   * @returns Lista de ${capitalizeMinusPlural(name)}
   */
  @Get()
  async getAll${capitalizePlural(name)}(): Promise<${capitalizePlural(name)}[]> {
    return this.Get.getAll${capitalizePlural(name)}();
  }

  /**
   * Obtiene un ${capitalizeMinus(name)} por su ID
   * @route GET /${capitalizeMinusPlural(name)}/:id
   * @param id - ID del ${capitalizeMinus(name)} a buscar
   * @returns El ${capitalizeMinus(name)} encontrado
   */
  @Get(':id')
  async get${capitalize(name)}ById(@Param('id') id: number): Promise<${capitalizePlural(name)} | null> {
    return this.Get.get${capitalize(name)}ById(id);
  }

  /**
   * Crea un nuevo ${capitalizeMinus(name)}
   * @route POST /${capitalizeMinusPlural(name)}
   * @param create${capitalize(name)}Dto - Datos del ${capitalizeMinus(name)} a crear
   * @returns El ${capitalizeMinus(name)} creado
   */
  @Post()
  async create${capitalize(name)}(
    @Body() create${capitalize(name)}Dto: Create${capitalize(name)}Dto,
  ): Promise<${capitalizePlural(name)}> {
    return this.created.create${capitalize(name)}(create${capitalize(name)}Dto);
  }

  /**
   * Actualiza un ${capitalizeMinus(name)} existente
   * @route PUT /${capitalizeMinusPlural(name)}/:id
   * @param id - ID del ${capitalizeMinus(name)} a actualizar
   * @param update${capitalize(name)}Dto - Datos actualizados del ${capitalizeMinus(name)}
   * @returns El ${capitalizeMinus(name)} actualizado
   */
  @Put(':id')
  async update${capitalize(name)}(
    @Param('id') id: number,
    @Body() update${capitalize(name)}Dto: Update${capitalize(name)}Dto,
  ): Promise<${capitalizePlural(name)}> {
    return this.updated.update${capitalize(name)}(id, update${capitalize(name)}Dto);
  }

  /**
   * Elimina lógicamente un ${capitalizeMinus(name)} (soft-delete)
   * @route DELETE /${capitalizeMinusPlural(name)}/:id
   * @param id - ID del ${capitalizeMinus(name)} a eliminar
   * @returns El ${capitalizeMinus(name)} eliminado
   */
  @Delete(':id')
  async delete${capitalize(name)}(@Param('id') id: number): Promise<${capitalizePlural(name)}> {
    return this.deleted.delete${capitalize(name)}(id);
  }
}
`;
    }

    // Definición del módulo NestJS
    if (relativeFilePath === `modules/${capitalizePlural(name)}/${capitalizeMinusPlural(name)}.module.ts`) {
      content = `import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Connect/prisma.module';
import { ${capitalize(name)}Controller } from './interfaces/controllers/${capitalizeMinusPlural(name)}.controller';
import { Create${capitalize(name)}UseCase } from './application/use-cases/create-${capitalizeMinusPlural(name)}.use-case';
import { Get${capitalize(name)}UseCase } from './application/use-cases/get-${capitalizeMinusPlural(name)}.use-case';
import { Update${capitalize(name)}UseCase } from './application/use-cases/update-${capitalizeMinusPlural(name)}.use-case';
import { SoftDeleted${capitalize(name)}UseCase } from './application/use-cases/soft-deleted-${capitalizeMinusPlural(name)}.use-case';
import { ${capitalize(name)}Repository } from './domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalize(name)}PrismaRepository } from './infrastructure/prisma/${capitalizeMinus(name)}.repository';

/**
 * Módulo de ${capitalizeMinusPlural(name)}
 * 
 * Este módulo organiza todos los componentes relacionados con ${capitalizeMinusPlural(name)}
 * siguiendo los principios de Clean Architecture:
 * 
 * 1. Interfaces: Controladores que manejan las peticiones HTTP
 * 2. Aplicación: Casos de uso que implementan la lógica de negocio
 * 3. Dominio: Entidades y repositorios abstractos
 * 4. Infraestructura: Implementaciones concretas de repositorios
 * 
 * El módulo configura la inyección de dependencias para conectar
 * todas las capas respetando el principio de inversión de dependencias.
 */

@Module({
  controllers: [${capitalize(name)}Controller],
  providers: [
    // Casos de uso de la capa de aplicación
    Get${capitalize(name)}UseCase,
    Create${capitalize(name)}UseCase,
    Update${capitalize(name)}UseCase,
    SoftDeleted${capitalize(name)}UseCase,
    // Implementación del patrón Repository con inyección de dependencias
    // Aquí se configura la inversión de dependencias: el dominio depende de abstracciones
    // y no de implementaciones concretas
    {
      provide: ${capitalize(name)}Repository, // Token abstracto (interfaz)
      useClass: ${capitalize(name)}PrismaRepository, // Implementación concreta
    },
  ],
  // Módulos externos necesarios
  imports: [PrismaModule], // Módulo que proporciona el servicio de Prisma ORM
})
export class ${capitalize(name)}Module {}

`;
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
    execSync('timeout /t 10', { stdio: 'inherit' });

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
