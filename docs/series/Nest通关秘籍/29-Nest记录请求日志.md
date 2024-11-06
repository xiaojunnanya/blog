---
id: nestseries29
slug: /nestseries29
title: 29-Nest记录请求日志
date: 2002-09-26
authors: 鲸落
tags: [Nest]
keywords: [Nest]
---

## 请求日志

Nest 服务会不断处理用户用户的请求，如果我们想记录下每次请求的日志呢？

可以通过 interceptor 来做。

我们写一下：`nest new request-log`

进入项目，创建个 interceptor：`nest g interceptor request-log --no-spec --flat`

打印下日志：

```javascript
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLogInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const userAgent = request.headers['user-agent'];

    const { ip, method, path } = request;

    this.logger.debug(
      `${method} ${path} ${ip} ${userAgent}: ${
        context.getClass().name
      } ${
        context.getHandler().name
      } invoked...`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${method} ${path} ${ip} ${userAgent}: ${response.statusCode}: ${Date.now() - now}ms`,
        );
        this.logger.debug(`Response: ${JSON.stringify(res)}`);
      }),
    );
  }
}
```

这里用 nest 的 Logger 来打印日志，可以打印一样的格式。

打印下 method、path、ip、user agent，调用的目标 class、handler 等信息。

然后记录下响应的状态码和请求时间还有响应内容。

全局启用这个 interceptor：

![](29-Nest记录请求日志.assets/993e301485814f80bf286317ba3176b9tplv-k3u1fbpfcp-jj-mark0000q75.png)

```javascript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestLogInterceptor } from './request-log.interceptor';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLogInterceptor
    }
  ],
})
export class AppModule {}
```

把服务跑起来：`npm run start:dev`

浏览器访问下：

![](29-Nest记录请求日志.assets/77ad2fc8d22a439eb4af197fa9d9566dtplv-k3u1fbpfcp-jj-mark0000q75.png)

![](29-Nest记录请求日志.assets/c91f2ef3b2e34afbb08037dc9487f590tplv-k3u1fbpfcp-jj-mark0000q75.png)

可以看到，打印了请求的信息，目标 class、handler，响应的内容。

但其实这个 ip 是有问题的：

如果客户端直接请求 Nest 服务，那这个 ip 是准的，但如果中间经过了 nginx 等服务器的转发，那拿到的 ip 就是 nginx 服务器的 ip 了。

这时候要取 X-Forwarded-For 这个 header，它记录着转发的客户端 ip。

当然，这种事情不用自己做，有专门的库 request-ip：

![](29-Nest记录请求日志.assets/d185d5f4a8434bd9807ff00c4c9ab6f9tplv-k3u1fbpfcp-jj-mark0000q75.png)

安装下：`npm install --save request-ip`

然后把打印的 ip 换一下：

![](29-Nest记录请求日志.assets/b8c19bab4cc04c5b853dbc8e3298b985tplv-k3u1fbpfcp-jj-mark0000q75.png)

换成 X-Forwarded-For 的客户端 ip 或者是 request.ip。

```javascript
import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import * as requestIp from 'request-ip';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLogInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const userAgent = request.headers['user-agent'];

    const { ip, method, path } = request;

    const clientIp = requestIp.getClientIp(ip) || ip;

    this.logger.debug(
      `${method} ${path} ${clientIp} ${userAgent}: ${
        context.getClass().name
      } ${
        context.getHandler().name
      } invoked...`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${method} ${path} ${clientIp} ${userAgent}: ${response.statusCode}: ${Date.now() - now}ms`,
        );
        this.logger.debug(`Response: ${JSON.stringify(res)}`);
      }),
    );
  }
}
```

访问下：

![](29-Nest记录请求日志.assets/77ad2fc8d22a439eb4af197fa9d9566dtplv-k3u1fbpfcp-jj-mark0000q75.png)

![](29-Nest记录请求日志.assets/adc0f934451143a288f12d84d42fa754tplv-k3u1fbpfcp-jj-mark0000q75.png)

因为我们本地访问用 localhost 是拿不到真实 ip 的。

你可以查一下本地 ip，用 ip 访问：

![](29-Nest记录请求日志.assets/4a56c88c01e64c8caca56d634e310a5btplv-k3u1fbpfcp-jj-mark0000q75.png)

![](29-Nest记录请求日志.assets/62a40d49ecc742d0ba9de4c2cc21e8detplv-k3u1fbpfcp-jj-mark0000q75.png)

这里的 ::ffff 是 ipv6 地址的意思：

![](29-Nest记录请求日志.assets/d740b9700c2242108175eb301a000b1atplv-k3u1fbpfcp-jj-mark0000q75.png)

这样部署到线上之后就能拿到真实地址了。

那如果想拿到 ip 地址对应的城市呢？

![](29-Nest记录请求日志.assets/0b41849f8d89476182956347521a788ftplv-k3u1fbpfcp-jj-mark0000q75.png)

很多系统会做登录日志，每次登录的时候记录登录时的 ip 和对应的城市信息到数据库里。

如何根据 ip 拿到城市信息呢？

其实可以通过一些在线的免费接口：

https://whois.pconline.com.cn/ipJson.jsp?ip=221.237.121.165&json=true

这个就是用于查询 IP 对应的城市的。

![](29-Nest记录请求日志.assets/e6506d0caf004facb57998c7fce77ebctplv-k3u1fbpfcp-jj-mark0000q75.png)

请求三方服务用 axios 的包，

安装下：`npm install --save @nestjs/axios axios`

在 AppModule 里引入下：

![](29-Nest记录请求日志.assets/7fa49346ee39405d99d554fbf56dd8e1tplv-k3u1fbpfcp-jj-mark0000q75.png)

然后在 interceptor 里注入 HttpService 来发请求：

![](29-Nest记录请求日志.assets/18d1f0dfa5654005935252e3b77e6factplv-k3u1fbpfcp-jj-mark0000q75.png)

注入 HttpService，封装个 ipToCity 方法来查询，在 intercept 方法里调用下：

```javascript
import { CallHandler, ExecutionContext, Inject, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';
import * as requestIp from 'request-ip';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestLogInterceptor.name);

  @Inject(HttpService)
  private httpService: HttpService;

  async ipToCity(ip: string) {
    const response = await this.httpService.axiosRef(`https://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`);
    return response.data.addr;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ) {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    console.log(await this.ipToCity('221.237.121.165'))

    const userAgent = request.headers['user-agent'];

    const { ip, method, path } = request;

    const clientIp = requestIp.getClientIp(ip) || ip;

    this.logger.debug(
      `${method} ${path} ${clientIp} ${userAgent}: ${
        context.getClass().name
      } ${
        context.getHandler().name
      } invoked...`,
    );

    const now = Date.now();

    return next.handle().pipe(
      tap((res) => {
        this.logger.debug(
          `${method} ${path} ${clientIp} ${userAgent}: ${response.statusCode}: ${Date.now() - now}ms`,
        );
        this.logger.debug(`Response: ${JSON.stringify(res)}`);
      }),
    );
  }
}
```

直接用 httpService 的方法是被包装过后的，返回值是 rxjs 的 Observable，需要用 firstValueFrom 的操作符转为 promise：

![](29-Nest记录请求日志.assets/1318b2218ed1490bb70eba60cdb5c4b3tplv-k3u1fbpfcp-jj-mark0000q75.png)

如果想用原生 axios 对象，可以直接调用 this.httpService.axiosRef.xxx，这样返回的就是 promise。

可以看到，返回的数据是没问题的，但是字符集不对：

![](29-Nest记录请求日志.assets/452e3160cf424122acb376a6ec8632adtplv-k3u1fbpfcp-jj-mark0000q75.png)

![](29-Nest记录请求日志.assets/a250d8b5dced478caf5793901c2b4f28tplv-k3u1fbpfcp-jj-mark0000q75.png)

接口返回的字符集是 gbk，而我们用的是 utf-8，所以需要转换一下。

用 iconv-lite 这个包：

![](29-Nest记录请求日志.assets/9b78b63df13a4bc4b9b2072c3b0495f7tplv-k3u1fbpfcp-jj-mark0000q75.png)

它就是用来转换字符集的。

```
npm install --save iconv
```

![](29-Nest记录请求日志.assets/c20abf9572984107bcec15fa1d155ef6tplv-k3u1fbpfcp-jj-mark0000q75.png)

指定 responseType 为 arraybuffer，也就是二进制的数组，然后用 gbk 的字符集来解码。

```javascript
async ipToCity(ip: string) {
    const response = await this.httpService.axiosRef(`https://whois.pconline.com.cn/ipJson.jsp?ip=${ip}&json=true`, {
      responseType: 'arraybuffer',
      transformResponse: [
        function (data) {
          const str = iconv.decode(data, 'gbk');
          return JSON.parse(str);
        }
      ]
    });
    return response.data.addr;
}
```

现在，就能拿到 utf-8 编码的城市信息了：

![](29-Nest记录请求日志.assets/6dc8cbf610d94894af4f72d68dfe0301tplv-k3u1fbpfcp-jj-mark0000q75.png)

当然，这个不建议放到请求日志里，不然每次请求都调用一次接口太浪费性能了。

登录日志里可以加这个。

![](29-Nest记录请求日志.assets/e4391f262b3c415290213c78d3b8180atplv-k3u1fbpfcp-jj-mark0000q75.png)

案例代码上传了[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/request-log)

## 总结

我们通过 interceptor 实现了记录请求日志的功能。

其中 ip 地址如果被 nginx 转发过，需要取 X-Forwarded-For 的 header 的值，我们直接用 request-ip 这个包来做。

如果想拿到 ip 对应的城市信息，可以用一些免费接口来查询，用 @nestjs/axios 来发送请求。当然，这个不建议放到请求日志里。

这样，就可以记录下每次请求响应的信息了。

