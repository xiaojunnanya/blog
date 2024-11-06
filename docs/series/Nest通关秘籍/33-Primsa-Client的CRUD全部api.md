---
id: nestseries33
slug: /nestseries33
title: 33-Primsa-Client的CRUD全部api
date: 2002-09-26
authors: 鲸落
tags: [Nest]
keywords: [Nest]
---

我们学了 Prisma 的命令、schema 的语法，这节来过一遍 Prisma Client 的 api。

## 单表操作

### findUnique

findUnique 是用来查找唯一的记录的，可以根据主键或者有唯一索引的列来查：

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'query'
    },
  ],
});

async function test1() {
    const aaa = await prisma.aaa.findUnique({
        where: {
            id: 1
        }
    });
    console.log(aaa);

    const bbb = await prisma.aaa.findUnique({
        where: {
            email: 'bbb@xx.com'
        }
    });
    console.log(bbb);
}

test1();
```

所以，这里的 id、email 都可以：

![](33-Primsa-Client的CRUD全部api.assets/af97ee8cd6824c95a5d0499111c25b4btplv-k3u1fbpfcp-jj-mark0000q75.png)

跑一下试试：`npx ts-node ./src/index.ts`

![](33-Primsa-Client的CRUD全部api.assets/c17ddadffce045acb1d4f36d59812191tplv-k3u1fbpfcp-jj-mark0000q75.png)

但是如果指定 name 就不行了：

![](33-Primsa-Client的CRUD全部api.assets/ecd8795097a44959ad84f2ffab871bb0tplv-k3u1fbpfcp-jj-mark0000q75.png)

因为通过 name 来查并不能保证记录唯一。

你还可以通过 select 指定返回的列：

```javascript
async function test1() {
    const aaa = await prisma.aaa.findUnique({
        where: {
            id: 1
        }
    });
    console.log(aaa);

    const bbb = await prisma.aaa.findUnique({
        where: {
            email: 'bbb@xx.com'
        },
        select: {
            id: true,
            email: true
        }
    });
    console.log(bbb);
}
```

比如我通过 select 指定返回 id、email：

![](33-Primsa-Client的CRUD全部api.assets/7c1252b339db4a27a55025ddae309849tplv-k3u1fbpfcp-jj-mark0000q75.png)

那结果里就只包含这两个字段。



### findUniqueOrThrow

**findUniqueOrThrow 和 findUnique 的区别是它如果没找到对应的记录会抛异常，而 findUnique 会返回 null。**

先试下 findUnique：

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'query'
    },
  ],
});


async function test2() {
    const aaa = await prisma.aaa.findUnique({
        where: {
            id: 10
        }
    });
    console.log(aaa);
}

test2();
```

![](33-Primsa-Client的CRUD全部api.assets/87f289e0f283403e992e1c3feb48f517tplv-k3u1fbpfcp-jj-mark0000q75.png)

再换成 findUniqueOrThrow 试试：

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'query'
    },
  ],
});

async function test2() {
    const aaa = await prisma.aaa.findUniqueOrThrow({
        where: {
            id: 10
        }
    });
    console.log(aaa);
}

test2();
```

如果没找到会抛异常：

![](33-Primsa-Client的CRUD全部api.assets/d9eec40cb4e445bebf8b878abc741d66tplv-k3u1fbpfcp-jj-mark0000q75.png)



### findMany

findMany 很明显是查找多条记录的。

比如查找 email 包含 xx 的记录，按照 name 降序排列：

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'query'
    },
  ],
});

async function test3() {
    const res = await prisma.aaa.findMany({
        where: {
            email: {
                contains: 'xx'
            }
        },
        orderBy: {
            name: 'desc'
        }
    });
    console.log(res);
}

test3();

```

跑一下：`npx ts-node ./src/index.ts`

![](33-Primsa-Client的CRUD全部api.assets/9f77efa5cabd4110ac425ce293950368tplv-k3u1fbpfcp-jj-mark0000q75.png)

然后再加个分页，取从第 2 条开始的 3 条。

```javascript
async function test3() {
    const res = await prisma.aaa.findMany({
        where: {
            email: {
                contains: 'xx'
            }
        },
        orderBy: {
            name: 'desc'
        },
        skip: 2,
        take: 3
    });
    console.log(res);
}
```

下标是从 0 开始的，所以是这三条：

