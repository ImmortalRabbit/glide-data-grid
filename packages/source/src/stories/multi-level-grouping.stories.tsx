import React from "react";
import {
    DataEditor,
    GridCell,
    GridCellKind,
    GridColumn,
    Item,
} from "@glideapps/glide-data-grid";
import { useCollapsingGroups } from "../use-collapsing-groups.js";

export default {
    title: "Glide-Data-Grid/DataEditor Demos",
    decorators: [
        (Story: React.ComponentType) => (
            <div
                style={{
                    outerWidth: 1000,
                    width: 1000,
                    height: 600,
                    padding: 20,
                }}
            >
                <Story />
            </div>
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

export const MultiLevelGrouping: React.VFC = () => {
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

    const getCellContent = React.useCallback((cell: Item): GridCell => {
        const [col, row] = cell;
        return getDummyData(col, row);
    }, []);

    const groupingProps = useCollapsingGroups({
        columns,
        theme: {
            accentColor: "#8c96ff",
            accentLight: "rgba(202, 206, 255, 0.253)",
            
            textDark: "#313139",
            textMedium: "#737383",
            textLight: "#b2b2c0",
            textBubble: "#313139",

            bgIconHeader: "#737383",
            fgIconHeader: "#000000",
            textHeader: "#313139",
            textGroupHeader: "#313139FF",
            bgCell: "#ffffff",
            bgCellMedium: "#fafafb",
            bgHeader: "#f7f7f8",
            bgHeaderHasFocus: "#e9e9ea",
            bgHeaderHovered: "#efeff1",

            bgBubble: "#ededf3",
            bgBubbleSelected: "#ffffff",

            bgSearchResult: "#fff9e6",

            borderColor: "rgba(115, 116, 131, 0.16)",
            drilldownBorder: "rgba(0, 0, 0, 0)",

            linkColor: "#4F5DFF",

            headerFontStyle: "600 13px",
            baseFontStyle: "13px",
            fontFamily:
                "Inter, Roboto, -apple-system, BlinkMacSystemFont, avenir next, avenir, segoe ui, helvetica neue, helvetica, Ubuntu, noto, arial, sans-serif",
        },
    });

    return (
        <DataEditor
            {...groupingProps}
            getCellContent={getCellContent}
            rows={10}
            smoothScrollX={true}
            smoothScrollY={true}
            groupHeaderHeight={36}
        />
    );
};

MultiLevelGrouping.story = {
    name: "Multi-Level Column Grouping",
};