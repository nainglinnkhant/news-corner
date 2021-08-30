import { computed, onBeforeUnmount, onMounted } from 'vue'

export default function useScrollTrigger (currentPage, totalResults) {
     const pageCount = computed(() => Math.ceil(totalResults.value / 20))
     
     function scrollTrigger() {
          const observer = new IntersectionObserver((entries) => {
               entries.forEach(entry => {
                    if(entry.intersectionRatio > 0 && currentPage.value < pageCount.value && currentPage.value < 5) {
                         currentPage.value++
                    }
               })
          })
          
          if(!document.getElementById('scroll-trigger')) return 
          
          observer.observe(document.getElementById('scroll-trigger'))
     }

     let timer;

     onMounted(() => {
          timer = setTimeout(scrollTrigger, 3000)
     })

     onBeforeUnmount(() => {
          clearTimeout(timer)
     })

     return {
          scrollTrigger
     }
}