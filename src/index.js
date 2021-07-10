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
    spinnerModal: document.querySelector('.loader-in-lightbox'),
    loadMoreBtn: document.querySelector('.load-more-btn'),
}

const lightBoxRef = document.querySelector('.js-lightbox');
const modalImageRef = document.querySelector('.lightbox__image');
const closeButtonRef = document.querySelector('.lightbox__button');


refs.searchForm.addEventListener('submit', onSearch);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);
refs.imageGallery.addEventListener('click', onImageClick);
closeButtonRef.addEventListener('click', onModalCloseButton);
lightBoxRef.addEventListener('click', onBackdropClickClose);

function onLoadMore () {
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
            refs.loadMoreBtn.scrollIntoView({
                behavior: 'smooth',
                block: 'end',
            })
        });
}

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

function onModalOpen() {
  window.addEventListener("keydown", onEscPress);
  lightBoxRef.classList.add("is-open");
  refs.spinnerModal.classList.remove('is-hidden');
}

function onModalCloseButton(event) {
  lightBoxRef.classList.remove("is-open");
    modalImageRef.src = "";
    modalImageRef.alt = "";
    
  window.removeEventListener("keydown", onEscPress);
}

function onBackdropClickClose(event) {
  if (event.target.nodeName !== "IMG") {
    onModalCloseButton(event);
  }
}

function openModalWithBigImage(element) {
    const array = [...document.querySelectorAll('img.card-img')];
      const image = array.find(image => image.alt === element.alt);
    refs.spinnerModal.classList.add('is-hidden');
    modalImageRef.src = image.srcset;
    modalImageRef.alt = image.id;
  ; 
}

function onImageClick(e) {
    e.preventDefault();
    const target = e.target;

    if (target.nodeName !== "IMG") return;
    onModalOpen();  
    openModalWithBigImage(target);
}

function onEscPress(event) {
  if (event.key === "Escape") {
    onModalCloseButton(event);
  }
}