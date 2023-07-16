class StorageSpec {
    storage_source;
    path;
    cid;
    url;

    constructor({ storage_source, path, cid, url }) {
        this.storage_source = storage_source;
        this.path = path;
        this.cid = cid;
        this.url = url;
    }

    toJson() {
        return {
            storage_source: this.storage_source,
            path: this.path,
            cid: this.cid,
            url: this.url,
        }
    }
}

module.exports = { StorageSpec }