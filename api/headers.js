const { PREVIEW_QUERY, ENV, API_PATH_FRONTEND } = require('../configs/config')

module.exports = function handleHeaders(req, res, next) {
  const { hostname, url } = req

  if (
    ['local', 'dev'].includes(ENV) ||
    /keystone/gs.test(hostname) ||
    /^\/(video_category|externals)\//gs.test(url) ||
    new RegExp(PREVIEW_QUERY, 'gs').test(url) ||
    // membership page paths
    /(login|finishSignUp|profile|cancelMembership|premium|magazine)/gs.test(
      url
    ) ||
    // membership api paths
    new RegExp(`/${API_PATH_FRONTEND}/membership`, 'gs').test(url) ||
    new RegExp(`/${API_PATH_FRONTEND}/saleor`, 'gs').test(url)
  ) {
    res.setHeader('Cache-Control', 'no-store')

    return next()
  }

  const isDefaultListingPages = /^\/(section|category|topic|search|author|tag)\//gs.test(
    url
  )
  if (isDefaultListingPages) {
    res.setHeader('Cache-Control', `public, max-age=${60 * 5}`)

    return next()
  }

  res.setHeader('Cache-Control', `public, max-age=${60 * 10}`)

  return next()
}
