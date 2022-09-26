import { ElLoading } from 'element-plus';
import 'element-plus/es/components/loading/style/css';
import { Directive } from 'vue';
import {defineNuxtPlugin} from "#app";

const svg = `
        <path class="path" d="
          M 30 15
          L 28 17
          M 25.61 25.61
          A 15 15, 0, 0, 1, 15 30
          A 15 15, 0, 1, 1, 27.99 7.5
          L 15 15
        " style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>
      `;
let loadingInstance: any;
const common = (el: HTMLElement, value: boolean) => {
    if (value && !loadingInstance) {
        loadingInstance = ElLoading.service({
            target: el,
            text: 'loading...',
            spinner: svg,
            svgViewBox: '-10, -10, 50, 50',
        });
    }
    if (!value) {
        loadingInstance?.close();
        loadingInstance = null;
    }
};
const spinDirective: Directive = {
    mounted(el, binding) {
        const { value } = binding;
        common(el, value);
    },
    updated(el, binding) {
        const { value } = binding;
        common(el, value);
    },
};

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.directive('spin', spinDirective)
})
