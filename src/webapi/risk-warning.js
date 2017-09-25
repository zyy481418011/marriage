import {get} from './http';

export function getGroupTree() {
    return get("/group");
}

export function getGroupReport(id, skip, limit, query) {
    return get(`/report/group/${id}`, {skip, limit, ...query});
}

export function getCompanyTaxReport(id, tax_type) {
    return get(`/report/company/${id}/tax`, {tax_type: tax_type || null});
}

export function getTaxType() {
    return get('/tax_type');
}
