function authFetch(url) {
    const token = localStorage.getItem('token');
    return fetch(url, {
        headers: {
            'authorization': 'Bearer ' + token
        }
    });
}

export { authFetch };