import { computed } from 'vue'

export default function useScrollTrigger (currentPage, totalResults) {
     const pageCount = computed(() => totalResults.value / 20)
     
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

     return {
          scrollTrigger
     }
}