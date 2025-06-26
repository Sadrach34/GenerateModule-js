/**
 * Funciones de utilidad para manipulación de strings
 * Estas funciones ayudan a formatear correctamente los nombres de clases, variables y archivos
 */

/**
 * Objeto con todas las funciones de transformación de strings
 */
const StringUtils = {
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  capitalizePlural: (str) => str.charAt(0).toUpperCase() + str.slice(1) + "s",
  capitalizeMinusPlural: (str) => str.charAt(0).toLowerCase() + str.slice(1) + "s",
  capitalizeMinus: (str) => str.charAt(0).toLowerCase() + str.slice(1)
};

// Mantenemos las funciones individuales para compatibilidad hacia atrás
const { capitalize, capitalizePlural, capitalizeMinusPlural, capitalizeMinus } = StringUtils;

//aqui comienzan los templates modificables
/***-------------------------------------------------------------------------------------------------------------------------------------------**```*/

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
function structure(name) {
  return [
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
    `modules/${capitalizePlural(name)}/infrastucture/prisma/${capitalizeMinus(name)}.repository.ts`,

    // Controladores para la API REST
    `modules/${capitalizePlural(name)}/interfaces/controllers/${capitalizeMinusPlural(name)}.controller.ts`,

    // Archivo principal del módulo
    `modules/${capitalizePlural(name)}/${capitalizeMinusPlural(name)}.module.ts`
  ];
};

function modulePrisma() {
  return `import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],  // Registra el servicio de Prisma
  exports: [PrismaService],    // Lo exporta para que otros módulos puedan usarlo
})
export class PrismaModule {}
`;
};

function servicePrisma() {
  return `import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // Se conecta automáticamente a la base de datos al inicializar el módulo
  async onModuleInit() {
    await this.$connect();
  }
}
`;
};

/**
     * Generación de DTOs (Data Transfer Objects)
     * 
     * Los DTOs definen la estructura de los datos que se reciben en las peticiones:
     * - create-*.dto.ts: Para operaciones de creación
     * - update-*.dto.ts: Para operaciones de actualización (con campos opcionales)
     * 
     * Estos archivos incluyen importaciones de class-validator para validación de datos
     */
