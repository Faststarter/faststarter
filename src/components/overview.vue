<template>
  <!-- Campaign overview -->
  <section id="overview" class="row">
    <!-- Expires time -->
    <div class="col-12 col-md-6" role="button" @click="user.connect">
      <span class="align-center">
        <img src="/icons/badge.svg" alt="" />
        <b class="ellipsis">{{ user.address || "connect wallet" }}</b>
      </span>
    </div>
    <!-- Campaign request amount -->
    <div class="col-12 col-md-6">
      <span class="align-center flex-md-row-reverse">
        <img src="/icons/bookmark.svg" alt="" />
        <b>{{ website.crypto.codeCoin }}</b>
        <span class="align-center">
          {{ fromWei(campaign_balance) }}
          /
          {{ fromWei(campaign_recipient) }}
        </span>
      </span>
    </div>
    <!-- Progress bar of campaign-->
    <Progress :value="campaignProgressBar" :hint="campaignContributionBar" />
  </section>
</template>

<script>
import { defineComponent, computed } from "@nuxtjs/composition-api";
import { userStore, campaignStore, websiteStore } from "~/store/index.js";
import { fromWei } from "~/assets/utils.js";

export default defineComponent({
  props: ["contribution"],
  setup(props) {
    // campaign data
    let user = userStore();
    let campaign = campaignStore();
    let website = websiteStore();

    //
    let campaign_recipient = computed(() => campaign.recipient);
    let campaign_balance = computed(() => campaign.contributionAmount);
    let campaignProgressBar = computed(
      () => (campaign_balance.value / campaign_recipient.value) * 100
    );

    let campaignContributionBar = computed(
      () => (props.contribution / campaign_recipient.value) * 100
    );

    return {
      fromWei,
      user,
      website,
      campaign_recipient,
      campaign_balance,
      campaignProgressBar,
      campaignContributionBar,
    };
  },
});
</script>
