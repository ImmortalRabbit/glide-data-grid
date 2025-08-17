import * as React from "react";

import { type GridCell, GridCellKind, type GridColumn, type Item } from "../internal/data-grid/data-grid-types.js";
import { DataEditorAll as DataEditor } from "../data-editor-all.js";
import { SimpleThemeWrapper } from "../stories/story-utils.js";
import { DocWrapper, Highlight, Marked, Wrapper } from "./doc-wrapper.js";

export default {
    title: "Glide-Data-Grid/Docs",
    decorators: [
        (Story: React.ComponentType) => (
            <SimpleThemeWrapper>
                <Story />
            </SimpleThemeWrapper>
        ),
    ],
};

function getDummyData(col: number, row: number): GridCell {
    return {
        kind: GridCellKind.Text,
        allowOverlay: false,
        displayData: `${col},${row} 🦝`,
        data: `${col},${row} 🦝`,
    };
}

export const MultiLevelColumnGrouping: React.VFC = () => {
    const getCellContent = React.useCallback((cell: Item): GridCell => {
        const [col, row] = cell;
        return getDummyData(col, row);
    }, []);

    const columns: GridColumn[] = React.useMemo(
        () => [
            {
                title: "First",
                width: 100,
                groupPath: ["Group A", "Sub Group 1"],
            },
            {
                title: "Second",
                width: 100,
                groupPath: ["Group A", "Sub Group 1"],
            },
            {
                title: "Third",
                width: 100,
                groupPath: ["Group A", "Sub Group 2"],
            },
            {
                title: "Fourth",
                width: 100,
                groupPath: ["Group B", "Sub Group 3"],
            },
            {
                title: "Fifth",
                width: 100,
                groupPath: ["Group B", "Sub Group 3"],
            },
            {
                title: "Sixth",
                width: 100,
                groupPath: ["Group B", "Sub Group 4"],
            },
            {
                title: "Seventh",
                width: 100,
                // Test backward compatibility with single group
                group: "Group C",
            },
            {
                title: "Eighth", 
                width: 100,
                // Test three-level grouping
                groupPath: ["Group D", "Sub Group 5", "Sub Sub Group 1"],
            },
            {
                title: "Ninth",
                width: 100,
                groupPath: ["Group D", "Sub Group 5", "Sub Sub Group 2"],
            },
        ],
        []
    );

    return (
        <DocWrapper>
            <Marked>
                {`
# Multi Level Column Grouping

Columns can be grouped by assinging them a group. Easy peasy.`}
            </Marked>
            <Highlight>
                {`
const columns = React.useMemo<GridColumn[]>(() => {
    return [
        {
            title: "Name",
            id: "name",
            group: "Core",
        },
        {
            title: "Company",
            id: "company",
            group: "Core",
        },
        {
            title: "Email",
            id: "email",
            group: "Extra",
        },
        {
            title: "Phone",
            id: "phone",
            group: "Extra",
        },
    ];
}, []);
`}
            </Highlight>
            <Wrapper height={500}>
                {/* <DataEditor getCellContent={getCellContent} columns={columns} rows={data.length} /> */}
                        <DataEditor
                        columns={columns}
            getCellContent={getCellContent}
            rows={10}
            smoothScrollX={true}
            smoothScrollY={true}
            groupHeaderHeight={36}
        />
            </Wrapper>
        </DocWrapper>
    );
};
(MultiLevelColumnGrouping as any).storyName = "10. Multi Level Column Grouping";
