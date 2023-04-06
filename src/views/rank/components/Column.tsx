import style from './Column.module.scss'
interface IProps {
    name: string,
    value: object,
    title: string
}
function Column(props: IProps) {
    return (
        <div className={style['rank-table-column']}>
            <div className={style['table-column-head-item']}>
                <slot name="head">
                    {props.title}
                </slot>
            </div>
            {props.value.map((item, index) =>
                <template key={`rank-table-${props.name}-item-${index}`}>
                    <div className={style['table-column-row-item']}>
                        <slot name="body" row={item}>
                            {item[props.name!]}
                        </slot>
                    </div>
                </template >
            )}
        </div >
    )
}

export default Column;