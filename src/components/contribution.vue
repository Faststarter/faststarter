<template>
  <li v-if="show">
    <div class="me-2">
      <div
        class="contributionWaves"
        :style="`background-position : 0 ${4 - percentAmount / 25 - 0.1}rem`"
      />
      <div class="contributionDisplay" />
      <span class="contributionPercent">{{ percentAmount }}%</span>
    </div>
    <span>
      <span v-toggle-class="isUser" data-toggle="text-primary">
        <b class="contributionAlias" v-text="alias" />
        <small class="contributionAmount">
          {{ fromWei(amount) }} {{ website.crypto.codeCoin }}
        </small>
      </span>
      <q class="contributionComment" v-if="comment" v-text="comment" />
    </span>
  </li>
</template>

<script>
import { computed, defineComponent } from "@nuxtjs/composition-api";
import { fromWei, fixed } from "../assets/utils";
import { campaignStore, websiteStore, userStore } from "../store";

export default defineComponent({
  props: ["alias", "comment", "amount", "address", "show"],
  setup(props) {
    let campaign = campaignStore();
    let website = websiteStore();
    let isUser = computed(() => {
      return userStore().address.toUpperCase() === props.address.toUpperCase();
    });

    const percentAmount = computed(() => {
      return fixed((props.amount / campaign.recipient) * 100, 0);
    });

    return {
      isUser,
      fromWei,
      website,
      percentAmount,
    };
  },
});
</script>
