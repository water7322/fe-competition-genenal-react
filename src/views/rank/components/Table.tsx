import { flatten } from '@/utils';


interface IProps {
    value: Array<Record<string, any>>
}

function Table(props) {
    const slots = {};
    const columns = slots.default ? flatten(slots.default()) : [];
    return (
        <div className="rank-table">
            {columns.map((column, index) =>
                <template key={`rank-table-column-${index}`}>
                    <component is={column} value={props.value} />
                </template>
            )}
        </div >
    )
}
