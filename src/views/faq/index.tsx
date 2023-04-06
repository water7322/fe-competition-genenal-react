import Contact from './Contact';
import Section from '@/components/Section';
import { getFaqConfig } from '@/api/hr';
import { IGetFaqConfigResponse } from '@/api/hr';
import { useEffect, useState } from 'react';
import style from './index.module.scss'
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

function Faq() {
    const {contestId} = useSelector((state: RootState) => state.config)
    const [faqConfig, setFaqConfig] = useState<IGetFaqConfigResponse>()
    useEffect(() => {
        getFaq();
    }, [])
    async function getFaq() {
        const res = await getFaqConfig({ query: { contestId } });
        if (res.error || !res.data) {
            return;
        }
        setFaqConfig(res.data || {})
    }
    return (
        <div className="tw-flex tw-flex-col">
            {faqConfig?.qa && Object.keys(faqConfig.qa).length > 0 &&
                <Section className="tw-p-9" title={faqConfig.qa.title}>
                    {faqConfig.qa.children.map((item, index) =>
                        <div key={index} className="tw-mt-7">
                            <p className="tw-text-lg tw-font-bold">Q{index + 1}：{item.title}</p>
                            <p className={`${style.A} tw-mt-2 tw-text-base`} dangerouslySetInnerHTML={{ __html: `A${index + 1}：${item.answer}` }} />
                        </div>
                    )}
                </Section >
            }
            {faqConfig?.contact && Object.keys(faqConfig.contact).length > 0 &&
                <Section className="tw-p-9 tw-mt-10" title={faqConfig.contact.title}>
                    <Contact contact={faqConfig.contact} />
                </Section>
            }
        </div >
    )
}

export default Faq