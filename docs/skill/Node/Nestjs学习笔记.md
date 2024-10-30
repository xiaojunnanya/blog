---
id: nestjs
slug: /nestjs
title: Nestjs学习笔记
date: 2002-09-26
authors: 鲸落
tags: [Node, NestJs]
keywords: [Node, NestJs]
---

[中文文档 | NestJS](http://nestjs.inode.club/)

## 介绍

- 版本node >= 10.13.0：`node -v`
- 安装 NestJS cli：`npm i -g @nestjs/cli`
- `nest/cli`
  - 安装：`npm install -g @nestjs/cli`  
  - 查看版本：`nest --version`
  - 可视化使用nestcli可以做的所有的事情：`nest --help`
  - 运行：`npm run start`
  - 开发中使用：`npm run start:dev`，他会在每次文件更改的时候为我们提供实时编译和自动服务器重建
  - 生成模板：`nest g resource 名字`



## 概述

### 第一步

创建nest项目并运行：
```
npm i -g @nestjs/cli
nest new project-name
cd project-name
npm i
npm start
```



> **提示：**要创建一个具有 TypeScript 更严格功能集合的新项目，请在 `nest new` 命令中加上 `--strict` 标志。



将创建 `project-name` 目录，并安装 node modules 和其他一些样板文件，然后创建一个 `src/` 目录，并增加几个核心文件：

```js
src
|——app.controller.spec.ts
|——app.controller.ts
|——app.module.ts
|——app.service.ts
|——main.ts
```



以下是这些核心文件的简要概述：

| 文件                     | 描述                                                         |
| ------------------------ | ------------------------------------------------------------ |
| `app.controller.ts`      | 一个具有单一路由的基本控制器                                 |
| `app.controller.spec.ts` | 控制器的单元测试.                                            |
| `app.module.ts`          | 应用程序的根模块.                                            |
| `app.service.ts`         | 一个基本的服务，拥有一个单一的方法.                          |
| `main.ts`                | 应用程序的入口文件将使用核心函数 `NestFactory` 来创建一个 Nest 应用程序实例. |

`main.ts` 文件包含一个异步函数，用于引导我们的应用程序：

```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

为了创建一个 Nest 应用程序实例，我们使用核心的 `NestFactory` 类。`NestFactory` 暴露了一些静态方法，可以用来创建应用程序实例。`create()` 方法返回一个实现 `INestApplication` 接口的应用程序对象。该对象提供了一组方法，后面的章节将对其进行描述。在上面的 `main.ts` 示例中，我们只是启动了我们的 `HTTP` 监听器，使应用程序能够处理传入的 `HTTP` 请求。



### 控制器controller

**控制器负责处理传入的请求并向客户端返回响应**

控制器的目的是接收应用程序的特定请求。**路由**机制控制哪个控制器接收哪些请求。通常，每个控制器都有多个路由，不同的路由可以执行不同的操作

为了创建一个基本的控制器，我们使用类和**装饰器**。装饰器将类与所需的元数据关联起来，并使Nest能够创建路由映射（将请求与相应的控制器关联起来）

> **提示**：要使用CLI创建控制器，只需执行`nest g controller [name]`命令



#### 路由

在下面的示例中，我们将使用`@Controller()`装饰器，这是**必需的**，用于定义一个基本的控制器。

我们将指定一个可选的路由路径前缀`cats`。在`@Controller()`装饰器中使用路径前缀可以方便地将一组相关的路由分组，并减少重复的代码。例如，我们可以选择将一组管理与猫实体的交互的路由分组到路径`/cats`下。在这种情况下，我们可以在`@Controller()`装饰器中指定路径前缀`cats`，这样我们就不必在文件中的每个路由中重复该路径的一部分。

```js
// cats.controller.js

import { Controller, Get } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  findAll() {
    return 'This action returns all cats';
  }
}
```



在`findAll()`方法前的`@Get()` HTTP请求方法装饰器告诉Nest为特定的HTTP请求创建一个处理程序。端点对应于HTTP请求方法（在本例中为GET）和路由路径。什么是路由路径？处理程序的路由路径由连接控制器声明的（可选）前缀和方法装饰器中指定的任何路径决定。由于我们为每个路由声明了前缀（`cats`），并且在装饰器中没有添加任何路径信息，Nest会将`GET /cats`请求映射到此处理程序。如前所述，路径包括可选的控制器路径前缀**和**请求方法装饰器中声明的任何路径字符串。例如，具有前缀路径`cats`和装饰器`@Get('breed')`将为像`GET /cats/breed`这样的请求生成路由映射。

在上面的示例中，当对此端点发出GET请求时，Nest将请求路由到我们定义的`findAll()`方法。请注意，我们在此处选择的方法名是完全任意的。我们显然必须声明一个方法来绑定路由，但是Nest不会将选择的方法名附加到任何意义上。



#### 请求对象

处理程序通常需要访问客户端的**请求**详细信息。Nest提供了对底层平台的[请求对象](https://expressjs.com/en/api.html#req)（默认为Express）的访问。我们可以通过在处理程序的签名中添加`@Req()`装饰器来指示Nest注入请求对象，从而访问请求对象。

```ts
// cats.controller.ts

