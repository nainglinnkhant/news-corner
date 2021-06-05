import { createRouter, createWebHistory } from 'vue-router'
import LatestNews from '../views/LatestNews.vue'

const WorldNews = () => import('../views/WorldNews.vue')
const CategoriesNews = () => import('../views/CategoriesNews.vue')
const NotFound = () => import('../views/NotFound.vue')

const router = createRouter({
     history: createWebHistory(),
     routes: [
          {
               path: '/',
               component: LatestNews,
          },
          {
               path: '/world/:country',
               component: WorldNews,
               props: true
          },
          {
               path: '/category/:name',
               component: CategoriesNews,
               props: true
          },
          {
               path: `/search/:q`,
               component: LatestNews,
               props: true 
          },
          {
               path: '/:notFound(.*)',
               component: NotFound
          }
     ]
})

export default router