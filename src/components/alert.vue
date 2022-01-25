<template>
  <div class="modal d-block" role="dialog" v-if="website.error">
    <div class="fade modal-backdrop show"></div>
    <div
      class="modal-dialog modal-dialog modal-dialog-centered"
      style="z-index: 1100"
    >
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Error</h5>
          <button
            type="button"
            class="btn-close"
            @click="website.error = ''"
          ></button>
        </div>
        <div class="modal-body">
          <p>{{ website.error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { websiteStore } from "../store/index.js";
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  setup() {
    return {
      website: websiteStore(),
    };
  },
});
</script>
