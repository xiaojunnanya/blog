---
id: nestseries16
slug: /nestseries16
title: 16-如何自定义Exception-Filter
date: 2002-09-26
authors: 鲸落
tags: [Nest]
keywords: [Nest]
---

## Nest异常

Exception Filter 是在 Nest 应用抛异常的时候，捕获它并返回一个对应的响应。

比如路由找不到时返回 404：

![](16-如何自定义Exception-Filter.assets/3b9d75dc99fc4121a6679f7530555925tplv-k3u1fbpfcp-jj-mark0000q75.png)

服务端报错时返回 500：

![](16-如何自定义Exception-Filter.assets/27012d32c72f472186b05bbfa3f6bfe4tplv-k3u1fbpfcp-jj-mark0000q75.png)

参数的错误返回 400：

![](16-如何自定义Exception-Filter.assets/96886fcf1ee7463889c6ec18ae45a099tplv-k3u1fbpfcp-jj-mark0000q75.png)

这些都是 Exception Filter 做的事情。



## 自定义异常

那么，如果我们想自定义异常时返回的响应格式呢？

这种就要自定义 Exception Filter 了。

创建个 nest 项目：`nest new exception-filter-test`

把它跑起来：`npm run start:dev`

浏览器访问 http://localhost:3000 可以看到 hello world，代表服务跑起来了

然后在 controller 里抛个异常： 

![](16-如何自定义Exception-Filter.assets/6513d46aec8c406ba44a1e6593c9288etplv-k3u1fbpfcp-jj-mark0000q75.png)

```javascript
throw new HttpException('xxxx', HttpStatus.BAD_REQUEST)
```

这个 HttpStatus 就是一些状态码的常量：

![](16-如何自定义Exception-Filter.assets/4f1c9abeb20640b988eed80ab6f7fb9btplv-k3u1fbpfcp-jj-mark0000q75.gif)

这时候刷新页面，返回的就是 400 对应的响应：

![](16-如何自定义Exception-Filter.assets/f04c970babc949df9c342131f610a21etplv-k3u1fbpfcp-jj-mark0000q75.png)

这个响应的格式是内置的 Exception Filter 生成的。

当然，你也可以直接抛具体的异常：

![](16-如何自定义Exception-Filter.assets/813ffdfd373d4d4fbb00ee8408f35c35tplv-k3u1fbpfcp-jj-mark0000q75.png)

![](16-如何自定义Exception-Filter.assets/00fd127d5c70464290bfcd27a40a9628tplv-k3u1fbpfcp-jj-mark0000q75.png)

然后我们自己定义个 exception filter：`nest g filter hello --flat --no-spec`

--flat 是不生成 hello 目录，--no-spec 是不生成测试文件。

![](16-如何自定义Exception-Filter.assets/13da92ec51ae4f6596fed68444879d00tplv-k3u1fbpfcp-jj-mark0000q75.png)

@Catch 指定要捕获的异常，这里指定 BadRequestException。


```javascript
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';

@Catch(BadRequestException)
export class HelloFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    debugger;
  }
}
```

先打个断点。

在 AppModule 里引入：

![](16-如何自定义Exception-Filter.assets/d675e362c14d4b5898ba56ac4fc23f6dtplv-k3u1fbpfcp-jj-mark0000q75.png)

```javascript
app.useGlobalFilters(new HelloFilter());
```

如果你想局部启用，可以加在 handler 或者 controller 上：

![](16-如何自定义Exception-Filter.assets/991278f81105477baf1fc9426ca38db7tplv-k3u1fbpfcp-jj-mark0000q75.png)

![](16-如何自定义Exception-Filter.assets/a18e5b669d3845f2b092982b644bea2ctplv-k3u1fbpfcp-jj-mark0000q75.png)

然后新建个调试配置文件：

![](16-如何自定义Exception-Filter.assets/d286f2ac98dd4e5e99f57a2ac803eb0etplv-k3u1fbpfcp-jj-mark0000q75.png)

输入调试配置：

![](16-如何自定义Exception-Filter.assets/de2342ca2649488f86a3085daf20e45atplv-k3u1fbpfcp-jj-mark0000q75.png)

```json
{
    "type": "node",
    "request": "launch",
    "name": "debug nest",
    "runtimeExecutable": "npm",
    "args": [
        "run",
        "start:dev",
    ],
    "skipFiles": [
        "<node_internals>/**"
    ],
    "console": "integratedTerminal",
}
```

把之前的服务关掉，点击调试启动：

![](16-如何自定义Exception-Filter.assets/b3c4753f4795472881a96add2a298858tplv-k3u1fbpfcp-jj-mark0000q75.png)

刷新页面，代码会在断点处断住：

![](16-如何自定义Exception-Filter.assets/9ba99ed6372c413bbfd4050248dccac2tplv-k3u1fbpfcp-jj-mark0000q75.png)

我们只要根据异常信息返回对应的响应就可以了：

