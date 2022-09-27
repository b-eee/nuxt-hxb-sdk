interface SearchConditionType {
    search_value?: any;
    data_type?: string;
    id?: string;
    rpf_id?: string;
    exact_match?: boolean;
    not_match?: boolean;
    include_null?: boolean;
    conditions?: SearchConditionType;
    use_or_condition?: boolean;
}

interface SortFieldType {
    id?: string;
    order?: string;
}

interface GetItemsPlType {
    conditions?: SearchConditionType[];
    use_or_condition?: boolean;
    unread_only?: boolean;
    sort_fields?: SortFieldType;
    sort_field_id?: string;
    sort_order?: string;
    page: number;
    per_page: number;
    use_field_id?: boolean;
    use_display_id?: boolean;
    include_links?: boolean;
    include_lookups?: boolean;
    return_number_value?: boolean;
    format?: string;
    return_count_only?: boolean;
    omit_fields_data?: boolean;
    omit_total_items?: boolean;
    data_result_timeout_sec?: number;
    total_count_timeout_sec?: number;
    debug_query?: boolean;
}

interface DsItemType {
    data_type: string,
    display_id: string,
    ds_lookup_info: any,
    f_id: string,
    max_value: number | string | null,
    min_value: number | string | null,
    name: string,
    options: any,
    order: number,
    statuses: StatusType[],
    "users_info": any
}

interface StatusType {
    status_name: string,
    status_id: string
}

interface ItemType {
    [key: string]: string,
    created_at: string,
    created_by: string,
    d_id: string,
    i_id: string,
    p_id: string,
    rev_no: string,
    seed_i_id: string,
    status_id: string,
    title: string,
    unread: string,
    updated_at: string,
    updated_by: string,
    w_id: string,
}

export {
    SearchConditionType,
    SortFieldType,
    GetItemsPlType,
    DsItemType,
    ItemType
}