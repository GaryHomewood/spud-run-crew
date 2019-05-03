class Graph {
  constructor(dimens, data) {
    this.w = dimens.width;
    this.h = dimens.height;
    this.margin = { 
      top: dimens.top,
      right: dimens.right,
      bottom: dimens.bottom,
      left: dimens.left
    };
    this.data = data;
  }
}

export { Graph };