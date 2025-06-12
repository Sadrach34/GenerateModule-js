# GenerateModule-js
Es un projecto que automatiza la creacion de cruds en el framework de nest.js utilizando estructura limpia

Scripts:# 🛠️ GenerateModule-js

**GenerateModule-js** es una herramienta en JavaScript que automatiza la creación de módulos tipo CRUD en un proyecto NestJS siguiendo una estructura limpia (Clean Architecture).

Este proyecto no es un NestJS por sí mismo, sino un conjunto de scripts que puedes integrar en tu propio proyecto NestJS para generar módulos de forma rápida y ordenada.

## 🚀 ¿Qué hace?

Al ejecutar el comando, se genera automáticamente la siguiente estructura:

```
src/
  modules/
    <nombre>/
      application/
        dtos/
          create-<nombre>.dto.ts
          update-<nombre>.dto.ts
        use-case/
          create-<nombre>.use-case.ts
          get-<nombre>.use-case.ts
          soft-deleted-<nombre>.use-case.ts
          update-<nombre>.use-case.ts
      domain/
        entities/
          <nombre>.entity.ts
        repositories/
          <nombre>.repository.ts
      infrastucture/
        prisma/
          <nombre>.repository.ts
      interfaces/
        controllers/
          <nombre>.controller.ts
      <nombre>.module.ts
  Connect/
    prisma.module.ts
    prisma.service.ts
```

    "create:module": "node scripts/generateModule.js"

    
Además, registra automáticamente el nuevo módulo en `src/app.module.ts`.

## 🧩 ¿Cómo integrarlo?

1. Clona este repositorio o copia la carpeta `scripts` en la raíz de tu proyecto NestJS.

2. Agrega el siguiente script en tu archivo `package.json`:

```json
"scripts": {
  "create:module": "node scripts/generateModule.js"
}
```
3. Ejecuta el comando para crear un nuevo módulo:
    `npm run create:module nombre`

## Ejemplo:
`npm run create:module project`
Esto generará un módulo llamado project (todo en minúsculas).

## ⚙️ Requisitos
- Proyecto NestJS ya creado
- Node.js 18+ instalado

## 🧑‍💻 Autor
Creado por 
- **Sadrach Juan Diego García Flores** 

## 📄 Licencia

Este software está disponible para uso personal y educativo bajo una licencia personalizada.  
**El uso comercial está estrictamente prohibido sin autorización expresa del autor.**  
Consulta el archivo [LICENSE](./LICENSE) para más detalles.

