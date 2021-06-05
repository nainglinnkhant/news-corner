<template>
     <div class="col-12 col-xs-6 col-md-4 col-lg-3">
          <div class="news-item" @click="goToSource">
               <div class="news-img">
                    <img :src="newsImage" alt="" class="img-responsive">
               </div>

               <div class="news-info">
                    <h2 class="news-title">{{ news.title }}</h2>

                    <p class="news-description">{{ trimmedDes }}</p>
               </div>
          </div>
     </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
     props: ['news'],
     setup(props) {
          const vw = ref(Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0));

          const newsImage = computed(() => props.news.urlToImage? props.news.urlToImage : 'https://i.stack.imgur.com/y9DpT.jpg')

          const trimmedDes = computed(() => {
               if(props.news.description) {
                    if(vw.value <= 576) return props.news.description

                    if(vw.value > 576 && props.news.title.length <= 73) {
                         return `${props.news.description.slice(0, 115).trim()}...`
                    }

                    if(vw.value > 576 && props.news.title.length > 130) {
                         return `${props.news.description.slice(0, 35).trim()}...`
                    }

                    if(vw.value > 576 && props.news.title.length > 105) {
                         return `${props.news.description.slice(0, 65).trim()}...`
                    }
                         
                    if(vw.value > 576 && props.news.title.length > 94) {
                         return `${props.news.description.slice(0, 75).trim()}...`
                    }

                    if(vw.value > 576 && props.news.title.length > 73) {
                         return `${props.news.description.slice(0, 90).trim()}...`
                    }
               }
               
               return ''
          })

          function goToSource() {
               window.open(props.news.url)
          }

          return {
               newsImage,
               trimmedDes,
               goToSource
          }
     }
}
</script>

<style scoped>
.news-item {
     height: 350px;
     overflow-y: hidden;
     background: #ffffff;
     margin-bottom: 20px;
     cursor: pointer;
     border-bottom: 2px solid #e91802;
}
.img-responsive {
     height: 165px;
     object-fit: cover;
     width: 100%;
}
.news-info {
     padding: 0 10px;
}
.news-title {
     font-size: 16px;
     color: #212121;
     font-weight: 700;
     margin-bottom: 15px;
}
.news-description {
     font-size: 14px;
     color: #4a4a4a;
}
@media (max-width: 576px) {
     .col-12 {
          width: 100%;
     }
     .news-item {
          height: 350px;
     }
}
</style>