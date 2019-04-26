import JScroll from "./jscroll";
import JRecycleScroll from "./recycle";
const components = [JScroll, JRecycleScroll];

const install = function(Vue) {
  if (install.installed) return;
  components.map(component => Vue.component(component.name, component));
};

if (typeof window !== "undefined" && window.Vue) {
  install(window.Vue);
}

export { JScroll, JRecycleScroll };

export default { install };
