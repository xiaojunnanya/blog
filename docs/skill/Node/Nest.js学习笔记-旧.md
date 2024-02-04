---
id: nestjsbefore
slug: /nestjsbefore
title: Nestjs学习笔记-旧
date: 2023-02-21
authors: 鲸落
tags: [Node, NestJs]
keywords: [Node, NestJs]
---


> controller 是接口的入口， service 是具体业务逻辑。
>
> 所以是在controller增加 入口代码，例如 @Post()\@Get() 调用
>
> 在service 中增加处理函数，比方说具体从db读写的student,

>- findOne和find的区别



## 开发准备

- 版本node >= 10.13.0：`node -v`

- 安装 NestJS cli：`npm i -g @nestjs/cli`

- nest/cli
  - 安装：`npm install -g @nestjs/cli`  
  - 查看版本：`nest --version`
  - 可视化使用nestcli可以做的所有的事情：`nest --help`
  - 创建应用：`nest new`
  - 运行：`npm run start`
  - 开发中使用：`npm run start:dev`，他会在每次文件更改的时候为我们提供实时编译和自动服务器重建
  - 生成控制器：`nest generate controller`  /  `nest g co`




## Hello world

### 创建项目

```js
// step1
nest new nest-test

// step2 Which package manager would you
选择: npm
```



### 目录结构

这样就得到了 src/ 目录为这样的文件列表了

```js
src
  |- app.controller.spec.ts // controller 的单元测试文件
  |- app.controller.ts      // controller，路由和预处理
  |- app.module.ts          // module，为模块注册用
  |- app.service.ts         // service 真正的逻辑
  |- main.ts                // 程序入口
```



### module

module 的作用是在程序运行时给模块处理依赖。好处是所有模块的依赖都可以在 module 中清晰明了的知道引用还是被引用

![image-20231023203758240](Nest.js学习笔记-旧.assets/image-20231023203758240.png)



### controller

controller 的作用是处理请求，所有的请求会先到 controller，再经 controller 调用其他模块业务逻辑

![image-20231023203832307](Nest.js学习笔记-旧.assets/image-20231023203832307.png)

### service

是真正处理业务逻辑的地方，所有的业务逻辑都会在这里处理。它可经过 module 引用其他模块的service，也可经过 module 暴露出去。



### hello world

```js
// step1: 进入目录
cd nest-test

// step2: 安装依赖或更新依赖
npm install

// step3: 运行程序
npm run start
```

访问: `http://localhost:3000/`



## 生成新模块

### 执行命令

能访问新模块了，再进一步期望生成文件夹和文件夹的模块。NestJS cli 也支持用命令行形式来创建，这样就不需要做重复的创建文件的动作了。

```js
nest g controller students
nest g service students
nest g module students
```



### 目录结构

再命令行分别执行以上三条命令，src/ 目录变成了如下样子

```arduino
arduino复制代码src
  |- app.controller.spec.ts
  |- app.controller.ts     
  |- app.module.ts         
  |- app.service.ts        
  |- main.ts               
  |- students/
        |- students.controller.spec.ts
        |- students.controller.ts     
        |- students.module.ts         
        |- students.service.spec.ts
        |- students.service.ts        
```



## 处理请求

### GET请求

```ts
// students.service.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentsService {
    getStudent(){
        return '111'
    }
}
```

```ts
// students.controller.ts
import { Controller, Get } from '@nestjs/common';

import { StudentsService } from './students.service'

@Controller('students')
export class StudentsController {
    constructor( private readonly studengtService: StudentsService ){}

    @Get('/who')
    who(){
        return this.studengtService.getStudent()
    }

    @Get('')
    a(){
        return '222'
    }
}
```



重启服务, 加上 dev 就能监听文件修改了

```js
npm run start:dev
```



最后浏览器访问url分别看看

```js
http://localhost:3000/students/who

http://localhost:3000/students
```



### POST请求

经过上面的介绍，总体请求先会经过 students.controller.ts -> 再到 students.service.ts。

在 students.service.ts 上新增 `Post` 方法