![](33-Primsa-Client的CRUD全部api.assets/b7f029c71fc64398a24adcd2cfc3937ctplv-k3u1fbpfcp-jj-mark0000q75.png)

当然，你可以再加上 select 指定返回的字段：

```javascript
async function test3() {
    const res = await prisma.aaa.findMany({
        where: {
            email: {
                contains: 'xx'
            }
        },
        select: {
            id: true,
            email: true,
        },
        orderBy: {
            name: 'desc'
        },
        skip: 2,
        take: 3
    });
    console.log(res);
}
```

![](33-Primsa-Client的CRUD全部api.assets/619979abd71149e9a279a21ce941ccddtplv-k3u1fbpfcp-jj-mark0000q75.png)

你会发现熟练 sql 之后，这些 api 用起来都很自然，过一遍就会了。



### findFirst

findFirst 和 findMany 的唯一区别是，这个返回第一条记录。

```javascript
async  function test4() {
    const res = await prisma.aaa.findFirst({
        where: {
            email: {
                contains: 'xx'
            }
        },
        select: {
            id: true,
            email: true,
        },
        orderBy: {
            name: 'desc'
        },
        skip: 2,
        take: 3
    });
    console.log(res);
}
test4();
```

![](33-Primsa-Client的CRUD全部api.assets/8a3d3aa449a440dfbc5946c0aafd6af2tplv-k3u1fbpfcp-jj-mark0000q75.png)

此外，where 条件这里可以指定的更细致：

![](33-Primsa-Client的CRUD全部api.assets/239d3681eed74917b35e7d0cf38f3926tplv-k3u1fbpfcp-jj-mark0000q75.png)

contains 是包含，endsWith 是以什么结尾

gt 是 greater than 大于，lte 是 less than or equal 大于等于

这些过滤条件都很容易理解，就不展开了。

此外，还有 findFirstOrThrow 方法，那个也是如果没找到，抛异常，参数和 FindFirst 一样。



### create

这个我们用过多次了，用来创建记录：

```javascript
async  function test5() {
    const res = await prisma.aaa.create({
        data: {
            name: 'kk',
            email: 'kk@xx.com'
        },
        select: {
            email: true
        }
    });
    console.log(res);
}
test5();
```

它同样也可以通过 select 指定插入之后再查询出来的字段。

![](33-Primsa-Client的CRUD全部api.assets/c63f821b7a9845e385f3bb4b74c8ccb7tplv-k3u1fbpfcp-jj-mark0000q75.png)

createMany 我们用过，这里就不测了：

![](33-Primsa-Client的CRUD全部api.assets/c94f7b2748f9498787cd63dd828c6025tplv-k3u1fbpfcp-jj-mark0000q75.png)



### update

update 明显是用来更新的。

它可以指定 where 条件，指定 data，还可以指定 select 出的字段：

```javascript
async function test6() {
    const res = await prisma.aaa.update({
        where: { id: 3 },
        data: { email: '3333@xx.com' },
        select: {
            id: true,
            email: true
        }
    });
    console.log(res);
}

test6();
```

跑一下：`npx ts-node ./src/index.ts`

![](33-Primsa-Client的CRUD全部api.assets/b559edb67e0247a78566066a68a39d19tplv-k3u1fbpfcp-jj-mark0000q75.png)

可以看到，打印了 3 条 sql：

首先根据 where 条件查询出这条记录，然后 update，之后再 select 查询出更新后的记录。

updateMany 自然是更新多条记录。

比如你想更新所有邮箱包含 xx.com 的记录为 666@xx.com

![](33-Primsa-Client的CRUD全部api.assets/4d5f1d297acf42f28f220bff549b3442tplv-k3u1fbpfcp-jj-mark0000q75.png)

用 update 会报错，它只是用来更新单条记录的，需要指定 id 或者有唯一索引的列。

这时候改成 udpateMany 就可以了。

```javascript
async function test7() {
    const res = await prisma.aaa.updateMany({
        where: { 
            email: {
                contains: 'xx.com'
            } 
        },
        data: { name: '666' },
    });
    console.log(res);
}

test7();
```

![](33-Primsa-Client的CRUD全部api.assets/d2ae34da887644228b96e35065eed5b4tplv-k3u1fbpfcp-jj-mark0000q75.png)

在 mysql workbench 里可以看到，确实改了：

