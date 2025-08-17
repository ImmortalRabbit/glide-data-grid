import type { GridSelection, DataEditorProps, Theme } from "@glideapps/glide-data-grid";
import React from "react";

// Utility functions for groupPath handling
function getGroupKey(column: { group?: string; groupPath?: string[] }): string {
    if (column.groupPath && column.groupPath.length > 0) {
        return column.groupPath.join('|');
    }
    return column.group ?? "";
}

function getGroupLevel(column: { group?: string; groupPath?: string[] }): number {
    if (column.groupPath && column.groupPath.length > 0) {
        return column.groupPath.length;
    }
    if (column.group !== null && column.group !== undefined && column.group.length > 0) {
        return 1;
    }
    return 0;
}

function getGroupPathAtLevel(column: { group?: string; groupPath?: string[] }, level: number): string {
    if (column.groupPath && column.groupPath.length > 0) {
        return column.groupPath.slice(0, level).join('|');
    }
    return level === 1 ? (column.group ?? "") : "";
}

function isGroupCollapsedAtLevel(collapsed: string[], column: { group?: string; groupPath?: string[] }, level: number): boolean {
    const groupKey = getGroupPathAtLevel(column, level);
    return groupKey !== "" && collapsed.includes(groupKey);
}

type Props = Pick<
    DataEditorProps,
    "columns" | "onGroupHeaderClicked" | "onGridSelectionChange" | "getGroupDetails" | "gridSelection" | "freezeColumns"
> & { theme: Theme };

type Result = Pick<
    DataEditorProps,
    "columns" | "onGroupHeaderClicked" | "onGridSelectionChange" | "getGroupDetails" | "gridSelection"
>;

export function useCollapsingGroups(props: Props): Result {
    const [collapsed, setCollapsed] = React.useState<string[]>([]);
    const [gridSelectionInner, setGridSelectionsInner] = React.useState<GridSelection | undefined>(undefined);

    const {
        columns: columnsIn,
        onGroupHeaderClicked: onGroupHeaderClickedIn,
        onGridSelectionChange: onGridSelectionChangeIn,
        getGroupDetails: getGroupDetailsIn,
        gridSelection: gridSelectionIn,
        freezeColumns = 0,
        theme,
    } = props;

    const gridSelection = gridSelectionIn ?? gridSelectionInner;

    const spans = React.useMemo(() => {
        const result: [number, number][] = [];
        let current: [number, number] = [-1, -1];
        let lastGroupKey: string | undefined;
        
        for (let i = freezeColumns; i < columnsIn.length; i++) {
            const c = columnsIn[i];
            const groupKey = getGroupKey(c);
            const maxLevel = getGroupLevel(c);
            
            // Check if any level of this column's group path is collapsed
            let isCollapsed = false;
            for (let level = 1; level <= maxLevel; level++) {
                if (isGroupCollapsedAtLevel(collapsed, c, level)) {
                    isCollapsed = true;
                    break;
                }
            }

            if (lastGroupKey !== groupKey && current[0] !== -1) {
                result.push(current);
                current = [-1, -1];
            }

            if (isCollapsed && current[0] !== -1) {
                current[1] += 1;
            } else if (isCollapsed) {
                current = [i, 1];
            } else if (current[0] !== -1) {
                result.push(current);
                current = [-1, -1];
            }
            lastGroupKey = groupKey;
        }
        if (current[0] !== -1) result.push(current);
        return result;
    }, [collapsed, columnsIn, freezeColumns]);

    const columns = React.useMemo(() => {
        if (spans.length === 0) return columnsIn;
        return columnsIn.map((c, index) => {
            for (const [start, length] of spans) {
                if (index >= start && index < start + length) {
                    let width = 8;
                    if (index === start + length - 1) {
                        width = 36;
                    }

                    return {
                        ...c,
                        width,
                        themeOverride: { bgCell: theme.bgCellMedium },
                    };
                }
            }
            return c;
        });
    }, [columnsIn, spans, theme.bgCellMedium]);

    const onGroupHeaderClicked = React.useCallback<NonNullable<Props["onGroupHeaderClicked"]>>(
        (index, a) => {
            onGroupHeaderClickedIn?.(index, a);

            const column = columns[index];
            // if (!column) return;
            
            const groupKey = getGroupKey(column);
            if (groupKey === "") return;
            
            a.preventDefault();
            setCollapsed(cv => (cv.includes(groupKey) ? cv.filter(x => x !== groupKey) : [...cv, groupKey]));
        },
        [columns, onGroupHeaderClickedIn]
    );

    const onGridSelectionChange = React.useCallback<NonNullable<Props["onGridSelectionChange"]>>(
        s => {
            if (s.current !== undefined) {
                const col = s.current.cell[0];
                const column = columns[col];
                // if (column) {
                    // const groupKey = getGroupKey(column);
                const maxLevel = getGroupLevel(column);
                
                setCollapsed(cv => {
                    // Remove any collapsed group that contains this column
                    let newCollapsed = cv;
                    for (let level = 1; level <= maxLevel; level++) {
                        const levelGroupKey = getGroupPathAtLevel(column, level);
                        if (levelGroupKey !== "" && cv.includes(levelGroupKey)) {
                            newCollapsed = newCollapsed.filter(g => g !== levelGroupKey);
                        }
                    }
                    return newCollapsed;
                });
                // }
            }
            if (onGridSelectionChangeIn !== undefined) {
                onGridSelectionChangeIn(s);
            } else {
                setGridSelectionsInner(s);
            }
        },
        [columns, onGridSelectionChangeIn]
    );

    const getGroupDetails = React.useCallback<NonNullable<Props["getGroupDetails"]>>(
        group => {
            const result = getGroupDetailsIn?.(group);

            // For backward compatibility, check both the original group string and as a group key
            const isCollapsed = collapsed.includes(group ?? "") || 
                               collapsed.some(c => c.endsWith('|' + group) || c === group);

            return {
                ...result,
                name: group,
                overrideTheme: isCollapsed
                    ? {
                          bgHeader: theme.bgHeaderHasFocus,
                      }
                    : undefined,
            };
        },
        [collapsed, getGroupDetailsIn, theme.bgHeaderHasFocus]
    );

    return {
        columns,
        onGroupHeaderClicked,
        onGridSelectionChange,
        getGroupDetails,
        gridSelection,
    };
}
