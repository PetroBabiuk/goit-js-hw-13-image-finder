export default class ImageApiService {
    constructor() {
        this.searchQuery = '';
        this.page = 1;
    }

    fetchImages() {
        const BASE_URL = 'https://pixabay.com/api/?image_type=photo&orientation=horizontal';
        const autorizationKey = '22394687-5b263f11c9e1c3bf9700990e1';

        return fetch(`${BASE_URL}&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${autorizationKey}`)
        .then(response => response.json())
            .then(({ hits }) => {
                this.incrementPage();
                return hits;
        });
    }

    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;

    }

    get query() {
        return this.searchQuery;
    }

    set query(newQuery) {
        this.searchQuery = newQuery;
    }
}