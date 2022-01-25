<template>
  <aside class="col-md-4 ms-md-3 flex-md-shrink-1">
    <section>
      <div>
        <span class="align-center">
          <img src="/icons/face.svg" alt="" />
          <b class="mx-1" id="campaignRecipientCount">{{
            recipients.length
          }}</b>
          <span>recipients</span>
        </span>
      </div>
      <hr />
      <ul class="recipient-list">
        <li class="card" v-for="recipient in recipients" :key="recipient.name">
          <a :href="recipient.website" target="_blank">
            <img :src="recipient.photo" :alt="recipient.name" />
            <span>
              <b>{{ recipient.name }}</b>
            </span>
          </a>
        </li>
      </ul>
    </section>

    <aside-track />

    <section>
      <div>
        <span class="align-center">
          <img src="/icons/volunteer.svg" alt="" />
          <b class="mx-1" id="campaignContributorCount">{{
            contributions.length
          }}</b>
          <span>contributors</span>
        </span>
      </div>
      <hr />
      <ul class="contribution-list">
        <li class="d-block" v-if="!contributions.length">
          <i>No one has made a pledge yet.</i>
          <br />
          <i>You could be the first.</i>
        </li>
        <Contribution
          v-else
          v-for="contribution in contributions"
          :key="contribution.address"
          :alias="contribution.name"
          :comment="contribution.comment"
          :amount="contribution.amount"
          :address="contribution.address"
          :show="!contribution.withdrawn"
        />
      </ul>
    </section>
  </aside>
</template>

<script>
import { defineComponent, computed } from "@nuxtjs/composition-api";
import { campaignStore } from "../store/index.js";

export default defineComponent({
  setup() {
    let campaign = campaignStore();

    let contributions = computed(() => campaign.contributors);
    let recipients = computed(() => campaign.recipients);

    return { contributions, recipients };
  },
});
</script>
