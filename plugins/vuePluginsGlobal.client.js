import Vue from 'vue'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import GPTAD from './gpt-ad'

import { GPT_MODE, IS_AD_DISABLE } from '~/configs/config'

Vue.use(VueAwesomeSwiper)

Vue.use(GPTAD, {
  adNetwork: '40175602',
  mode: GPT_MODE,
  isAdDisable: IS_AD_DISABLE,
})
