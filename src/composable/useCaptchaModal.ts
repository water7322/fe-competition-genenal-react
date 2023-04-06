import { McPopup } from 'meetcode-ui';
import Captcha from '@/components/Captcha.vue';

export async function useCaptchaModal() {

    return new Promise<string>(async resolve => {
        const { show, hide } = McPopup(Captcha!, {
            on: {
                success(data: string) {
                    hide();
                    resolve(data);
                }
            }
        });
        show({
            animation: 'slide',
            position: { top: '15vh' },
            title: '请完成验证',
            showFooter: false,
            width: 310,
            bodyStyle: { paddingTop: 0 }
        });
    });
}
