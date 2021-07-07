import './sass/main.scss';
import startMarkupTemplate from './hbs/start-markup';
import imageCardTemplate from './hbs/image-card.hbs';
import ImagesApiService from './js/apiService';
import LoadMoreBtn from './js/load-more-btn';

const imagesApiService = new ImagesApiService();

document.body.insertAdjacentHTML('afterbegin', startMarkupTemplate());

const loadMoreBtn = new LoadMoreBtn({
    selector: '.load-more-btn',
    hidden: true,
});

const refs = {
    body: document.querySelector('body'),
    articlesGallery: document.querySelector('.gallery'),
    searchForm: document.querySelector('.search-form'),
    imageGallery: document.querySelector('.gallery'),
    searchBtn: document.querySelector('.btn-search'),
    spinner: document.querySelector('.loader'),
    loadMoreBtn: document.querySelector('.load-more-btn'),
}

refs.loadMoreBtn.scrollIntoView({
    behavior: 'smooth',
    block: 'end',
})

refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', fetchImages);

function onSearch(e) {
    e.preventDefault();
    refs.searchBtn.setAttribute('disabled', true);
    imagesApiService.query = e.currentTarget.elements.query.value;

    loadMoreBtn.show();
    imagesApiService.resetPage();
    clearImagesContainer();
    
    fetchImages();
}

function fetchImages() {
    loadMoreBtn.disable();
    refs.spinner.classList.remove('is-hidden');
    imagesApiService.fetchImages()
        .then(images => {
            if (images.length === 0) {
                alert('Please, try to search something else');
                
            }
            appendImagesMarkup(images);
            loadMoreBtn.enable();
            refs.spinner.classList.add('is-hidden');
            refs.searchBtn.removeAttribute('disabled');
        });
}

function appendImagesMarkup(images) {
    refs.imageGallery.insertAdjacentHTML('beforeend', imageCardTemplate(images));
}

function clearImagesContainer() {
    refs.imageGallery.innerHTML = '';
}