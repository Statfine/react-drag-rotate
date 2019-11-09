## React-drag-rotate

拖动组件，支持旋转属性

## 安装组件
创建项目文件夹并初始化 `npm package` ，确保你创建的组件名称没有在 [npm](https://www.npmjs.com/) 上被使用过， 这里我们用 react-demo 作为示例

```bash
npm install react-drag-rotate
```

`npm init` 是生成初始的 **package.json** 的命令，在 `npm init` 的时候，你可以根据你自己的需要进行填写你的组件信息。或者直接使用 `npm init -y` 采用默认的，后面自己再去修改。

首先安装 react 相关的包：

```bash
npm i react react-dom -D
```

演示：

```javascript
import TransRotateCom from '../../src'

<TransRotateCom
  position={{ x: 0, y: 0, height: 100, width: 100, rotate: 0 }}
  cbActualChange={(info) => console.log('cbActualChange', info)}
  cbMouseUp={(info) => console.log('cbMouseUp', info)}
/>

```
