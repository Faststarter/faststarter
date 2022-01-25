<template>
  <section class="loading" id="loading" v-if="website.loading">
    <div class="spinner-grow" style="width: 3rem; height: 3rem" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
    <span class="my-2" v-text="website.loading" />
  </section>
</template>

<script>
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { websiteStore } from "~/store/index.js";

export default defineComponent({
  setup() {
    let website = websiteStore();

    return {
      website,
      loading: computed(() => {
        return website.loading;
      }),
    };
  },
});
</script>
