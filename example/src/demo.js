import React from 'react';
import styled from 'styled-components';

import TransRotateCom from '../../src';
import { transform, isPointInRect, getRectScalePoint } from '../../src/utils';

const BaseInfo = styled.div`
  position: absolute;
  z-index: 1;
  right: 0;
  top: 0;
  padding: 10px;
`;

const EachEvent = styled.div`
  margin-top: 16px;

  > p {
    padding-left: 10px;
  }
`;

export default class TransRotate extends React.PureComponent {
  state = {
    position: {
      x: 0,
      y: 0,
      height: 100,
      width: 100,
      rotate: 0,
    },
    isInRect: false,
  };

  componentDidMount() {
    document.addEventListener('mouseup', this.handlePreviewDivMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.handlePreviewDivMouseUp);
  }

  handlePreviewDivMouseUp = (ev) => {
    this.setState({ isInRect: false });
    const point = [ev.clientX, ev.clientY];
    const { position } = this.state;
    // const rectTransform = transform(position, position.rotate);
    // console.log('rectTransform', rectTransform);
    // console.log('getRectScalePoint', getRectScalePoint(position.width, position.height, position.x, position.y, position.rotate))
    if (isPointInRect(point, position)
    ) {
      this.setState({ isInRect: true });
    }
  }

  render() {
    return (
      <div>
        <BaseInfo>
          {this.state.isInRect && <p>点击位置再拖拽组件内</p>}
          <EachEvent>
            <h3>拖动(handleBindMoveEvents)</h3>
            <p>监听xy轴偏移量 直接设置</p>
          </EachEvent>
          <EachEvent>
            <h3>旋转(handleBindRotateEvents)</h3>
            <p>获取中心点,通过当前点(鼠标)到中心的xy计算出角度</p>
          </EachEvent>
          <EachEvent>
            <h3>大小修改(handleBindResizeEvents)</h3>
            <p>1.获取旋转之后的8个顶点坐标</p>
            <p>2.获取当前点的对角点(坐标+索引)</p>
            <p>3.判断计算x周偏移还是y轴偏移</p>
            <p>4.通过第三步计算出缩放比列</p>
            <p>5.通过当前点所以判断缩放比例是作用于宽还是高或者宽高</p>
            <p>6.通过(原始坐标, 5, 1, 对角索引)计算新的位置</p>
          </EachEvent>
        </BaseInfo>
        <TransRotateCom
          position={{ x: 0, y: 0, height: 100, width: 100, rotate: 0 }}
          cbActualChange={(info) => this.setState({ position: info }, () => console.log('cbActualChange', info))}
          cbMouseUp={(info) => this.setState({ position: info }, () => console.log('cbMouseUp', info))}
        />
      </div>
    );
  }
}
