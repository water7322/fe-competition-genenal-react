import { Divider } from 'antd';
import style from './Footer.module.scss';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

function Footer() {
  const appConfig = useSelector((state: RootState) => state.config.appConfig)
  const rightLogoUrl = useMemo(() => appConfig?.otherConf.footer.rightIcon ?? '', [appConfig?.otherConf.footer.rightIcon])
  return (
    <div className={`${style.footer} tw-flex tw-items-center tw-justify-center tw-h-[250px] tw-w-full`}>
      <img className={`${style['logo-img']} tw-h-[60px]`} src="../assets/footer-logo.png" alt="" />
      {
        rightLogoUrl &&
        <Divider style={{ width: '2px', height: '50px' }} type="vertical" />
      }
      {
        rightLogoUrl &&
        <img className={`${style['logo-img']} tw-h-[60px]`} src={rightLogoUrl} alt="" />
      }
    </div>
  )
}

export default Footer
