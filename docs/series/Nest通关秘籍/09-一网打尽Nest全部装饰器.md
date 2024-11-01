---
id: nestseries09
slug: /nestseries09
title: 09-一网打尽Nest全部装饰器
date: 2002-09-26
authors: 鲸落
tags: [Nest]
keywords: [Nest]
---

Nest 的功能都是大多通过装饰器来使用的，这节我们就把所有的装饰器过一遍。

我们创建个新的 nest 项目：`nest new all-decorator -p npm`



## @Module

Nest 提供了一套模块系统，通过 @Module声明模块：

![](09-一网打尽Nest全部装饰器.assets/350bf6ae1f1d425aba1e30a2112c75f4tplv-k3u1fbpfcp-watermark.png)



## @Controller、@Injectable

通过 @Controller、@Injectable 分别声明其中的 controller 和 provider：

![](09-一网打尽Nest全部装饰器.assets/835bb7e52eb24497bec4a6c97a682307tplv-k3u1fbpfcp-watermark.png)

![](09-一网打尽Nest全部装饰器.assets/63c2e0a4e2e04d638fd510e658429265tplv-k3u1fbpfcp-watermark.png)

这个 provider 可以是任何的 class：

![](09-一网打尽Nest全部装饰器.assets/a32aed0be559462d8734925deebc8e1ftplv-k3u1fbpfcp-watermark.png)

注入的方式可以是构造器注入：

![](09-一网打尽Nest全部装饰器.assets/97763942ca1843eab617d82a2b6ee164tplv-k3u1fbpfcp-watermark.png)

或者属性注入：

![](09-一网打尽Nest全部装饰器.assets/3b66d2ff31184e689a22bef888eb4b77tplv-k3u1fbpfcp-watermark.png)

属性注入要指定注入的 token，可能是 class 也可能是 string。

你可以通过 useFactory、useValue 等方式声明 provider：

![](09-一网打尽Nest全部装饰器.assets/035c9f0ee8e540aaa5e1ceadb1ce9aa2tplv-k3u1fbpfcp-watermark.png)

这时候也需要通过 @Inject 指定注入的 token：

![](09-一网打尽Nest全部装饰器.assets/16e14a5849b64701b3f74162046c6f38tplv-k3u1fbpfcp-watermark.png)



## @Optional

这些注入的依赖如果没有的话，创建对象时会报错。但如果它是可选的，你可以用 @Optional 声明一下，这样没有对应的 provider 也能正常创建这个对象。

![](09-一网打尽Nest全部装饰器.assets/b9742d2a930b47018c07a627b57cfdb3tplv-k3u1fbpfcp-watermark.png)



## @Global

如果模块被很多地方都引用，为了方便，可以用 @Global 把它声明为全局的，这样它 exports 的 provider 就可以直接注入了：

![](09-一网打尽Nest全部装饰器.assets/16ce92233e484b4e974c9af63f24a8bctplv-k3u1fbpfcp-watermark.png)



## @Catch、@UseFilters

filter 是处理抛出的未捕获异常的，通过 @Catch 来指定处理的异常：

![](09-一网打尽Nest全部装饰器.assets/4cd95a5fb6b44d17869c3ae45fda9467tplv-k3u1fbpfcp-watermark.png)

然后通过 @UseFilters 应用到 handler 上：

![](09-一网打尽Nest全部装饰器.assets/f824522eee2d4c9f96b38b1784879280tplv-k3u1fbpfcp-watermark.png)

![](09-一网打尽Nest全部装饰器.assets/73b48391b96245438e60872b913d5108tplv-k3u1fbpfcp-watermark.png)



## interceptor、guard、pipe的

除了 filter 之外，interceptor、guard、pipe 也是这样用：

![](09-一网打尽Nest全部装饰器.assets/54b937a0d54a40a19b81624eb8e82a1btplv-k3u1fbpfcp-watermark.png)

当然，pipe 更多还是单独在某个参数的位置应用：

![](09-一网打尽Nest全部装饰器.assets/5fced92c2344495b86524871d8ed9cfatplv-k3u1fbpfcp-watermark.png)



## 请求方法相关

这里的 @Query 是取 url 后的 ?bbb=true，而 @Param 是取路径中的参数，比如 /xxx/111 种的 111

![](09-一网打尽Nest全部装饰器.assets/f61a443880944b1bb1aff47d2e77e769tplv-k3u1fbpfcp-watermark.png)

![](09-一网打尽Nest全部装饰器.assets/493ea39f11f1488ba3bd53dc6f4ee405tplv-k3u1fbpfcp-watermark.png)