```ts
// students.controller.ts
import { Controller, Get, Post } from '@nestjs/common';

import { StudentsService } from './students.service'

@Controller('students')
export class StudentsController {
    constructor( private readonly studengtService: StudentsService ){}

    @Get('/who')
    who(){
        return this.studengtService.getStudent()
    }

    @Post('/who')
    whos(){
        return this.studengtService.getStudent();
    }
}
```



postman输入url测试。可以看到，这就是基本的post请求的使用



### 请求参数

#### get请求参数

Get 请求的参数一般会放在 URL 上，这是 `@Query` 装饰器就派上用场了。

**先改造 controller**

```ts
// students.controller.ts
import { Controller, Get, Post, Query } from '@nestjs/common';

import { StudentsService } from './students.service'

@Controller('students')
export class StudentsController {
    constructor( private readonly studengtService: StudentsService ){}

    @Get('/who')
    who(@Query('name') name: string){
        return this.studengtService.getStudent(name)
    }

    @Post('/who')
    whos(){
        return this.studengtService.getStudent();
    }
}
```



**再改造 service**

```ts
// students.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentsService {
    getStudent(name?: string){
        return 'hello' + name
    }
}
```



通过浏览器访问 url：`http://localhost:3000/students/who?name=jn`



#### post请求参数

