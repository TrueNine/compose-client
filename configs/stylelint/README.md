1. 建立文件 `.stylelintrc.cjs`

```javascript
module.exports = {
  extends: ['@compose-types/stylelint-config']
}
```

2. 增加命令

```json
{
  "slint": "stylelint \"./**/*.{css,sass,scss,less,vue,html}\" --fix"
}
```

3. 也可以编写 .stylelintignore 来忽略某些文件
