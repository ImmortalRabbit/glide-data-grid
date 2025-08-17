import React from "react";
import { DataEditorAll as DataEditor } from "../../data-editor-all.js";
import {
    BeautifulWrapper,
    Description,
    PropName,
    useMockDataGenerator,
    defaultProps,
} from "../../data-editor/stories/utils.js";
import { GridColumnIcon, type GridColumn, GridCellKind, type GridCell, type Item } from "../../internal/data-grid/data-grid-types.js";
import { SimpleThemeWrapper } from "../../stories/story-utils.js";

export default {
    title: "Glide-Data-Grid/DataEditor Demos",

    decorators: [
        (Story: React.ComponentType) => (
            <SimpleThemeWrapper>
                <BeautifulWrapper
                    title="Multi-Level Column Grouping"
                    description={
                        <Description>
                            Columns can be organized into multiple hierarchical levels using the <PropName>groupPath</PropName>{" "}
                            property. This allows for complex nested column structures while maintaining backward compatibility with the legacy <PropName>group</PropName> property.
                        </Description>
                    }>
                    <Story />
                </BeautifulWrapper>
            </SimpleThemeWrapper>
        ),
    ],
};

interface SalesData {
    product: string;
    region: string;
    q1Jan: number;
    q1Feb: number;
    q1Mar: number;
    q2Apr: number;
    q2May: number;
    q2Jun: number;
    q3Jul: number;
    q3Aug: number;
    q3Sep: number;
    q4Oct: number;
    q4Nov: number;
    q4Dec: number;
}

const salesData: SalesData[] = [
    {
        product: "Widget A",
        region: "North",
        q1Jan: 1200, q1Feb: 1350, q1Mar: 1100,
        q2Apr: 1400, q2May: 1250, q2Jun: 1600,
        q3Jul: 1800, q3Aug: 1750, q3Sep: 1900,
        q4Oct: 2100, q4Nov: 2000, q4Dec: 2300,
    },
    {
        product: "Widget B",
        region: "South", 
        q1Jan: 900, q1Feb: 1050, q1Mar: 800,
        q2Apr: 1100, q2May: 950, q2Jun: 1200,
        q3Jul: 1400, q3Aug: 1350, q3Sep: 1500,
        q4Oct: 1700, q4Nov: 1600, q4Dec: 1900,
    },
    {
        product: "Widget C",
        region: "East",
        q1Jan: 1500, q1Feb: 1650, q1Mar: 1400,
        q2Apr: 1700, q2May: 1550, q2Jun: 1900,
        q3Jul: 2100, q3Aug: 2050, q3Sep: 2200,
        q4Oct: 2400, q4Nov: 2300, q4Dec: 2600,
    },
];

export const MultiLevelColumnGroups: React.VFC = () => {
    const getContent = React.useCallback((cell: Item): GridCell => {
        const [col, row] = cell;
        const dataRow = salesData[row];
        
        if (col === 0) {
            return {
                kind: GridCellKind.Text,
                allowOverlay: true,
                displayData: dataRow.product,
                data: dataRow.product,
            };
        }
        
        if (col === 1) {
            return {
                kind: GridCellKind.Text,
                allowOverlay: true,
                displayData: dataRow.region,
                data: dataRow.region,
            };
        }

        const monthKeys: (keyof SalesData)[] = [
            "q1Jan", "q1Feb", "q1Mar",
            "q2Apr", "q2May", "q2Jun", 
            "q3Jul", "q3Aug", "q3Sep",
            "q4Oct", "q4Nov", "q4Dec"
        ];
        
        const value = dataRow[monthKeys[col - 2]] as number;
        
        return {
            kind: GridCellKind.Number,
            allowOverlay: true,
            displayData: value.toLocaleString(),
            data: value,
        };
    }, []);

    const columns = React.useMemo<GridColumn[]>(() => {
        return [
            {
                title: "Product",
                id: "product",
                width: 120,
            },
            {
                title: "Region", 
                id: "region",
                width: 100,
            },
            // Q1 months
            {
                title: "January",
                id: "q1-jan",
                width: 100,
                groupPath: ["Sales Data", "Q1 2024", "Months"],
            },
            {
                title: "February",
                id: "q1-feb", 
                width: 100,
                groupPath: ["Sales Data", "Q1 2024", "Months"],
            },
            {
                title: "March",
                id: "q1-mar",
                width: 100,
                groupPath: ["Sales Data", "Q1 2024", "Months"],
            },
            // Q2 months
            {
                title: "April",
                id: "q2-apr",
                width: 100,
                groupPath: ["Sales Data", "Q2 2024", "Months"],
            },
            {
                title: "May",
                id: "q2-may",
                width: 100,
                groupPath: ["Sales Data", "Q2 2024", "Months"],
            },
            {
                title: "June",
                id: "q2-jun",
                width: 100,
                groupPath: ["Sales Data", "Q2 2024", "Months"],
            },
            // Q3 months
            {
                title: "July",
                id: "q3-jul",
                width: 100,
                groupPath: ["Sales Data", "Q3 2024", "Months"],
            },
            {
                title: "August",
                id: "q3-aug",
                width: 100,
                groupPath: ["Sales Data", "Q3 2024", "Months"],
            },
            {
                title: "September",
                id: "q3-sep",
                width: 100,
                groupPath: ["Sales Data", "Q3 2024", "Months"],
            },
            // Q4 months
            {
                title: "October",
                id: "q4-oct",
                width: 100,
                groupPath: ["Sales Data", "Q4 2024", "Months"],
            },
            {
                title: "November",
                id: "q4-nov",
                width: 100,
                groupPath: ["Sales Data", "Q4 2024", "Months"],
            },
            {
                title: "December",
                id: "q4-dec",
                width: 100,
                groupPath: ["Sales Data", "Q4 2024", "Months"],
            },
        ];
    }, []);

    return (
        <DataEditor
            {...defaultProps}
            getCellContent={getContent}
            columns={columns}
            rows={salesData.length}
            getGroupDetails={(groupName, level) => {
                if (level === 0) {
                    return {
                        name: groupName,
                        icon: GridColumnIcon.HeaderArray,
                    };
                }
                if (level === 1) {
                    return {
                        name: groupName,
                        icon: GridColumnIcon.HeaderCalendar,
                    };
                }
                return {
                    name: groupName,
                    icon: GridColumnIcon.HeaderCode,
                };
            }}
            rowMarkers="both"
        />
    );
};