此外，如果是 @Post 请求，可以通过 @Body 取到 body 部分：

![](09-一网打尽Nest全部装饰器.assets/a10d3521580a486ca1348b3f9b7bdde8tplv-k3u1fbpfcp-watermark.png)

我们一般用 dto 的 class 来接受请求体里的参数：

![](09-一网打尽Nest全部装饰器.assets/58338c7cc0634a388c58bde39f5bc8b6tplv-k3u1fbpfcp-watermark.png)

nest 会实例化一个 dto 对象：

用 postman 发个 post 请求：

![](09-一网打尽Nest全部装饰器.assets/4a959786094d4690832d0af884921c12tplv-k3u1fbpfcp-watermark.png)

可以看到 nest 接受到了 body 里的参数：

![](09-一网打尽Nest全部装饰器.assets/4bfb3d526abb4b478ccd3bc9988d486ftplv-k3u1fbpfcp-watermark.png)

除了 @Get、@Post 外，还可以用 @Put、@Delete、@Patch、@Options、@Head 装饰器分别接受 put、delete、patch、options、head 请求：

![](09-一网打尽Nest全部装饰器.assets/cf5a32293fde40beb8e9f19d91e81329tplv-k3u1fbpfcp-watermark.png)



## @SetMetadata

:::info 补充

`@SetMetadata` 是 NestJS 中用于在处理程序（如控制器或处理请求的类）上设置元数据的装饰器。通过这个装饰器，你可以为特定的路由或处理程序添加自定义元数据，便于后续在中间件、守卫、拦截器或其他地方进行访问和处理。

**用法示例**

```
typescript复制代码import { Controller, Get, SetMetadata } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Get()
  @SetMetadata('roles', ['admin'])
  findAll() {
    // ...
  }
}
```

在这个例子中，`@SetMetadata('roles', ['admin'])` 会在 `findAll` 方法上设置一个名为 `roles` 的元数据，值为 `['admin']`。你可以在守卫或其他地方通过 `Reflector` 来获取这个元数据。

**主要用途**

1. **权限控制**：可以用来定义访问特定路由所需的角色或权限。
2. **动态配置**：允许在运行时动态地改变处理逻辑。
3. **代码组织**：通过元数据可以使代码更加清晰和易于维护。

这种方式使得在大型应用中处理复杂的逻辑变得更加简洁和高效。

:::



handler 和 class 可以通过 @SetMetadata 指定 metadata：

![](09-一网打尽Nest全部装饰器.assets/937ac8e44f2d4fedb9818a0b6c8e70c5tplv-k3u1fbpfcp-watermark.png)

然后在 guard 或者 interceptor 里取出来：

![](09-一网打尽Nest全部装饰器.assets/27163078cd944d68b10c13068dc08145tplv-k3u1fbpfcp-watermark.png)

![](09-一网打尽Nest全部装饰器.assets/5971233494fb4a1bb6968501878dd66atplv-k3u1fbpfcp-watermark.png)



## @Headers

你可以通过 @Headers 装饰器取某个请求头 或者全部请求头：

![](09-一网打尽Nest全部装饰器.assets/59578d6bc6a64764a276c3fb8abbb1e8tplv-k3u1fbpfcp-watermark.png)

![](09-一网打尽Nest全部装饰器.assets/583883749dc14df0b5d1ed7efbffee1ctplv-k3u1fbpfcp-watermark.png)



## @Ip

通过 @Ip 拿到请求的 ip：

![](09-一网打尽Nest全部装饰器.assets/0dadc94181774a94aa3913d8d793909ftplv-k3u1fbpfcp-watermark.png)



## @Session

通过 @Session 拿到 session 对象：

![](09-一网打尽Nest全部装饰器.assets/1f8c71364e3849e3b6fd1b9b9dacaeeatplv-k3u1fbpfcp-watermark.png)

但要使用 session 需要安装一个 express 中间件：

    npm install express-session

在 main.ts 里引入并启用：

![](09-一网打尽Nest全部装饰器.assets/5971294374b641c7b099f95471b4f6e6tplv-k3u1fbpfcp-watermark.png)

指定加密的密钥和 cookie 的存活时间。

然后刷新页面：

![](09-一网打尽Nest全部装饰器.assets/1d3b62447a4041e6b9f666da1d8e2705tplv-k3u1fbpfcp-watermark.png)

会返回 set-cookie 的响应头，设置了 cookie，包含 sid 也就是 sesssionid。

之后每次请求都会自动带上这个 cookie：