import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
  @Get()
  findAll(@Req() request: Request): string {
    console.log(request)// 我们可以拿到客户端的信息
    return 'This action returns all cats';
  }
}
```



> **提示**：为了利用`express`的类型定义（就像上面的`request: Request`参数示例中一样），请安装`@types/express`包（默认已经安装）



请求对象表示HTTP请求，具有用于请求查询字符串、参数、HTTP标头和主体的属性。在大多数情况下，不需要手动获取这些属性。相反，我们可以使用专门的装饰器，例如`@Body()`或`@Query()`，它们可以直接使用。以下是提供的装饰器列表以及它们所表示的普通平台特定对象

|                            |                                     |
| -------------------------- | ----------------------------------- |
| `@Request(), @Req()`       | `req`                               |
| `@Response(), @Res()`***** | `res`                               |
| `@Next()`                  | `next`                              |
| `@Session()`               | `req.session`                       |
| `@Param(key?: string)`     | `req.params` / `req.params[key]`    |
| `@Body(key?: string)`      | `req.body` / `req.body[key]`        |
| `@Query(key?: string)`     | `req.query` / `req.query[key]`      |
| `@Headers(name?: string)`  | `req.headers` / `req.headers[name]` |
| `@Ip()`                    | `req.ip`                            |
| `@HostParam()`             | `req.hosts`                         |



#### 资源

前面，我们定义了一个用于获取猫资源的端点（**GET**路由）。通常，我们还希望提供一个用于创建新记录的端点。为此，让我们创建一个**POST**处理程序：

```ts
// cats.controller.ts

import { Controller, Get, Post } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Post()
  create(): string {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```



就是这么简单。Nest为所有标准HTTP方法提供了装饰器：`@Get()`、`@Post()`、`@Put()`、`@Delete()`、`@Patch()`、`@Options()`和`@Head()`。此外，`@All()`定义了一个处理所有方法的端点。



#### 路由通配符

模式匹配的路由也是支持的。例如，星号（asterisk）用作通配符，将匹配任何字符组合。

```ts
@Get('ab*cd')
findAll() {
  return 'This route uses a wildcard';
}
```

路由路径`'ab*cd'`将匹配`abcd`、`ab_cd`、`abecd`等。字符`?`、`+`、`*`和`()`可以在路由路径中使用，并且是其正则表达式对应项的子集。连字符（`-`）和句点（`.`）在基于字符串的路径中会被直接解释。



#### 状态码

如前所述，默认情况下，响应的**状态码**始终为**200**，除了POST请求的状态码为**201**。我们可以通过在处理程序级别添加`@HttpCode(...)`装饰器来轻松更改此行为。

```ts
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}
```

> **提示**：从`@nestjs/common`包中导入`HttpCode`。



#### 头部信息

要指定自定义的响应头，你可以使用`@Header()`装饰器，也可以使用特定于库的响应对象（并直接调用`res.header()`）。

```ts
@Post()
@Header('Cache-Control', 'none')
create() {
  return 'This action adds a new cat';
}
```

> **提示**：从`@nestjs/common`包中导入`Header`。



#### 重定向

要将响应重定向到特定的URL，你可以使用`@Redirect()`装饰器，也可以使用特定于库的响应对象（并直接调用`res.redirect()`）。

`@Redirect()`接受两个参数，`url`和`statusCode`，两者都是可选的。如果省略`statusCode`，其默认值为`302`（`Found`）。

```typescript
@Get()
@Redirect('https://nestjs.com', 301)
```

有时你可能希望动态确定HTTP状态码或重定向的URL。你可以通过从路由处理程序方法返回具有以下结构的对象来实现：

```json
{
  "url": string,
  "statusCode": number
}
```

返回的值将覆盖传递给`@Redirect()`装饰器的任何参数。例如：

```typescript
@Get('docs')
@Redirect('http://nestjs.inode.club', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'http://nestjs.inode.club/v5/' };
  }
}
```



#### 路由参数

当你需要接受请求的一部分作为**动态数据**时（例如，`GET /cats/1`来获取id为`1`的猫），具有静态路径的路由将不起作用。为了定义具有参数的路由，我们可以在路由的路径中添加路由参数**标记**，以在请求URL中的该位置捕获动态值。在下面的`@Get()`装饰器示例中，演示了路由参数标记的用法。以这种方式声明的路由参数可以使用`@Param()`装饰器访问，该装饰器应该添加到方法签名中。

> **提示**：具有参数的路由应该在任何静态路径之后声明。这可以防止参数化路径截取前往静态路径的流量。

```typescript
@Get(':id')
findOne(@Param() params: any): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}
```

> **提示**：从`@nestjs/common`包中导入`Param`。

```typescript
@Get(':id')
findOne(@Param('id') id: string): string {
  return `This action returns a #${id} cat`;
}
```



#### 异步性

我们热爱现代JavaScript，也知道数据提取主要是**异步**的。这就是为什么Nest支持并且与`async`函数很好地配合使用。

每个异步函数都必须返回一个`Promise`。这意味着你可以返回一个延迟的值，Nest将能够自行解析它。让我们看一个例子：

```typescript
// cats.controller.ts
@Get()
async findAll(): Promise<any[]> {
  return [];
}
```

上面的代码是完全有效的。此外，Nest路由处理程序甚至更加强大，因为它们能够返回RxJS [observable流](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html)。Nest将自动订阅底层的源，并获取最后发出的值（一旦流程完成）。



#### 请求参数

我们之前的POST路由处理程序没有接受任何客户端参数。让我们通过在此处添加`@Body()`装饰器来修复这个问题。

但首先（如果你使用TypeScript），我们需要确定**DTO**（数据传输对象）模式。DTO是一个定义了数据将如何通过网络发送的对象。我们可以使用**TypeScript**接口或简单类来确定DTO模式。有趣的是，我们在这里建议使用**类**。为什么呢？类是JavaScript ES6标准的一部分，因此它们在编译后的JavaScript中被保留为实际实体。另一方面，由于TypeScript接口在编译过程中被删除，Nest无法在运行时引用它们。这很重要，因为诸如**Pipes**之类的特性在运行时具有变量的元类型时会有额外的可能性。

让我们创建`CreateCatDto`类：

```typescript
// dto/create-cat.dto.ts

