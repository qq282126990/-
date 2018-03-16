/**
   *窗口的显示部分 -> 当前viewPort显示的部分。
   *把cell(块)组合起来显示在当前的窗口。
   *这使我们能够更快地确定在窗口的给定区域显示哪些单元格。
   *显示具有固定的大小，并包含0到多个块（由其索引跟踪）。
 */

export default class Section {
  constructor ({width, height, x, y}) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    // 收集当前应该显示那些块
    this._indexMap = {};

    // 收集当前需要显示块的索引
    this._indices = [];
  }

  // 有添加就有获取

  // 添加块的索引
  addCellIndex ({index}) {
    if (!this._indexMap[index]) {
      // 收集当前应该显示那些块
      this._indexMap[index] = true;
      // 收集当前需要显示块的索引并保持它们
      this._indices.push(index);
    }
  }

  // 获取块的
  getCellIndex () {
    this._indices;
  }
}
