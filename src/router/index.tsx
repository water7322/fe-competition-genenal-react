import { createBrowserRouter } from 'react-router-dom';
import Faq from '@/views/faq/index';
import About from '@/views/About/index'
const routeConfig = createBrowserRouter([
    // {
    //     path: '/:id/introduce',
    //     name: 'introduce',
    //     component: () => import('@/views/introduce/index.vue')
    // },
    // // 排行榜
    // {
    //     path: '/:id/rank',
    //     name: 'rank',
    //     component: () => import('@/views/rank/index.vue')
    // },
    // 大赛说明
    {
        path: '/:id/faq',
        element: (
            <Faq />
        )
    },
    // 走进x
    {
        path: '/:id/about',
        element: (
            <About />
        )
    }
    // // 报名
    // {
    //     path: '/:id/sign',
    //     name: 'sign',
    //     component: () => import('@/views/signup/index.vue'),
    //     beforeEnter: async to => {
    //         // 避免重复请求
    //         const { isLogin } = storeToRefs(useLogin());
    //         if (!isLogin.value) {
    //             const { error, code } = await getUserInfo();
    //             if (error && code === LoginErrorCode.NOT_LOGGED_IN) {
    //                 // 未登录去首页
    //                 McMessage.error('请登录后报名');
    //                 useLoginModal();
    //                 return { name: 'introduce', params: { id: to.params.id } };
    //             }
    //         }
    //     }
    // },
    // {
    //     path: '/:id',
    //     redirect: to => {
    //         return { name: 'introduce', params: { id: to.params.id } };
    //     }
    // },
    // {
    //     path: '/:id/:catchAll(.*)',
    //     redirect: to => {
    //         return { name: 'introduce', params: { id: to.params.id } };
    //     }
    // }
]);

export default routeConfig;