![](33-Primsa-Client的CRUD全部api.assets/b450063af6f443cbbe3148db3cab91c0tplv-k3u1fbpfcp-jj-mark0000q75.png)



### upsert

upsert 是 update 和 insert 的意思。

当传入的 id 有对应记录的时候，会更新，否则，会创建记录。

```javascript
async function test8() {
    const res = await prisma.aaa.upsert({
        where: { id: 11 },
        update: { email: 'yy@xx.com' },
        create: { 
            id:  11,
            name: 'xxx',
            email: 'xxx@xx.com'
        },
    });
    console.log(res);
}

test8();
```

第一次跑执行的是 insert：

![](33-Primsa-Client的CRUD全部api.assets/2f322a5842c748c6a325970c04f0163etplv-k3u1fbpfcp-jj-mark0000q75.png)

![](33-Primsa-Client的CRUD全部api.assets/2a1c34df17d94668988ed26cdf77c744tplv-k3u1fbpfcp-jj-mark0000q75.png)

第二次跑就是 update 了：

![](33-Primsa-Client的CRUD全部api.assets/570a0212a0284695b4941bb4a4d298betplv-k3u1fbpfcp-jj-mark0000q75.png)

![](33-Primsa-Client的CRUD全部api.assets/b69089861bf14b349c213a15fa6e3bcatplv-k3u1fbpfcp-jj-mark0000q75.png)



### delete

delete 就比较简单了，我们和 deleteMany 一起测试下：

```javascript
async function test9() {
    await prisma.aaa.delete({
        where: { id: 1 },
    });

    await prisma.aaa.deleteMany({
        where: {
            id: {
                in: [11, 2]
            }
        }
    });
}

test9();
```

![](33-Primsa-Client的CRUD全部api.assets/9f00108df717445488fe1cdc11245e0ftplv-k3u1fbpfcp-jj-mark0000q75.png)

可以看到有两条 delete 语句。

![](33-Primsa-Client的CRUD全部api.assets/a15026f6da7d4dabb5f9127292d03ceetplv-k3u1fbpfcp-jj-mark0000q75.gif)

可以看到 3 条记录都被删除了。



### count

count 其实和 findMany 参数一样，只不过这里不返回具体记录，而是返回记录的条数。

比如 findMany 是这样的：

```javascript
async function test10() {
    const res = await prisma.aaa.findMany({
        where: {
            email: {
                contains: 'xx'
            }
        },
        orderBy: {
            name: 'desc'
        },
        skip: 2,
        take: 3
    });
    console.log(res);
}
test10();
```

![](33-Primsa-Client的CRUD全部api.assets/57fb1afa9463410eb26ed5daa5b05406tplv-k3u1fbpfcp-jj-mark0000q75.png)

把 findMany 改为 count 就是这样了：

```javascript
async function test10() {
    const res = await prisma.aaa.count({
        where: {
            email: {
                contains: 'xx'
            }
        },
        orderBy: {
            name: 'desc'
        },
        skip: 2,
        take: 3
    });
    console.log(res);
}
test10();
```

![](33-Primsa-Client的CRUD全部api.assets/fa3e688b042c4f6ea6c5ef3bd8e12e5etplv-k3u1fbpfcp-jj-mark0000q75.png)



### aggregate 

aggregate 是统计相关的。

它除了 where、orderBy、skip、take 这些参数外，还可以指定 _count、_avg、_sum、_min、_max
这些。

不过我们现在的表里没有数字相关的列。

改一下 model：

![](33-Primsa-Client的CRUD全部api.assets/2661d3c4f5444433972546f4f499e7f4tplv-k3u1fbpfcp-jj-mark0000q75.png)

```
model Aaa {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
  age Int       @default(0)
}
```

然后创建一个新的 migration：

```
npx prisma migrate dev --name bbb
```

![](33-Primsa-Client的CRUD全部api.assets/fc6ee6e6538f43b8b850f06d452b21c2tplv-k3u1fbpfcp-jj-mark0000q75.png)

对应的 sql 如下：

![](33-Primsa-Client的CRUD全部api.assets/d282df2c9837454d825e4d8f6d6fc642tplv-k3u1fbpfcp-jj-mark0000q75.png)

然后我们用代码改一下：

```javascript
async function test11() {
    await prisma.aaa.update({
        where: {
            id: 3
        },
        data: {
            age: 3
        }
    });

    await prisma.aaa.update({
        where: {
            id: 5
        },
        data: {
            age: 5
        }
    });
}
test11();
```