![](09-一网打尽Nest全部装饰器.assets/466415bd1d9941a38053e08a61d53d89tplv-k3u1fbpfcp-watermark.png)

这样就可以在 session 对象里存储信息了。

![](09-一网打尽Nest全部装饰器.assets/6f5bb63a915e4218aa6e1a997e8e4db0tplv-k3u1fbpfcp-watermark.png)

![](09-一网打尽Nest全部装饰器.assets/83805b26ffed403fb45106412479d766tplv-k3u1fbpfcp-watermark.gif)



## @HostParam

@HostParam 用于取域名部分的参数：

我们再创建个 controller：`nest g controller aaa --no-spec --flat`

这样指定 controller 的生效路径：

```javascript
import { Controller, Get, HostParam } from '@nestjs/common';

@Controller({ host: ':host.0.0.1', path: 'aaa' })
export class AaaController {
    @Get('bbb')
    hello() {
        return 'hello';
    }
}
```

controller 除了可以指定某些 path 生效外，还可以指定 host：

![](09-一网打尽Nest全部装饰器.assets/0acf98f2b82041df81cb8a7e92f639b2tplv-k3u1fbpfcp-watermark.png)

然后再访问下：

![](09-一网打尽Nest全部装饰器.assets/e44328d1d6d74a01914d0ac5187a8bc4tplv-k3u1fbpfcp-watermark.gif)

这时候你会发现只有 host 满足 xx.0.0.1 的时候才会路由到这个 controller。

host 里的参数就可以通过 @HostParam 取出来：

```javascript
import { Controller, Get, HostParam } from '@nestjs/common';

@Controller({ host: ':host.0.0.1', path: 'aaa' })
export class AaaController {
    @Get('bbb')
    hello(@HostParam('host') host) {
        return host;
    }
}
```

![](09-一网打尽Nest全部装饰器.assets/a059c8c10ae74b80862238fdf7935043tplv-k3u1fbpfcp-watermark.gif)



## @Request/@Req

前面取的这些都是 request 里的属性，当然也可以直接注入 request 对象：

![](09-一网打尽Nest全部装饰器.assets/9f2bd6c37caf46b6b1e4b96f29e78291tplv-k3u1fbpfcp-watermark.png)

通过 @Req 或者 @Request 装饰器，这俩是同一个东西：

![](09-一网打尽Nest全部装饰器.assets/4041e1d300b14403bc05d1bc296829f4tplv-k3u1fbpfcp-watermark.png)

注入 request 对象后，可以手动取任何参数：

![](09-一网打尽Nest全部装饰器.assets/2bfdaeb455a34a6a8d1bf655fdc979c4tplv-k3u1fbpfcp-watermark.png)



## @Res/@Response

当然，也可以 @Res 或者 @Response 注入 response 对象，只不过 response 对象有点特殊：

![](09-一网打尽Nest全部装饰器.assets/0069b293e87e44a8af1df6a6150ff511tplv-k3u1fbpfcp-watermark.png)

当你注入 response 对象之后，服务器会一直没有响应：

![](09-一网打尽Nest全部装饰器.assets/a328cef97c9242fb8c2b93e50feb9b9ctplv-k3u1fbpfcp-watermark.png)

因为这时候 Nest 就不会再把 handler 返回值作为响应内容了。

你可以自己返回响应：

![](09-一网打尽Nest全部装饰器.assets/b22ecf0abbab49eca095d05d8a03644etplv-k3u1fbpfcp-watermark.png)

![](09-一网打尽Nest全部装饰器.assets/7b940ec0f01b4a268b32ac10f7d15842tplv-k3u1fbpfcp-watermark.png)

Nest 这么设计是为了避免你自己返回的响应和 Nest 返回的响应的冲突。

如果你不会自己返回响应，可以通过 passthrough 参数告诉 Nest：

![](09-一网打尽Nest全部装饰器.assets/404c6fe6d28947de89e1b94d3b535e5ctplv-k3u1fbpfcp-watermark.png)

![](09-一网打尽Nest全部装饰器.assets/7b940ec0f01b4a268b32ac10f7d15842tplv-k3u1fbpfcp-watermark.png)



## @Next

除了注入 @Res 不会返回响应外，注入 @Next 也不会：

![](09-一网打尽Nest全部装饰器.assets/8b696471d11644cc8dc4a07efd697546tplv-k3u1fbpfcp-watermark.png)

当你有两个 handler 来处理同一个路由的时候，可以在第一个 handler 里注入 next，调用它来把请求转发到第二个 handler：

![](09-一网打尽Nest全部装饰器.assets/f74e4f19b09e434496a5dfe35caedc66tplv-k3u1fbpfcp-watermark.png)

