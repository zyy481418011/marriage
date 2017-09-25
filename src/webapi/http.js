import store from '../store';

function buildParams(data) {
  data = camelToSnake(data);
  let params = [];
  for (let key in data) {
    if (data[key] === null || data[key] === undefined) {
      // Skip
    } else if (Array.isArray(data[key])) {
      data[key].forEach(item => params.push([key, item]));
    } else {
      params.push([key, data[key]]);
    }
  }

  for (let pair of params) {
    if (pair[1] instanceof Date) {
      pair[1] = pair[1].getTime() / 1000;
    }
  }
  return params;
}

function buildFormData(data) {
  let formData = new FormData();
  buildParams(data).forEach(([key, value]) => formData.append(key, value));
  return formData;
}

// function buildPostParams(data) {
//   return data.map(([key, value]) =>
//     `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
// }

function buildQueryUrl(baseUrl, data) {
  const params = buildParams(data).map(([key, value]) =>
    `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
  if (params.length == 0) return baseUrl;
  return `${baseUrl}?${params}`;
}

function buildHeaders() {
  const {accessToken} = store.getState().logon;
  if (accessToken) {
    return {
      'Authorization': `Bearer ${accessToken}`
    };
  } else {
    return {};
  }
}

// 递归地将JSON中以snake_case命名的键转为对应的camelCase
function snakeToCamel(value) {
  function toCamel(s) {
    return s.replace(/(_\w)/g, m => m[1].toUpperCase());
  }

  if (Array.isArray(value)) {
    return value.map(snakeToCamel);
  } else if (typeof value === 'object' && value !== null && value.constructor === Object) {
    let result = {};
    for (let key in value) {
      result[toCamel(key)] = snakeToCamel(value[key]);
    }
    return result;
  } else {
    return value;
  }
}

// 递归地将JSON中以camelCase命名的键转为对应的snake_case
function camelToSnake(value) {
  function toSnake(s) {
    return s.replace(/([A-Z])/g, m => `_${m.toLowerCase()}`);
  }

  if (Array.isArray(value)) {
    return value.map(snakeToCamel);
  } else if (typeof value === 'object' && value !== null && value.constructor === Object) {
    let result = {};
    for (let key in value) {
      result[toSnake(key)] = snakeToCamel(value[key]);
    }
    return result;
  } else {
    return value;
  }
}

function getDataByContentType(response) {
  if (!response.headers.has('Content-Type')) {
    return null;
  }
  if (response.headers.get('Content-Type') == 'application/json')
    return response.json();
  else
    return response.text();
}

async function patchFetchResponse(uri, params) {
  let response;
  try {
    response = await fetch(uri, params);
  } catch (err) {
    alert('加载失败,请检查网络连接状态');
    return false;
  }
  if (!response.ok) {
    if (response.status == 500) {
      alert('服务器出现故障');
      return false;
    }
    throw await getDataByContentType(response);
  } else {
    return snakeToCamel(await getDataByContentType(response));
  }
}

export function get(uri, data) {
  return patchFetchResponse(buildQueryUrl(__API_BASE__ + uri, data), {
    method: 'GET',
    headers: buildHeaders(),
    credentials: 'include'
  });
}

export async function post(uri, data) {
  return patchFetchResponse(__API_BASE__ + uri, {
    method: 'POST',
    body: buildFormData(data),
    headers: buildHeaders(),
    credentials: 'include'
  });
}

export async function postAddUsers(uri, data) {
  const {accessToken} = store.getState().logon;
  console.log(data);

  return patchFetchResponse(__API_BASE__ + uri, {
    method: 'POST',
    body: JSON.stringify(data),
    headers:  {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': "application/json"
    }
  });
}

export function put(uri, data) {
  return patchFetchResponse(__API_BASE__ + uri, {
    method: 'PUT',
    body: buildFormData(data),
    headers: buildHeaders(),
    credentials: 'include'
  });
}

export async function del(uri, data) {
  return patchFetchResponse(__API_BASE__ + uri, {
    method: 'DELETE',
    body: buildFormData(data),
    headers: buildHeaders(),
    credentials: 'include'
  });
}
