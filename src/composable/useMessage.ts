import { message } from 'antd';

export function useMessage() {
    const [messageApi] = message.useMessage();

    return messageApi;
}