![](16-如何自定义Exception-Filter.assets/d01b846ffbe8485fad5d1d838eca3525tplv-k3u1fbpfcp-jj-mark0000q75.png)

```javascript
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class HelloFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    const statusCode = exception.getStatus();

    response.status(statusCode).json({
       code: statusCode,
       message: exception.message,
       error: 'Bad Request',
       xxx: 111
    })
  }
}

```

这样，抛异常时返回的响应就是自定义的了：

![](16-如何自定义Exception-Filter.assets/cf1ce8c1a18945a98ee2e4babae2994atplv-k3u1fbpfcp-jj-mark0000q75.png)

但我们只是 @Catch 了 BadRequestException

如果抛的是其他异常，依然是原来的格式：

![](16-如何自定义Exception-Filter.assets/0ae44ad88cb34a4c809a3aa9e35265f3tplv-k3u1fbpfcp-jj-mark0000q75.png)

比如我抛一个 BadGatewayException。

![](16-如何自定义Exception-Filter.assets/aa4500ea58224c8a990fde02ecfcaf2ftplv-k3u1fbpfcp-jj-mark0000q75.png)

依然是默认格式。

那我们只要 @Catch 指定 HttpException 不就行了？

因为 BadRequestExeption、BadGateWayException 等都是它的子类。

![](16-如何自定义Exception-Filter.assets/a3e384391b13481ea29e678c14602f21tplv-k3u1fbpfcp-jj-mark0000q75.png)

试一下：

![](16-如何自定义Exception-Filter.assets/947030e2ced443cd9ed1f4d8555e2f87tplv-k3u1fbpfcp-jj-mark0000q75.png)

![](16-如何自定义Exception-Filter.assets/2df461a79adc4d61b0bcc172dad6bbcdtplv-k3u1fbpfcp-jj-mark0000q75.png)

确实，现在所有的 HttpException 都会被处理了。

但其实这也有个问题。



## ValidationPipe异常处理

就是当我们用了 ValidationPipe 的时候。

比如我们加一个路由：

```javascript
@Post('aaa') 
aaa(@Body() aaaDto: AaaDto ){
    return 'success';
}
```

然后创建 src/aaa.dto.ts

```javascript
export class AaaDto {
    aaa: string;
    
    bbb: number;
}
```

安装用到的包：

```
npm install --save class-validator class-transformer
```

然后给 AaaDto 添加几个校验规则：

```javascript
import { IsEmail, IsNotEmpty, IsNumber } from "class-validator";

export class AaaDto {
    @IsNotEmpty({message: 'aaa 不能为空'})
    @IsEmail({}, {message: 'aaa 不是邮箱格式'})
    aaa: string;
    
    @IsNumber({}, {message: 'bbb 不是数字'})
    @IsNotEmpty({message: 'bbb 不能为空'})
    bbb: number;
}
```

在 main.ts 启用 ValidationPipe：

![](16-如何自定义Exception-Filter.assets/649786f904ea41b1b2cdd4d43492bae6tplv-k3u1fbpfcp-jj-mark0000q75.png)

```javascript
app.useGlobalPipes(new ValidationPipe());
```

在 postman 里测试下：

![](16-如何自定义Exception-Filter.assets/298928b550af4817bb070d12c37f8b70tplv-k3u1fbpfcp-jj-mark0000q75.png)

可以看到，提示的错误也不对了。

因为我们自定义的 exception filter 会拦截所有 HttpException，但是没有对这种情况做支持。

![](16-如何自定义Exception-Filter.assets/5df5b55aa61b4499a6cf23718bd13d4btplv-k3u1fbpfcp-jj-mark0000q75.png)

先不加这个 filter。

这时候响应是这样的：

![](16-如何自定义Exception-Filter.assets/3eec351b99ec4674846958c92693fe47tplv-k3u1fbpfcp-jj-mark0000q75.png)

我们对这种情况做下支持：

![](16-如何自定义Exception-Filter.assets/c26c24ed49b64c908fdbb398519592b9tplv-k3u1fbpfcp-jj-mark0000q75.png)

启用自定义的 filter，然后打个断点：

![](16-如何自定义Exception-Filter.assets/052703cecab44c65835f5d0ffb6d3f4atplv-k3u1fbpfcp-jj-mark0000q75.png)

再次访问会在断点处断住：

![](16-如何自定义Exception-Filter.assets/95c13555449345f2b59b1dd88bbea4e6tplv-k3u1fbpfcp-jj-mark0000q75.png)

可以看到 ValidationPipe 的 response 格式是这样的。

所以我们可以这样改：

![](16-如何自定义Exception-Filter.assets/48446a774ec84fa58563fea546afe6a1tplv-k3u1fbpfcp-jj-mark0000q75.png)

```javascript
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HelloFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    const statusCode = exception.getStatus();

    const res = exception.getResponse() as { message: string[] };
    
    response.status(statusCode).json({
       code: statusCode,
       message: res?.message?.join ? res?.message?.join(',') : exception.message,
       error: 'Bad Request',
       xxx: 111
    })
  }
}
```

