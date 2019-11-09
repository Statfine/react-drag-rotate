/**
 * 拖动组件
 *  拖动-监听xy偏移 直接设置
 *  旋转-监听移动后的xy轴 计算角度
 *  大小设置（同原始坐标比较）
 *    获取对角线信息(点位置和索引)
 *    判断是x还是y移动获取移动后的比例
 *    根据索引判断宽或者高等比缩放
*/
import React from 'react';
import PropTypes from 'prop-types';

import { transform, getScaledRect } from './utils';

import { TranContainer, RotateBtn, DraggableDiv,
  ResizableDiv, PointTl, PointT, PointTr, PointR, PointBr, PointB, PointBl, PointL } from './styled';

export default class TransRotateCom extends React.PureComponent {
  state = {};

  componentWillMount() {
    this.position = this.props.position;
  }

  componentDidMount() {
    this.handleDraw();
    this.handleSetCursorStyle(0);
    this.handleBindMoveEvents(); // 拖动
    this.handleBindRotateEvents(); // 旋转
  }
  position = { x: 0, y: 0, height: 100, width: 100, rotate: 0 };

  // 拖动事件
  handleBindMoveEvents() {
    this.draggableEl.onmousedown = () => {
      const event = window.event;
      const deltaX = event.pageX - this.position.x;
      const deltaY = event.pageY - this.position.y;
      document.onmousemove = () => {
        const event = window.event;
        this.position.x = event.pageX - deltaX;
        this.position.y = event.pageY - deltaY;
        this.handleDraw();
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
        this.handleMouseUp();
      };
    };
    this.draggableEl.ondragstart = (event) => {
      event.preventDefault();
      return false;
    };
  }

  // 旋转
  handleBindRotateEvents = () => {
    this.rotateEl.onmousedown = () => {
      // 旋转开始
      const event = window.event;
      const point = this.handleGetConterPoint(this.tranContainerEl);
      const prevAngle = Math.atan2(event.pageY - point.y, event.pageX - point.x) - this.position.rotate * Math.PI / 180;
      console.log('prevAngle', prevAngle);
      document.onmousemove = () => {
        // 旋转
        const event = window.event;
        const angle = Math.atan2(event.pageY - point.y, event.pageX - point.x);
        console.log('angle', angle);
        this.position.rotate = Math.floor((angle - prevAngle) * 180 / Math.PI);
        this.handleDraw();
      };
      document.onmouseup = () => {
        // 旋转结束
        document.onmousemove = null;
        document.onmouseup = null;
        this.handleSetCursorStyle(this.position.rotate);
        this.handleMouseUp();
      };
    };
    this.rotateEl.ondragstart = (event) => {
      event.preventDefault();
      return false;
    };
  }