export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

它只有三个基本属性。然后，我们可以在`CatsController`内部使用新创建的DTO：

```typescript
// cats.controller.ts

@Post()
async create(@Body() createCatDto: CreateCatDto) {
  console.log(createCatDto)
  return 'This action adds a new cat'
}
```

> **提示**：我们的`ValidationPipe`可以过滤掉不应由方法处理程序接收的属性。在这种情况下，我们可以将可接受的属性列入白名单，白名单中未包含的任何属性将自动从结果对象中剥离。在`CreateCatDto`示例中，我们的白名单是`name`、`age`和`breed`属性。



#### 启动和运行

在上面完全定义了控制器后，Nest仍然不知道`CatsController`存在，因此不会创建此类的实例。

控制器始终属于一个模块，这就是为什么我们在`@Module()`装饰器中包含了`controllers`数组。由于我们还没有定义除了根`AppModule`之外的其他模块，所以我们将使用它来引入`CatsController`：

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';

@Module({
  controllers: [CatsController],
})
export class AppModule {}
```

我们使用`@Module()`装饰器将元数据附加到模块类，并且Nest现在可以轻松地反映出哪些控制器必须被挂载。



### 提供者service

控制器应该处理HTTP请求并将更复杂的任务委托给**提供者**。提供者是普通的JavaScript类，在模块中声明为`providers`。

> **提示**：要使用CLI创建控制器，只需执行`nest generate service [name]`命令



#### 服务

让我们首先创建一个简单的`CatsService`。这个服务将负责数据的存储和检索，旨在供`CatsController`使用，因此它是一个很好的提供者候选对象。

```typescript
// cats.service.ts

import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

