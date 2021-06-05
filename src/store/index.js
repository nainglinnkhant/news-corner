import { createStore } from 'vuex'

const store = createStore({
     state() {
          return {
               latestNews: {},
               categoryNews: {},
               worldNews: {},
               recentSortBy: 'publishedAt'
          }
     },
     getters: {
          getLatestNews(state) {
               return state.latestNews
          },
          getCategoryNews(state) {
               return state.categoryNews
          },
          getWorldNews(state) {
               return state.worldNews
          },
          getRecentSortBy(state) {
               return state.recentSortBy
          }
     },
     actions: {
          async fetchNews (context, payload) {
               const apiKey = '7a27c80ebaf54106af6502648afe4070'

               let url 
               
               if(payload.type === 'latest') {
                    url = `https://newsapi.org/v2/everything?domains=bbc.co.uk&language=en&sortBy=${payload.sortBy}&page=${payload.currentPage}&apiKey=${apiKey}`
                    context.state.recentSortBy = payload.sortBy
               }

               if(payload.type === 'search') {
                    url = `https://newsapi.org/v2/everything?q=${payload.searchWord}&qInTitle=${payload.searchWord}&language=en&sortBy=${payload.sortBy}&page=${payload.currentPage}&apiKey=${apiKey}`
                    context.state.recentSortBy = payload.sortBy
               }

               if(payload.type === 'category') url = `https://newsapi.org/v2/top-headlines?category=${payload.name}&language=en&page=${payload.currentPage}&apiKey=${apiKey}`

               if(payload.type === 'world') url = `https://newsapi.org/v2/top-headlines?country=${payload.country}&language=en&page=${payload.currentPage}&apiKey=${apiKey}`

               const response = await fetch(url)
               
               const responseData = await response.json()

               if(!response.ok) {
                    const error = new Error(responseData.message)
                    throw error
               }
               
               context.commit('setNews', {
                    ...payload,
                    news: responseData.articles,
                    totalResults: responseData.totalResults
               })
          },
          clearData(context) {
               context.commit('clearCache')
          }
     },
     mutations: {
          setNews(state, payload) {
               if(payload.type === 'latest') {
                    if(payload.currentPage > 1) {
                         state.latestNews['news'][0] = payload.currentPage
                         state.latestNews['news'][1] = payload.totalResults
                         state.latestNews['news'] = [...state.latestNews['news'], ...payload.news]
                         return
                    }
                    state.latestNews['news'] = [payload.currentPage, payload.totalResults, ...payload.news]
               }

               if(payload.type === 'search') {
                    if(payload.currentPage > 1) {
                         state.latestNews[payload.searchWord][0] = payload.currentPage
                         state.latestNews[payload.searchWord][1] = payload.totalResults
                         state.latestNews[payload.searchWord] = [...state.latestNews[payload.searchWord], ...payload.news]
                         return
                    }
                    state.latestNews[payload.searchWord] = [payload.currentPage, payload.totalResults, ...payload.news]
               }
               
               if(payload.type === 'category') {
                    if(payload.currentPage > 1) {
                         state.categoryNews[payload.name][0] = payload.currentPage
                         state.categoryNews[payload.name][1] = payload.totalResults
                         state.categoryNews[payload.name] = [...state.categoryNews[payload.name], ...payload.news]
                         return
                    }
                    state.categoryNews[payload.name] = [payload.currentPage, payload.totalResults, ...payload.news]
               }
               
               if(payload.type === 'world') {
                    if(payload.currentPage > 1) {
                         state.worldNews[payload.country][0] = payload.currentPage
                         state.worldNews[payload.country][1] = payload.totalResults
                         state.worldNews[payload.country] = [...state.worldNews[payload.country], ...payload.news]
                         return
                    }
                    state.worldNews[payload.country] = [payload.currentPage, payload.totalResults, ...payload.news]
               }
          },
          clearCache(state) {
               state.latestNews = {}
          }
     },
})

export default store