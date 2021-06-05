import { ref } from 'vue'
import { useStore } from 'vuex'

export default function useFetchNews() {
     const isLoading = ref(false)
     const errorMessage = ref('')
     const nextPageLoading = ref(false)

     const store = useStore()

     async function fetchNews(payload) {
          if(payload.currentPage === 1) isLoading.value = true
          if(payload.currentPage > 1) nextPageLoading.value = true
          
          try {
               await store.dispatch('fetchNews', payload)
          }
          catch(error) {
               errorMessage.value = error.message
          }
          isLoading.value = false
          nextPageLoading.value = false
     }

     return {
          isLoading,
          errorMessage,
          fetchNews,
          nextPageLoading
     }
}