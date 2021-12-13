'use strict';

// find elements
const body = document.querySelector('body');
const content = document.querySelector('.content');
const inputContainer = document.querySelector('.input-container');
const inputFiles = document.getElementById('files');
const dropArea = document.querySelector('.input-container label');
const removeImgAll = document.querySelectorAll('.remove-img');
const modal = document.getElementById('modal');

// drag-and-drop realization
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  body.addEventListener(eventName, event => {
    event.preventDefault();
    event.stopPropagation();
  });
});

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, event => {
    inputContainer.classList.add('highlight');
  });
});

['dragleave', 'drop'].forEach((eventName) => {
  dropArea.addEventListener(eventName, event => {
    inputContainer.classList.remove('highlight');
  });
});

dropArea.addEventListener('drop', (event) => {
  const files = event.dataTransfer.files;

  renderImages([...files]);
});

//handling click on 'open files'
inputFiles.addEventListener('change', (event) => {
  const files = event.target.files;

  renderImages([...files]);
  event.target.value = '';
});

//handling click on image
content.addEventListener('click', (event) => {
  const elment = event.target;
  const elementContainer = elment.parentNode;

  //open modal with image
  if (elment === elementContainer.querySelector('.image')) {
    modal.innerHTML = `
      <img src="${elment.src}">
    `;
    modal.classList.add('active');
    overlay.classList.add('active');
  }

  if (elment !== elementContainer.querySelector('.remove-img')) return;

  //remove image
  if (elementContainer !== inputContainer) {
    elementContainer.classList.add('delete');
    setTimeout(() => elementContainer.remove(), 400);
  }
});

//handling click on modal (close madal)
modal.addEventListener('click', () => {
  modal.classList.remove('active');
  overlay.classList.remove('active');
  setTimeout(() => modal.querySelector('img').remove(), 200);
});

//session storage
window.onunload = () => {
  let imgInfo = [];
  const images = [...document.querySelectorAll('.image-container')];

  if (images.length === 0) {
    sessionStorage.removeItem('imgInfo');

    return;
  };

  images.forEach(image => {
    const imgName = image.querySelector('p').textContent;
    const imgURL = image.querySelector('img').src;

    imgInfo.push({ imgName, imgURL })
  });

  if (imgInfo) {
    sessionStorage.setItem('imgInfo', JSON.stringify(imgInfo));
  }
};

window.onload = () => {
  const images = JSON.parse(sessionStorage.getItem('imgInfo'));

  if (!images) return;

  images.forEach(({ imgName, imgURL }) => {
    insertImageContainer(imgName, imgURL);
  });
};

//FUNCTIONS
//handling file info
function renderImages(imgFiles) {
  imgFiles.forEach(async file => {
    if (file.type.startsWith('image/')) {
      const imgName = file.name;

      const readURL = file => {
        return new Promise((response, reject) => {
            const reader = new FileReader();
            reader.onload = () => response(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
      };
      const imgURL = await readURL(file);

      insertImageContainer(imgName, imgURL);
    }
  });
};

//HTML image container
function insertImageContainer(imgName, imgURL) {
  content.insertAdjacentHTML('beforeend', `
    <div class="container image-container">
      <img class="image" src="${imgURL}">
      <p><span>${imgName}</span></p>
      <div class="remove-img">&#10006;</div>
    </div>
  `);
};
