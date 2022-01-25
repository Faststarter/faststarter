import Vue from "vue";

Vue.directive("toggle-class", function (el, binding) {
  let classList = el.dataset.toggle.split(" ");

  classList.forEach((className) => {
    if (binding.value) {
      el.classList.add(className);
    } else {
      el.classList.remove(className);
    }
  });
});
