<template>
     <div class="row search-bar">
          <div class="col-12 col-sm-8 col-md-6">
               <form @submit.prevent="search" class="input-group">
                    <input
                         type="text"
                         class="form-control"
                         placeholder="Search..."
                         :value="searchWord"
                         @change="changeSearchWord"
                    >

                    <span class="input-group-btn" @click="search">
                         <button class="search-btn btn btn-default" type="button">
                              <i class="fas fa-search"></i>
                         </button>
                    </span>
               </form>
          </div>
     </div>
</template>

<script>
export default {
     props: ['searchWord'],
     emits: ['change', 'submit'],
     setup(_, context) {
          const search = () => {
               context.emit('submit')
          }

          const changeSearchWord = (e) => {
               context.emit('change', e.target.value)
          }

          return {
               search,
               changeSearchWord
          }
     }
}
</script>