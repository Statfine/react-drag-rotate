/**
 * 获取旋转指定角度后的rect
 * @param  {[type]} options rect
 * @param  {[type]} angle   旋转角度
 * @return {[type]}
 */
export function transform(options, angle) {
  const x = options.x;
  const y = options.y;
  const width = options.width;
  const height = options.height;
  console.log('options', options, angle);

  const r = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
  const a = Math.round(Math.atan(height / width) * 180 / Math.PI);
  const tlbra = 180 - angle - a;
  const trbla = a - angle;
  const ta = 90 - angle;
  const ra = angle;

  const halfWidth = width / 2;
  const halfHeight = height / 2;

  const middleX = x + halfWidth;
  const middleY = y + halfHeight;

  const topLeft = {
    x: middleX + r * Math.cos(tlbra * Math.PI / 180),
    y: middleY - r * Math.sin(tlbra * Math.PI / 180),
  };
  const top = {
    x: middleX + halfHeight * Math.cos(ta * Math.PI / 180),
    y: middleY - halfHeight * Math.sin(ta * Math.PI / 180),
  };
  const topRight = {
    x: middleX + r * Math.cos(trbla * Math.PI / 180),
    y: middleY - r * Math.sin(trbla * Math.PI / 180),
  };
  const right = {
    x: middleX + halfWidth * Math.cos(ra * Math.PI / 180),
    y: middleY + halfWidth * Math.sin(ra * Math.PI / 180),
  };
  const bottomRight = {
    x: middleX - r * Math.cos(tlbra * Math.PI / 180),
    y: middleY + r * Math.sin(tlbra * Math.PI / 180),
  };
  const bottom = {
    x: middleX - halfHeight * Math.sin(ra * Math.PI / 180),
    y: middleY + halfHeight * Math.cos(ra * Math.PI / 180),
  };
  const bottomLeft = {
    x: middleX - r * Math.cos(trbla * Math.PI / 180),
    y: middleY + r * Math.sin(trbla * Math.PI / 180),
  };
  const left = {
    x: middleX - halfWidth * Math.cos(ra * Math.PI / 180),
    y: middleY - halfWidth * Math.sin(ra * Math.PI / 180),
  };
  const minX = Math.min(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
  const maxX = Math.max(topLeft.x, topRight.x, bottomRight.x, bottomLeft.x);
  const minY = Math.min(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
  const maxY = Math.max(topLeft.y, topRight.y, bottomRight.y, bottomLeft.y);
  return {
    point: [topLeft, top, topRight, right, bottomRight, bottom, bottomLeft, left],
    width: maxX - minX,
    height: maxY - minY,
    left: minX,
    right: maxX,
    top: minY,
    bottom: maxY,
  };
}

/**
 * 取得缩放指定倍数后的坐标
 * @param  {[type]} isEqualRatio    是否等比
 * @param  {[type]} params    rect
 * @param  {[type]} baseIndex 基点索引
 */
export function getScaledRect(isEqualRatio, params, baseIndex) {
  const { x, y, width, height, scale } = params;
  const offset = {
    x: 0,
    y: 0,
  };
  // const ratio = width / height;
  let deltaXScale = scale.x - 1; // 增加比例
  let deltaYScale = scale.y - 1;
  // var deltaYScale = deltaXScale; // 是否缩放在此控制
  // console.log('deltaXScale', deltaXScale);
  // console.log('deltaYScale', deltaYScale);
  // console.log('deltaYScale', ratio, params, scale.x, scale.y);
  // deltaXScale=0 或者 deltaYScale=0 表示不是4个顶点
  if (isEqualRatio && (deltaXScale === 0 || deltaYScale === 0) && (deltaXScale !== deltaYScale)) {
    if (deltaXScale === 0) deltaXScale = deltaYScale; // 宽度增加多少，高度等比增加多少
    if (deltaYScale === 0) deltaYScale = deltaXScale;
  }
  const deltaWidth = width * deltaXScale;
  const deltaHeight = height * deltaYScale;
  const newWidth = width + deltaWidth;
  const newHeight = height + deltaHeight;
  const newX = x - deltaWidth / 2;
  const newY = y - deltaHeight / 2;
  if (baseIndex) {
    const points = [{ x, y }, { x: x + width, y }, { x: x + width, y: y + height }, { x, y: y + height }];
    const newPoints = [{ x: newX, y: newY }, { x: newX + newWidth, y: newY }, { x: newX + newWidth, y: newY + newHeight }, { x: newX, y: newY + newHeight }];
    offset.x = points[baseIndex].x - newPoints[baseIndex].x;
    offset.y = points[baseIndex].y - newPoints[baseIndex].y;
  }
  return {
    x: newX + offset.x,
    y: newY + offset.y,
    width: newWidth,
    height: newHeight,
  };
}

export const getStartPoint = (x1, y1, currentDeg, cx, cy) => {
  const degToRad = currentDeg * Math.PI / 180;
  const sx = x1 * Math.cos(degToRad) - y1 * Math.sin(degToRad) + cx;
  const sy = x1 * Math.sin(degToRad) + y1 * Math.cos(degToRad) + cy;
  // return { sx, sy };
  return [sx, sy];
};

// 计算拖动点的坐标
export const getRectScalePoint = (startW, startH, dragStartL, dragStartT, deg) => {
  const startX = dragStartL; // 左上角 x 坐标 转动角度为 0
  const startY = dragStartT;// 左上角 y 坐标 转动角度为 0
  const cx = startX + startW / 2; // 中心点 x 坐标
  const cy = startY + startH / 2; // 中心点 y 坐标
  const tr = {// rect四边形右上角 坐标 转动角度为 0
    sx: startX + startW,
    sy: startY,
  };
  const br = {// rect四变形 右下角 坐标 转动角度为 0
    sx: startX + startW,
    sy: startY + startH,
  };
  const bl = {// rect四变形  坐标 转动角度为 0
    sx: startX,
    sy: startY + startH,
  };
  // 计算初始角度 的八个拖动点 坐标
  const topLeft = getStartPoint(startX - cx, startY - cy, deg, cx, cy);

  const topRight = getStartPoint(tr.sx - cx, tr.sy - cy, deg, cx, cy);

  const bottomRight = getStartPoint(br.sx - cx, br.sy - cy, deg, cx, cy);

  const bottomLeft = getStartPoint(bl.sx - cx, bl.sy - cy, deg, cx, cy);
  return [
    topLeft,
    topRight,
    bottomLeft,
    bottomRight,
  ];
};
/**
 * 判断落点是否在区域内
 * 
 * @param {Array} point 落点坐标。 数组：[x, y]
 * @param {Array} rect 长方形坐标, 按顺序分别是：左上、右上、左下、右下。 
 *                     数组：[[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
 * 
 * @return {boolean} 
 */

export function isPointInRect(point, rect) {
  const [touchX, touchY] = point;
  // 长方形四个点的坐标
  const [[x1, y1], [x2, y2], [x3, y3], [x4, y4]] = getRectScalePoint(rect.width, rect.height, rect.x, rect.y, rect.rotate);
  // 四个向量
  const v1 = [x1 - touchX, y1 - touchY];
  const v2 = [x2 - touchX, y2 - touchY];
  const v3 = [x3 - touchX, y3 - touchY];
  const v4 = [x4 - touchX, y4 - touchY];
  const flag1 =  (v1[0] * v2[1] - v2[0] * v1[1]) > 0 ;
  const flag2 = (v2[0] * v4[1] -  v4[0] * v2[1]) > 0;
  const flag3 = (v4[0] * v3[1] - v3[0] * v4[1]) > 0;
  const flag4 = (v3[0] * v1[1] -  v1[0] * v3[1]) > 0;
  console.log('isPointInRect', flag1, flag2, flag3, flag4);
  if(
      (v1[0] * v2[1] - v2[0] * v1[1]) > 0 
      && (v2[0] * v4[1] -  v4[0] * v2[1]) > 0
      && (v4[0] * v3[1] - v3[0] * v4[1]) > 0
      && (v3[0] * v1[1] -  v1[0] * v3[1]) > 0
  ){
      return true;
  }
  return false;
}
