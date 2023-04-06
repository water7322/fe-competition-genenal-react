import { getSMSSupportCountries, getLoginInfo } from '@@/api/common/login';
import type { SelectOption } from 'naive-ui';

async function getCountryCodes(): Promise<SelectOption[]> {
    const { data } = await getSMSSupportCountries();

    return data.map(({ code, name }) => {
        return {
            label: `${name} ${code}`,
            value: code,
            style: { width: '200px' }
        };
    });
}

async function getPublicKey() {
    const { data } = await getLoginInfo();

    return data?.rsaPublicKey || '';
}

export async function useLoginSetup() {
    const [countryCodes, publicKey] = await Promise.all([getCountryCodes(), getPublicKey()]);

    return { countryCodes, publicKey };
}
