<template>
  <div class="fail">
    <div v-if="resultStatus === 'payment-fail'" class="fail__payment_fail">
      <div class="fail__payment_fail_message">
        信用卡付款失敗，請再次確認信用卡資訊，或更換信用卡完成訂購手續，謝謝！
      </div>
      <SubscribeFailWrapper :data="errorData" status="payment-fail" />
    </div>

    <div v-else class="fail__order_fail">
      <SubscribeFailWrapper
        message="訂單建立失敗，請再次下訂單，或聯繫客服專員（02-6633-3832 /
       service@mirrormedia.mg）協助。"
        status="order-fail"
      />
    </div>
  </div>
</template>

<script>
import SubscribeFailWrapper from '~/components/SubscribeFailWrapper.vue'
export default {
  components: {
    SubscribeFailWrapper,
  },
  props: {
    resultStatus: {
      type: String,
      isRequired: true,
      default: 'order-fail',
    },
    orderId: {
      type: String,
      isRequired: true,
      default: 'orderId',
    },
  },
  computed: {
    errorData() {
      return {
        orderId: this.orderId,
        message: 'WYZxxxxx 拒絕交易',
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.fail {
  font-size: 16px;
  line-height: 150%;
  color: rgba(0, 0, 0, 0.87);
  align-items: center;
  height: 50vh;
  max-width: 990px;
  margin: 0 auto;

  @include media-breakpoint-up(xl) {
    font-size: 18px;
  }
}

.fail__payment_fail_message {
  margin: 20px;
  @include media-breakpoint-up(xl) {
    margin: 48px 32px 32px;
  }
}

.fail__order_fail .fail-wrapper {
  margin: 0;
  padding: 27px 24px 24px 25px;
  @include media-breakpoint-up(sm) {
    margin: 47px;
    padding: 17px 25px 30px 25px;
  }
}
</style>
