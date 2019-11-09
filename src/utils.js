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
