<template>
     <section>
          <div>
               <h2>Page not found</h2>
               
               <p>
                    This page could not be found - maybe check out 
                    <router-link to="/">this</router-link>.
               </p>
          </div>
     </section>
</template>

<style scoped>
div {
     padding: 2rem;
     margin: 2rem auto;
     max-width: 40rem;
}
h2 {
     color: #e91802;
     padding-bottom: 20px;
     font-size: 19px;
}
p {
     font-size: 15px;
     margin-bottom: 0;
}
</style>