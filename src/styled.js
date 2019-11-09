import styled from 'styled-components';

export const TranContainer = styled.div`
  transform: rotate(0deg);
  background: orange;
  position: absolute;
  user-select: none;
  z-index: 99;
`;

export const RotateBtn = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  top: -40px;
  left: 50%;
  margin-left: -15px;
`;

export const DraggableDiv = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  border: 2px dashed #FF8140;
  box-sizing: border-box;
`;

export const ResizableDiv = styled.div`
`;

export const ResizablePoint = styled.span`
  width: 15px;
  height: 15px;
  position: absolute;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #fff;
  background-color: #FF8140;
`;

export const PointTl = styled(ResizablePoint)`
  top: -7px;
  left: -7px;
  cursor: nwse-resize;
`;
export const PointT = styled(ResizablePoint)`
  top: -7px;
  left: 50%;
  margin-left: -7px;
  cursor: ns-resize;
`;
export const PointTr = styled(ResizablePoint)`
  top: -7px;
  right: -7px;
  cursor: nesw-resize;
`;
export const PointR = styled(ResizablePoint)`
  top: 50%;
  margin-top: -7px;
  right: -7px;
  cursor: ew-resize;
`;
export const PointBr = styled(ResizablePoint)`
  bottom: -7px;
  right: -7px;
  cursor: nwse-resize;
`;
export const PointB = styled(ResizablePoint)`
  bottom: -7px;
  left: 50%;
  margin-left: -7px;
  cursor: ns-resize;
`;
export const PointBl = styled(ResizablePoint)`
  bottom: -7px;
  left: -7px;
  cursor: nesw-resize;
`;
export const PointL = styled(ResizablePoint)`
  left: -7px;
  top: 50%;
  margin-top: -7px;
  cursor: ew-resize;
`;
