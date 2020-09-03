const urlEndPoint = "https://thinkful-list-api.herokuapp.com/andycharles/bookmarks";

const apiFetch = function (...args) {
    let error;
    return fetch(...args)
        .then(res => {
            if (!res.ok) {
                error = { code: res.status };

                if (!res.headers.get('content-type').includes('json')) {
                    error.message = res.statusText;
                    return Promise.reject(error);
                }
            }

            return res.json();
        })
        .then(data => {
            if (error) {
                error.message = data.message;
                return Promise.reject(error);
            }

            return data;
        });
};

const getBookmarks = () => {
    return apiFetch(`${urlEndPoint}`);
};

const createBookmark = (bookmark) => {
    const newBookmark = JSON.stringify(bookmark);
    return apiFetch(`${urlEndPoint}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: newBookmark
    });
};

const deleteBookmark = (id) => {
    return apiFetch(`${urlEndPoint}/${id}`, {
        method: 'DELETE'
    });
};


export default {
    getBookmarks,
    createBookmark,
    deleteBookmark,
};

