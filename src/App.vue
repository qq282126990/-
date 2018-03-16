<template>
  <div class="vue-wrapper" :style="wrapperStyle">
    <div class="cell-container" v-for="(item, index) in displayItems">
      {{item.data}}
    </div>
  </div>
</template>

<script>
  import SectionManager from "./SectionManager"

  export default {
    data () {
      return {
        // 列表数据
        collection: new Array(1000).fill(0).map((_, index) => ({
          data: '#' + index
        })),
        height: 500,
        width: 500,
        displayItems: [],
        sectionSize: 300
      }
    },
    created () {
      // 获取块的管理
      this._sectionManager = new SectionManager(this.sectionSize);

      // 注册块和块的管理
      this.registerCellsToSectionManager();
    },
    computed: {
      wrapperStyle () {
        return {
          height: `${this.height}px`,
          width: `${this.height}px`
        }
      }
    },
    methods: {
      // 注册块和块的管理
      registerCellsToSectionManager () {
        // 如果_sectionManager中没有数据就创建一个
        if (!this._sectionManager) {
          this._sectionManager = new SectionManager(this.sectionSize);
        }

        // 我们需要去遍历去注册它,为每一个块都设置一个对应的信息方便用于查找他
        this.collection.forEach((item, index) => {
          // 注册块 -> 为每一个块都设置一个对应的信息
          this._sectionManager.registerCell({
            index,
            cellMetadatum: this.cellSizeAndPositionGetter(item, index)
          })
        });
      },
      // 我们需要一个方法去计算这些块的信息 -> 用于计算每一个块显示的大小和显示的位置
      cellSizeAndPositionGetter (item, index) {
        // 计算大小和位置
        return {
          width: 100,
          height: 150,
          x: (index % 2 * 110),
          y: parseInt(index / 2) * 160
        }
      }
    }
  }
</script>

<style>
  .vue-wrapper {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }

  .vue-wrapper-container {
    position: relative;
  }

  .cell-container {
    position: absolute;
    top: 0;
  }
</style>
