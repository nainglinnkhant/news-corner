<template>
     <div class="mcw">
          <div class="container">
               <base-spinner v-if="isLoading"></base-spinner>

               <div class="error" v-if="errorMessage">
                    <p>{{ errorMessage }}</p>
               </div>

               <div class="main-content" v-if="!isLoading && !errorMessage">
                    <h3 class="label">{{ categoryName[0].toUpperCase() + categoryName.slice(1) }}</h3>

                    <div class="row">
                         <news-item 
                              v-for="news in categoryNews"
                              :key="news"
                              :news="news">
                         </news-item>
                    </div>

                    <div id="scroll-trigger">
                         <p v-if="nextPageLoading">Loading...</p>
                    </div>
               </div>
          </div>
     </div>
</template>

<script>
import { ref, computed, watchEffect, watch, onMounted } from 'vue'
import { useStore } from 'vuex'
import NewsItem from '../components/NewsItem'
import useFetchNews from '../hooks/fetchNews.js'
import useScrollTrigger from '../hooks/scrollTrigger.js'

export default {
     props: ['name'],
     components: {
          NewsItem
     },
     setup(props) {
          const store = useStore()

          const categoryName = computed(() => props.name)

          const categoryNews = computed(() => store.getters.getCategoryNews[categoryName.value]?.slice(2))

          const { isLoading, errorMessage, fetchNews, nextPageLoading } = useFetchNews()

          watchEffect(() => {
               errorMessage.value = ''

               if(categoryNews.value) return
               fetchNews({ type: 'category', name: categoryName.value, currentPage: 1 })
          })

          const savedCurrentPage = computed(() => {
               if(!store.getters.getCategoryNews[categoryName.value]) return 1
               return store.getters.getCategoryNews[categoryName.value][0]
          })

          const currentPage = ref(savedCurrentPage.value)

          const totalResults = computed(() => store.getters.getCategoryNews[categoryName.value][1])

          const { scrollTrigger } = useScrollTrigger(currentPage, totalResults)

          watch(currentPage, () => {
               if(currentPage.value === 1) return

               if(currentPage.value === savedCurrentPage.value) return

               fetchNews({ type: 'category', name: categoryName.value, currentPage: currentPage.value })
          })

          watch(categoryName, () => {
               currentPage.value = savedCurrentPage.value

               if(categoryNews.value) return

               setTimeout(() => {
                    scrollTrigger()
               }, 3000)
          })

          onMounted(() => {
               setTimeout(() => {
                    scrollTrigger()
               }, 3000)
          })

          return {
               categoryName,
               categoryNews,
               isLoading,
               errorMessage,
               nextPageLoading
          }
     }
}
</script>

<style scoped>
.row {
     margin-top: 10px;
     margin-bottom: 5px;
}
.error {
     margin-top: 20px;
}
</style>