function dtos(name) {
  return `import { IsString, IsNumber, IsOptional, IsDate, IsInt } from 'class-validator';

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
};

function dtoUpdate(name) {
  return `import {
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
};

/**
 * Generación de casos de uso (Use Cases)
 * 
 * Los casos de uso implementan la lógica de negocio de la aplicación
 * siguiendo el principio de responsabilidad única.
 */
function useCaseCreate(name, entityParams) {
  return `import { HttpException, Injectable } from '@nestjs/common';
import { ${capitalize(name)}Repository } from '../../domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalize(name)} } from '../../domain/entities/${capitalizeMinus(name)}.entity';
import { Create${capitalize(name)}Dto } from '../dtos/create-${capitalizeMinusPlural(name)}.dto';

/**
 * Caso de uso para crear ${capitalizeMinusPlural(name)}
 *
 * Implementa la lógica para crear un nuevo ${capitalizeMinus(name)}
 * utilizando el DTO de creación para validar los datos de entrada
 */
@Injectable()
export class Create${capitalize(name)}UseCase {
  constructor(private ${capitalizeMinus(name)}Repository: ${capitalize(name)}Repository) {}

  /**
   * Crea un nuevo ${capitalizeMinus(name)}
   * @param data - Datos validados mediante DTO
   * @returns El ${capitalizeMinus(name)} creado
   */
  async create${capitalize(name)}(data: Create${capitalize(name)}Dto): Promise<${capitalize(name)}> {
    try {
      // Crear entidad de dominio con los datos recibidos
      const new${capitalize(name)} = new ${capitalize(name)}(
${entityParams}
      );

      // Delegar la persistencia al repositorio
      return await this.${capitalizeMinus(name)}Repository.create(new${capitalize(name)});
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: \`Error al crear: \${(error as Error).message}\`,
        },
        500,
      );
    }
  }
}
`;
};

function useCaseGet(name) {
  return `import { HttpException, Injectable } from '@nestjs/common';
import { ${capitalize(name)}Repository } from '../../domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalize(name)} } from '../../domain/entities/${capitalizeMinus(name)}.entity';

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
   */
  async getAll${capitalize(name)}(): Promise<${capitalize(name)}[]> {
    try {
      return await this.${capitalizeMinus(name)}Repository.findAll();
    } catch (error) {
      throw new HttpException(
        {
          Error: \`Error al obtener: \${(error as Error).message}\`,
        },
        500,
      );
    }
  }

  /**
   * Busca un ${capitalizeMinus(name)} por su ID
   * @param id - ID del ${capitalizeMinus(name)} a buscar
   * @returns El ${capitalizeMinus(name)} encontrado
   */
  async get${capitalize(name)}ById(id: number): Promise<${capitalize(name)}> {
    try {
      const ${capitalizeMinus(name)} = await this.${capitalizeMinus(name)}Repository.findById(id.toString());
      if (!${capitalizeMinus(name)}) {
        throw new HttpException({ Error: 'No se encontró el equipo' }, 404);
      }

      return ${capitalizeMinus(name)};
    } catch (error) {
      throw new HttpException(
        {
          Error: \`Error al obtener: \${(error as Error).message}\`,
        },
        500,
      );
    }
  }
}
`;
};

function useCaseSoftDeleted(name) {
  return `import { HttpException, Injectable } from '@nestjs/common';
import { ${capitalize(name)}Repository } from '../../domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalize(name)} } from '../../domain/entities/${capitalizeMinus(name)}.entity';

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
  async delete${capitalize(name)}(id: string): Promise<${capitalize(name)}> {
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
};

function useCaseUpdate(name) {
  return `import { Injectable, HttpException } from '@nestjs/common';
import { ${capitalize(name)}Repository } from '../../domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalize(name)} } from '../../domain/entities/${capitalizeMinus(name)}.entity';
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
  async update${capitalize(name)}(id: number, data: Update${capitalize(name)}Dto): Promise<${capitalize(name)}> {
    try {
      return await this.${capitalizeMinus(name)}Repository.update(id, data);
    } catch (error) {
      throw new HttpException(
        {
          Error: \`Error al actualizar: \${(error as Error).message}\`,
        },
        500,
      );
    }
  }
}
`;
};

function enidadDominio(name) {
  return `/**
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
};

function repoDomain(name) {
  return `import { ${capitalize(name)} } from '../entities/${capitalizeMinus(name)}.entity';

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
  abstract create(${capitalizeMinus(name)}: ${capitalize(name)}): Promise<${capitalize(name)}>;

  /**
   * Obtiene todos los ${capitalizeMinusPlural(name)}
   * @returns Lista de ${capitalizeMinusPlural(name)}
   */
  abstract findAll(): Promise<${capitalize(name)}[]>;

  /**
   * Busca un ${capitalizeMinus(name)} por su ID
   * @param id - ID del ${capitalizeMinus(name)} a buscar
   * @returns El ${capitalizeMinus(name)} encontrado o null si no existe
   */
  abstract findById(id: string): Promise<${capitalize(name)} | null>;

  /**
   * Busca un ${capitalizeMinus(name)} por su nombre
   * @param name - Nombre del ${capitalizeMinus(name)} a buscar
   * @returns El ${capitalizeMinus(name)} encontrado o null si no existe
   */
  abstract findByName(name: string): Promise<${capitalize(name)} | null>;

  /**
   * Actualiza un ${capitalizeMinus(name)} existente
   * @param id - ID del ${capitalizeMinus(name)} a actualizar
   * @param ${capitalizeMinus(name)} - Nuevos datos del ${capitalizeMinus(name)}
   * @returns El ${capitalizeMinus(name)} actualizado
   */
  abstract update(id: number, ${capitalizeMinus(name)}: any): Promise<${capitalize(name)}>;

  /**
   * Elimina lógicamente un ${capitalizeMinus(name)} (soft-delete)
   * @param id - ID del ${capitalizeMinus(name)} a eliminar
   * @returns El ${capitalizeMinus(name)} eliminado
   */
  abstract delete(id: string): Promise<${capitalize(name)}>;
}
`;
};

function repoPrisma(name, createDataMapping, constructorCreated, includeFields, constructorUpdated, constructorDeleted) {
  const entity = capitalize(name);
  const repoName = `${entity}PrismaRepository`;
  const instanceName = capitalizeMinus(name);

  return `import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Connect/prisma.service';
import { ${entity}Repository } from '../../domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${entity} } from '../../domain/entities/${capitalizeMinus(name)}.entity';

@Injectable()
export class ${repoName} implements ${entity}Repository {
  constructor(private readonly prisma: PrismaService) {}

  async create(${instanceName}: ${entity}): Promise<${entity}> {
    const created = await this.prisma.${instanceName}.create({
      data: {
${createDataMapping}
      },${includeFields ? `\n      include: {\n${includeFields}\n      },` : ''}
    });

    return new ${entity}(
${constructorCreated}
    );
  }

  async findAll(): Promise<${entity}[]> {
    const result = await this.prisma.${instanceName}.findMany({
      where: { deletedAt: null },${includeFields ? `\n      include: {\n${includeFields}\n      },` : ''}
    });

    return result.map(data => new ${entity}(
${constructorCreated.replace(/created/g, 'data')}
    ));
  }

  async findById(id: string): Promise<${entity} | null> {
    const data = await this.prisma.${instanceName}.findFirst({
      where: { id: Number(id) },${includeFields ? `\n      include: {\n${includeFields}\n      },` : ''}
    });

    if (!data) return null;

    return new ${entity}(
${constructorCreated.replace(/created/g, 'data')}
    );
  }

  async findByName(name: string): Promise<${entity} | null> {
    const data = await this.prisma.${instanceName}.findFirst({
      where: { name, deletedAt: null },${includeFields ? `\n      include: {\n${includeFields}\n      },` : ''}
    });

    if (!data) return null;

    return new ${entity}(
${constructorCreated.replace(/created/g, 'data')}
    );
  }

  async update(id: number, ${instanceName}: ${entity}): Promise<${entity}> {
    const updated = await this.prisma.${instanceName}.update({
      where: { id },
      data: {
${createDataMapping}
      },${includeFields ? `\n      include: {\n${includeFields}\n      },` : ''}
    });

    return new ${entity}(
${constructorUpdated}
    );
  }

  async delete(id: string): Promise<${entity}> {
    const deleted = await this.prisma.${instanceName}.update({
      where: { id: Number(id) },
      data: {
        deletedAt: new Date(),
      },${includeFields ? `\n      include: {\n${includeFields}\n      },` : ''}
    });

    return new ${entity}(
${constructorDeleted}
    );
  }
}
`;
}

function apiRest(name) {
  return `import {
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
import { ${capitalize(name)} } from '../../domain/entities/${capitalizeMinus(name)}.entity';

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
  async getAll${capitalizePlural(name)}(): Promise<${capitalize(name)}[]> {
    return this.Get.getAll${capitalize(name)}();
  }

  /**
   * Obtiene un ${capitalizeMinus(name)} por su ID
   * @route GET /${capitalizeMinusPlural(name)}/:id
   * @param id - ID del ${capitalizeMinus(name)} a buscar
   * @returns El ${capitalizeMinus(name)} encontrado
   */
  @Get(':id')
  async get${capitalize(name)}ById(@Param('id') id: number): Promise<${capitalize(name)} | null> {
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
  ): Promise<${capitalize(name)}> {
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
  ): Promise<${capitalize(name)}> {
    return this.updated.update${capitalize(name)}(id, update${capitalize(name)}Dto);
  }

  /**
   * Elimina lógicamente un ${capitalizeMinus(name)} (soft-delete)
   * @route DELETE /${capitalizeMinusPlural(name)}/:id
   * @param id - ID del ${capitalizeMinus(name)} a eliminar
   * @returns El ${capitalizeMinus(name)} eliminado
   */
  @Delete(':id')
  async delete${capitalize(name)}(@Param('id') id: string): Promise<${capitalize(name)}> {
    return this.deleted.delete${capitalize(name)}(id);
  }
}
`;
};

function moduleNest(name) {
  return `import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/Connect/prisma.module';
import { ${capitalize(name)}Controller } from './interfaces/controllers/${capitalizeMinusPlural(name)}.controller';
import { Create${capitalize(name)}UseCase } from './application/use-case/create-${capitalizeMinusPlural(name)}.use-case';
import { Get${capitalize(name)}UseCase } from './application/use-case/get-${capitalizeMinusPlural(name)}.use-case';
import { Update${capitalize(name)}UseCase } from './application/use-case/update-${capitalizeMinusPlural(name)}.use-case';
import { SoftDeleted${capitalize(name)}UseCase } from './application/use-case/soft-deleted-${capitalizeMinusPlural(name)}.use-case';
import { ${capitalize(name)}Repository } from './domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalize(name)}PrismaRepository } from './infrastucture/prisma/${capitalizeMinus(name)}.repository';

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
};

/*
*para agregar mas aqui esta un template copia y pega para agregar mas
function dtoUpdateActualizar(name) {
return
};
*/

module.exports = {
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
};