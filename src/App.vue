<template>
     <the-navbar></the-navbar>

     <!--msb: main sidebar-->
     <the-sidebar></the-sidebar>

     <!--main content wrapper-->
     <router-view></router-view>

     <div class="up-button">
          <button @click="goToTop"><i class="fas fa-arrow-up"></i></button>
     </div>
</template>

<script>
import TheNavbar from './components/TheNavbar'
import TheSidebar from './components/TheSidebar'

export default {
     name: 'App',
     components: {
          TheNavbar,
          TheSidebar
     },
     setup() {
          function goToTop() {
               window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
          }

          return {
               goToTop
          }
     },
     mounted() {
          document.querySelector('#msbo').addEventListener('click', function() {
               document.querySelector('body').classList.toggle('msb-x')
          })
     }
}
</script>

<style>
@import './style.css';

.up-button {
     position: fixed;
     bottom: 30px;
     right: 30px;
}
.up-button button {
     width: 40px;
     height: 40px;
     border-radius: 100%;
     background: #e91802;
     border: 0;
     color: #ffffff;
}
.label {
     font-size: 18px;
     color: #212121;
     border-left: 2px solid #e91802;
     border-radius: 0;
     text-align: left;
     display: inline-block;
}
.search-bar {
     margin-top: 20px;
     margin-bottom: 20px;
}
.search-btn {
     color: #e91802;
}
.search-btn:hover {
     background: #e91802;
     color: #ffffff;
}
.search-btn:focus, search-btn:active {
     outline: 0 !important;
     background: #ffffff;
     color: #e91802;
     border-color: #cccccc;
}
.items-list {
     margin-top: 20px;
}
#scroll-trigger {
     display: flex;
     justify-content: center;
     align-items: center;
     width: 100%;
     height: 80px;
}
</style>