如果 response.message 是个数组，就返回 join 的结果，否则还是返回 exception.message

再试下：

![](16-如何自定义Exception-Filter.assets/0d4b65e69c6f4ec38777e76d70c36ccctplv-k3u1fbpfcp-jj-mark0000q75.png)

![](16-如何自定义Exception-Filter.assets/fcbb65dfb38d4a3bae2a06d2abca9fc2tplv-k3u1fbpfcp-jj-mark0000q75.png)

现在，ValidationPipe 的错误和其他的错误就都返回了正确的格式。

那如果我想在 Filter 里注入 AppService 呢？

这就需要改一下注册方式：

![](16-如何自定义Exception-Filter.assets/579bb3c079f94392a19e817f937b88b4tplv-k3u1fbpfcp-jj-mark0000q75.png)

不用 useGlobalFilters 注册了，而是在 AppModule 里注册一个 token 为 APP_FILTER 的 provider：

![](16-如何自定义Exception-Filter.assets/d674aeefea6d444298bba83448e6f414tplv-k3u1fbpfcp-jj-mark0000q75.png)

```javascript
{
  provide: APP_FILTER,
  useClass: HelloFilter
}
```

Nest 会把所有 token 为 APP_FILTER 的 provider 注册为全局 Exception Filter。

注册多个 Filter 也是这么写。

其余的全局 Guard、Interceptor、Pipe 也是这样注册：

![](16-如何自定义Exception-Filter.assets/53bc0c71ad5e4dd5ac6896f933cf57b3tplv-k3u1fbpfcp-jj-mark0000q75.png)

这样注册的好处就是可以注入其他 provider 了：

比如我注入了 AppService，然后调用它的 getHello 方法：

![](16-如何自定义Exception-Filter.assets/c0febd36852749139bd753a31ccfa169tplv-k3u1fbpfcp-jj-mark0000q75.png)

```javascript
import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, Inject } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Catch(HttpException)
export class HelloFilter implements ExceptionFilter {

  @Inject(AppService)
  private service: AppService;

  catch(exception: HttpException, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const response = http.getResponse<Response>();

    const statusCode = exception.getStatus();

    const res = exception.getResponse() as { message: string[] };
    
    response.status(statusCode).json({
       code: statusCode,
       message: res?.message?.join ? res?.message?.join(',') : exception.message,
       error: 'Bad Request',
       xxx: 111,
       yyy: this.service.getHello()
    })
  }
}
```

可以看到，service 方法调用成功了：

![](16-如何自定义Exception-Filter.assets/3fc8070b467e469abaec739549f12104tplv-k3u1fbpfcp-jj-mark0000q75.png)

此外，如果你想自定义 Exception 也是可以的。

比如添加一个 src/unlogin.filter.ts 

```javascript
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class UnLoginException{
  message: string;

  constructor(message?){
    this.message = message;
  }
}

@Catch(UnLoginException)
export class UnloginFilter implements ExceptionFilter {
  catch(exception: UnLoginException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response.status(HttpStatus.UNAUTHORIZED).json({
      code: HttpStatus.UNAUTHORIZED,
      message: 'fail',
      data: exception.message || '用户未登录'
    }).end();
  }
}
```

我们创建了一个 UnloginException 的异常。

然后在 ExceptionFilter 里 @Catch 了它。

在 AppModule 里注册这个全局 Filter：

![](16-如何自定义Exception-Filter.assets/b219d2fc7303447486687e1496569c8dtplv-k3u1fbpfcp-jj-mark0000q75.png)

```javascript
{
  provide: APP_FILTER,
  useClass: UnloginFilter
}
```

之后在 AppController 里抛出这个异常：

![](16-如何自定义Exception-Filter.assets/417033967a124ab1966d8f2e2f167caatplv-k3u1fbpfcp-jj-mark0000q75.png)

浏览器里访问下：

![](16-如何自定义Exception-Filter.assets/7a0b0dd568ba4b55a5c7a8474f20f262tplv-k3u1fbpfcp-jj-mark0000q75.png)

可以看到，返回的是我们自定义的格式。

也就是说，可以用自定义 Exception Filter 捕获内置的或者自定义的 Exception。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/exception-filter-test)。



## 总结

这节我们学习了自定义 Exception Filter。

通过 @Catch 指定要捕获的异常，然后在 catch 方法里拿到异常信息，返回对应的响应。

如果捕获的是 HttpException，要注意兼容下 ValidationPipe 的错误格式的处理。

filter 可以通过 @UseFilters 加在 handler 或者 controller 上，也可以在 main.ts 用 app.useGlobalFilters 全局启用。

如果 filter 要注入其他 provider，就要通过 AppModule 里注册一个 token 为 APP_FILTER 的 provider 的方式。

此外，捕获的 Exception 也是可以自定义的。

这样，我们就可以自定义异常和异常返回的响应格式了。