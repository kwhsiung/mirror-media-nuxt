<template>
  <div class="subscribe-magazine-page">
    <template
      v-if="resultStatus === 'order-fail' || resultStatus === 'payment-fail'"
    >
      <SubscribeStepProgress :currentStep="2" />
      <SubscribeFail :resultStatus="resultStatus" :orderId="orderId" />
    </template>

    <template v-if="resultStatus === 'success'">
      <SubscribeStepProgress :currentStep="3" />
      <SubscribeSuccess
        :orderInfo="orderInfo"
        :orderInfoPurchasedList="orderInfoPurchasedList"
        :customerInfo="customerInfo"
      />
    </template>
  </div>
</template>

<script>
import SubscribeStepProgress from '~/components/SubscribeStepProgress.vue'
import SubscribeFail from '~/components/SubscribeFail.vue'
import SubscribeSuccess from '~/components/SubscribeSuccess.vue'
export default {
  middleware({ store, redirect }) {
    const resultStatus = store.getters['subscribe/getResultStatus']
    if (
      resultStatus !== 'success' &&
      resultStatus !== 'order-fail' &&
      resultStatus !== 'payment-fail'
    ) {
      redirect('/subscribe')
    }
  },
  components: {
    SubscribeStepProgress,
    SubscribeFail,
    SubscribeSuccess,
  },
  provide: {
    subscribeFailButtonLink: '/subscribe',
  },
  data() {
    return {
      currentStep: 3,
    }
  },
  computed: {
    resultStatus() {
      return this.$store.getters['subscribe/getResultStatus']
    },
    orderInfo() {
      const orderInfo = this.$store.getters['subscribe/getOrderInfo']
      const { MerchantOrderNo } = this.$store.getters[
        'subscribe/getInfoPayload'
      ]

      return {
        ...orderInfo,
        orderId: MerchantOrderNo,
      }
    },
    orderInfoPurchasedList() {
      return [
        {
          text: `${this.orderInfo.item_desc} X ${this.orderInfo.amount}`,
          price: this.orderInfo.price,
        },
        {
          text: '運費',
          price: this.orderInfo.delivery === '限時掛號' ? 20 : 0,
        },
        {
          text: '總計',
          price: this.orderInfo.price_total,
        },
      ]
    },
    customerInfo() {
      /* eslint-disable camelcase */
      const {
        pur_name = '',
        pur_mail = '',
        pur_cell = '',
        rec_name = '',
        rec_cell = '',
        rec_addr = '',
      } = this.$store.getters['subscribe/getOrderInfo']
      return {
        pur_name,
        pur_mail,
        pur_cell,
        rec_name,
        rec_cell,
        rec_addr,
      }
    },
    orderId() {
      const { MerchantOrderNo } = this.$store.getters[
        'subscribe/getInfoPayload'
      ]
      return MerchantOrderNo
    },
  },
  destroyed() {
    // turn off result page's access after leaving this page
    this.$store.dispatch('subscribe/updateResultStatus', 'pending')
  },
}
</script>

<style lang="scss" scoped></style>
