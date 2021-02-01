<template>
  <section class="section">
    <client-only>
      <ContainerGptAd :pageKey="currentSectionId" adKey="HD" />
    </client-only>
    <UiArticleList
      class="section__list"
      :listTitle="currentSectionTitle"
      :listTitleColor="currentSectionThemeColor"
      :listData="listDataFirstPage"
    >
      <template v-for="unit in microAdUnits" v-slot:[unit.name]>
        <MicroAd :key="unit.name" :unitId="unit.id" />
      </template>
    </UiArticleList>
    <client-only>
      <ContainerGptAd :pageKey="currentSectionId" adKey="FT" />
    </client-only>
    <UiArticleList
      v-show="showListDataLoadmorePage"
      class="section__list"
      :listData="listDataLoadmorePage"
    />
    <UiInfiniteLoading
      v-if="shouldMountInfiniteLoading"
      @infinite="infiniteHandler"
    />
    <UiStickyAd>
      <ContainerGptAd :pageKey="currentSectionId" adKey="MB_ST" />
    </UiStickyAd>
    <ContainerFullScreenAds />
  </section>
</template>

<script>
import _ from 'lodash'
import MicroAd from '~/components/MicroAd.vue'
import UiArticleList from '~/components/UiArticleList.vue'
import UiInfiniteLoading from '~/components/UiInfiniteLoading.vue'
import ContainerGptAd from '~/components/ContainerGptAd.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'
import styleVariables from '~/scss/_variables.scss'
import { MICRO_AD_UNITS } from '~/constants/ads.js'
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '~/constants'

export default {
  name: 'Externals',
  components: {
    MicroAd,
    UiArticleList,
    UiInfiniteLoading,
    ContainerGptAd,
    ContainerFullScreenAds,
    UiStickyAd,
  },
  async fetch() {
    const response = await this.fetchSectionListing({ page: 1 })
    this.setListData(response)
    this.setListDataTotal(response)
    this.listDataCurrentPage += 1
  },
  data() {
    return {
      listData_: [],
      listDataCurrentPage: 0,
      listDataMaxResults: 9,
      listDataTotal: undefined,
    }
  },
  computed: {
    currentSectionId() {
      return 'other'
    },
    currentSectionThemeColor() {
      const key = 'section-color-external'
      return styleVariables[key]
    },
    partnerName() {
      return this.$route.params.name
    },
    partnerStoreItems() {
      return this.$store.state?.partners?.data?.items ?? []
    },
    partnerData() {
      return (
        this.partnerStoreItems.find((partnerData) => {
          return partnerData.name === this.partnerName
        }) ?? {}
      )
    },
    partnerId() {
      return this.partnerData?.id ?? ''
    },
    currentSectionTitle() {
      return this.partnerData?.display ?? ''
    },
    listDataPageLimit() {
      if (this.listDataTotal === undefined) {
        return undefined
      }
      return Math.ceil(this.listDataTotal / this.listDataMaxResults)
    },

    /**
     * Constraint which prevent loadmore unexpectly
     * if we navigating on client-side
     * due to the list data of the first page has not been loaded.
     */
    shouldMountInfiniteLoading() {
      return this.listDataCurrentPage >= 1
    },

    listData() {
      return _.uniqBy(this.listData_, function identifyDuplicatedItemById(
        listItem
      ) {
        return listItem.id
      })
    },
    listDataFirstPage() {
      return this.listData.slice(0, this.listDataMaxResults)
    },
    listDataLoadmorePage() {
      return this.listData.slice(this.listDataMaxResults, Infinity)
    },
    showListDataLoadmorePage() {
      return this.listDataLoadmorePage.length > 0
    },

    microAdUnits() {
      return !this.isSectionMember ? MICRO_AD_UNITS.LISTING.RWD : []
    },
  },
  methods: {
    stripHtmlTag(html = '') {
      return html.replace(/<\/?[^>]+(>|$)/g, '')
    },
    mapDataToComponentProps(item) {
      return {
        id: item.id,
        href: `/external/${item.name}`,
        imgSrc: item.thumb,
        imgText: '合作媒體',
        imgTextBackgroundColor: '#fd9b18',
        infoTitle: item.title ?? '',
        infoDescription: this.stripHtmlTag(item.brief ?? ''),
      }
    },
    async fetchSectionListing({ page = 1 } = {}) {
      const response = await this.$fetchExternals({
        maxResults: this.listDataMaxResults,
        sort: '-publishedDate',
        partner: this.partnerId,
        page,
      })
      return response
    },
    setListData(response = {}) {
      let listData = response.items ?? []
      listData = listData.map(this.mapDataToComponentProps)
      this.listData_.push(...listData)
    },
    setListDataTotal(response = {}) {
      this.listDataTotal = response.meta?.total ?? 0
    },
    async infiniteHandler($state) {
      this.listDataCurrentPage += 1
      try {
        const response = await this.fetchSectionListing({
          page: this.listDataCurrentPage,
        })
        this.setListData(response)

        if (this.listDataCurrentPage >= this.listDataPageLimit) {
          $state.complete()
        } else {
          $state.loaded()
        }
      } catch (e) {
        $state.error()
      }
    },
  },
  head() {
    const title = `${this.currentSectionTitle} - ${SITE_TITLE}`
    const description = this.currentSectionData?.description || SITE_DESCRIPTION

    return {
      title,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: title,
        },
        {
          hid: 'twitter:title',
          name: 'twitter:title',
          content: title,
        },
        {
          hid: 'description',
          name: 'description',
          content: description,
        },
        {
          hid: 'og:description',
          name: 'og:description',
          content: description,
        },
        {
          hid: 'twitter:description',
          name: 'twitter:description',
          content: description,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${SITE_URL}/section/${this.$route.params.name}`,
        },
        {
          hid: 'section-name',
          name: 'section-name',
          content: this.currentSectionName,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '~/css/micro-ad/listing.scss';

.section {
  background-color: #f2f2f2;
  padding: 36px 0;
  @include media-breakpoint-up(md) {
    padding: 36px 25px 72px 25px;
  }
  @include media-breakpoint-up(xl) {
    max-width: 1024px;
    padding: 0;
    margin: auto;
  }
  &__ad {
    margin: 20px auto;
  }
  &__list {
    @include media-breakpoint-up(md) {
      margin: 8px 0 0 0;
    }
  }
}
</style>