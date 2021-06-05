<template>
     <div class="msb" id="msb">
          <nav class="navbar navbar-default" role="navigation">
               <div class="navbar-header">
                    <div class="brand-wrapper">
                         <div class="brand-name-wrapper">
                              <a class="navbar-brand" href="#">
                                   News Corner
                              </a>
                         </div>
                    </div>
               </div>

               <!-- Main Menu -->
               <div class="side-menu-container">
                    <ul class="nav navbar-nav">
                         <li><router-link class="home" to="/">Home</router-link></li>
                         <li><router-link class="world" to="/world/us">World</router-link></li>
                         <li><router-link to="/category/business">Business</router-link></li>
                         <li><router-link to="/category/entertainment">Entertainment</router-link></li>
                         <li><router-link to="/category/general">General</router-link></li>
                         <li><router-link to="/category/health">Health</router-link></li>
                         <li><router-link to="/category/science">Science</router-link></li>
                         <li><router-link to="/category/sports">Sports</router-link></li>
                         <li><router-link to="/category/technology">Technology</router-link></li>
                    </ul>
               </div>
          </nav>  
     </div>
</template>

<script>
export default {
     computed: {
          route() {
               return this.$route.fullPath
          }
     },
     methods: {
          changeNavColor(route) {
               setTimeout(() => {
                    document.querySelector('.home').style.color = route.includes('search') ? '#e91802' : '#5f5f5f'

                    document.querySelector('.world').style.color = route.includes('world') ? '#e91802' : '#5f5f5f'
               }, 500)
          }
     },
     watch: {
          route: function(newValue) {
               this.changeNavColor(newValue)
          }
     },
     mounted() {
          this.changeNavColor(this.$route.fullPath)
     }
}
</script>

<style scoped>
.msb {
     width: 200px;
     background-color: #ffffff;
     position: fixed;
     left: 0;
     top: 0;
     right: auto;
     min-height: 100%;
     overflow-y: auto;
     white-space: nowrap;
     height: 100%;
     z-index: 1;
     border-right: 1px solid #ddd;
     overflow-x: hidden;
}
.msb .navbar {
     border: none;
     margin-left: 0;
     background-color: #ffffff;
}
.msb .navbar-header {
     width: 100%;
     border-bottom: 1px solid #e7e7e7;
     background: #fff;
}
.msb .navbar-brand {
     color: #e91802;
     margin-left: 10px;
}
.msb .navbar-nav li {
     display: block;
     width: 100%;
     height: 40px;
}
.msb .navbar-nav li a {
     color: #5f5f5f;
     margin-left: 15px;
}
.msb .navbar-nav li a:hover {
     color: #e91802 !important;
}
.router-link-active {
     color: #e91802 !important;
} 
@media (max-width: 768px) {
     .msb {
          width: 150px;
     }
     .msb .navbar-nav li a {
          margin-left: 20px;
     }
     .msb .navbar-brand {
          margin-left: 0;
     }
}
</style>