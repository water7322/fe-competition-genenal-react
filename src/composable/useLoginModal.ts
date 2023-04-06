import { ref } from 'vue';
import { McPopup } from 'meetcode-ui';
import Login from '@/components/Login.vue';
import router from '@/router';
import store from '@@/store';

export function useLoginModal() {
    const forceBlock = ref(false);
    const { show, hide } = McPopup(Login, {
        on: {
            login() {
                hide();
            }
        },
        plugins: [router, store]
    });

    // 必须加上这个，不然弹窗内部无法获取路由信息
    router.isReady().then(() => {
        show({
            animation: 'slide',
            position: { top: '15vh' },
            showFooter: false,
            width: 420,
            bodyStyle: { paddingTop: 0 },
            onBeforeLeave(action) {
                if (action === 'wrapper' && forceBlock.value) return true;
            },
            onWrapperClick(e) {
                const isClickOnNSelect = !!e.composedPath().find(target => (target as HTMLElement).className?.includes('n-select-menu'));
                forceBlock.value = isClickOnNSelect;
            }
        });
    });
}
