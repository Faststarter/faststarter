<template>
  <header class="container py-4 my-2">
    <h1 class="text-center display-3">
      <span id="campaignTitle"> {{ campaign.info.title }}</span>
    </h1>
  </header>
</template>

<script>
import { defineComponent } from "@nuxtjs/composition-api";
import { campaignStore } from "../store";

export default defineComponent({
  setup() {
    let campaign = campaignStore();

    return {
      campaign,
    };
  },
});
</script>
