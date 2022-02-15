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
          <img src="/icons/address.svg" alt="" />
          <span>Contract address</span>
        </span>
      </div>
      <hr />
      <p>
        <span class="alert d-block alert-warning"> beta feature </span>
        Here you can send money to the contract to donate without linking your
        wallet to the site
        <br />
        <br />
        Note the name will be anonymous
        <br />
        <img :src="qrCode(address)" class="m-auto d-block" alt="" />
        <small>Address contract (smart bitcoin cash)</small>
        <span class="contract-address"> {{ address }} </span>
      </p>
    </section>

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
import { campaignStore, websiteStore } from "../store/index.js";

export default defineComponent({
  setup() {
    let campaign = campaignStore();
    let website = websiteStore();

    let contributions = computed(() => campaign.contributors);
    let recipients = computed(() => campaign.recipients);
    let address = computed(() => website.env.contractAddress);

    function qrCode(address) {
      address = encodeURIComponent(address);
      return `https://chart.googleapis.com/chart?cht=qr&chl=ethereum%3A%3Famount%${address}&chs=180x180&choe=UTF-8&chld=L|2' alt='qr code`;
    }

    return { contributions, recipients, qrCode, address };
  },
});
</script>
