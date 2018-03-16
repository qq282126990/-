// 用于创建每一个块所包含的信息
import Section from "./Section";


// 默认视图大小 600
const SECTION_SIZE = 600;

export default class SectionManager {
  constructor (sectionSize = SECTION_SIZE) {
    // 设置默认视图大小
    this._sectionSize = sectionSize;

    // 收集所有块的数据
    this._cellMetadata = []
  }

  // 创建块
  registerCell ({cellMetadatum, index}) {
    // 收集所有块的数据
    this._cellMetadata[index] = cellMetadatum;
  }

}
