<template>
     <div class="mcw">
          <div class="container">
               <the-searchbar :searchWord="searchWord" @change="changeSearchWord" @submit="search" />

               <base-spinner v-if="isLoading"></base-spinner>

               <div class="error" v-if="errorMessage">
                    <p>{{ errorMessage }}</p>
               </div>

               <div class="not-found" v-if="!isLoading && !errorMessage && countryNews.length === 0">
                    <p>No results found.</p>
               </div>

               <div class="main-content" v-if="!isLoading && !errorMessage && countryNews.length > 0">
                    <h3 class="label">{{ label }}</h3>

                    <div class="row items-list">
                         <news-item 
                              v-for="news in countryNews"
                              :key="news"
                              :news="news">
                         </news-item>
                    </div>

                    <scroll-trigger :nextPageLoading="nextPageLoading" />
               </div>
          </div>
     </div>
</template>

<script>
import { computed, ref, watchEffect, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import NewsItem from '../components/NewsItem'
import TheSearchbar from '../components/TheSearchbar'
import ScrollTrigger from '../components/ScrollTrigger'
import useFetchNews from '../hooks/fetchNews'
import useScrollTrigger from '../hooks/scrollTrigger'
import { COUNTRY_CODES, convertCountryCode } from '../utils/utils'

export default {
     props: ['country'],
     components: {
          NewsItem,
          TheSearchbar,
          ScrollTrigger
     },
     setup(props) {
          const searchWord = ref('')

          const store = useStore()
          const router = useRouter()

          const countryCode = computed(() => props.country)

          const countryName = computed(() => COUNTRY_CODES[props.country][0])

          const label = computed(() => {
               return countryName.value.split(' ').map(el => el[0].toUpperCase() + el.slice(1)).join(' ')
          })

          const countryNews = computed(() => store.getters.getWorldNews[countryCode.value]?.slice(2))

          const { isLoading, errorMessage, fetchNews, nextPageLoading } = useFetchNews()

          watchEffect(() => {
               errorMessage.value = ''
               
               if(countryNews.value) return
               fetchNews({ type: 'world', country: countryCode.value, currentPage: 1 })
          })

          const changeSearchWord = (searchWordValue) => {
               searchWord.value = searchWordValue
          }
          
          function search() {
               const trimmedSearchWord = searchWord.value.trim()
               if(!trimmedSearchWord) return
               router.push(`/world/${convertCountryCode(trimmedSearchWord)}`)
          }

          const savedCurrentPage = computed(() => {
               if(!store.getters.getWorldNews[countryCode.value]) return 1
               return store.getters.getWorldNews[countryCode.value][0]
          })

          const currentPage = ref(savedCurrentPage.value)

          const totalResults = computed(() => store.getters.getWorldNews[countryCode.value][1])

          const { scrollTrigger } = useScrollTrigger(currentPage, totalResults)

          watch(currentPage, () => {
               if(currentPage.value === 1) return

               if(currentPage.value === savedCurrentPage.value) return

               fetchNews({ type: 'world', country: countryCode.value, currentPage: currentPage.value })
          })

          watch(countryCode, (_, oldValue) => {
               currentPage.value = savedCurrentPage.value

               if(countryNews.value && store.getters.getWorldNews[oldValue]?.length > 2) return

               setTimeout(scrollTrigger, 3000)
          })

          return {
               countryName,
               label,
               countryNews,
               isLoading,
               errorMessage,
               searchWord,
               changeSearchWord,
               search,
               nextPageLoading
          }
     }
}
</script>

<style scoped>
h3 {
     margin: 0;
}
</style>