![](33-Primsa-Client的CRUD全部api.assets/96087511c92d41aa86ef7457be55fb44tplv-k3u1fbpfcp-jj-mark0000q75.png)

在 mysql workbench 里刷新下，可以看到确实改了：

![](33-Primsa-Client的CRUD全部api.assets/f4ff325c8e714542a3e24cac64bde57etplv-k3u1fbpfcp-jj-mark0000q75.png)

接下来就可以测试 aggregate 方法了：

```javascript
async function test12() {
    const res = await prisma.aaa.aggregate({
        where: {
            email: {
                contains: 'xx.com'
            }
        },
        _count: {
            _all: true,
        },
        _max: {
            age: true
        },
        _min: {
            age: true
        },
        _avg: {
            age: true
        }
    });
    console.log(res);
}
test12();
```

跑一下：

![](33-Primsa-Client的CRUD全部api.assets/ba51d2dc388d4765b132bdc9baacc2d6tplv-k3u1fbpfcp-jj-mark0000q75.png)

可以看到返回的最大值、最小值、计数、平均值，都是对的。



### groupBy

最后还有个 groupBy 方法，大家有 sql 基础也很容易搞懂，这个就是分组的。

```javascript
async function test13() {
    const res = await prisma.aaa.groupBy({
        by: ['email'],
        _count: {
          _all: true
        },
        _sum: {
          age: true,
        },
        having: {
          age: {
            _avg: {
              gt: 2,
            }
          },
        },
    })
    console.log(res);
}

test13();

```

就是按照 email 分组，过滤出平均年龄大于 2 的分组，计算年龄总和返回。

结果如下：
![](33-Primsa-Client的CRUD全部api.assets/9859da852ff044d1bca8e1b2d44b7b12tplv-k3u1fbpfcp-jj-mark0000q75.png)

因为 age 大于 2 的就 2 条，然后算平均值、计数，就是上面的结果了：

![](33-Primsa-Client的CRUD全部api.assets/3cf5f033140f44cd8132804fa0044d04tplv-k3u1fbpfcp-jj-mark0000q75.png)





## 多表操作

设置datasource 的 provider 为 mysql，并且添加 model

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Department {
  id        Int    @id @default(autoincrement())
  name      String  @db.VarChar(20)
  createTime DateTime @default(now())
  updateTime DateTime @updatedAt
  employees     Employee[]
}

model Employee {
  id         Int       @id @default(autoincrement())
  name      String     @db.VarChar(20)
  phone     String     @db.VarChar(30)  

  deaprtmentId Int
  department     Department      @relation(fields: [deaprtmentId], references: [id])
}
```

之后执行 migrate reset 重置下：`npx prisma migrate reset`

然后用 migrate dev 创建新的迁移：`npx prisma migrate dev --name aaa`

生成了 client 代码，还有 sql 文件。

![](33-Primsa-Client的CRUD全部api.assets/a129c832d88b4cd1ae85015353b95a20tplv-k3u1fbpfcp-jj-mark3024000q75.png)

数据库中也多了这 2 个表：

![](33-Primsa-Client的CRUD全部api.assets/55197603cc2d40a089abacdd197abea1tplv-k3u1fbpfcp-jj-mark3024000q75.png)

![](33-Primsa-Client的CRUD全部api.assets/9f087fe832374ad8b88c5f9e684e350ctplv-k3u1fbpfcp-jj-mark3024000q75.png)

然后来写下 client 的 crud 代码。

首先安装 ts、ts-node 包：`npm install typescript ts-node @types/node --save-dev`

创建 tsconfig.json`npx tsc --init`

把注释删掉，保留这些配置就行：

```json
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "types": ["node"],
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

创建 src/index.ts

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'query'
    },
  ],
});

async function main() { 
}

main();
```

然后分别做下 CRUD



### 插入数据

首先是插入数据：

```javascript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: [
    {
      emit: 'stdout',
      level: 'query'
    },
  ],
});

async function test1() {
   await prisma.department.create({
        data: {
            name: '技术部',
            employees: {
                create: [
                    {
                        name: '小张',
                        phone: '13333333333'
                    },
                    {
                        name: '小李',
                        phone: '13222222222'
                    }
                ]
            }
        }
   })
}

