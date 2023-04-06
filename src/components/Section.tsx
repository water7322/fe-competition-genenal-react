import style from './Section.module.scss'

interface IProps {
    title?: string;
    subTitle?: string;
    background?: boolean;
    contentStyle?: string;
    className?: string;
    children?: JSX.Element | JSX.Element[];
}
function Section(props: IProps) {
    const { title, subTitle, background = true, contentStyle, className } = props;

    return (
        <div className={`${background ? style['section--with-background'] : ''} ${className} section tw-flex tw-flex-col tw-items-center`}>
            {title &&
                <div className="tw-text-[26px] tw-leading-[26px] tw-font-semibold tw-text-[#353535]">{title}</div>
            }
            <div className={style.bar}></div>
            {subTitle &&
                <div className="tw-text-base tw-text-[#5d5d5d]">{subTitle}</div>
            }
            <div className="tw-w-full tw-mt-4" style={contentStyle}>
                {props.children}
            </div>
        </div >
    )
}
export default Section;


