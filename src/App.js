import React, { Component } from "react";
import Cards from "./Cards";
import "./App.css";

class App extends Component {
  //listing vars here so they're in the global scope
  constructor(props) {
    super(props);
    this.state = {
      cards: "",
      nCards: "",
      cover: "",
      openContent: "",
      openContentText: "",
      pageIsOpen: false,
      openContentImage: "",
      closeContent: "",
      windowWidth: null,
      windowHeight: null,
      currentCard: {}
    };
  }

  init() {
    this.resize();
    this.selectElements();
    this.attachListeners();
  }

  // select all the elements in the DOM that are going to be used
  selectElements() {
    let {
      cards,
      nCards,
      cover,
      openContent,
      openContentText,
      openContentImage,
      closeContent
    } = this.state;

    cards = document.getElementsByClassName("card");
    nCards = cards.length;
    cover = document.getElementById("cover");
    openContent = document.getElementById("open-content");
    openContentText = document.getElementById("open-content-text");
    openContentImage = document.getElementById("open-content-image");
    closeContent = document.getElementById("close-content");
  }

  /* Attaching three event listeners here:
  - a click event listener for each card
  - a click event listener to the close button
  - a resize event listener on the window
  */
  attachListeners() {
    const { nCards, closeContent } = this.state;
    for (var i = 0; i < nCards; i++) {
      this.attachListenerToCard(i);
    }
    closeContent.addEventListener("click", this.onCloseClick);
    window.addEventListener("resize", this.resize);
  }

  attachListenerToCard(i) {
    const { cards } = this.state;
    cards[i].addEventListener("click", function(e) {
      var card = this.getCardElement(e.target);
      this.onCardClick(card, i);
    });
  }

  /* When a card is clicked */
  onCardClick(card, i) {
    const { currentCard, openContent } = this.state;
    // set the current card
    currentCard = card;
    // add the 'clicked' class to the card, so it animates out
    currentCard.className += " clicked";
    // animate the card 'cover' after a 500ms delay
    setTimeout(function() {
      this.animateCoverUp(currentCard);
    }, 500);
    // animate out the other cards
    this.animateOtherCards(currentCard, true);
    // add the open class to the page content
    openContent.className += " open";
  }

  /*
   * This effect is created by taking a separate 'cover' div, placing
   * it in the same position as the clicked card, and animating it to
   * become the background of the opened 'page'.
   * It looks like the card itself is animating in to the background,
   * but doing it this way is more performant (because the cover div is
   * absolutely positioned and has no children), and there's just less
   * having to deal with z-index and other elements in the card
   */
  animateCoverUp(card) {
    const { openContentText, openContentImage, pageIsOpen } = this.state;
    // get the position of the clicked card
    var cardPosition = card.getBoundingClientRect();
    // get the style of the clicked card
    var cardStyle = getComputedStyle(card);
    this.setCoverPosition(cardPosition);
    this.setCoverColor(cardStyle);
    this.scaleCoverToFillWindow(cardPosition);
    // update the content of the opened page
    openContentText.innerHTML =
      "<h1>" + card.children[2].textContent + "</h1>" + this.paragraphText;
    openContentImage.src = card.children[1].src;
    setTimeout(function() {
      // update the scroll position to 0 (so it is at the top of the 'opened' page)
      window.scroll(0, 0);
      // set page to open
      pageIsOpen = true;
    }, 300);
  }

