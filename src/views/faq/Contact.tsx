import style from './Contact.module.scss'
interface IContact {
    contact: {
        title: string;
        children: {
            image: string;
            content: string;
            number: number;
        }[];
    };
}
function Contact(props: IContact) {
    return (
        <div className="tw-flex tw-justify-evenly">
            {props.contact.children.map((item, index) =>
                <div key={index} className="tw-flex tw-flex-col tw-items-center">
                    <img src={item.image} className={style.image} />
                    <span className={`${style.content} tw-mt-2 tw-text-center`}>{item.content}</span>
                    <span className={style.content}>{item.number}</span>
                </div>
            )}
        </div>
    )
}

export default Contact;