我们的`CatsService`是一个基本的类，有一个属性和两个方法。唯一的新功能是它使用了`@Injectable()`装饰器。`@Injectable()`装饰器附加了元数据，声明`CatsService`是一个可以由Nest [IoC](https://en.wikipedia.org/wiki/Inversion_of_control)容器管理的类。顺便说一下，这个示例还使用了一个`Cat`接口，可能看起来是这样的：

```typescript
// interfaces/cat.interface.ts
export interface Cat {
  name: string;
  age: number;
  breed: string;
}
```

现在我们有了一个用于检索猫的服务类，让我们在`CatsController`内部使用它：

```typescript
// cats.controller.ts

import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

`CatsService`是通过类构造函数**注入**的。请注意使用了`private`语法。这种简写允许我们在同一位置立即声明和初始化`catsService`成员。



#### 供者注册

现在我们已经定义了一个提供者（`CatsService`），并且有一个使用该服务的消费者（`CatsController`），我们需要将该服务注册到Nest中，以便进行注入。我们可以通过编辑模块文件（`app.module.ts`）并将服务添加到`@Module()`装饰器的`providers`数组中来实现这一点。

```typescript
// app.module.ts

import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```



### 模块module

> **提示**：要使用命令行界面（CLI）创建一个模块，只需执行`nest g module [name]`命令。

模块是带有`@Module()`装饰器的类。`@Module()`装饰器提供元数据，Nest使用这些元数据来组织应用程序的结构。

每个应用程序至少有一个模块，即**根模块**。根模块是Nest用于构建**应用程序图**的起点，这是Nest用于解析模块和提供者之间关系和依赖关系的内部数据结构。虽然理论上很小的应用程序可能只有根模块，但这并不是典型情况。我们强调模块是一种有效组织组件的方法。因此，对于大多数应用程序，生成的架构将使用多个模块，每个模块封装了一组紧密相关的**功能**。

`@Module()`装饰器接受一个单一的对象作为参数，其属性描述了模块:

|               |                                                              |
| ------------- | ------------------------------------------------------------ |
| `providers`   | 将由 Nest 注入器实例化并且至少可以在该模块中共享的提供程序享。 |
| `controllers` | 此模块中定义的必须实例化的控制器集                           |
| `imports`     | 导出此模块所需的提供程序的导入模块列表                       |
| `exports`     | 这个模块提供的`providers`子集应该在引入此模块的其他模块中可用。您可以使用提供者本身，也可以只使用其标记（`provide`值）。 |

默认情况下，模块 **encapsulates** 提供程序。 这意味着不可能注入既不直接属于当前模块也不从导入模块导出的提供程序。 因此，你可以将模块中导出的提供程序视为模块的公共接口或 API。



#### 特性模块

`CatsController`和`CatsService`属于同一个应用程序领域。由于它们密切相关，将它们移动到一个特性模块中是有意义的。特性模块简单地组织与特定功能相关的代码，保持代码有组织性，并建立清晰的边界。这有助于我们管理复杂性，并根据[SOLID](https://en.wikipedia.org/wiki/SOLID)原则进行开发，尤其是在应用程序的规模和/或团队规模增长时。

为了演示这一点，我们将创建`CatsModule`。

```typescript
// cats/cats.module.ts

import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {}
```



在上面，我们在`cats.module.ts`文件中定义了`CatsModule`，并将与该模块相关的所有内容都移动到了`cats`目录中。我们还需要做的最后一件事是将此模块导入到根模块（即在`app.module.ts`文件中定义的`AppModule`）中

```typescript
// app.module.ts

import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule {}
```



#### 共享模块

在Nest中，默认情况下，模块是**单例**的，因此您可以在多个模块之间轻松共享任何提供者的同一实例。

每个模块都自动成为一个**共享模块**。一旦创建，它可以被任何模块重复使用。假设我们想要在几个其他模块之间共享`CatsService`的实例。为了实现这一点，我们首先需要通过将其添加到模块的`exports`数组中来**导出**`CatsService`提供者，如下所示：

```typescript
// cats.module.ts

import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService]
})
export class CatsModule {}
```

现在，任何导入`CatsModule`的模块都可以访问`CatsService`，并且将与所有其他导入它的模块共享同一实例。



#### 模块重新导出

如上所示，模块可以导出其内部的提供者。此外，它们还可以重新导出它们导入的模块。在下面的示例中，`CommonModule`既被导入到`CoreModule`中，又从`CoreModule`中导出，从而使得其他导入了`CoreModule`的模块也能够使用它。

```typescript
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```



#### 全局模块

如果您必须在每个地方导入相同的模块集合，那可能会变得很繁琐。与Nest不同，[Angular](https://angular.io/)中的`providers`在全局范围内注册。一旦定义，它们就可以在任何地方使用。然而，Nest将提供者封装在模块范围内。如果不先导入封装模块，您无法在其他地方使用模块的提供者。

当您想要提供一组应该在开箱即用的情况下随处可用的提供者（例如，辅助函数、数据库连接等），可以使用`@Global()`装饰器使模块**全局化**。

```typescript
import { Module, Global } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

`@Global()`装饰器使模块具有全局范围。全局模块应该**仅注册一次**，通常由根模块或核心模块完成。在上面的示例中，`CatsService`提供者将是无处不在的，希望注入该服务的模块将不需要在其导入数组中导入`CatsModule`。

> **提示**：将所有内容都设为全局并不是一个好的设计决策。全局模块的目的是为了减少必要的样板代码。通常情况下，使用`imports`数组是将模块的API提供给消费者的首选方式.



### 中间件

Middleware是在路由处理程序**之前**调用的函数。中间件函数可以访问请求和响应对象，以及应用程序的请求-响应周期中的`next()`中间件函数。通常，**next**中间件函数由一个名为`next`的变量表示。

Nest中间件默认情况下与express中间件等效。以下来自官方express文档的描述介绍了中间件的功能：

> 中间件函数可以执行以下任务：
>
> - 执行任何代码。
> - 对请求和响应对象进行更改。
> - 结束请求-响应周期。
> - 调用堆栈中的下一个中间件函数。
> - 如果当前中间件函数未结束请求-响应周期，则必须调用`next()`将控制权传递给下一个中间件函数。否则，请求将被搁置。

您可以在函数中或带有`@Injectable()`装饰器的类中实现自定义的Nest中间件。类应该实现`NestMiddleware`接口，而函数没有任何特殊要求。让我们首先使用类方法来实现一个简单的中间件功能。



```typescript
// middleware/logger.middleware.ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}
```



#### 依赖注入

Nest中间件完全支持依赖注入。与提供者和控制器一样，它们能够在同一模块内**注入依赖项**。与往常一样，这是通过`constructor`来实现的。



#### 应用中间件

在`@Module()`装饰器中没有中间件的位置。相反，我们使用模块类的`configure()`方法来设置它们。包含中间件的模块必须实现`NestModule`接口。让我们在`AppModule`级别设置`LoggerMiddleware`。

```typescript
// app.module.ts

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OneModule } from './one/one.module';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './cats/middleware/logger.middleware';

@Module({
  imports: [OneModule, CatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}
```

