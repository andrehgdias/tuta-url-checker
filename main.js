function debouncePromise(callBack, delay = 1000) {
  let timeoutRef;

  return (...args) => {
    clearTimeout(timeoutRef);

    return new Promise((resolve) => {
      timeoutRef = setTimeout(async () => {
        const result = await callBack(...args);
        resolve(result);
      }, delay);
    });
  };
}

function getReturnType(url) {
  const urlObj = new URL(url);
  const splitPathname = urlObj.pathname.split('/');
  const pathnameEnd = splitPathname[splitPathname.length - 1];
  const regex = /\.[a-zA-Z0-9]+$/;
  if (regex.test(pathnameEnd)) return 'file';
  return 'folder';
}

function checkUrl(url) {
  console.log('🚀 ~ file: main.js:26 ~ checkUrl ~ url:', url);
  const urlExists = Math.random() < 0.5;
  const returnType = urlExists ? getReturnType(url) : null;

  const response = {
    status: 'success',
    data: {
      urlExists,
      returnType,
    },
  };

  return response;
}

const debouncedCheck = debouncePromise(checkUrl, 500);

const handleInput = async ({ target }) => {
  const { value, validity } = target;

  if (!validity.valid) {
    resultSection.classList.remove('valid');
    resultSection.classList.add('invalid');
    return;
  }
  resultSection.classList.remove('invalid');
  resultSection.classList.add('valid');

  resultSection.classList.add('loading');
  debouncedCheck(value).then((result) => {
    resultSection.classList.remove('loading');
    console.log(result);
  });
};

let urlInput = document.getElementById('url-input');
let resultSection = document.getElementById('result');
urlInput.addEventListener('input', handleInput);
