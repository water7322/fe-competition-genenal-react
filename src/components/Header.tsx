
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
// import { useLoginModal } from '@/composable';
// import { useRouterEventHook } from '@/composable';
import type { Track } from '@/api/hr';
import { useMemo, useState } from 'react';
// import { logoutAsync } from '@/store/loginSlice'
import { TrackInfo } from '@/store/configSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { Tabs, Popover } from 'antd';


function Header() {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const params = useParams()
    const { appConfig, themeColor, trackInfo } = useSelector((state: RootState) => state.config)
    const { isLogin } = useSelector((state: RootState) => state.login)
    const { isSignup, userData } = useSelector((state: RootState) => state.user)

    const name = params.name;
    // const { onRouteChange } = useRouterEventHook();
    const [currentTab, setCurrentTab] = useState(name === 'sign' ? 'introduce' : (name as string));
    const [contestTrack, setContestTrack] = useState(trackInfo?.sortedTracks[0].value);
    const enableSignup = useMemo(() => {
        return !appConfig?.trackConf.tracks.every(({ signUpStatus }) => !!!signUpStatus);
    }, [appConfig?.trackConf.tracks]);
    const tabs = useMemo(() => {
        return appConfig?.otherConf.tab.filter(tab => tab.type !== 'introduce') || [];
    }, [appConfig?.otherConf.tab]);
    const handleTabClick = (tab: string) => {
        if (tab === 'introduce' || tab === 'track') {
            navigate(`/introduce#${contestTrack}`, { state: params })
        } else {
            navigate(tab, { state: params })
        }
    };
    const handleSelectTrack = (name: string) => {
        navigate(`/introduce#${name}`, { state: params })
    };
    const handleSignup = () => {
        navigate('sign', { state: params })
    };
    const handleLogin = () => {
        if (isSignup || !enableSignup) return;
        const track = trackInfo?.track as Track;
        const buttonLink = track.buttonLink;

        if (buttonLink.startsWith('http')) {
            window.open(buttonLink);
            return;
        }
        if (!isLogin) {
            useLoginModal();
            return;
        }
        if (buttonLink === '') {
            return;
        }
        navigate('sign', { state: params })
    };
    const handleLoginRegister = () => {
        const track = trackInfo?.track as Track;
        const buttonLink = track.buttonLink;
        if (buttonLink.startsWith('http')) {
            const track = trackInfo?.track as Track;
            const buttonLink = track.buttonLink;
            window.open(buttonLink);
            return;
        }
        useLoginModal();
    };

    // onRouteChange('path', ({ route }) => {
    //     setCurrentTab(route.name as string)
    // });
    // onRouteChange('hash', ({ hash }) => {
    //     setContestTrack(hash ? +hash.slice(1) : trackInfo?.sortedTracks[0].value)
    // });
    return (
        <header className="tw-flex tw-justify-center tw-fixed tw-top-0 tw-w-full tw-bg-white tw-z-50">
            <div className="tw-flex tw-items-center tw-justify-between tw-w-[1000px]">
                <div className="tw-flex tw-items-center">
                    <img src={appConfig?.otherConf.header.logo} className="tw-h-5" />

                    <Tabs items={[{
                        label: '大赛介绍',
                        key: 'introduce'
                    }, {
                        label: '赛道选择',
                        key: 'track'
                    }].concat(tabs.map((tab) => {
                        return {
                            label: tab.name,
                            key: tab.type
                        }
                    }))} onChange={handleTabClick} />
                    {/* {(trackInfo as TrackInfo).sortedTracks.length > 1 &&
                        <McTab name="track">
                            <McPopselect
                                value={contestTrack}
                                options={(trackInfo as TrackInfo).sortedTracks}
                                hide-delay={200}
                                onSelect={handleSelectTrack}
                            >
                                赛道选择
                            </McPopselect>
                        </McTab>
                    } */}
                </div >
                <div className="tw-flex tw-items-center tw-h-full">
                    {isSignup && enableSignup &&
                        <span className="tw-cursor-pointer" onClick={handleSignup}>修改报名信息</span>
                    }
                    <div className={'signup-btn tw-text-white tw-ml-5 tw-h-full tw-px-5 tw-py-[17px] tw-box-border tw-cursor-pointer tw-mr-8' + !enableSignup ? ' disabled' : ''} onClick={handleLogin} >{enableSignup ? (isSignup ? '报名成功' : '立即报名') : '报名结束'}</div >
                    {!isLogin
                        ? (<div className="tw-text-white tw-rounded-lg tw-text-center tw-leading-[16px] tw-cursor-pointer" style={{ background: themeColor, width: '95px', padding: '10px 0' }} onClick={handleLoginRegister} > 登录 / 注册</div >)
                        : userData &&
                        <Popover content={(<div><div className="tw-leading-8 tw-px-2 tw-truncate">{userData.nickname}</div>
                            <div className="header-logout-btn tw-leading-8 tw-flex tw-items-center tw-cursor-pointer tw-px-2 tw-rounded" onClick={() => {
                                // dispatch(logoutAsync())
                            }}>
                                退出登录
                            </div></div>)} style={{ padding: '4px', width: '150px' }}>
                            <div className="tw-flex tw-items-center tw-cursor-pointer">
                                <img className="tw-h-10 tw-w-10 tw-rounded-full tw-mr-3" src={userData.headImg} alt="" />
                                {userData.nickname}
                            </div>
                        </Popover >
                    }
                </div >
            </div >
        </header >
    )
}

export default Header;