<template>
     <div class="mcw">
          <div class="container">
               <div class="row search-bar">
                    <div class="col-12 col-sm-8 col-md-6">
                         <form @submit.prevent="search" class="input-group">
                              <input
                                   v-model.trim="searchWord"
                                   type="text"
                                   class="form-control"
                                   placeholder="Search..."
                              >

                              <span class="input-group-btn" @click="search">
                                   <button class="search-btn btn btn-default" type="button">
                                        <i class="fas fa-search"></i>
                                   </button>
                              </span>
                         </form>
                    </div>
               </div>

               <base-spinner v-if="isLoading"></base-spinner>

               <div class="error" v-if="errorMessage">
                    <p>{{ errorMessage }}</p>
               </div>

               <div class="not-found" v-if="!isLoading && !errorMessage && latestNews.length === 0">
                    <p>No results found.</p>
               </div>

               <div class="main-content" v-if="!isLoading && !errorMessage && latestNews.length > 0">
                    <div class="sort-section">
                         <h3 class="label">Latest</h3>

                         <div class="sort-by">
                              <label for="sortBy">Sort By:</label>

                              <select name="sortBy" id="sortBy" v-model="sortBy">
                                   <option value="publishedAt">Published at</option>
                                   <option value="popularity">Popularity</option>
                                   <option value="relevancy">Relevancy</option>
                              </select>
                         </div>
                    </div>

                    <div class="row items-list">
                         <news-item
                              v-for="news in latestNews"
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
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import NewsItem from '../components/NewsItem'
import useFetchNews from '../hooks/fetchNews.js'
import useScrollTrigger from '../hooks/scrollTrigger.js'

export default {
     components: {
          NewsItem
     },
     setup() {
          const searchWord = ref('')

          const store = useStore()
          const router = useRouter()
          const route = useRoute()

          const sortBy = ref(store.getters.getRecentSortBy)

          const query = computed(() => route.params.q)

          const latestNews = computed(() => {
               if(!query.value) return store.getters.getLatestNews.news?.slice(2)

               return store.getters.getLatestNews[query.value]?.slice(2)
          })

          const { isLoading, errorMessage, fetchNews, nextPageLoading } = useFetchNews()

          // this watchEffect will actually be executed only the first time for each route
          watchEffect(() => {
               errorMessage.value = ''
               
               if(!query.value && !latestNews.value) {
                    fetchNews({ type: 'latest', sortBy: sortBy.value, currentPage: 1 })
                    return
               }
               if(query.value && !latestNews.value) {
                    fetchNews({ type: 'search', searchWord: query.value, sortBy: sortBy.value, currentPage: 1 })
                    return
               }
          })

          function search() {
               if(!searchWord.value) return
               router.push(`/search/${searchWord.value}`)
          }

          // window.addEventListener('popstate', () => {
          //      if(route.fullPath === '/') {
          //           latestNews.value || fetchNews({ type: 'latest', sortBy: sortBy.value })
          //           return
          //      }

          //      if(route.fullPath.slice(1, 7) !== 'search') return
          //      latestNews.value || fetchNews({ type: 'search', searchWord: route.params.q, sortBy: sortBy.value })
          // })

          const savedCurrentPage = computed(() => {
               if(!store.getters.getLatestNews.news && !store.getters.getLatestNews[query.value]) return 1

               if(!query.value) return store.getters.getLatestNews.news[0]

               return store.getters.getLatestNews[query.value] ? store.getters.getLatestNews[query.value][0] : 1
          })

          const currentPage = ref(savedCurrentPage.value)

          const totalResults = computed(() => {
               if(!query.value) return store.getters.getLatestNews['news'][1]

               return store.getters.getLatestNews[query.value][1]
          })

          const { scrollTrigger } = useScrollTrigger(currentPage, totalResults)

          watch(sortBy, () => {
               store.dispatch('clearData')

               currentPage.value = 1

               setTimeout(() => {
                    scrollTrigger()
               }, 3000)
          })

          watch(currentPage, () => {
               if(currentPage.value === 1) return

               if(currentPage.value === savedCurrentPage.value) return

               if(!query.value) {
                    fetchNews({ type: 'latest', sortBy: sortBy.value, currentPage: currentPage.value })
               }
               if(query.value) {
                    fetchNews({ type: 'search', searchWord: query.value, sortBy: sortBy.value, currentPage: currentPage.value })
               }
          })

          watch(query, (_, oldValue) => {
               searchWord.value = query.value
               currentPage.value = savedCurrentPage.value

               if(latestNews.value && store.getters.getLatestNews[oldValue]?.length > 2) return

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
               latestNews,
               isLoading,
               errorMessage,
               searchWord,
               search,
               sortBy,
               nextPageLoading
          }
     }
}
</script>

<style scoped>
h3 {
     margin: 0;
}
.sort-by {
     float: right;
}
label {
     color: #212121;
}
select {
     margin-left: 10px;
     padding: 3px;
     border-radius: 5px;
     border-color: #cccccc;
}
select:focus {
     outline: none;
}
</style>