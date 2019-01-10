import data from "./data";
export const setCoverPosition = (cardPosition, state) => {
  const { cover } = state;
  // style the cover so it is in exactly the same position as the card
  cover.style.left = cardPosition.left + "px";
  cover.style.top = cardPosition.top + "px";
  cover.style.width = cardPosition.width + "px";
  cover.style.height = cardPosition.height + "px";
};

export const setCoverColor = (cardStyle, state) => {
  const { cover } = state;
  // style the cover to be the same color as the card
  cover.style.backgroundColor = cardStyle.backgroundColor;
};

export const scaleCoverToFillWindow = (cardPosition, state) => {
  const { cover, windowWidth, windowHeight } = state;
  // calculate the scale and position for the card to fill the page,
  const scaleX = windowWidth / cardPosition.width;
  const scaleY = windowHeight / cardPosition.height;
  const offsetX =
    (windowWidth / 2 - cardPosition.width / 2 - cardPosition.left) / scaleX;
  const offsetY =
    (windowHeight / 2 - cardPosition.height / 2 - cardPosition.top) / scaleY;
  // set the transform on the cover - it will animate because of the transition set on it in the CSS
  cover.style.transform =
    "scaleX(" +
    scaleX +
    ") scaleY(" +
    scaleY +
    ") translate3d(" +
    offsetX +
    "px, " +
    offsetY +
    "px, 0px)";
  //this.props.updateState({ cover, windowWidth, windowHeight });
};

/*
 * This effect is created by taking a separate 'cover' div, placing
 * it in the same position as the clicked card, and animating it to
 * become the background of the opened 'page'.
 * It looks like the card itself is animating in to the background,
 * but doing it this way is more performant (because the cover div is
 * absolutely positioned and has no children), and there's just less
 * having to deal with z-index and other elements in the card
 */
export const animateCoverUp = (card, state) => {
  let { openContentText, openContentImage, pageIsOpen } = state;
  // get the position of the clicked card
  let cardPosition = card.getBoundingClientRect();
  // get the style of the clicked card
  let cardStyle = getComputedStyle(card);
  setCoverPosition(cardPosition, state);
  setCoverColor(cardStyle, state);
  scaleCoverToFillWindow(cardPosition, state);
  // update the content of the opened page
  openContentText.innerHTML =
    "<h1>" + card.children[2].textContent + "</h1>" + data.paragraphText;
  openContentImage.src = card.children[1].src;
  setTimeout(() => {
    // update the scroll position to 0 (so it is at the top of the 'opened' page)
    window.scroll(0, 0);
    // set page to open
    pageIsOpen = true;
  }, 300);
};

export const animateCoverBack = (card, state) => {
  const { cover, currentCard } = state;
  let cardPosition = card.getBoundingClientRect();

  /**
   * the original card may be in a different position,
   * because of scrolling, so the cover position needs to
   * be reset before scaling back down
   */
  setCoverPosition(cardPosition, state);
  scaleCoverToFillWindow(cardPosition, state);
  // animate scale back to the card size and position
  cover.style.transform = `scaleX(1) scaleY(1) translate3d(0px, 0px, 0px)`;
  setTimeout(() => {
    const { cover, openContentText, openContentImage, currentCard } = state;
    let { pageIsOpen } = state;
    // set content back to empty
    openContentText.innerHTML = "";
    openContentImage.src = "";
    // style the cover to 0x0 so it is hidden
    cover.style.width = "0px";
    cover.style.height = "0px";
    pageIsOpen = false;
    // remove the clicked class so the card animates back in
    currentCard.className = currentCard.className.replace(" clicked", "");
  }, 301);
};

// animations on individual cards (by adding/removing card names)
export const animateOutCard = (card, delay) => {
  setTimeout(function() {
    card.className += " out";
  }, delay);
};

export const animateInCard = (card, delay) => {
  setTimeout(function() {
    card.className = card.className.replace(" out", "");
  }, delay);
};

export const animateOtherCards = (card, out, state) => {
  const { cards, nCards } = state;
  let delay = 100;
  for (let i = 0; i < nCards; i++) {
    // animate cards on a stagger, 1 each 100ms
    if (cards[i] === card) continue;
    if (out) animateOutCard(cards[i], delay);
    else animateInCard(cards[i], delay);
    delay += 100;
  }
};
