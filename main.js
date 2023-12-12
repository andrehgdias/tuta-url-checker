function debouncePromise(callBack, delay = 1000) {
  let timeoutRef;

  return (...args) => {
    console.log(args);
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

function mockServerRequest(url) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = checkUrl(url);
      resolve(response);
    }, 2500);
  });
}

const setAppStatus = (result) => {
  const { status, data } = result;
  const { urlExists, returnType, reason } = data;

  const title = document.getElementById('title');
  const body = document.getElementById('body');

  switch (status) {
    case 'loading':
      resultSection.classList.remove('valid');
      resultSection.classList.remove('invalid');
      resultSection.classList.add('loading');
      title.innerText = status;
      body.innerText = '';
      break;
    case 'fail':
      resultSection.classList.remove('valid');
      resultSection.classList.add('invalid');
      title.innerText = status;
      body.innerText = reason;
      break;
    case 'success':
      resultSection.classList.remove('invalid');
      resultSection.classList.add('valid');

      const bodyText = urlExists
        ? `URL exists, returning a ${returnType}!`
        : "Although valid, this URL doesn't exists.";

      title.innerText = 'Valid URL';
      body.innerText = bodyText;
      break;
    default:
      resultSection.classList.remove('valid');
      resultSection.classList.add('invalid');
      title.innerText = 'Error';
      body.innerText = 'Something went wrong, please try again!';
      break;
  }
  return;
};

const debouncedCheck = debouncePromise(mockServerRequest, 500);

const handleInput = async ({ target }) => {
  const { value, validity } = target;

  if (!validity.valid) {
    setAppStatus({ status: 'fail', data: { reason: 'Invalid URL format.' } });
    return;
  }

  setAppStatus({ status: 'loading', data: {} });

  const response = await debouncedCheck(value);
  console.log('~ Value:', value);
  console.log('~ handleInput ~ debouncedCheck response:', response);
  resultSection.classList.remove('loading');
  setAppStatus(response);
};

let urlInput = document.getElementById('url-input');
let resultSection = document.getElementById('result');
urlInput.addEventListener('input', handleInput);