test1();
```

插入关联 model 的数据的时候，也是用 create 指定：

![](33-Primsa-Client的CRUD全部api.assets/634ccb2291f44010a91f42fad5191a15tplv-k3u1fbpfcp-jj-mark3024000q75.png)

测试下：`npx ts-node ./src/index.ts`

![](33-Primsa-Client的CRUD全部api.assets/99422760137c4c939fd32afd811a17b8tplv-k3u1fbpfcp-jj-mark3024000q75.png)

在 mysql workbench 里看下结果：

![](33-Primsa-Client的CRUD全部api.assets/e20e8a26e5254d6aadcaea6853bcd75etplv-k3u1fbpfcp-jj-mark3024000q75.png)

![](33-Primsa-Client的CRUD全部api.assets/393d9cb0043f4d2eb89d4e90687e6887tplv-k3u1fbpfcp-jj-mark3024000q75.png)

确实，数据都被正确插入了。

当然，你也可以用这种写法：

![](33-Primsa-Client的CRUD全部api.assets/d6fde3edfc2b49e3b2194a0d2ece5e6atplv-k3u1fbpfcp-jj-mark3024000q75.png)

```javascript
async function test2() {
    await prisma.department.create({
         data: {
             name: '技术部',
             employees: {
                 createMany: {
                    data: [
                        {
                            name: '小王',
                            phone: '13333333333'
                        },
                        {
                            name: '小周',
                            phone: '13222222222'
                        }
                    ],

                 }
             }
         }
    })
}

test2();
```

跑一下：

![](33-Primsa-Client的CRUD全部api.assets/86cba5416ddc402c9d29b8f0d01ceb4atplv-k3u1fbpfcp-jj-mark3024000q75.png)

效果一样：

![](33-Primsa-Client的CRUD全部api.assets/394a883a6ee04d4499305daa12653dactplv-k3u1fbpfcp-jj-mark3024000q75.png)

![](33-Primsa-Client的CRUD全部api.assets/8a4e6050a5af47b3aaafd7820f7959catplv-k3u1fbpfcp-jj-mark3024000q75.png)



### 关联查询

那如何关联查询呢？

可以这样写：

```javascript
async function test3() {
    const res1 = await prisma.department.findUnique({
        where: {
            id: 1
        },
        include: {
            employees: true
        }
    });
    console.log(res1);

    const res2 = await prisma.department.findUnique({
        where: {
            id: 1
        },
        include: {
            employees: {
                where: {
                    name: '小张'
                },
                select: {
                    name: true
                }
            }
        }
    });
    console.log(res2);

    const res3 = await prisma.department.findUnique({
        where: {
            id: 1
        }
    }).employees();
    console.log(res3);
}

test3();
```

查询 department 的时候，通过 include 指定关联查询出 employees。

include 还可以指定 where 等查询的参数，进一步过滤。

此外，你也可以在查出 department 后调用 empolyees() 方法来查询。

可以看到，都能正确查出关联数据：

![](33-Primsa-Client的CRUD全部api.assets/483173bf0da443ada07efb5a0dc36b61tplv-k3u1fbpfcp-jj-mark3024000q75.png)



### 关联更新

再就是关联更新：

```javascript
async function test4() {
    const res1 = await prisma.department.update({
        where: {
            id: 1
        },
        data: {
            name: '销售部',
            employees: {
                create: [
                    {
                        name: '小刘',
                        phone: '13266666666'
                    }
                ]
            }
        }
    });
    console.log(res1);
}

