<template>
  <div class="vue-wrapper" :style="wrapperStyle" @scroll.passive="onScroll" ref="VueWrapper">
    <div class="vue-wrapper-container" :style="scrollHeight">
      <div class="cell-container" v-for="(item, index) in displayItems" :style="getComputedStyle(item, index)">
        {{item.data}}
      </div>
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

      // 创建一个方法用于把当前试图应该渲染出来的块给渲染出来
      this.flushDisplayItems();
    },
    computed: {
      wrapperStyle () {
        return {
          height: this.height + 'px',
          width: this.width + 'px'
        }
      },
      // 创建滚动区域
      scrollHeight () {
        let scrollHeight = 0;
        let scrollWidth = 0;

        // 遍历循环计算出滚动区域的总宽度和总高度
        this._sectionManager._cellMetadata.forEach((sizeAndPosition) => {
          const {x, y, width, height} = sizeAndPosition;
          const bottom = y - height;
          const right = x - width;

          if (bottom > scrollHeight) {
            scrollHeight = bottom
          }
          if (right > scrollWidth) {
            scrollWidth = right
          }
        });

        return {
          height: scrollHeight + 'px',
          width: scrollWidth + 'px'
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
          });
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
      },
      // 设置当前视图我们中应该显示那些块
      flushDisplayItems () {
        let scrollTop = 0;
        let scrollLeft = 0;

        // 设置可以滚动的高度和宽度
        if (this.$refs.VueWrapper) {
          scrollTop = this.$refs.VueWrapper.scrollTop;
          scrollLeft = this.$refs.VueWrapper.scrollLeft;
        }

        // 然后这里我们需要去设置当前视图中应该渲染那些块
        // 于是我们要在 SectionManager类中定义一个方法去获取需要渲染的那个块的索引
        let index = this._sectionManager.getCellIndex({
          height: this.height,
          width: this.width,
          x: scrollLeft,
          y: scrollTop
        });
        // 到这里我们已经获取到了索引了,然后我们就可以去渲染该视图所对应的块了
        const displayItems = [];
        index.forEach((index) => {
          displayItems.push({
            index,
            ...this.collection[index]
          });
        });

        if (window.requestAnimationFrame) {
          window.requestAnimationFrame(() => {
            this.displayItems = displayItems;

            // 强制更新当前组件（以及 Slot 里面的組件，但不包含全部子組件 )
            this.$forceUpdate();
          })
        } else {
          this.displayItems = displayItems;

          // 强制更新当前组件（以及 Slot 里面的組件，但不包含全部子組件 )
          this.$forceUpdate();
        }
      },
      onScroll(e) {
        this.flushDisplayItems();
      },
      // 获取到视图应该渲染那些块之外我们还需要设置这些块所应该在的位置
      getComputedStyle(displayItem) {
        if (!displayItem) {
          return;
        }

        const { width, height, x, y } = this._sectionManager._cellMetadata[displayItem.index];

        return {
          left: `${x}px`,
          top: `${y}px`,
          width: `${width}px`,
          height: `${height}px`
        }
      }
    },
    watch: {
      // 监听数据的变化重新重新注册块进行渲染
      collection() {
        this._sectionManager = new SectionManager(this.sectionSize)
        this.registerCellsToSectionManager();
        this.flushDisplayItems();
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
