const MULTIPLIER = 100; // for debugging, 1000 for prod
const TIMER = 4 * MULTIPLIER * 60; // 1000 = 4 seconds
const INTERVAL = 5 * MULTIPLIER * 60; // 1000 = 5 minutes
const items = [
  {
    html: `Wanna chat later?`,
    command: `!twitter`,
    img: 'icon_twitter.png'
  },
  // {
  //   html: `Follower goal: 1500</br>Reward: Giveaway?`,
  //   img: 'star-fill.svg'
  // },
  {
    html: `Aus/SEA Splatoon:`,
    command: `!oce`,
    img: 'oceanink_logo.png',
  },
  {
    html: `Art credit:`,
    command: `!art`,
    img: 'brush.svg',
  },
  {
    html: `Wanna chat later?`,
    command: `!discord`,
    img: 'icon_discord.png'
  },
  {
    html: `My Splatoon team:`,
    command: `!riptide`,
    img: 'rt_logo.png'
  },
  {
    html: `My friend code:`,
    command: `!fc`,
    img: 'person-plus-fill.svg'
  },
  {
    html: `Hoodies and things:`,
    command: `!merch`,
    img: 'baseline-free_breakfast-24px.png'
  }
  // {
  //   html: `Share the love?`,
  //   command: `!tweet`,
  //   img: 'heart-fill.svg'
  // }
];

const generateImage = (imgPath, className, fullsize) => {
  
  const isSvg = imgPath.endsWith('.svg');
  const image = document.createElement('img');
  image.className = isSvg ? `${className} socials-svg` : className;
  image.src = `../images/${imgPath}`;
  if (isSvg) {
    const size = fullsize ? '53' : '23';
    image.style = `height: ${size}px; width: ${size}px; padding: 5px 8px 5px 10px; filter: invert(100%);`;
  } else {
    const size = fullsize ? '63' : '26';
    image.style = `height: ${size}px; padding: 0 8px 0 10px;`;
  }
  return image;
};

const generateMainScreen = (fullsize) => {
  const wrapper = document.createElement('div');
  wrapper.id = "socials-main-wrapper";

  const images = ['icon_twitter.png', 'icon_youtube.png', 'icon_discord.png'];

  for (i in images) {
    const img = images[i];
    wrapper.appendChild(generateImage(img, "socials-main-img", fullsize));
  }
  return wrapper;
};

const twoLineText = (div, item) => {
  const text = document.createElement('p');
  text.id = "socials-text";
  text.innerHTML = item.html;
  div.appendChild(text);

  if (item.command) {
    const cmd = document.createElement('p');
    cmd.id = "socials-command";
    cmd.innerHTML = item.command;
    div.appendChild(cmd);
  }
  // mutation side-effect
};

const oneLineText = (div, item) => {
  const text = document.createElement('p');
  text.id = "socials-text";
  text.innerHTML = item.html;
  
  if (item.command) {
    const cmd = document.createElement('span');
    cmd.id = "socials-command";
    cmd.innerHTML = `&nbsp;${item.command}`;
    text.appendChild(cmd);
  }

  div.appendChild(text);
  // mutation side-effect
};

const generateScreen = (item, fullsize) => {
  const wrapper = document.createElement('div');
  wrapper.id = "socials-info-wrapper";

  if (item.img) {
    wrapper.appendChild(generateImage(item.img, "socials-img", fullsize));
  }

  const div = document.createElement('div');

  fullsize ? twoLineText(div, item) : oneLineText(div, item);

  wrapper.appendChild(div);

  return wrapper;
};

const initSocials = (socialsWrapper, fullsize=true) => {
  let index = 0;

  const mainScreen = generateMainScreen(fullsize);

  const ANIMATION_END = 'animationend';

  const replace = (outAnim, inAnim, incrementIndex) => (oldElem, newElem) => {
    newElem.classList = [];
    oldElem.classList = [outAnim];
    if (incrementIndex) {
      index === items.length - 1 ? index = 0 : index += 1;
    }
    const handler = () => {
      oldElem.classList = [];
      socialsWrapper.removeChild(oldElem);

      newElem.classList = [inAnim];
      socialsWrapper.appendChild(newElem);

      oldElem.removeEventListener(ANIMATION_END, handler);
    };
    oldElem.addEventListener(ANIMATION_END, handler);
  };

  const replaceInfo = replace('slideright', 'slidedown', true);
  const replaceMain = replace('slideup', 'slideleft', false);

  socialsWrapper.appendChild(mainScreen);

  // const item = items[index];
  // replaceMain(socialsWrapper.children[0], generateScreen(item.html, item.img));


  setInterval(() => {
    console.log(index);
    const item = items[index];
    replaceMain(socialsWrapper.children[0], generateScreen(item, fullsize));

    setTimeout(() => {
      replaceInfo(socialsWrapper.children[0], mainScreen);
    }, TIMER);
  }, INTERVAL)
}