test4();
```

比如我在更新 department 的时候关联插入了一条 employee 的记录。

跑一下：

![](33-Primsa-Client的CRUD全部api.assets/ef0fdb1edee04269a19ffe5d9bab87cetplv-k3u1fbpfcp-jj-mark3024000q75.png)

在 mysql workbench 里可以看到，id 为 1 的 department 更新了：

![](33-Primsa-Client的CRUD全部api.assets/f714834fc2ee442b8daee35721af79bdtplv-k3u1fbpfcp-jj-mark3024000q75.png)

关联插入了一条 employee 的记录：

![](33-Primsa-Client的CRUD全部api.assets/b95da0f1b5624d1a84b72e659dbd33d4tplv-k3u1fbpfcp-jj-mark3024000q75.png)

![](33-Primsa-Client的CRUD全部api.assets/d8fe049ad64a4c53ae8ad7e66705aee9tplv-k3u1fbpfcp-jj-mark3024000q75.png)

更新 department 的时候，除了可以插入 empolyee 的数据，也可以和别的 empolyee 建立关联。

比如 id 为 4 的 empolyee：

![](33-Primsa-Client的CRUD全部api.assets/8cbfe2b5b54b4bd48b4aae7306894b6ctplv-k3u1fbpfcp-jj-mark3024000q75.png)

现在他关联的是 id 为 2 的 department。

我们 update 的时候使用 connect 和它关联：

```javascript
async function test5() {
    const res1 = await prisma.department.update({
        where: {
            id: 1
        },
        data: {
            name: '销售部',
            employees: {
                connect: [
                    {
                        id: 4
                    }
                ]
            }
        }
    });
    console.log(res1);
}
test5();
```

![](33-Primsa-Client的CRUD全部api.assets/45b36288047e45b185047c5913776413tplv-k3u1fbpfcp-jj-mark3024000q75.png)

跑一下：

![](33-Primsa-Client的CRUD全部api.assets/502561f1da854860b6baf9a8159191d7tplv-k3u1fbpfcp-jj-mark3024000q75.png)

刷新可以看到，id 为 4 的 employee 关联的 department 就变了：

![](33-Primsa-Client的CRUD全部api.assets/d001d81bf504470792dd59b534139231tplv-k3u1fbpfcp-jj-mark3024000q75.png)

如果是某个 id 的数据存在就 connect，不存在就 create 呢？

可以这样写：

```javascript
async function test6() {
    const res1 = await prisma.department.update({
        where: {
            id: 1
        },
        data: {
            name: '销售部',
            employees: {
                connectOrCreate: {
                    where: {
                        id: 6
                    },
                    create: {
                        id: 6,
                        name: '小张',
                        phone: '13256665555'
                    }
                }
            }
        }
    });
    console.log(res1);
}
test6();
```

第一次跑，执行的是 insert：

![](33-Primsa-Client的CRUD全部api.assets/3d7ca69a88d64e40bb52bf841560fd2ctplv-k3u1fbpfcp-jj-mark3024000q75.png)

![](33-Primsa-Client的CRUD全部api.assets/624fbc54470b4f1fb349cdfc8c13aee0tplv-k3u1fbpfcp-jj-mark3024000q75.png)

第二次跑，就是 update 了：

![](33-Primsa-Client的CRUD全部api.assets/8d52d7347cdc4d0280cb3a54f30561batplv-k3u1fbpfcp-jj-mark3024000q75.png)

也就是说，update 的时候可以通过 create、connect、connectOrCreate 来插入新的关联 model 的记录或者关联已有的记录。

当然，create 的时候也可以这样：

![](33-Primsa-Client的CRUD全部api.assets/c53b43c1124444939e8ed8bcf99ef7b7tplv-k3u1fbpfcp-jj-mark3024000q75.png)

效果一样，就不一个个测试了。



### 删除

再就是删除：

如果我们想删除 id 为 1 的 department 的所有 empolyee，可以这样写：

```javascript
async function test7() {
    await prisma.employee.deleteMany({
        where: {
            department: {
                id: 1
            }
        },
    });
}
test7();
```

![](33-Primsa-Client的CRUD全部api.assets/767766da6f174af2a443da2fdb9a75c7tplv-k3u1fbpfcp-jj-mark3024000q75.png)

![](33-Primsa-Client的CRUD全部api.assets/f916a94bfa2745648c0b6c3ba2f94e7dtplv-k3u1fbpfcp-jj-mark3024000q75.png)

这就是多个 model 关联时的 CRUD。



## 执行sql

此外，Prisma 还可以直接执行 sql：

```javascript
async function test8() {
    await prisma.$executeRaw`TRUNCATE TABLE Employee`;

    const res = await prisma.$queryRaw`select * from Department`;
    console.log(res);
}
test8();
```

![](33-Primsa-Client的CRUD全部api.assets/0c7d176c1f8444d0975bc83e700e67a3tplv-k3u1fbpfcp-jj-mark3024000q75.png)

这样，当上面的 api 都不能满足需求的时候，你就可以直接执行 sql。

案例代码在[小册仓库](https://github.com/QuarkGluonPlasma/nestjs-course-code/tree/main/prisma-client-api2)
