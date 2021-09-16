const concatUrl = (base, rest) => {
    base = base.trim();
    rest = rest.trim();
    if (base.substr(base.length - 1) == '/') base = base.substr(0, base.length - 1);
    if (rest.substr(0, 1) == '/') rest = rest.substr(1);
    return `${base}/${rest}`
}

export const getReportList = async (portalUrl, referenceToken) => {
    const url = concatUrl(portalUrl, 'api/graphql')
    const init = {
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Accept: 'application/json',
            'content-type': 'application/json',
            'pragma': 'no-cache',
            'Reference-Token': referenceToken
        },
        method: 'post',
        body: JSON.stringify({ query: 'query { documenttypes(key:"rdl") { documents{ id, title } } }' })
    };
    const res = await fetch(url, init);
    if (!res.ok) return null
    let response = await res.json()
    let documents = response.data.documenttypes[0].documents;
    let list = documents.map(x => ({ name: x.title, id: x.id }))
    list.sort((x, y) => x.name < y.name ? -1 : 1 )
    return list
}

/**
 * 
 * @param {根据报表id删除报表} portalUrl 
 * @param {*} referenceToken 
 * @param {*} reportId 
 */
export const deleteReportById = async (portalUrl, referenceToken,reportId) => {
    const url = concatUrl(portalUrl, 'api/graphql')
    const init = {
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            Accept: 'application/json',
            'content-type': 'application/json',
            'pragma': 'no-cache',
            'Reference-Token': referenceToken
        },
        method: 'post',
        body: JSON.stringify({ query: 'mutation { deleteDocument(documentId: \"'+reportId+'\", force: false) { deleted_id } }' })
    };
    const res = await fetch(url, init);
    if (!res.ok) return null
    let response = await res.json()
    return response
}