Post 参数有些不同，会用到 [DTO](https://link.juejin.cn/?target=https%3A%2F%2Fbaike.baidu.com%2Fitem%2FDTO%2F16016821) 的传输。因为数据通过 HTTP 传输是文本类型，因此需要将文本类型转化成代码可识别的变量。

**新建 students.dto.ts**

```ts
// src/students/dtos/students.dto.ts
export class StudentDto {
    name: string;
}
```

**编辑 students.controller.ts**

```ts
// students.controller.ts
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StudentDto } from './dto/students.dto'
import { StudentsService } from './students.service'

@Controller('students')
export class StudentsController {
    constructor( private readonly studengtService: StudentsService ){}

    @Get('/who')
    who(@Query('name') name: string){
        return this.studengtService.getStudent(name)
    }

    @Post('/who')
    whos(@Body() student: StudentDto){
        return this.studengtService.getStudent(student.name);
    }
}
```



postman

![image-20231023210905340](Nest.js学习笔记-旧.assets/image-20231023210905340.png)



### 参数限制和转换

这部分其实用到了 [管道](https://link.juejin.cn/?target=https%3A%2F%2Fdocs.nestjs.com%2Fpipes) 的概念，我们用基础管道来实现，更高阶用法将会放在后面



#### Get请求

get 请求需要用到 `ParseIntPipe`, 更多的内置管道列表可查看[这里](https://link.juejin.cn?target=https%3A%2F%2Fdocs.nestjs.com%2Fpipes%23built-in-pipes)

浏览器访问的 url 默认是 string 类型，`ParseIntPipe` 管道能将 string 类型转化成 number 类型

这次我们实现的是通过 id 查找学生姓名。

**修改 students.service.ts**

```ts
// students.service.ts

import { Injectable } from '@nestjs/common';

@Injectable()
export class StudentsService {
    getStudent(name?: string){
        return 'hello' + name
    }

    getStudentName( id: number ){
        const student_list = {
            1: 'JN'
        }

        return student_list[id] ?? 'Not Found'
    }
}
```



**修改 students.controller.ts**

```ts
// students.controller.ts
import { Body, Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { StudentDto } from './dto/students.dto'
import { StudentsService } from './students.service'

@Controller('students')
export class StudentsController {
    constructor( private readonly studengtService: StudentsService ){}

    ...

    @Get('/getName')
    getName(@Query('id', ParseIntPipe) id: number ){
        return this.studengtService.getStudentName(id)
    }
}
```



**浏览器访问**

```ts
http://localhost:3000/students/getName?id=1  // JN

http://localhost:3000/students/getName?id=2  // Not Found
```



当使用非法请求，导致无法转换时，NestJs 会将请求报错处理，而正确参数则会转换后调用调用相应函数。通过简单的装饰器引用， NestJs 框架就可以自动做了参数检查与转换了



#### Post请求

Post 请求略微有些不一样，要用到 class-validator

安装 class-validator：`npm i --save class-validator class-transformer`



**修改 main.ts**

```ts
// main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```



**修改 student.dto.ts**

```ts
// src/students/dtos/students.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class StudentDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}
```



**postman**：`http://localhost:3000/students/who`

不传或者参数不是string都会报错

![image-20231023212304589](Nest.js学习笔记-旧.assets/image-20231023212304589.png)



## 自定义装饰器

在 post 请求用到了大量的装饰器，系统装饰器能满足大部分场景，但是有些特定需求时，需要自定义装饰器。

例如这样一个场景：每个请求都会带上 `user` 字段。代表是谁做的请求，每次在代码里 getUser 是非常难受的事情，这时自定义装饰器就派上了用场。

新建 src/common/decorators.ts

```ts
// src/common/decorators.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // 拿到请求
    return request.body.user;
  },
);
```



**修改 students.controller.ts**

```ts
// students.controller.ts
import { Body, Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { StudentDto } from './dto/students.dto'
import { StudentsService } from './students.service'

import { User } from './common/decorators'

@Controller('students')
export class StudentsController {
    constructor( private readonly studengtService: StudentsService ){}

    ...

    @Post('/haveUser')
    haveUser(@User() user: string ){
        return user
    }
}
```

postman

![image-20231023220404501](Nest.js学习笔记-旧.assets/image-20231023220404501.png)

## 日志

后台接口请求常伴随日志产生，日志对后台查问题至关重要。NestJs 框架也集成了日志，开箱即用。

使用日志分为三步:

- main.ts 引入 `Logger`
- 模块引入日志组建: `private readonly logger = new Logger(StudentsService.name)`;
- 在需要打印的地方引入: this.logger.log(`student name is ${name}`);



**修改main.ts**

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new Logger(),
  });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```



**引用 Logger 组建**

```ts
// students.service.ts

import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class StudentsService {
    private readonly logger = new Logger(StudentsService.name);

    getStudent(name?: string){
        this.logger.log(`student name is ${name}`);
        return 'hello' + name
    }

    getStudentName( id: number ){
        this.logger.log(`get student id is ${id}`);
        const student_list = {
            1: 'JN'
        }

        return student_list[id] ?? 'Not Found'
    }
}
```



访问接口，控制台输出

![image-20231023221010747](Nest.js学习笔记-旧.assets/image-20231023221010747.png)



## 数据库

使用 `mysql` 作为数据库连接。使用 `NestJs` 内置的[数据库连接](https://link.juejin.cn/?target=https%3A%2F%2Fdocs.nestjs.com%2Ftechniques%2Fdatabase) `typeorm`，可在 [这里](https://link.juejin.cn/?target=https%3A%2F%2Ftypeorm.io%2F) 查阅 typeorm 详细文档



### 开发准备

1. [下载](https://link.juejin.cn?target=https%3A%2F%2Fdev.mysql.com%2Fdownloads%2Fmysql%2F)并安装 Mysql
2. 创建 school 库
3. 安装 @nestjs/typeorm typeorm mysql2：`npm install --save @nestjs/typeorm typeorm mysql2`



### 数据库连接

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsModule } from './students/students.module';

@Module({
  imports: [
    StudentsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',//数据库类型
      host: '127.0.0.1',
      port: 3306,
      username: 'root',//账号
      password: '123456',//密码
      database: 'teacher',//库名
      autoLoadEntities: true,//如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
      synchronize: true, // synchronize字段代表数据库自动同步 entity 文件修改，在生产中要将其设为false
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```



### 定义表结构

Entity表示ts类和数据库表之间的关系，在nest中，我们的实体使用`@Entity()`装饰器修饰装饰的类，帮助我们**创建表**

```ts
// src\students\entity\students.entities.ts
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
    CreateDateColumn,
} from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @UpdateDateColumn()
  updateDate: Date;

  @CreateDateColumn()
  createDate: Date;
}
```

- `@Entity` 注解代表是数据库入口文件
- `@Column` 是基础列文件，使用 `type` 字段定义在数据库实际存储
- `@PrimaryGeneratedColumn` 代表单调递增的主键
- `@UpdateDateColumn` 当记录修改时会修改时间
- `@CreateDateColumn` 当记录新增时会写入时间



### 引用表

```ts
// students.module.ts
import { Module } from '@nestjs/common';
import { Student } from './entities/students.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentsController } from './students.controller';
import { StudentsService } from './students.service';

@Module({
    imports: [TypeOrmModule.forFeature([Student])],
    providers: [StudentsService, Student],
    controllers: [StudentsController],
})
export class StudentsModule {}
```

- `imports` 引用 typeorm 模块， entity 才可以在 service 中使用
- `providers` service 的 constructor 需要引用哪些模块
- `controllers` 模块的 controller



```ts
// students.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/students.entity';

@Injectable()
export class StudentsService {
    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
    ) {}
}
```

这样会在 db 中建立 student 新表。



### 与数据库交互

到这一步，终于可以和数据库进行交互了。基本上和数据库交互的部分都会放在 service 层，因此 `新增` 和 `查询` 都放在 service 层。

其中包括了

- `getStudentName` 的改造
- `setStudent` 函数的新增

```ts
// students.service.ts

import { Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/students.entity';


@Injectable()
export class StudentsService {
    private readonly logger = new Logger(StudentsService.name);

    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
    ) {}

    ...
	// `getStudentName` 的改造
    // url访问http://localhost:3000/students/getName?id=1 即可看到，前提你数据库中有id为1
    async getStudentName(id: number) {
        this.logger.log(`get student id is ${id}`);
        const results = await this.studentRepository.findOne({ where: { id } });

        return results ?? 'not found';
    }
}
```

**创建`setStudent`**

```ts
// students.service.ts

import { Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/students.entity';


@Injectable()
export class StudentsService {
    private readonly logger = new Logger(StudentsService.name);

    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
    ) {}

	...

    async getStudentName(id: number) {
        this.logger.log(`get student id is ${id}`);
        const results = await this.studentRepository.findOne({ where: { id } });

        return results ?? 'not found';
    }

    async setStudent(name: string) {
        const results = this.studentRepository.save({ name: name }) 
        return results;
    }
}
```



之后自己创建方法尝试即可



### 联表查询

我们准备新建课程表`class`，每个班级可以有多个学生，一个学生隶属一个班级。

这样`学生`和`班级`就构成了 `n:1` 的关系。

为了方便展示，在学生模块下直接新增 `class.entity.ts` 文件。并通过 `@OneToMany` 关联 `students`。

```ts
// src\students\entities\class.entity.ts

// classes.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Student } from './students.entity';

@Entity()
export class Classes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  className: string;

  @OneToMany(() => Student, student => student.class)
  students: Student[]

  @UpdateDateColumn()
  updateDate: Date;

  @CreateDateColumn()
  createDate: Date;
}
```

同时修改 `students.entity.ts`, 通过 `@ManyToOne` 引入 `Classes` 修改

```ts
// src\students\entities\class.entity.ts

// classes.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Student } from './students.entity';

@Entity()
export class Classes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  className: string;

  @OneToMany(() => Student, student => student.class)
  students: Student[]

  @UpdateDateColumn()
  updateDate: Date;

  @CreateDateColumn()
  createDate: Date;
}
```

注意：`classes` 表引用 `students` 是通过新建字段(`students.class`)进行关联。

引用会最终在数据库变成`外键`连接。



**再引入表**

```ts
// students.module.ts
import { Classes } from './entities/classes.entity';
// ...

@Module({
    imports: [TypeOrmModule.forFeature([Student, Classes])],
    providers: [StudentsService, Student, Classes],
    // ..
})
export class StudentsModule {}
```



`students.service.ts` 引入表, 并实现 `setClass`, `getClass` 方法

```ts
// students.service.ts

import { Injectable, Logger } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/students.entity';
import { Classes } from './entities/class.entity';

import { In } from 'typeorm';



@Injectable()
export class StudentsService {
    private readonly logger = new Logger(StudentsService.name);

    constructor(
        @InjectRepository(Student)
        private readonly studentRepository: Repository<Student>,
        @InjectRepository(Classes)
        private readonly classRepository: Repository<Classes>,
    ) {}

    ...

    async setClass(name: string, studentIds: number[]) {
        // 下面的 In(studentIds) 等同于 map
        // const students = await this.studentRepository.find({ 
        //     where: studentIds.map((id) => ({ id })),
        //  });

        const students = await this.studentRepository.find({ where: { id: In(studentIds) } });

        const result = await this.classRepository.save({
            className: name,
            students: students, // 此处直接保存students 的实例，即直接从数据库取出来的数据
        })
        return result;
    }
    async findClass(id: number) {
        const result = await this.classRepository.find({
            where: { id },
            relations: ['students']
        });
        return result;
    }
}
```



**新增 `ClassesDto`**

```ts
// classes.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class ClassesDto {
    @IsNotEmpty()
    @IsString()
    className: string;

    students: number[]
}
```



**`students.controller.ts` 修改**

```ts
// students.controller.ts
import { Body, Controller, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { StudentDto } from './dto/students.dto'
import { StudentsService } from './students.service'

import { User } from './common/decorators'
import { ClassesDto } from './dto/classes.dto';

@Controller('students')
export class StudentsController {
    constructor( private readonly studentService: StudentsService ){}

   	...

    @Get('getClass')
    getClass(@Query('id', ParseIntPipe) id: number) {
        return this.studentService.findClass(id);
    }

    @Post('setClass')
    setClass(@Body() classes: ClassesDto) {
        return this.studentService.setClass(classes.className, classes.students);
    }

}

```

将id1和2加入班级中

![image-20231023230617292](Nest.js学习笔记-旧.assets/image-20231023230617292.png)



浏览器：`http://localhost:3000/students/getClass?id=1` 查询数据



## 高阶用法

[NestJs 入门教程之四：高阶用法 - 掘金 (juejin.cn)](https://juejin.cn/post/7008932991325962247)

### 数据校验核查

#### 守卫 Guards

在 `请求到达业务逻辑前` 会经过 guard，这样在接口前可以做统一处理。

例如：检查登陆态、检查权限 ...

需要在业务逻辑前 `统一检查` 的信息，都可以抽象成守卫。

在真实场景中，大多数的后台管理端会用 `JWT` 实现接口鉴权。`NestJs` 也提供了对应的[解决方案](https://link.juejin.cn?target=https%3A%2F%2Fdocs.nestjs.com%2Fsecurity%2Fauthentication)。

由于较长且原理相通，本篇暂时用校验 `user` 字段做演示。



#### 新建守卫

**新建 `user.guard.ts` 文件**

```ts
// src/common/guards/user.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.body.user;

    if (user) {
        return true;
    }

    throw new UnauthorizedException('need user field');
  }
}
```



#### 单个接口使用守卫

单个接口使用需要用 `@UseGuards` 作为引用。再将定义的 `UserGuard` 作为入参。

在 `student.controller.ts` 中使用

```ts
// students.controller.ts
...

import {  UseGuards  /** ... **/} from '@nestjs/common';
import { UserGuard } from './common/guards/user.guard';

@Controller('students')
export class StudentsController {
    constructor( private readonly studentService: StudentsService ){}

	...

    @UseGuards(UserGuard)
    @Post('who-are-you')
    whoAreYouPost(@Body() student: StudentDto) {
        return this.studentService.setStudent(student.name);
    }

}
```

这样当访问 `who-are-you` 就起作用了

```bash
// ❌ 不使用 user
curl -X POST http://127.0.0.1:3000/students/who-are-you -H 'Content-Type: application/json' -d '{"name": "gdccwxx"}'
// => {"statusCode":401,"message":"need user to distinct","error":"Unauthorized"}%  

// ✅ 使用 user
// curl -X POST http://127.0.0.1:3000/students/who-are-you -H 'Content-Type: application/json' -d '{"user": "gdccwxx", "name": "gdccwxx"}'
// => Im student gdccwxx%
```



#### 全局使用

全局使用仅需在 `app.module.ts` 的 `providers` 中引入。这样就对全局生效了

```ts
// app.module.ts
...

import { APP_GUARD } from '@nestjs/core';
import { UserGuard } from './students/common/guards/user.guard';

@Module({
  imports: [
    StudentsModule,
    TypeOrmModule.forRoot(...),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: UserGuard,
    },
    AppService
  ],
})
export class AppModule {}
```



### 敏感操作录入

### 数据转化















