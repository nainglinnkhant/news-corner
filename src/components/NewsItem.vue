<template>
     <div class="col-12 col-xs-6 col-md-4 col-lg-3">
          <div class="news-item" @click="goToSource">
               <div class="news-img">
                    <object :data="newsImage" type="image/jpg" class="img-responsive" >
                         <img
                              src="https://i.stack.imgur.com/y9DpT.jpg"
                              :alt="news.title"
                              class="img-responsive"
                         />
                    </object>
               </div>

               <div class="news-info">
                    <h2 class="news-title">{{ news.title }}</h2>

                    <p class="news-description">{{ trimmedDes }}</p>
               </div>
          </div>
     </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { getViewWidth, trimDescription } from '../utils/utils'

export default {
     props: ['news'],
     setup(props) {
          const viewWidth = ref(getViewWidth())

          const newsImage = computed(() => {
               return props.news.urlToImage? props.news.urlToImage : 'https://i.stack.imgur.com/y9DpT.jpg'
          })

          const trimmedDes = computed(() => {
               return trimDescription(props.news.title.length ,props.news.description, viewWidth.value)
          })

          const resizeHandler = () => {
               viewWidth.value = getViewWidth()
          }

          onMounted(() => {
               window.addEventListener('resize', resizeHandler)
          })

          onBeforeUnmount(() => {
               window.removeEventListener('resize', resizeHandler)
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