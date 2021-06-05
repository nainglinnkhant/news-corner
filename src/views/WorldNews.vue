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

                    <div id="scroll-trigger">
                         <p v-if="nextPageLoading">Loading...</p>
                    </div>
               </div>
          </div>
     </div>
</template>

<script>
import { computed, ref, watchEffect, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import NewsItem from '../components/NewsItem'
import useFetchNews from '../hooks/fetchNews.js'
import useScrollTrigger from '../hooks/scrollTrigger.js'

export default {
     props: ['country'],
     components: {
          NewsItem
     },
     setup(props) {
          const countryCodes = {
               ae: ['united arab emirates', 'uae'],
               ar: ['argentina'],
               at: ['austria'],
               au: ['australia'],
               be: ['belgium'],
               bg: ['bulgaria'],
               br: ['brazil'],
               ca: ['canada'],
               ch: ['switzerland'],
               cn: ['china'],
               co: ['colombia'],
               cu: ['cuba'],
               cz: ['czech', 'czechia'],
               de: ['germany'],
               eg: ['egypt'],
               fr: ['france'],
               gb: ['united kingdom', 'uk'],
               gr: ['greece'],
               hk: ['hong kong'],
               hu: ['hungary'],
               id: ['indonesia'],
               ie: ['ireland'],
               il: ['israel'],
               in: ['india'],
               it: ['italy'],
               jp: ['japan'],
               kr: ['south korea', 'korea'],
               lt: ['lithuania'],
               lv: ['latvia'],
               ma: ['morocco'],
               mx: ['mexico'],
               my: ['malaysia'],
               ng: ['nigeria'],
               nl: ['netherlands'],
               no: ['norway'],
               nz: ['new zealand'],
               ph: ['philippines'],
               pl: ['poland'],
               pt: ['portugal'],
               ro: ['romania'],
               rs: ['serbia'],
               ru: ['russia'],
               sa: ['saudi arabia'],
               se: ['sweden'],
               sg: ['singapore'],
               si: ['slovenia'],
               sk: ['slovakia'],
               th: ['thailand'],
               tr: ['turkey'],
               tw: ['taiwan'],
               ua: ['ukraine'],
               us: ['united states', 'us'],
               ve: ['venezuela'],
               za: ['south africa']
          }

          const searchWord = ref('')

          const store = useStore()
          const router = useRouter()

          const countryCode = computed(() => props.country)

          const countryName = computed(() => countryCodes[props.country][0])

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
          
          function search() {
               if(!searchWord.value) return
               router.push(`/world/${convertCountryCode(searchWord.value)}`)
          }

          function convertCountryCode(countryName) {
               for(const countryCode in countryCodes) {
                    // if(countryCodes[countryCode] === countryName.toLowerCase()) return countryCode
                    if(countryCodes[countryCode].some(name => name === countryName.toLowerCase())) return countryCode
               }
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
               countryName,
               label,
               countryNews,
               isLoading,
               errorMessage,
               searchWord,
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