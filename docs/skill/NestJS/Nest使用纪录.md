---
id: nestuse
slug: /nestuse
title: Nest使用纪录
date: 2002-09-26
authors: 鲸落
tags: [Nod, Nest]
keywords: [Node, Nest]
---

## Filter

### 全局异常捕获

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common'
import { Response } from 'express'
import { formatDate } from '@/utils'
import { customCode, responseType } from '@/type'

// 捕获异常
@Catch()
export default class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const code = exception.getStatus()
    console.log('exception', exception)
    // 对class-validator的异常做兼容
    const { message: validatorErr } = exception.getResponse() as {
      message: string[]
    }

    const message = validatorErr?.join
      ? validatorErr.join(',')
      : exception.message || customCode[98]

    const errorResponse: responseType = {
      code: 98,
      timestamp: formatDate(),
      data: {
        data: null,
        message,
      },
      type: 'system',
    }

    response.status(code).json(errorResponse)
  }
}
```





## interceptor

### 自定义返回类型

```ts
import { responseType, returnType } from '@/type'
import { formatDate } from '@/utils'
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(response => {
        // 默认错误处理
        const {
          code = 50,
          message = 'Internal Server Error',
          data = null,
        } = response as returnType

        const returnMsg: responseType = {
          code,
          timestamp: formatDate(),
          data: {
            message,
            data,
          },
          type: 'custom',
        }

        return returnMsg
      }),
    )
  }
}
```





## 杂

- ```
  // 全局路由添加：
  app.setGlobalPrefix('/whaledev/v1')
  
  // 去除指定的路径：
  app.setGlobalPrefix('/whaledev/v1', {
  	exclude: ['/']
  })
  ```

- 































































































