<template>
  <view class="container product-list">
    <!--页面加载动画-->
    <rfLoading isFullScreen :active="loading"></rfLoading>
  </view>
</template>
<script>
import uniDrawer from '@/components/uni-drawer/drawer';
import rfTopDrawer from '@/components/rf-top-drawer';
import rfAttrContent from '@/components/rf-attr-content';
import rfProductList from '@/components/rf-product-list';
import rfLoadMore from '@/components/rf-load-more/rf-load-more';
import {
  cartItemCount,
  cartItemCreate,
  productDetail,
  productList,
  productCate,
  brandIndex
} from '@/api/product';
import { mapMutations } from 'vuex';
/* eslint-disable */
export default {
  components: {
    uniDrawer,
    rfProductList,
    rfAttrContent,
    rfLoadMore,
    rfTopDrawer
  },

  data() {
    return {
      loading: false
    };
  },
  onLoad(options) {}
};
</script>
<style lang="scss">
page {
  background: $page-color-base;
}
</style>
