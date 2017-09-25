import {get} from './http';

export function getGroupTaxTypes(id, query) {
    return get(`/report/group/${id}/tax_types`, { ...query});
}

export function getGroupPipelines(id, query) {
    return get(`/report/group/${id}/pipelines`, { ...query});
}
