<template>
  <fieldset class="donate-field card p-2 py-3 my-3">
    <div class="donate-status" v-toggle-class="isEnd" data-toggle="show">
      The campaign was funded
    </div>

    <Control @update="updateMode" :show="!isEnd" />

    <div
      class="donate-withdrow"
      v-toggle-class="user.isOwner && isEnd"
      data-toggle="show my-2 text-center"
    >
      <span>
        Contract balance : {{ fromWei(campaign.balance) }}
        {{ website.crypto.codeCoin }}
      </span>
      <span class="d-block my-2" />
      <button
        v-if="user.isOwner && isEnd"
        class="btn btn-primary px-3"
        @click="withdraw"
        :disabled="campaign.balance == 0"
      >
        Withdraw
      </button>
    </div>
    <div
      class="donate-form"
      v-toggle-class="user.address && !(user.isContributor || isEnd)"
      data-toggle="show"
    >
      <input
        type="range"
        min="0"
        max="100"
        value="0"
        step="0.20"
        class="form-range"
        v-model="slider_value"
      />
      <button
        id="donateButton"
        class="btn btn-primary"
        :disabled="slider_value == 0"
        @click="pledge"
      >
        <span id="donateText"> Pladge </span>
        <span id="donationAmount">
          {{ fromWei(slider_wei) }} {{ website.crypto.codeCoin }} (
          {{ fixed(slider_amount) }}$ )
        </span>
      </button>
    </div>

    <div
      class="donate-section"
      v-toggle-class="user.address && (slider_value != 0 || user.update)"
      data-toggle="show"
    >
      <div>
        <div class="input-group my-2">
          <img src="/icons/person.svg" alt="" class="input-group-text" />
          <input
            placeholder="Name (optional)"
            class="form-control"
            type="text"
            maxlength="24"
            v-model="contributionName"
          />
        </div>

        <div class="input-group my-2">
          <img src="/icons/comment.svg" alt="" class="input-group-text" />
          <input
            placeholder="Comment (optional)"
            class="form-control"
            type="text"
            maxlength="120"
            v-model="contributionComment"
          />
        </div>

        <button
          class="btn btn-primary w-100"
          v-show="user.update"
          @click="updatePledge"
        >
          Update
        </button>
      </div>
    </div>
  </fieldset>
</template>

<script>
import { defineComponent, ref, computed } from "@nuxtjs/composition-api";
import { toWei, fromWei, fixed } from "../assets/utils.js";
import { userStore, campaignStore, websiteStore } from "../store/index";

export default defineComponent({
  setup(props, context) {
    const user = userStore();
    const campaign = campaignStore();
    const website = websiteStore();

    //
    const isEnd = computed(() => campaign.isEnd);

    //
    const contributionName = ref("");
    const contributionComment = ref("");

    //
    const slider_value = ref(0);

    //
    const slider_wei = computed(() => {
      if (!user.address) {
        context.emit("input", 0);
        return 0;
      }

      //
      let wei = parseInt(Number(slider_value.value) * (campaign.request / 100));
      let fixed = toWei(fromWei(wei));

      //
      if (slider_value.value === 100) fixed = campaign.request;
      context.emit("input", fixed);

      return fixed;
    });

    //
    const slider_amount = computed(() => {
      const priceWithUsd = website.crypto.price;
      return priceWithUsd * fromWei(slider_wei.value);
    });

    //
    async function pledge() {
      // From wei will fixed value like user show in interface
      // after I use toWei to send it in value of pledger
      let pledgeValue = slider_wei.value;
      if (!ethereum.selectedAddress) {
        website.alert("You are not connect with wallet");
        return;
      }

      if (!(user.update || pledgeValue > 0)) return;

      await website.setLoading(
        campaign.sendFunction(
          "pledge",
          pledgeValue,
          contributionName.value.trim() || "anonymous",
          contributionComment.value
        ),
        "need confirm"
      );

      /* Reset form */
      contributionName.value = "";
      contributionComment.value = "";
      slider_value.value = 0;
    }

    //
    async function withdraw() {
      await website.setLoading(
        campaign.sendFunction("withdraw", 0),
        "need confirm"
      );
      campaign.getBrowserData();
    }

    //
    function updateMode() {
      if (user.update) {
        let contributor = campaign.contributors.find((contributor) => {
          let isContributor =
            contributor.address.toUpperCase() == user.address.toUpperCase();

          let isWithdrawn = contributor.withdrawn;

          return isContributor && !isWithdrawn;
        });

        // Set current value to update field
        contributionName.value = contributor.name;
        contributionComment.value = contributor.comment;
      }

      // toggle update mode
      user.update = !user.update;
    }

    //
    async function updatePledge() {
      await pledge();
      user.update = false;
    }

    return {
      // const data
      user,
      website,
      campaign,
      isEnd,
      // slider value
      slider_value,
      slider_wei,
      slider_amount,
      updateMode,
      // donate section
      contributionName,
      contributionComment,
      pledge,
      updatePledge,
      withdraw,
      // utils
      fromWei,
      fixed,
    };
  },
});
</script>

<style>
.update-button {
  margin: auto;
  min-width: 80%;
}
</style>
