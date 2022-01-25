<template>
  <div
    class="d-flex justify-content-around donate-control"
    v-toggle-class="show"
    data-toggle="show"
  >
    <button
      v-if="!user.address"
      class="btn btn-outline-dark"
      @click="user.connect"
    >
      Connect Wallet
    </button>

    <button
      v-if="user.isContributor"
      class="btn btn-outline-dark"
      @click="updatePledge"
    >
      Update Data
    </button>

    <button
      v-if="user.isContributor"
      class="btn btn-outline-dark"
      @click="cancelPledge"
    >
      cancel pledge
    </button>
  </div>
</template>

<script>
import { defineComponent } from "@nuxtjs/composition-api";
import { userStore, campaignStore, websiteStore } from "~/store/index.js";

export default defineComponent({
  props: ["show"],
  setup(props, context) {
    const user = userStore();
    const campaign = campaignStore();
    const website = websiteStore();

    //
    function cancelPledge() {
      user.update = false;
      website.setLoading(
        campaign.sendFunction("cancelPledge"),
        "Cancel pledge"
      );
    }

    function updatePledge() {
      context.emit("update");
    }

    return {
      user,
      campaign,
      cancelPledge,
      updatePledge,
    };
  },
});
</script>