Nest 不会处理注入 @Next 的 handler 的返回值。



## @HttpCode

handler 默认返回的是 200 的状态码，你可以通过 @HttpCode 修改它：

![](09-一网打尽Nest全部装饰器.assets/7148d5f586494f9891b1d4a43cebc103tplv-k3u1fbpfcp-watermark.png)

![](09-一网打尽Nest全部装饰器.assets/e2e4d8c9ee3b4598b6bfdd53f6d1c61dtplv-k3u1fbpfcp-watermark.png)



## @Header

当然，你也可以修改 response header，通过 @Header 装饰器：

![](09-一网打尽Nest全部装饰器.assets/0ce211852e9e4d5c9d9f954355f5c60btplv-k3u1fbpfcp-watermark.png)

![](09-一网打尽Nest全部装饰器.assets/00ef498cad0d4670821b46eb64a12731tplv-k3u1fbpfcp-watermark.png)



## @Redirect

此外，你还可以通过 @Redirect 装饰器来指定路由重定向的 url：

![](09-一网打尽Nest全部装饰器.assets/4ee4edf4a78b4fb683fb4f48d91270a5tplv-k3u1fbpfcp-watermark.png)

![](09-一网打尽Nest全部装饰器.assets/d563d9e5836f49038f9ad7db40702f85tplv-k3u1fbpfcp-watermark.gif)

或者在返回值的地方设置 url：

```javascript
@Get('xxx')
@Redirect()
async jump() {
    return {
      url: 'https://www.baidu.com',
      statusCode: 302
    }  
}
```

你还可以给返回的响应内容指定渲染引擎，不过这需要先这样设置：

![](09-一网打尽Nest全部装饰器.assets/3dc3a9722af1467eb26f7b21f028abfetplv-k3u1fbpfcp-watermark.png)

```javascript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();

```

分别指定静态资源的路径和模版的路径，并指定模版引擎为 handlerbars。

当然，还需要安装模版引擎的包 hbs：

    npm install --save hbs

然后准备图片和模版文件：

![](09-一网打尽Nest全部装饰器.assets/3eab9c35c1534e2b9a173302480cda32tplv-k3u1fbpfcp-watermark.png)

![](09-一网打尽Nest全部装饰器.assets/5afa60e3c49c4ac7af3fe65f1f52a96ctplv-k3u1fbpfcp-watermark.png)

在 handler 里指定模版和数据：

![](09-一网打尽Nest全部装饰器.assets/dcd6047993244f07a6ac050aaf654573tplv-k3u1fbpfcp-watermark.png)

就可以看到渲染出的 html 了：

![](09-一网打尽Nest全部装饰器.assets/b59a367d570e4a5f84332ee02b8ac0d8tplv-k3u1fbpfcp-watermark.png)

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/all-decorator)。



## 总结

这节我们梳理了下 Nest 全部的装饰器

*   @Module： 声明 Nest 模块
*   @Controller：声明模块里的 controller
*   @Injectable：声明模块里可以注入的 provider
*   @Inject：通过 token 手动指定注入的 provider，token 可以是 class 或者 string
*   @Optional：声明注入的 provider 是可选的，可以为空
*   @Global：声明全局模块
*   @Catch：声明 exception filter 处理的 exception 类型
*   @UseFilters：路由级别使用 exception filter
*   @UsePipes：路由级别使用 pipe
*   @UseInterceptors：路由级别使用 interceptor
*   @SetMetadata：在 class 或者 handler 上添加 metadata
*   @Get、@Post、@Put、@Delete、@Patch、@Options、@Head：声明 get、post、put、delete、patch、options、head 的请求方式
*   @Param：取出 url 中的参数，比如 /aaa/:id 中的 id
*   @Query: 取出 query 部分的参数，比如 /aaa?name=xx 中的 name
*   @Body：取出请求 body，通过 dto class 来接收
*   @Headers：取出某个或全部请求头
*   @Session：取出 session 对象，需要启用 express-session 中间件
*   @HostParm： 取出 host 里的参数
*   @Req、@Request：注入 request 对象
*   @Res、@Response：注入 response 对象，一旦注入了这个 Nest 就不会把返回值作为响应了，除非指定 passthrough 为true
*   @Next：注入调用下一个 handler 的 next 方法
*   @HttpCode： 修改响应的状态码
*   @Header：修改响应头
*   @Redirect：指定重定向的 url
*   @Render：指定渲染用的模版引擎

把这些装饰器用熟，就掌握了 nest 大部分功能了。