  // point拖动
  handleBindResizeEvents = (event) => {
    // 缩放开始
    event.preventDefault();
    const { x, y, width, height, rotate } = this.position;
    const ex = event.pageX;
    const ey = event.pageY;

    // 计算初始状态旋转后的rect
    const transformedRect = transform({
      x,
      y,
      width,
      height,
    }, rotate);
    // 取得旋转后的8点坐标
    console.log('取得旋转后的8点坐标:transformedRect', transformedRect);
    const { point } = transformedRect;

    // 获取当前点和对角线点
    const pointAndOpposite = this.handleGetPointAndOpposite(point, ex, ey);
    const { opposite } = pointAndOpposite;
    console.log('获取当前点和对角线点:opposite', opposite);

    // 对角线点的索引即为缩放基点索引
    const baseIndex = opposite.index;
    const oppositeX = opposite.point.x;
    const oppositeY = opposite.point.y;

    // 鼠标释放点距离当前点对角线点的偏移量  基于对角的偏移量（点击上中的话，对焦点就是下种）
    const offsetWidth = Math.abs(ex - oppositeX);
    const offsetHeight = Math.abs(ey - oppositeY);
    console.log('offsetWidth', offsetWidth, offsetHeight);

    // 记录最原始的状态
    const oPoint = { x, y, width, height, rotate };

    document.onmousemove = () => {
      const event = window.event;
      const nex = event.pageX;
      const ney = event.pageY;

      const scale = { x: 1, y: 1 };
      let realScale = 1;

      // 判断是根据x方向的偏移量来计算缩放比还是y方向的来计算 获取大小修改比例
      if (offsetWidth > offsetHeight) {
        realScale = Math.abs(nex - oppositeX) / offsetWidth;
      } else {
        realScale = Math.abs(ney - oppositeY) / offsetHeight;
      }
      console.log('offsetWidth', offsetWidth, offsetHeight, realScale);

      // 通过point索引，判断设置的比例作用于 宽还是高
      if ([0, 2, 4, 6].indexOf(baseIndex) >= 0) {
        scale.x = realScale;
        scale.y = realScale;
      } else if ([1, 5].indexOf(baseIndex) >= 0) {
        scale.y = realScale;
      } else if ([3, 7].indexOf(baseIndex) >= 0) {
        scale.x = realScale;
      }

      // 计算新坐标
      const newRect = this.handleGetNewRect(oPoint, scale, transformedRect, baseIndex);
      this.position.x = newRect.x;
      this.position.y = newRect.y;
      this.position.width = newRect.width;
      this.position.height = newRect.height;
      this.handleDraw();
    };
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      this.handleMouseUp();
    };
  }

  /**
   * 取得rect中心点
   * @param  {[type]} box [description]
  */
  handleGetConterPoint = (el) => {
    const box = el;
    return {
      x: box.offsetLeft + box.offsetWidth / 2,
      y: box.offsetTop + box.offsetHeight / 2,
    };
  }

  /**
   * 取得鼠标释放点在rect8点坐标中的对应点及其对角线点
   * @param  {[type]} point [description]
   * @param  {[type]} ex    [description]
   * @param  {[type]} ey    [description]
  */
  handleGetPointAndOpposite(point, ex, ey) {
    let oppositePoint = {};
    let currentPoint = {};

    let minDelta = 1000;
    let currentIndex = 0;
    let oppositeIndex = 0;

    point.forEach((p, index) => {
      const delta = Math.sqrt(Math.pow(p.x - ex, 2) + Math.pow(p.y - ey, 2));
      if (delta < minDelta) {
        currentPoint = p;
        currentIndex = index;
        minDelta = delta;
        // 对角线点index相差4
        const offset = 4;
        let oIndex = index - offset;
        if (oIndex < 0) {
          oIndex = index + offset;
        }
        // 取对角线点坐标
        oppositePoint = point.slice(oIndex, oIndex + 1)[0];
        oppositeIndex = oIndex;
      }
    });

    return {
      current: {
        index: currentIndex,
        point: currentPoint,
      },
      opposite: {
        index: oppositeIndex,
        point: oppositePoint,
      },
    };
  }

  /**
   * 根据缩放基点和缩放比例取得新的rect
   * @param  {[type]} oPoint               [description]
   * @param  {[type]} scale            [description]
   * @param  {[type]} oTransformedRect [description]
   * @param  {[type]} baseIndex        [description]
   * @return {[type]}                  [description]
  */
  handleGetNewRect(oPoint, scale, oTransformedRect, baseIndex) {
    const scaledRect = getScaledRect(this.props.isEqualRatio, {
      x: oPoint.x,
      y: oPoint.y,
      width: oPoint.width,
      height: oPoint.height,
      scale,
    });
    const transformedRotateRect = transform(scaledRect, oPoint.rotate);
    // 计算到平移后的新坐标
    const translatedX = oTransformedRect.point[baseIndex].x - transformedRotateRect.point[baseIndex].x + transformedRotateRect.left;
    const translatedY = oTransformedRect.point[baseIndex].y - transformedRotateRect.point[baseIndex].y + transformedRotateRect.top;

    // 计算平移后元素左上角的坐标
    const newX = translatedX + transformedRotateRect.width / 2 - scaledRect.width / 2;
    const newY = translatedY + transformedRotateRect.height / 2 - scaledRect.height / 2;

    // 缩放后元素的高宽
    const newWidth = scaledRect.width;
    const newHeight = scaledRect.height;

    return {
      x: newX,
      y: newY,
      width: newWidth,
      height: newHeight,
    };
  }

  /**
   * 重绘视图
   * @return {[type]} [description]
  */
  handleDraw = () => {
    const { position } = this;
    this.handleCss(this.tranContainerEl, {
      left: `${position.x}px`,
      top: `${position.y}px`,
      width: `${position.width}px`,
      height: `${position.height}px`,
      transform: `rotate(${position.rotate}deg)`,
    });
    this.handleActualChange();
  }
  handleSetCursorStyle = (degree) => {
    const cursorStyle = this.handleGetNewCursorArray(degree);
    this.handleCss(this.pointtEl, { cursor: cursorStyle[0] });
    this.handleCss(this.pointtrEl, { cursor: cursorStyle[1] });
    this.handleCss(this.pointrEl, { cursor: cursorStyle[2] });
    this.handleCss(this.pointbrEl, { cursor: cursorStyle[3] });
    this.handleCss(this.pointbEl, { cursor: cursorStyle[4] });
    this.handleCss(this.pointblEl, { cursor: cursorStyle[5] });
    this.handleCss(this.pointlEl, { cursor: cursorStyle[6] });
    this.handleCss(this.pointtlEl, { cursor: cursorStyle[7] });
  }

  /**
   * 获取点的鼠标手势
   * @param  {[type]} degree [description]
   * @return {[type]}        [description]
  */
  handleGetNewCursorArray = (rotate) => {
    const cursorStyleArray = ['ns-resize', 'nesw-resize', 'ew-resize', 'nwse-resize', 'ns-resize', 'nesw-resize', 'ew-resize', 'nwse-resize'];

    const ARR_LENGTH = 8;
    const STEP = 45;

    let startIndex = 0;

    const degree = rotate < 0 ? 360 + rotate : rotate;
    if (degree) {
      startIndex = Math.floor(degree / STEP);
      if (degree % STEP > (STEP / 2)) {
        startIndex += 1;
      }
    }

    if (startIndex > 1) {
      const len = ARR_LENGTH - startIndex;
      return (cursorStyleArray.slice(startIndex, startIndex + len)).concat(cursorStyleArray.slice(0, startIndex));
    }

    return cursorStyleArray;
  }

  handleCss = (node, ops) => {
    const el = node;
    // eslint-disable-next-line
    for (const index in ops) {
      el.style[index] = ops[index];
    }
  }

  handleActualChange = () => {
    const { cbActualChange } = this.props;
    if (cbActualChange) cbActualChange(this.position);
  }

  handleMouseUp = () => {
    const { cbMouseUp } = this.props;
    if (cbMouseUp) cbMouseUp(this.position);
  }

  render() {
    const { children } = this.props;
    return (
      <TranContainer ref={(ref) => this.tranContainerEl = ref}>
        <RotateBtn ref={(ref) => this.rotateEl = ref}><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSItNzE5MyA0MjM2IDQ0IDQ0Ij4KICA8ZGVmcz4KICAgIDxzdHlsZT4KICAgICAgLmNscy0xIHsKICAgICAgICBmaWxsOiAjM2EzYTNhOwogICAgICB9CgogICAgICAuY2xzLTIgewogICAgICAgIGZpbGw6ICNmZmY7CiAgICAgIH0KCiAgICAgIC5jbHMtMyB7CiAgICAgICAgZmlsdGVyOiB1cmwoI2VsbGlwc2UtMTQpOwogICAgICB9CiAgICA8L3N0eWxlPgogICAgPGZpbHRlciBpZD0iZWxsaXBzZS0xNCIgeD0iLTcxOTMiIHk9IjQyMzYiIHdpZHRoPSI0NCIgaGVpZ2h0PSI0NCIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIj4KICAgICAgPGZlT2Zmc2V0IGR5PSIzIiBpbnB1dD0iU291cmNlQWxwaGEiLz4KICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iMyIgcmVzdWx0PSJibHVyIi8+CiAgICAgIDxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAuMTYxIi8+CiAgICAgIDxmZUNvbXBvc2l0ZSBvcGVyYXRvcj0iaW4iIGluMj0iYmx1ciIvPgogICAgICA8ZmVDb21wb3NpdGUgaW49IlNvdXJjZUdyYXBoaWMiLz4KICAgIDwvZmlsdGVyPgogIDwvZGVmcz4KICA8ZyBpZD0iR3JvdXBfMTY4IiBkYXRhLW5hbWU9Ikdyb3VwIDE2OCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgwNzMgNDAwOCkiPgogICAgPGcgY2xhc3M9ImNscy0zIiB0cmFuc2Zvcm09Im1hdHJpeCgxLCAwLCAwLCAxLCA4MDczLCAtNDAwOCkiPgogICAgICA8Y2lyY2xlIGlkPSJlbGxpcHNlLTE0LTIiIGRhdGEtbmFtZT0iZWxsaXBzZS0xNCIgY2xhc3M9ImNscy0xIiBjeD0iMTMiIGN5PSIxMyIgcj0iMTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03MTg0IDQyNDIpIi8+CiAgICA8L2c+CiAgICA8ZyBpZD0iZ3JvdXAtMTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDg5NS40OTIgMjQwLjMwNikiPgogICAgICA8ZyBpZD0iZ3JvdXAiPgogICAgICAgIDxwYXRoIGlkPSJwYXRoIiBjbGFzcz0iY2xzLTIiIGQ9Ik0xMi44Myw4Ljg2N2E2LjYxNSw2LjYxNSwwLDEsMS0xLjc4NC03LjE2aDBMMTIuMzM3LjQxM2MuMjMtLjIzLjQxNi0uMTUzLjQxNS4xNzNMMTIuNzM5LDMuODZhLjYuNiwwLDAsMS0uNTkyLjU5MmwtMy4yNTYuMDA2Yy0uMzI2LDAtLjQtLjE4Ni0uMTczLS40MTZsMS4zMjctMS4zMjhBNS4xOTUsNS4xOTUsMCwxLDAsMTEuNSw4LjM2N2guMDA2YS43MDkuNzA5LDAsMSwxLDEuMzIxLjVaIi8+CiAgICAgIDwvZz4KICAgIDwvZz4KICA8L2c+Cjwvc3ZnPgo=" alt="旋转" /></RotateBtn>
        <DraggableDiv ref={(ref) => this.draggableEl = ref}>{children || 'Children'}</DraggableDiv>
        <ResizableDiv>
          <PointTl draggable="true" ref={(ref) => this.pointtlEl = ref} onMouseDown={this.handleBindResizeEvents} />
          <PointT draggable="true" ref={(ref) => this.pointtEl = ref} onMouseDown={this.handleBindResizeEvents} />
          <PointTr draggable="true" ref={(ref) => this.pointtrEl = ref} onMouseDown={this.handleBindResizeEvents} />
          <PointR draggable="true" ref={(ref) => this.pointrEl = ref} onMouseDown={this.handleBindResizeEvents} />
          <PointBr draggable="true" ref={(ref) => this.pointbrEl = ref} onMouseDown={this.handleBindResizeEvents} />
          <PointB draggable="true" ref={(ref) => this.pointbEl = ref} onMouseDown={this.handleBindResizeEvents} />
          <PointBl draggable="true" ref={(ref) => this.pointblEl = ref} onMouseDown={this.handleBindResizeEvents} />
          <PointL draggable="true" ref={(ref) => this.pointlEl = ref} onMouseDown={this.handleBindResizeEvents} />
        </ResizableDiv>
      </TranContainer>
    );
  }
}

/**
 * children: 可变换的元素
 * position: 默认定位与尺寸 { x, y, height, width, rotate}
 * cbActualChange 实时改变回调
 * cbMouseUp 鼠标抬起时间回调(拖动结束)
 * isEqualRatio 上下左右是否等比
 */
TransRotateCom.defaultProps = {
  position: { x: 0, y: 0, height: 100, width: 100, rotate: 0 },
  isEqualRatio: false,
};
TransRotateCom.propTypes = {
  children: PropTypes.node,
  position: PropTypes.object.isRequired,
  cbActualChange: PropTypes.func,
  cbMouseUp: PropTypes.func,
  isEqualRatio: PropTypes.bool,
};
