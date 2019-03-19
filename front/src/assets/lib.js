export function fetch(url, params) {
    return new Promise((resolve, reject) => {
        axios.post(url, params).then(response => {
                resolve(response.data);
            },
            err => {
                reject(err);
            }).catch((error) => {
            reject(error)
        })
    })
}