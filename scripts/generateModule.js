const { execSync } = require("child_process");

const fs = require("fs");
const path = require("path");

function capitalize(str) {//mayuscula
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizePlural(str) { //mayuscula y s
  return str.charAt(0).toUpperCase() + str.slice(1) + "s";
}

function capitalizeMinusPlural(str) { //minuscula y s
  return str.charAt(0).toLowerCase() + str.slice(1) + "s";
}
function capitalizeMinus(str) { //minuscula
  return str.charAt(0).toLowerCase() + str.slice(1);
}

// Obtenemos el nombre desde la línea de comandos
const name = process.argv[2];
if (!name) {
  console.error("❌ Debes proporcionar un nombre. Ej: npm run create:module user");
  process.exit(1);
}

const basePath = path.join(__dirname, "..", "src");

// Definimos la estructura de carpetas y archivos
const structure = [
  `Connect/prisma.module.ts`,
  `Connect/prisma.service.ts`,

  `modules/${capitalizePlural(name)}/application/dtos/create-${capitalizeMinusPlural(name)}.dto.ts`,
  `modules/${capitalizePlural(name)}/application/dtos/update-${capitalizeMinusPlural(name)}.dto.ts`,

  `modules/${capitalizePlural(name)}/application/use-case/create-${capitalizeMinusPlural(name)}.use-case.ts`,
  `modules/${capitalizePlural(name)}/application/use-case/get-${capitalizeMinusPlural(name)}.use-case.ts`,
  `modules/${capitalizePlural(name)}/application/use-case/soft-deleted-${capitalizeMinusPlural(name)}.use-case.ts`,
  `modules/${capitalizePlural(name)}/application/use-case/update-${capitalizeMinusPlural(name)}.use-case.ts`,

  `modules/${capitalizePlural(name)}/domain/entities/${capitalizeMinus(name)}.entity.ts`,
  `modules/${capitalizePlural(name)}/domain/repositories/${capitalizeMinusPlural(name)}.repository.ts`,

  `modules/${capitalizePlural(name)}/infrastucture/prisma/${capitalize(name)}.repository.ts`,

  `modules/${capitalizePlural(name)}/interfaces/controllers/${capitalizeMinusPlural(name)}.controller.ts`,

  `modules/${capitalizePlural(name)}/${capitalizeMinusPlural(name)}.module.ts`
];

// Iteramos sobre la estructura
structure.forEach((relativeFilePath) => {
  const fullPath = path.join(basePath, relativeFilePath);
  const dir = path.dirname(fullPath);

  // Creamos la carpeta si no existe
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Creamos el archivo con contenido si no existe
  if (!fs.existsSync(fullPath)) {
    let content = `// ${path.basename(fullPath)} generado automáticamente\n`;

    // prisnama Connect
    if (relativeFilePath === 'Connect/prisma.module.ts') {
      content = `import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
`;
    }

    if (relativeFilePath === 'Connect/prisma.service.ts') {
      content = `import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$Connect();
  }
}
`;
    }

    // module dtos
    if (relativeFilePath === `modules/${capitalizePlural(name)}/application/dtos/create-${capitalizeMinusPlural(name)}.dto.ts`) {
      content = `import { IsString, IsNumber, IsOptional, IsDate, IsInt } from 'class-validator';
    
export class Create${capitalize(name)}Dto {
}
`;
    }

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

export class Update${capitalize(name)}Dto {
}
`;
    }

    // module use-cases
    if (relativeFilePath === `modules/${capitalizePlural(name)}/application/use-case/create-${capitalizeMinusPlural(name)}.use-case.ts`) {
      content = `import { HttpException, Injectable } from '@nestjs/common';
import { ${capitalize(name)}Repository } from '../../domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalizePlural(name)} } from '../../domain/entities/${capitalizeMinus(name)}.entity';
import { Create${capitalize(name)}Dto } from '../dtos/create-${capitalizeMinusPlural(name)}.dto';

@Injectable()
export class Create${capitalize(name)}UseCase {
  constructor(private ${capitalizeMinus(name)}Repository: ${capitalize(name)}Repository) {}

  async create${capitalize(name)}(data: Create${capitalize(name)}Dto): Promise<${capitalizePlural(name)}> {
    try {
      // Validación de existencia previa (opcional)
      const existing${capitalize(name)} = await this.${capitalizeMinus(name)}Repository.findByName(
        //data.name,
      );
      if (existing${capitalize(name)}) {
        throw new HttpException(
          { Error: 'Ya existe un ${capitalize(name)} con este nombre' },
          400,
        );
      }

      // Crear entidad
      const new${capitalize(name)} = new ${capitalizePlural(name)}(
        //ejemplo
        // 0,
        // data.name,
        // data.price,
        // data.stock,
        // data.expiration,
        // data.description,
        // data.image,
      );

      // Delegar al repositorio
      return await this.${capitalizeMinus(name)}Repository.create(new${capitalize(name)});
    } catch (error) {
      if (error instanceof HttpException) throw error;
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

    if (relativeFilePath === `modules/${capitalizePlural(name)}/application/use-case/get-${capitalizeMinusPlural(name)}.use-case.ts`) {
      content = `import { HttpException, Injectable } from '@nestjs/common';
import { ${capitalize(name)}Repository } from '../../domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalizePlural(name)} } from '../../domain/entities/${capitalizeMinus(name)}.entity';

@Injectable()
export class Get${capitalize(name)}UseCase {
  constructor(private ${capitalizeMinus(name)}Repository: ${capitalize(name)}Repository) {}

  async getAll${capitalize(name)}(): Promise<${capitalize(name)}[]> {
    try {
      const ${capitalizeMinusPlural(name)} = await this.${capitalizeMinus(name)}Repository.findAll();

      if (!${capitalizeMinusPlural(name)}.length) {
        throw new HttpException({ Error: 'No hay ${capitalizeMinusPlural(name)} disponibles' }, 404);
      }

      return ${capitalizeMinusPlural(name)};
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        {
          Error: \`Error al obtener los ${capitalizeMinusPlural(name)}: \${(error as Error).message}\`,
        },
        500,
      );
    }
  }

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

    if (relativeFilePath === `modules/${capitalizePlural(name)}/application/use-case/soft-deleted-${capitalizeMinusPlural(name)}.use-case.ts`) {
      content = `import { HttpException, Injectable } from '@nestjs/common';
import { ${capitalize(name)}Repository } from '../../domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalizePlural(name)} } from '../../domain/entities/${capitalizeMinus(name)}.entity';

@Injectable()
export class SoftDeleted${capitalize(name)}UseCase {
  constructor(private ${capitalizeMinus(name)}Repository: ${capitalize(name)}Repository) {}

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

    if (relativeFilePath === `modules/${capitalizePlural(name)}/application/use-case/update-${capitalizeMinusPlural(name)}.use-case.ts`) {
      content = `import { Injectable, HttpException } from '@nestjs/common';
import { ${capitalize(name)}Repository } from '../../domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalizePlural(name)} } from '../../domain/entities/${capitalizeMinus(name)}.entity';
import { Update${capitalize(name)}Dto } from '../dtos/update-${capitalizeMinusPlural(name)}.dto';

@Injectable()
export class Update${capitalize(name)}UseCase {
  constructor(private ${capitalizeMinus(name)}Repository: ${capitalize(name)}Repository) {}

  async update${capitalize(name)}(id: number, data: Update${capitalize(name)}Dto): Promise<${capitalizePlural(name)}> {
    try {
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

    // module entities
    if (relativeFilePath === `modules/${capitalizePlural(name)}/domain/entities/${capitalizeMinusPlural(name)}.entity.ts`) {
      content = `export class ${capitalizePlural(name)} {
  constructor(
    // Ejemplo
    // public id: number,
    // public name: string,
    // public price: number,
    // public stock: number,
    // public expiration: Date,
    // public description?: string,
    // public image?: string,
  ) {}
}
`;
    }

    // module repositories
    if (relativeFilePath === `modules/${capitalizePlural(name)}/domain/repositories/${capitalizeMinusPlural(name)}.repository.ts`) {
      content = `import { ${capitalizePlural(name)} } from '../entities/${capitalizeMinus(name)}.entity';

export abstract class ${capitalize(name)}Repository {
  abstract create(${capitalizeMinus(name)}: ${capitalizePlural(name)}): Promise<${capitalizePlural(name)}>;
  abstract findAll(): Promise<${capitalizePlural(name)}[]>;
  abstract findById(id: number): Promise<${capitalizePlural(name)} | null>;
  abstract findByName(name: string): Promise<${capitalizePlural(name)} | null>;
  abstract update(id: number, ${capitalizeMinus(name)}: ${capitalizePlural(name)}): Promise<${capitalizePlural(name)}>;
  abstract delete(id: number): Promise<${capitalizePlural(name)}>;
}

`;
    }

    // module infrastructureprisma
    if (relativeFilePath === `modules/${capitalizePlural(name)}/infrastucture/prisma/${capitalize(name)}.repository.ts`) {
      content = `import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/Connect/prisma.service';
import { ${capitalize(name)}Repository } from 'src/modules/${capitalizeMinusPlural(name)}/domain/repositories/${capitalizeMinusPlural(name)}.repository';
import { ${capitalizePlural(name)} } from 'src/modules/${capitalizeMinusPlural(name)}/domain/entities/${capitalizeMinus(name)}.entity';

@Injectable()
export class ${capitalize(name)}PrismaRepository implements ${capitalize(name)}Repository {
  constructor(private readonly prisma: PrismaService) {}

  async create(${capitalizeMinus(name)}: ${capitalizePlural(name)}): Promise<${capitalizePlural(name)}> {
    const created = await this.prisma.${capitalizeMinus(name)}.create({
      data: {
        // Ejemplo
        // name: ${capitalizeMinus(name)}.name,
        // price: ${capitalizeMinus(name)}.price,
        // stock: ${capitalizeMinus(name)}.stock,
        // description: ${capitalizeMinus(name)}.description || null,
        // deletedAt: null,
        // expiration: ${capitalizeMinus(name)}.expiration,
        // image: ${capitalizeMinus(name)}.image,
      },
    });
    return new ${capitalizePlural(name)}(
      // Ejemplo
      // created.id,
      // created.name,
      // created.price,
      // created.stock,
      // created.expiration,
      // created.description || undefined,
      // created.image || undefined,
    );
  }

  async findAll(): Promise<${capitalizePlural(name)}[]> {
    const ${capitalizeMinusPlural(name)} = await this.prisma.${capitalizeMinus(name)}.findMany({
      where: { deletedAt: null },
    });

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
  async findById(id: number): Promise<${capitalizePlural(name)} | null> {
    const ${capitalizeMinus(name)} = await this.prisma.${capitalizeMinus(name)}.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
    if (!${capitalizeMinus(name)}) return null;
    return new ${capitalizePlural(name)}(
      // Ejemplo
      // ${capitalizeMinus(name)}.id,
      // ${capitalizeMinus(name)}.name,
      // ${capitalizeMinus(name)}.price,
      // ${capitalizeMinus(name)}.stock,
      // ${capitalizeMinus(name)}.expiration,
      // ${capitalizeMinus(name)}.description || undefined,
      // ${capitalizeMinus(name)}.image || undefined,
    );
  }
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
  async delete(id: number): Promise<${capitalizePlural(name)}> {
    const deleted = await this.prisma.${capitalizeMinus(name)}.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
    return new ${capitalizePlural(name)}(
      // Ejemplo
      // deleted.id,
      // deleted.name,
      // deleted.price,
      // deleted.stock,
      // deleted.expiration,
      // deleted.description || undefined,
      // deleted.image || undefined,
    );
  }
  async findByName(name: string): Promise<${capitalizePlural(name)} | null> {
    const ${capitalizeMinus(name)} = await this.prisma.${capitalizeMinus(name)}.findFirst({
      where: {
        name,
        deletedAt: null,
      },
    });
    if (!${capitalizeMinus(name)}) return null;
    return new ${capitalizePlural(name)}(
      // Ejemplo
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

    // module interfaces controllers
    if (relativeFilePath === `modules/${capitalizePlural(name)}/interfaces/controllers/${capitalizeMinusPlural(name)}.controller.ts`) {
      content = `
      import {
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

@Controller('${capitalizeMinusPlural(name)}')
export class ${capitalize(name)}Controller {
  constructor(
    private readonly Get: Get${capitalize(name)}UseCase,
    private readonly created: Create${capitalize(name)}UseCase,
    private readonly updated: Update${capitalize(name)}UseCase,
    private readonly deleted: SoftDeleted${capitalize(name)}UseCase,
  ) {}

  @Get()
  async getAll${capitalizePlural(name)}(): Promise<${capitalizePlural(name)}[]> {
    return this.Get.getAll${capitalizePlural(name)}();
  }

  @Get(':id')
  async get${capitalize(name)}ById(@Param('id') id: number): Promise<${capitalizePlural(name)} | null> {
    return this.Get.get${capitalize(name)}ById(id);
  }

  @Post()
  async create${capitalize(name)}(
    @Body() create${capitalize(name)}Dto: Create${capitalize(name)}Dto,
  ): Promise<${capitalizePlural(name)}> {
    return this.created.create${capitalize(name)}(create${capitalize(name)}Dto);
  }

  @Put(':id')
  async update${capitalize(name)}(
    @Param('id') id: number,
    @Body() update${capitalize(name)}Dto: Update${capitalize(name)}Dto,
  ): Promise<${capitalizePlural(name)}> {
    return this.updated.update${capitalize(name)}(id, update${capitalize(name)}Dto);
  }

  @Delete(':id')
  async delete${capitalize(name)}(@Param('id') id: number): Promise<${capitalizePlural(name)}> {
    return this.deleted.delete${capitalize(name)}(id);
  }
}
`;
    }

    //module
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

@Module({
  controllers: [${capitalize(name)}Controller],
  providers: [
    Get${capitalize(name)}UseCase,
    Create${capitalize(name)}UseCase,
    Update${capitalize(name)}UseCase,
    SoftDeleted${capitalize(name)}UseCase,
    {
      provide: ${capitalize(name)}Repository,
      useClass: ${capitalize(name)}PrismaRepository,
    },
  ],
  imports: [PrismaModule],
})
export class ${capitalize(name)}Module {}

`;
    }

    // Usar la variable name que ya está definida en el ámbito global
    let appModuleContent;
    try {
      appModuleContent = fs.readFileSync('src/app.module.ts', 'utf8');

      const moduleName = `${capitalize(name)}Module`;
      const importLine = `import { ${moduleName} } from './modules/${capitalizePlural(name)}/${capitalizeMinusPlural(name)}.module';\n`;


      // Agrega la importación si no existe
      if (!appModuleContent.includes(importLine)) {
        appModuleContent = importLine + appModuleContent;
      }

      // Agrega el módulo al array de imports si no está
      appModuleContent = appModuleContent.replace(
        /(imports\s*:\s*\[)([\s\S]*?)(\])/,
        (_, start, modules, end) => {
          const newModule = `  ${moduleName},`;
          if (modules.includes(moduleName)) {
            return `${start}${modules}${end}`;
          }
          return `${start}\n${modules.trimEnd()}\n${newModule}\n${end}`;
        }
      );

      fs.writeFileSync('src/app.module.ts', appModuleContent, 'utf8');
    } catch (error) {
      console.log(`⚠️ No se pudo actualizar app.module.ts: ${error.message}`);
    }

    fs.writeFileSync(fullPath, content);
    console.log(`✅ Creado: ${relativeFilePath}`);
  } else {
    console.log(`⚠️ Ya existe: ${relativeFilePath}`);
  }
});
try {
  console.log("📦 Instalando Prisma como dependencia de desarrollo...");
  execSync("npm install prisma -D", { stdio: "inherit" });
  console.log("✅ Prisma instalado correctamente.");
} catch (err) {
  console.error("❌ Error al instalar Prisma:", err);
}
