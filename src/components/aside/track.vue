<template>
  <section v-if="tracks.length || user.isOwner">
    <div>
      <span class="align-center">
        <img src="/icons/track.svg" alt="" />
        <b class="mx-1" v-text="tracks.length" />
        <span class="mx-1">Track Delivery</span>
      </span>
    </div>
    <Progress :value="donePercent" hint="0" />
    <ul class="tracks-list">
      <hr class="line" v-if="doneTracks.length" />
      <label
        :for="`track-${index}`"
        v-for="(track, index) in tracks"
        :key="index"
        class="card track my-1 p-2"
        v-toggle-class="track.done"
        data-toggle="order-0"
      >
        <span v-text="track.title" />
        <input
          type="checkbox"
          :id="`track-${index}`"
          class="form-check-input me-2"
          v-model="track.done"
          @change="switchTrack(index)"
          :disabled="!user.isOwner"
        />
      </label>
    </ul>
    <div class="input-group mb-3" v-if="user.isOwner">
      <input
        type="text"
        class="form-control"
        placeholder="Add new Task"
        v-model="newTrack"
      />
      <button class="btn btn-outline-secondary" type="button" @click="addTrack">
        Add
      </button>
    </div>
  </section>
</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  computed,
} from "@nuxtjs/composition-api";
import { campaignStore, websiteStore, userStore } from "../../store/index.js";

export default defineComponent({
  setup() {
    const campaign = campaignStore();
    const website = websiteStore();
    const user = userStore();
    const tracks = ref([]);
    const doneTracks = computed(() =>
      tracks.value.filter((element) => element.done)
    );
    const donePercent = computed(() => {
      let total = tracks.value.length;
      let obtained = doneTracks.value.length;

      return (obtained / total) * 100;
    });

    const newTrack = ref("");

    async function getTracks() {
      let tracksArray = await campaign.callFunction("getTracksArray");

      tracks.value = tracksArray.map(({ title, done }) => {
        return {
          title,
          done,
        };
      });
    }

    async function switchTrack(index) {
      await website.setLoading(
        campaign.sendFunction(
          "switchTrack",
          0,
          index,
          tracks.value[index].done
        ),
        "Editing track"
      );
      getTracks();
    }

    async function addTrack() {
      await website.setLoading(
        campaign.sendFunction("addTrack", 0, newTrack.value),
        "Adding track"
      );

      newTrack.value = "";
    }

    getTracks();

    return {
      user,
      tracks,
      doneTracks,
      donePercent,
      newTrack,
      addTrack,
      switchTrack,
    };
  },
});
</script>
