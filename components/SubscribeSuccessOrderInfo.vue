<template>
  <div class="order-info">
    <div class="order-info__order">
      <div class="order-info__order_title">訂單資訊</div>
      <div class="order-info__order_content">
        <SubscribeSuccessOrderInfoContentRow
          class="order-id"
          title="訂單編號"
          :data="orderInfo.orderId"
        />
        <!-- <SubscribeSuccessOrderInfoContentRow
          title="續訂戶代碼"
          data="窩不知道"
        /> -->
        <SubscribeSuccessOrderInfoContentRow
          title="訂單日期"
          :data="orderDate"
        />
        <SubscribeSuccessOrderInfoContentRowPurchasedList
          title="訂單內容"
          :perchasedList="orderInfoPurchasedList"
          class="order-info__order_content_perchased"
        />
      </div>
    </div>
    <div v-if="shouldShowCustomerInfo" class="order-info__user">
      <div class="order-info__user_title">顧客資訊</div>
      <div class="order-info__user_content">
        <div class="order-info__user_content_title">訂購人</div>
        <SubscribeSuccessOrderInfoContentRow
          class="pur_name"
          title="姓名"
          :data="customerInfo.pur_name"
        />
        <SubscribeSuccessOrderInfoContentRow
          class="pur_mail"
          title="電子信箱"
          :data="customerInfo.pur_mail"
        />
        <SubscribeSuccessOrderInfoContentRow
          class="pur_cell"
          title="聯絡電話"
          :data="customerInfo.pur_cell"
        />
      </div>
      <div class="order-info__user_content">
        <div class="order-info__user_content_title">收件人</div>
        <SubscribeSuccessOrderInfoContentRow
          class="rec_name"
          title="姓名"
          :data="customerInfo.rec_name"
        />
        <SubscribeSuccessOrderInfoContentRow
          class="rec_cell"
          title="聯絡電話"
          :data="customerInfo.rec_cell"
        />
        <SubscribeSuccessOrderInfoContentRow
          class="rec_addr"
          title="通訊地址"
          :data="customerInfo.rec_addr"
        />
        <!-- <SubscribeSuccessOrderInfoContentRow
          title="派送備註"
          data="orderInfo.rec_remark"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import SubscribeSuccessOrderInfoContentRow from '~/components/SubscribeSuccessOrderInfoContentRow.vue'
import SubscribeSuccessOrderInfoContentRowPurchasedList from '~/components/SubscribeSuccessOrderInfoContentRowPurchasedList.vue'

export default {
  components: {
    SubscribeSuccessOrderInfoContentRow,
    SubscribeSuccessOrderInfoContentRowPurchasedList,
  },
  props: {
    orderInfo: {
      type: Object,
      isRequired: true,
      default: () => {
        return {}
      },
    },
    orderInfoPurchasedList: {
      type: Array,
      default: () => [],
    },
    customerInfo: {
      type: Object,
      default: () => {
        return {
          pur_name: '',
          pur_mail: '',
          pur_cell: '',
          rec_name: '',
          rec_cell: '',
          rec_addr: '',
        }
      },
    },
    filteredPerchasedPlan: {
      type: Array,
      default: () => [],
    },
    shipCost: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    orderDate() {
      const now = new Date()
      return dayjs(now).format('YYYY-MM-DD')
    },
    shouldShowCustomerInfo() {
      const isAnyValueInCustomInfoTruthy = Object.values(
        this.customerInfo
      ).reduce(function reduceWithAnyTruthy(acc, curr) {
        return acc || curr
      }, false)
      return isAnyValueInCustomInfoTruthy
    },
  },
}
</script>

<style lang="scss" scoped>
.order-info {
  position: relative;
  padding: 16px;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: rgba(0, 0, 0, 0.87);
  font-size: 16px;

  & > * + * {
    margin-top: 42px;
  }

  @include media-breakpoint-up(sm) {
    padding: 22px 25px;
  }
  @include media-breakpoint-up(xl) {
    padding: 24px;
    font-size: 18px;
  }
}

.order-info__order_title,
.order-info__user_title {
  font-size: 22px;

  @include media-breakpoint-up(sm) {
    font-size: 26px;
  }
}

.order-info__user_content_title {
  font-size: 18px;
  margin-bottom: 18px;
}

.order-info__order_content,
.order-info__user_content {
  margin-top: 24px;
}

.order-info__order_content_perchased {
  display: block;
  @include media-breakpoint-up(sm) {
    display: flex;
  }
}
</style>
