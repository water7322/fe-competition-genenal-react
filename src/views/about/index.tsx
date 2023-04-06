import Section from '@/components/Section';
import { getAboutConfig } from '@/api/hr';
import type { IGetAboutConfigResponse } from '@/api/hr';
import { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { RootState } from '@/store';

function About() {
    const [about, setAbout] = useState<IGetAboutConfigResponse>();
    const {contestId} = useSelector((state: RootState) => state.config)
    useEffect(() => {
        getAbout();
    }, [])
    async function getAbout() {
        const res = await getAboutConfig({ query: { contestId } });
        if (res.error || !res.data) {
            return;
        }
        setAbout(res.data || {})
    }
    return (
        <div className="tw-flex tw-flex-col">
            {about && Object.keys(about).length > 0 &&
                <Section className="tw-p-9" title={about?.name}>
                    <div dangerouslySetInnerHTML={{ __html: about?.content }}></div>
                </Section>
            }
        </div>
    )
}
export default About;