在上面的示例中，我们为之前在`CatsController`中定义的`/cats`路由处理程序设置了`LoggerMiddleware`。我们还可以通过在配置中传递一个包含路由`path`和请求`method`的对象来进一步限制中间件适用的请求方法。在下面的示例中，请注意我们导入了`RequestMethod`枚举以引用所需的请求方法类型

````typescript
// app.module.ts

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OneModule } from './one/one.module';
import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './cats/middleware/logger.middleware';

@Module({
  imports: [OneModule, CatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes({
      path  : 'cats',
      method: RequestMethod.GET
    });
  }
}
````

> **提示**：`configure()`方法可以使用`async/await`进行异步化



#### 路由通配符

模式匹配的路由也是受支持的。例如，星号（`*`）被用作通配符，它可以匹配任意字符的组合：

```typescript
forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
```

路由路径 `'ab*cd'` 将匹配 `abcd`、`ab_cd`、`abecd` 等等。字符 `?`、`+`、`*` 和 `()` 可以在路由路径中使用，它们是正则表达式的子集。连字符（`-`）和点号（`.`）在基于字符串的路径中被解释为字面量。



#### 中间件使用者

`MiddlewareConsumer` 是一个辅助类，它提供了几种内置方法来管理中间件。`forRoutes()` 方法可以接受一个字符串、多个字符串、一个 `RouteInfo` 对象、一个控制器类，甚至是多个控制器类。在大多数情况下，您可能只需要传递用逗号分隔的控制器列表

```typescript
// app.module.ts

export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CatsController);
  }
}
```



#### 排除路由

有时我们希望排除某些路由不受中间件的影响。我们可以使用 `exclude()` 方法轻松排除特定的路由。该方法可以接受单个字符串、多个字符串或 `RouteInfo` 对象，用于标识要排除的路由，如下所示：

```typescript
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST },
    'cats/(.*)',
  )
  .forRoutes(CatsController);
```

通过上面的示例，`LoggerMiddleware` 将绑定到 `CatsController` 中定义的所有路由，**除了**传递给 `exclude()` 方法的三个路由。



#### 函数中间件

我们一直使用的 `LoggerMiddleware` 类相当简单。它没有成员，没有额外的方法，也没有依赖关系。我们为什么不直接将它定义为一个简单的函数，而不是一个类呢？事实上，我们是可以这样做的。这种类型的中间件被称为**函数式中间件**。下面让我们将 `LoggerMiddleware` 从基于类的中间件转变为函数式中间件，以说明两者之间的差异：

```typescript
// logger.middleware.ts

import { Request, Response, NextFunction } from 'express';

export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
};
```

并在 `AppModule` 中使用它：

```typescript
// app.module.ts

consumer
  .apply(logger)
  .forRoutes(CatsController);
```

> **提示**：当中间件不需要任何依赖时，可以考虑使用更简单的 **函数式中间件** 替代方案。



#### 全局中间件

如果我们想要一次性将中间件绑定到每个已注册的路由上，我们可以使用 `INestApplication` 实例提供的 `use()` 方法：

```typescript
// main.ts

const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

> **提示**在全局中间件中无法访问 DI 容器。当使用 `app.use()` 时，您可以使用功能性中间件。或者，您可以使用类中间件，并在 `AppModule`（或任何其他模块）中使用 `.forRoutes('*')` 进行使用





### 异常过滤器

Nest框架内置了一个**异常处理层**，负责处理应用程序中的所有未处理异常。当一个异常没有被应用程序代码处理时，它会被这个异常处理层捕获，然后自动发送一个适当的用户友好响应。

默认情况下，这个操作是由内置的**全局异常过滤器**执行的，它处理类型为`HttpException`（以及其子类）的异常。当一个异常是**未识别**的（既不是`HttpException`，也不是继承自`HttpException`的类），内置的异常过滤器会生成以下默认的JSON响应：

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```



#### 抛出标准异常

Nest提供了一个内置的`HttpException`类，可以从`@nestjs/common`包中引入。对于典型的基于HTTP REST/GraphQL的API应用程序，最佳实践是在发生某些错误条件时发送标准的HTTP响应对象。

例如，在`CatsController`中，我们有一个`findAll()`方法（一个`GET`路由处理程序）。假设这个路由处理程序由于某种原因抛出了异常。为了演示这一点，我们可以将其硬编码如下：

```typescript
// cats.controller.ts

@Get()
async findAll() {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
}
```

> **提示**：这里我们使用了`HttpStatus`。这是从`@nestjs/common`包导入的辅助枚举

当客户端调用此端点时，响应如下所示：

```json
{
  "statusCode": 403,
  "message": "Forbidden"
}
```

`HttpException` 构造函数有两个必需的参数，用于确定响应：

- `response` 参数定义了 JSON 响应体。它可以是一个 `string` 或一个如下所述的 `object`。
- `status` 参数定义了HTTP 状态码

默认情况下，JSON 响应体包含两个属性：

- `statusCode`：默认为 `status` 参数中提供的 HTTP 状态码。
- `message`：基于 `status` 的 HTTP 错误的简短描述。

要仅覆盖 JSON 响应体的 `message` 部分，请在 `response` 参数中提供一个字符串。要覆盖整个 JSON 响应体，请在 `response` 参数中传递一个对象。Nest 将对该对象进行序列化，并将其作为 JSON 响应体返回。

第二个构造函数参数 - `status` - 应该是有效的 HTTP 状态码。最佳实践是使用从 `@nestjs/common` 导入的 `HttpStatus` 枚举。

还有一个**第三个**构造函数参数（可选） - `options` - 可用于提供错误的cause。此 `cause` 对象不会序列化到响应对象中，但它可以用于记录目的，提供有关导致抛出 `HttpException` 的内部错误的有价值信息。

```typescript
// cats.controller.ts

@Get()
async findAll() {
  try {
    await this.service.findAll()
  } catch (error) {
    throw new HttpException({
      status: HttpStatus.FORBIDDEN,
      error: 'This is a custom message',
    }, HttpStatus.FORBIDDEN, {
      cause: error
    });
  }
}
```



#### 内置HTTP异常

Nest提供了一组标准异常，这些异常都是从基本的`HttpException`继承而来的。它们在`@nestjs/common`包中公开，代表了许多常见的HTTP异常：

- `BadRequestException`
- `UnauthorizedException`
- `NotFoundException`
- `ForbiddenException`
- `NotAcceptableException`
- `RequestTimeoutException`
- `ConflictException`
- `GoneException`
- `HttpVersionNotSupportedException`
- `PayloadTooLargeException`
- `UnsupportedMediaTypeException`
- `UnprocessableEntityException`
- `InternalServerErrorException`
- `NotImplementedException`
- `ImATeapotException`
- `MethodNotAllowedException`
- `BadGatewayException`
- `ServiceUnavailableException`
- `GatewayTimeoutException`
- `PreconditionFailedException`

所有内置的异常还可以使用`options`参数提供错误的`cause`和错误描述：

```typescript
throw new BadRequestException('Something bad happened', { cause: new Error(), description: 'Some error description' })
```

使用上述方式，响应将如下所示：

```json
{
  "message": "Something bad happened",
  "error": "Some error description",
  "statusCode": 400,
}
```



#### ...



### 管道

管道是具有 `@Injectable()` 装饰器的类。管道应实现 `PipeTransform` 接口。

管道有两个典型的应用场景:

- **转换**：管道将输入数据转换为所需的数据输出(例如，将字符串转换为整数)
- **验证**：对输入数据进行验证，如果验证成功继续传递; 验证失败则抛出异常

在这两种情况下, 管道 `参数(arguments)` 会由控制器(controllers)的路由处理程序进行处理。Nest 会在调用这个方法之前插入一个管道，管道会先拦截方法的调用参数,进行转换或是验证处理，然后用转换好或是验证好的参数调用原方法。

Nest自带很多开箱即用的内置管道。你还可以构建自定义管道。本章将先介绍内置管道以及如何将其绑定到路由处理程序(route handlers)上，然后查看一些自定义管道以展示如何从头开始构建自定义管道。



#### 内置管道

`Nest` 自带九个开箱即用的管道，即

- `ValidationPipe`
- `ParseIntPipe`
- `ParseFloatPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`
- `ParseEnumPipe`
- `DefaultValuePipe`
- `ParseFilePipe`

他们从 `@nestjs/common` 包中导出。

我们先来快速看看如何使用`ParseIntPipe`。这是一个**转换**的应用场景，管道确保传给路由处理程序的参数是一个整数(若转换失败，则抛出异常)。在本章后面，我们将展示 `ParseIntPipe` 的简单自定义实现。下面的示例写法也适用于其他内置转换管道（`ParseBoolPipe`、`ParseFloatPipe`、`ParseEnumPipe`、`ParseArrayPipe` 和 `ParseUUIDPipe`，我们在本章中将其称为 `Parse*` 管道）。



#### 绑定管道

为了使用管道，我们需要将一个管道类的实例绑定到合适的情境。在我们的 `ParseIntPipe` 示例中，我们希望将管道与特定的路由处理程序方法相关联，并确保它在该方法被调用之前运行。我们使用以下构造来实现，并其称为在方法参数级别绑定管道:

```typescript
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

这确保了我们在 `findOne()` 方法中接收的参数是一个数字(与 `this.catsService.findOne()` 方法的诉求一致)，或者在路由处理程序被调用之前抛出异常。

举个例子，假设路由是这样子的：

```bash
GET localhost:3000/abc
```

Nest将会抛出这样的异常:

```json
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```

这个异常阻止了 `findOne()` 方法的执行。

在上述例子中，我们传递了一个类(`ParseIntPipe`)，而不是一个实例，将实例化留给框架去处理，做到了依赖注入。对于管道和守卫，我们也可以选择传递一个实例。如果我们想通过传递选项来自定义内置管道的行为，传递实例很有用：

```typescript
@Get(':id')
async findOne(
  @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }))
  id: number,
) {
  return this.catsService.findOne(id);
}
```

绑定其他转换管道(即所有 `Parse*` 管道)的方法类似。这些管道都在验证路由参数、查询字符串参数和请求体正文值的情境中工作。

验证查询字符串参数的例子：

```typescript
@Get()
async findOne(@Query('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

使用 `ParseUUIDPipe` 解析字符串并验证是否为UUID的例子

```typescript
@Get(':uuid')
async findOne(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
  return this.catsService.findOne(uuid);
}
```

> **提示**：当使用 `ParseUUIDPipe()` 时，将解析版本3、版本4或版本5的UUID，如果你只需要特定版本的UUID，你可以在管道选项中传递版本。

上文我们看到的例子都是绑定不同的 `Parse*` 系列内置管道。绑定验证管道有一些不同；我们将在后续篇章讨论。



#### ...



### 守卫

> 守卫是一个使用 `@Injectable()` 装饰器的类。 守卫应该实现 `CanActivate` 接口

守卫具有**单一职责**。它们根据运行时的某些条件（如权限、角色、ACL等）确定是否将处理给定请求，这通常称为**授权**。授权（以及它通常与之协作的**身份验证**）通常在传统的Express应用程序中由中间件处理。中间件是身份验证的不错选择，因为诸如令牌验证和将属性附加到`request`对象之类的事情与特定路由上下文（及其元数据）没有紧密关联。

但是，中间件的特性是它是无知的。它不知道在调用`next()`函数后将执行哪个处理程序。另一方面，**守卫**可以访问`ExecutionContext`实例，因此确切地知道接下来将执行什么。它们的设计方式很像异常过滤器、管道和拦截器，可以让您在请求/响应周期中的确切位置插入处理逻辑，并以声明性的方式执行此操作。这有助于保持您的代码具有DRY原则且声明性。

> **提示**：请注意，守卫在所有中间件之后执行，但在拦截器或管道之前执行。



#### 授权守卫

如前所述，**授权**是守卫的一个重要用例，因为特定路由应仅在调用者（通常是特定已认证用户）具有足够权限时可用。我们现在要构建的`AuthGuard`假定存在已认证用户（因此，请求标头中附带了令牌）。它将提取并验证令牌，然后使用提取的信息来确定请求是否可以继续执行。

```typescript
// auth.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

`validateRequest()` 函数内的逻辑可以根据需要简单或复杂。此示例的主要目的是展示守卫如何适应请求/响应周期。

每个守卫必须实现一个 `canActivate()` 函数。此函数应返回一个布尔值，指示当前请求是否允许。它可以同步或异步（通过`Promise`或`Observable`）返回响应。Nest使用返回值来控制接下来的操作：

- 如果返回 `true`，请求将被处理。
- 如果返回 `false`，Nest将拒绝请求。



#### 执行上下文

`canActivate()` 函数接受一个参数，即 `ExecutionContext` 实例。`ExecutionContext` 继承自 `ArgumentsHost`，我们之前在异常过滤器章节中见过 `ArgumentsHost`。在上面的示例中，我们仅使用了在 `ArgumentsHost` 上定义的与之前相同的辅助方法，以获取对 `Request` 对象的引用。

通过扩展 `ArgumentsHost`，`ExecutionContext` 还添加了一些新的辅助方法，提供关于当前执行过程的附加详细信息。这些详细信息可以帮助构建更通用的守卫，可以跨多个控制器、方法和执行上下文工作。了解有关 `ExecutionContext` 的更多信息，请参考[此处](http://nestjs.inode.club/fundamentals/execution-context)。



#### 基于角色的身份验证

让我们构建一个更加功能强大的守卫，它只允许具有特定角色的用户访问。我们将从一个基本的守卫模板开始，并在接下来的部分进行扩展。目前，它允许所有请求继续进行：

```typescript
// roles.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
```



#### 绑定守卫

与管道和异常过滤器一样，守卫可以是**控制器范围**、方法范围或全局范围的。在下面的示例中，我们使用`@UseGuards()`装饰器设置了一个控制器范围的守卫。这个装饰器可以接受单个参数，或以逗号分隔的参数列表。这使您可以轻松地通过一次声明应用适当的守卫集合。

```typescript
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}
```

> **提示**：`@UseGuards()` 装饰器是从 `@nestjs/common` 包中导入的。

在上面的示例中，我们传递了`RolesGuard`类（而不是实例），将实例化的责任留给了框架，并启用了依赖注入。与管道和异常过滤器一样，我们也可以传递一个即时实例：

```typescript
@Controller('cats')
@UseGuards(new RolesGuard())
export class CatsController {}
```

上面的设置将守卫附加到此控制器声明的每个处理程序。如果我们希望守卫仅应用于单个方法，我们可以在**方法级别**应用`@UseGuards()`装饰器。

要设置全局守卫，可以使用Nest应用程序实例的`useGlobalGuards()`方法：

```typescript
const app = await NestFactory.create(AppModule);
app.useGlobalGuards(new RolesGuard());
```

全局守卫用于整个应用程序，对于每个控制器和每个路由处理程序。就依赖注入而言，从任何模块外部注册的全局守卫（如上面的示例中使用的`useGlobalGuards()`）无法注入依赖项，因为这是在任何模块的上下文之外完成的。为了解决这个问题，您可以使用以下方式直接从任何模块设置守卫：

```typescript
// app.module.ts

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```



#### 为处理程序设置角色

我们的`RolesGuard`已经在工作，但它还不够智能。我们还没有充分利用最重要的守卫功能 - [执行上下文](http://nestjs.inode.club/fundamentals/execution-context)。它还不知道角色，或者哪些角色允许访问每个处理程序。例如，`CatsController`可以对不同的路由采用不同的权限方案。一些路由可能仅供管理员用户使用，而其他路由可能对所有人开放。我们如何以一种灵活和可重用的方式将角色与路由匹配起来？

这就是**自定义元数据**发挥作用的地方（了解更多信息[在这里](http://nestjs.inode.club/fundamentals/execution-context#reflection-and-metadata)）。Nest提供了通过`@SetMetadata()`装饰器向路由处理程序附加自定义**元数据**的能力。这些元数据提供了我们缺失的`role`数据，智能守卫需要它来做出决策。让我们看看如何使用`@SetMetadata()`：

```typescript
// cats.controller.ts

@Post()
@SetMetadata('roles', ['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

> **提示**`@SetMetadata()` 装饰器是从 `@nestjs/common` 包中导入的。

通过上面的构造，我们将`roles`元数据（`roles`是一个键，而`['admin']`是特定的值）附加到`create()`方法。虽然这可以工作，但直接在路由中使用`@SetMetadata()`不是一个良好的实践。相反，创建您自己的装饰器，如下所示：

```typescript
// roles.decorator.ts

import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);
```

这种方法更清晰、更易读，并具有强类型。现在我们有了自定义的`@Roles()`装饰器，我们可以用它来装饰`create()`方法。

```typescript
// cats.controller.ts

@Post()
@Roles('admin')
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```





### 拦截器

拦截器是使用 `@Injectable()` 装饰器注解的类。拦截器应该实现 `NestInterceptor` 接口。

拦截器具有一系列有用的功能，这些功能受面向切面编程（AOP）技术的启发。它们可以：

- 在函数执行之前/之后绑定**额外的逻辑**
- 转换从函数返回的结果
- **转换**从函数抛出的异常
- 扩展基本函数行为
- 根据所选条件完全重写函数 (例如, 缓存目的)



### 自定义装饰器





## 数据库

### 增删改查

```ts
增
save(user)            创建：返回该数据的所有字段
insert(user)          快速插入一条数据，插入成功：返回插入实体，与save方法不同的是，它不执行级联、关系和其他操作。
删
remove(user)          删除：返回该数据的可见字段
softRemove(user);     拉黑：返回该数据的可见字段，该删除实体必须拥有@DeleteDateColumn()字段，被拉黑的用户还存在数据库中，但无法被find查找到，会在@DeleteDateColumn()字段中添加删除时间，可使用recover恢复
改
update(id, user)      更新：返回更新实体，不是该数据的字段
恢复
recover({ id })       恢复：返回id，将被softRemove删除（拉黑）的用户恢复，恢复成功后可以被find查找到


查找全部
find()
find({id:9})                   条件查找，写法一，找不到返回空对象
find({where:{id:10}})          条件查找，写法二，找不到返回空对象
findAndCount()                 返回数据和总的条数

查找一个
findOne(id);                       根据ID查找，找不到返回undefined
findOne({ where: { username } });  条件查找，找不到返回undefined

根据ID查找一个或多个
findByIds([1,2,3]);            查找n个，全部查找不到返回空数组，找到就返回找到的

其他
hasId(new UsersEntity())       检测实体是否有合成ID，返回布尔值
getId(new UsersEntity())       获取实体的合成ID，获取不到返回undefined
create({username: 'admin12345', password: '123456',})  创建一个实体，需要调用save保存
count({ status: 1 })           计数，返回数量，无返回0
increment({ id }, 'age', 2);   增加，给条件为id的数据的age字段增加2，成功返回改变实体
decrement({ id }, 'age', 2)    减少，给条件为id的数据的age字段增加2，成功返回改变实体

谨用
findOneOrFail(id)              找不到直接报500错误，无法使用过滤器拦截错误，不要使用
clear()                        清空该数据表，谨用！！！
```

**find更多参数**

```ts
this.userRepository.find({
    select: ["firstName", "lastName"],             要的字段
    relations: ["photos", "videos"],               关系查询
    where: {                                       条件查询
        firstName: "Timber",
        lastName: "Saw"
    },
    where: [{ username: "li" }, { username: "joy" }],   多个条件or, 等于：where username = 'li' or username = 'joy'
    order: {                                       排序
        name: "ASC",
        id: "DESC"
    },
    skip: 5,                                       偏移量
    take: 10,                                      每页条数
    cache: 60000                                   启用缓存：1分钟
});
```



## 补充

- 我们单独创建一个controller或service需要在`app.module.ts`中配置controllers/providers，当我们用模板命令创建一个的时候，在`app.module.ts`中imports中引入module即可（自动引入）
