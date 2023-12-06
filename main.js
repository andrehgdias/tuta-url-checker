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
  const urlExists = Math.random() < 0.55;
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

const setResult = (result) => {
  const { status, data } = result;
  const { urlExists, returnType, reason } = data;

  const title = document.getElementById('title');
  const body = document.getElementById('body');

  if (status === 'fail') {
    resultSection.classList.remove('valid');
    resultSection.classList.add('invalid');
    title.innerText = status;
    body.innerText = reason;
    return;
  }

  resultSection.classList.remove('invalid');
  resultSection.classList.add('valid');

  const bodyText = urlExists
    ? `URL exists, returning a ${returnType}!`
    : "Although valid, this URL doesn't exists.";

  title.innerText = 'Valid URL';
  body.innerText = bodyText;
};

const debouncedCheck = debouncePromise(checkUrl, 500);

const handleInput = async ({ target }) => {
  const { value, validity } = target;

  if (!validity.valid) {
    setResult({ status: 'fail', data: { reason: 'Invalid URL format.' } });
    return;
  }

  resultSection.classList.add('loading');
  debouncedCheck(value).then((result) => {
    resultSection.classList.remove('loading');
    setResult(result);
  });
};

let urlInput = document.getElementById('url-input');
let resultSection = document.getElementById('result');
urlInput.addEventListener('input', handleInput);
