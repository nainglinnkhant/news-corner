<template>
     <div id="scroll-trigger">
          <secondary-spinner v-if="nextPageLoading" />
     </div>
</template>

<script>
import SecondarySpinner from './SecondarySpinner'

export default {
     props: ['nextPageLoading'],
     components: {
          SecondarySpinner
     }
}
</script>