  animateCoverBack(card) {
    const { cover, currentCard } = this.state;
    let cardPosition = card.getBoundingClientRect();
    // the original card may be in a different position, because of scrolling, so the cover position needs to be reset before scaling back down
    this.setCoverPosition(cardPosition);
    this.scaleCoverToFillWindow(cardPosition);
    // animate scale back to the card size and position
    cover.style.transform =
      "scaleX(" +
      1 +
      ") scaleY(" +
      1 +
      ") translate3d(" +
      0 +
      "px, " +
      0 +
      "px, 0px)";
    setTimeout(() => {
      const {
        cover,
        openContentText,
        openContentImage,
        currentCard
      } = this.state;
      let { pageIsOpen } = this.state;
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
  }

  setCoverPosition(cardPosition) {
    const { cover } = this.state;
    // style the cover so it is in exactly the same position as the card
    cover.style.left = cardPosition.left + "px";
    cover.style.top = cardPosition.top + "px";
    cover.style.width = cardPosition.width + "px";
    cover.style.height = cardPosition.height + "px";
  }

  setCoverColor(cardStyle) {
    const { cover } = this.state;
    // style the cover to be the same color as the card
    cover.style.backgroundColor = cardStyle.backgroundColor;
  }

  scaleCoverToFillWindow(cardPosition) {
    const { cover, windowWidth, windowHeight } = this.state;
    // calculate the scale and position for the card to fill the page,
    var scaleX = windowWidth / cardPosition.width;
    var scaleY = windowHeight / cardPosition.height;
    var offsetX =
      (windowWidth / 2 - cardPosition.width / 2 - cardPosition.left) / scaleX;
    var offsetY =
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
  }

  // /* When the close is clicked */
  // onCloseClick() {
  //   const { openContent, currentCard } = this.state;
  //   // remove the open class so the page content animates out
  //   openContent.className = openContent.className.replace(" open", "");
  //   // animate the cover back to the original position card and size
  //   this.animateCoverBack(currentCard);
  //   // animate in other cards
  //   this.animateOtherCards(currentCard, false);
  // }

  animateOtherCards(card, out) {
    const { cards, nCards } = this.state;
    var delay = 100;
    for (var i = 0; i < nCards; i++) {
      // animate cards on a stagger, 1 each 100ms
      if (cards[i] === card) continue;
      if (out) this.animateOutCard(cards[i], delay);
      else this.animateInCard(cards[i], delay);
      delay += 100;
    }
  }

  // animations on individual cards (by adding/removing card names)
  animateOutCard(card, delay) {
    setTimeout(function() {
      card.className += " out";
    }, delay);
  }

  animateInCard(card, delay) {
    setTimeout(function() {
      card.className = card.className.replace(" out", "");
    }, delay);
  }

  // this function searches up the DOM tree until it reaches the card element that has been clicked
  getCardElement(el) {
    if (el.className.indexOf("card ") > -1) return el;
    else return this.getCardElement(el.parentElement);
  }

  // resize function - records the window width and height
  // resize() {
  //   const { pageIsOpen, cardPosition, currentCard } = this.state;

  //   let { windowWidth, windowHeight } = this.state;

  //   if (pageIsOpen) {
  //     // update position of cover
  //     cardPosition = currentCard.getBoundingClientRect();
  //     this.setCoverPosition(cardPosition);
  //     this.scaleCoverToFillWindow(cardPosition);
  //   }
  //   windowWidth = window.innerWidth;
  //   windowHeight = window.innerHeight;
  // }

  paragraphText = `<p>Somebody once told me the world is gonna roll me.
  I ain't the sharpest tool in the shed. She was looking
  kind of dumb with her finger and her thumb in the shape
  of an \"L\" on her forehead. Well the years start coming
  and they don't stop coming. Fed to the rules and I hit the
   ground running. Didn't make sense not to live for fun.
   Your brain gets smart but your head gets dumb. So much to do,
   so much to see. So what's wrong with taking the back streets?
    You'll never know if you don't go. You'll never shine if you
    don't glow.</p><p>Hey now, you're an all-star, get your game on,
    go play. Hey now, you're a rock star, get the show on, get paid.
    And all that glitters is gold. Only shooting stars break the
    mold.</p><p>It's a cool place and they say it gets colder.
    You're bundled up now, wait till you get older.
    But the meteor men beg to differ. Judging by the hole in the
    satellite picture. The ice we skate is getting pretty thin.
     The water's getting warm so you might as well swim.
     My world's on fire, how about yours?
     That's the way I like it and I never get bored.</p>`;
  /** -------------------------------------------- */

  // resize function - records the window width and height
  resize() {
    const { pageIsOpen, cardPosition, currentCard } = this.state;
    let { windowWidth, windowHeight } = this.state;

    if (pageIsOpen) {
      // update position of cover
      cardPosition = currentCard.getBoundingClientRect();
      this.setCoverPosition(cardPosition);
      this.scaleCoverToFillWindow(cardPosition);
    }
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    this.updateState({
      pageIsOpen,
      cardPosition,
      currentCard,
      windowWidth,
      windowHeight
    });
  }

  myInit() {
    this.resize();
    let {
      cover,
      openContent,
      openContentText,
      openContentImage,
      closeContent
    } = this.state;
    cover = document.getElementById("cover");
    openContent = document.getElementById("open-content");
    openContentText = document.getElementById("open-content-text");
    openContentImage = document.getElementById("open-content-image");
    closeContent = document.getElementById("close-content");

    this.updateState({
      cover,
      openContent,
      openContentText,
      openContentImage,
      closeContent
    });
  }

  onCloseClick = () => {
    console.log("running");
    const { openContent, currentCard } = this.state;
    // remove the open class so the page content animates out
    openContent.className = openContent.className.replace(" open", "");
    // animate the cover back to the original position card and size
    this.animateCoverBack(currentCard);
    // animate in other cards
    this.animateOtherCards(currentCard, false);
  };

  updateState = function(args) {
    this.setState({
      ...args
    });
  };

  componentDidMount() {
    this.myInit();
  }

  render() {
    return (
      <div>
        <div className="container">
          <Cards
            state={this.state}
            updateState={args => this.updateState(args)}
          />
        </div>

        <div id="cover" className="cover" />

        <div id="open-content" className="open-content">
          <a
            href="#"
            id="close-content"
            className="close-content"
            onClick={this.onCloseClick}
          >
            <span className="x-1" />
            <span className="x-2" />
          </a>
          <img id="open-content-image" src="" alt="" />
          <div className="text" id="open-content-text" />
        </div>
      </div>
    );
  }
}

export default App;
