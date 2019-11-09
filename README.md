## React-drag-rotate

[![npm downloads](https://img.shields.io/npm/dt/react-draggable.svg?maxAge=2592000)](https://www.npmjs.com/package/react-drag-rotate)

拖动组件，支持旋转属性

## example
```bash
npm install
npm start
http://localhost:3011
```

## 安装组件
```bash
npm install react-drag-rotate
```

演示：

```javascript
import TransRotateCom from 'react-drag-rotate'

<TransRotateCom
  position={{ x: 0, y: 0, height: 100, width: 100, rotate: 0 }}
  cbActualChange={(info) => console.log('cbActualChange', info)}
  cbMouseUp={(info) => console.log('cbMouseUp', info)}
/>

```

## API

### props

| Parameter        | Description                        | Type          | Default                         |
|------------------|------------------------------------|---------------|---------------------------------|
| position         | default position                   | Object        | { x, y, height, width, rotate}  |
| children         | children                           | Node          | null                            |
| isEqualRatio     | single line is  equal ratio        | Bool          | false                           |
| cbActualChange   | actual change position callback    | Func          | position                        |
| cbMouseUp        | mouse up callback                  | Func          | position                        |
