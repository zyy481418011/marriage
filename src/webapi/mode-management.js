import {get} from './http';

export function getIndustry() {
    return get('/industry');
}

export function getPipeline(skip, limit, query) {
    return get('/pipeline', {skip, limit, ...query});
}
