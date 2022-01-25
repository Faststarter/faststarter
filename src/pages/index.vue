<template>
  <div class="page">
    <Header />
    <main class="container d-md-flex flex-grow-1">
      <article id="campaign" class="col-md-8 me-md-3 flex-md-shrink-1">
        <Overview :contribution="contribution" />
        <!-- Campaign heading -->
        <header class="markdown" v-html="campaign.info.summaryHtml" />

        <!-- Campaign donation form -->
        <DonateField v-model="contribution" />

        <!-- Campaign details. -->
        <section class="markdown" v-html="campaign.info.proposalHtml" />
      </article>
      <!-- Campaign sidebar -->
      <Aside />
    </main>
    <!-- Footer of website -->
    <footer class="bg-primary mt-2 no-link py-3 text-center text-white">
      <a href="https://faststarter.org" target="_blank">
        Powered by Faststarter
      </a>
    </footer>
    <Alert />
    <Loading />
  </div>
</template>

<script>
import {
  defineComponent,
  useAsync,
  ref,
  onMounted,
} from "@nuxtjs/composition-api";
import { websiteStore, campaignStore } from "~/store/index.js";
export default defineComponent({
  setup() {
    useAsync(async () => {
      await websiteStore().init();
    });

    onMounted(() => {
      document.querySelectorAll("table").forEach((element) => {
        element.className += "table";
      });
    });

    let campaign = campaignStore();
    let contribution = ref(0);

    return {
      contribution,
      campaign,
    };
  },
  head: {
    link: [
      { rel: "stylesheet", href: "/css/main.css" },
      { rel: "stylesheet", href: "/css/markdown.css" },
    ],
  },
});
</script>
