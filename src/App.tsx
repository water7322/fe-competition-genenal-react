import { useEffect, useState } from 'react'
import './App.scss'
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { RouterProvider } from 'react-router-dom'
import routeConfig from './router';
import { useSelector, useDispatch } from 'react-redux';
import { updateAppConfigAsync } from './store/configSlice'
import { updateUserInfoAsync } from './store/userSlice'
import { RootState } from './store'
function App() {
  const { appConfig } = useSelector((state: RootState) => state.config);
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(updateUserInfoAsync())
    dispatch(updateAppConfigAsync());
    console.log(appConfig)
  }, [])
  return (
    <div className="tw-w-full tw-h-full tw-flex tw-flex-col tw-relative style-var">
      <Header />
      <div className="tw-flex-1 tw-flex tw-flex-col tw-items-center tw-pt-14 tw-bg-[url(https://static.nowcoder.com/fe/file/site/competition/develop/assets/images/intro-bg.png)] tw-bg-cover tw-bg-no-repeat">
        <img className="tw-w-full" src={appConfig?.otherConf.header.bg} />
        <div className="tw-w-[1000px] tw-py-8 tw-flex-1">
          <RouterProvider router={routeConfig} />
        </div>
        <Footer />
      </div>
    </div>
  )
}

export default App
