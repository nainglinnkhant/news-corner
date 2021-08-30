import { createStore } from 'vuex'
import { setNewsObj } from '../utils/utils'

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
               const apiKey = process.env.VUE_APP_API_KEY

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
                    setNewsObj(state.latestNews, 'news', payload)
               }

               if(payload.type === 'search') {
                    setNewsObj(state.latestNews, payload.searchWord, payload)
               }
               
               if(payload.type === 'category') {
                    setNewsObj(state.categoryNews, payload.name, payload)
               }
               
               if(payload.type === 'world') {
                    setNewsObj(state.worldNews, payload.country, payload)
               }
          },
          clearCache(state) {
               state.latestNews = {}
          }
     },
})

export default store