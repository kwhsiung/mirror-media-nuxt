<template>
  <section class="section-topic">
    <ContainerList
      :fetchList="fetchList"
      :transformListItemContent="transformListItemContent"
      listTitle="Topic"
      listTitleColor="#bcbcbc"
    />

    <UiStickyAd :pageKey="sectionName" />
    <ContainerFullScreenAds />
  </section>
</template>

<script>
import ContainerList from '~/components/ContainerList.vue'
import ContainerFullScreenAds from '~/components/ContainerFullScreenAds.vue'
import UiStickyAd from '~/components/UiStickyAd.vue'

import { SITE_TITLE, SITE_URL } from '~/constants'
import { stripHtmlTags } from '~/utils/article.js'

export default {
  name: 'SectionTopic',
  components: {
    ContainerList,
    ContainerFullScreenAds,
    UiStickyAd,
  },

  data() {
    return {
      sectionName: 'other',
    }
  },

  methods: {
    async fetchList(page) {
      return await this.$fetchTopics({
        maxResults: 9,
        page,
      })
    },
    transformListItemContent(item = {}) {
      return {
        href: item.id ? `/topic/${item.id}` : '/',
        imgSrc: item.ogImage?.image?.resizedTargets?.mobile?.url,
        infoTitle: item.name ?? '',
        infoDescription:
          stripHtmlTags(item.brief?.html ?? '') || (item.ogDescription ?? ''),
      }
    },
  },

  head() {
    const title = `Topic - ${SITE_TITLE}`
    return {
      title,
      meta: [
        {
          hid: 'og:title',
          name: 'og:title',
          content: title,
        },
        {
          hid: 'og:url',
          property: 'og:url',
          content: `${SITE_URL}/section/topic`,
        },
        {
          hid: 'section-name',
          name: 'section-name',
          content: this.sectionName,
        },
      ],
    }
  },
}
</script>
