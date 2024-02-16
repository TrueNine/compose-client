# playwright docker 安装

playwright 的文档对此有一段描述
[playwright 安装](https://playwright.dev/java/docs/docker)
，在其文档可以切换其他语言

## 自定义 dockerfile

```dockerfile
FROM mcr.microsoft.com/playwright/java:v1.41.2-jammy
ARG TZ=Asia/Shanghai

RUN apt-get update && \
    apt-get install -y --no-install-recommends openjdk-21-jdk

ENV JAVA_HOME=/usr/lib/jvm/java-21-openjdk-${PW_TARGET_ARCH}
```

以上为java 系列的构建，如果是别的语言，也是同理，换成对应语言版本，叠上自己需要的依赖即可
