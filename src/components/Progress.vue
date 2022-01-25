<template>
  <div class="progress">
    <div class="progress-bar" :style="{ width: value + '%' }" />
    <div
      :style="{ width: hint + '%' }"
      class="progress-bar bg-warning bg-opacity-50"
    />
  </div>
</template>

<script>
export default {
  props: ["value", "hint"],
};
</script>
