import { ColumnOrderState, SortingState } from "@tanstack/react-table";
import { RowDataType, TableColumn } from "cdm/FolderModel";
import { FilterSettings, GlobalSettings, LocalSettings } from "cdm/SettingsModel";
import { DatabaseView } from "DatabaseView";
import { Literal } from "obsidian-dataview";
import { StoreApi, UseBoundStore } from "zustand";

export type TableActionResponse<T> = {
    view: DatabaseView,
    set: (partial: T | Partial<T> | ((state: T) => T | Partial<T>), replace?: boolean) => void,
    get: () => T,
    implementation: T
}

export type TableAction<T> = {
    setNext(handler: TableAction<T>): TableAction<T>;
    handle(settingHandlerResponse: TableActionResponse<T>): TableActionResponse<T>;
}
/**
 * TABLE STATE INTERFACE
 */
export interface ConfigState {
    ddbbConfig: LocalSettings;
    filters: FilterSettings;
    global: GlobalSettings;
    actions: {
        alterFilters: (filters: Partial<FilterSettings>) => void;
        alterConfig: (config: Partial<LocalSettings>) => void;
    }
}

export interface DataState {
    rows: RowDataType[];
    hoveredRow: number | null;
    actions: {
        addRow: (filename: string, columns: TableColumn[], ddbbConfig: LocalSettings) => void;
        updateCell: (rowIndex: number, column: TableColumn, value: Literal, columns: TableColumn[], ddbbConfig: LocalSettings, isMovingFile?: boolean) => void;
        parseDataOfColumn: (column: TableColumn, input: string, ddbbConfig: LocalSettings) => void;
        updateDataAfterLabelChange: (column: TableColumn, label: string, columns: TableColumn[], ddbbConfig: LocalSettings) => Promise<void>;
        removeRow: (row: RowDataType) => void;
        removeDataOfColumn: (column: TableColumn) => void;
        dataviewRefresh: (column: TableColumn[], ddbbConfig: LocalSettings, filterConfig: FilterSettings) => void;
        setHoveredRow: (rowIndex: number) => void;
    }
}

export interface ColumnsState {
    columns: TableColumn[];
    shadowColumns: TableColumn[];
    actions: {
        addToLeft: (column: TableColumn, customName?: string) => void;
        addToRight: (column: TableColumn, customName?: string) => void;
        remove: (column: TableColumn) => void;
        alterSorting: (column: TableColumn) => void;
        addOptionToColumn: (column: TableColumn, option: string, backgroundColor: string) => void;
        alterColumnType: (column: TableColumn, input: string, parsedRows?: RowDataType[]) => void;
        alterColumnLabel: (column: TableColumn, label: string) => Promise<void>;
        alterColumnSize: (id: string, width: number) => void;
        alterIsHidden: (column: TableColumn, isHidden: boolean) => void;
    }
    info: {
        getValueOfAllColumnsAsociatedWith: <K extends keyof TableColumn>(key: K) => TableColumn[K][];
        getVisibilityRecord: () => Record<string, boolean>;
    }
}
export interface ColumnSortingState {
    sortBy: SortingState;
    actions: {
        alterSorting: (alternativeSorting: SortingState) => void;
    },
    info: {
        generateSorting: (currentCol: TableColumn, isSortedDesc: boolean) => SortingState;
    }
}
export interface RowTemplateState {
    template: string;
    folder: string;
    options: { value: string, label: string }[],
    clear: () => void;
    update: (template: string) => void;
}

export interface TableStateInterface {
    configState: UseBoundStore<StoreApi<ConfigState>>;
    rowTemplate: UseBoundStore<StoreApi<RowTemplateState>>;
    data: UseBoundStore<StoreApi<DataState>>;
    sorting: UseBoundStore<StoreApi<ColumnSortingState>>;
    columns: UseBoundStore<StoreApi<ColumnsState>>;
}