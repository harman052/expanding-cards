import React, { Component } from "react";
import data from "./data";

class Cards extends Component {
  // constructor(props) {
  //   super(props);
  // }
  setCoverPosition = function(cardPosition, state) {
    const { cover } = state;
    // style the cover so it is in exactly the same position as the card
    cover.style.left = cardPosition.left + "px";
    cover.style.top = cardPosition.top + "px";
    cover.style.width = cardPosition.width + "px";
    cover.style.height = cardPosition.height + "px";
    //this.props.updateState({ cover });
  };

  setCoverColor = function(cardStyle, state) {
    const { cover } = state;
    // style the cover to be the same color as the card
    cover.style.backgroundColor = cardStyle.backgroundColor;
    //this.props.updateState({ cover });
  };

  scaleCoverToFillWindow = function(cardPosition, state) {
    const { cover, windowWidth, windowHeight } = state;
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
  animateCoverUp(card, state) {
    let { openContentText, openContentImage, pageIsOpen } = state;
    // get the position of the clicked card
    let cardPosition = card.getBoundingClientRect();
    // get the style of the clicked card
    let cardStyle = getComputedStyle(card);
    this.setCoverPosition(cardPosition, state);
    this.setCoverColor(cardStyle, state);
    this.scaleCoverToFillWindow(cardPosition, state);
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
    //this.props.updateState({ openContentText, openContentImage, pageIsOpen });
  }

  // animations on individual cards (by adding/removing card names)
  animateOutCard = function(card, delay) {
    setTimeout(function() {
      card.className += " out";
    }, delay);
  };

  animateInCard = function(card, delay) {
    setTimeout(function() {
      card.className = card.className.replace(" out", "");
    }, delay);
  };

  animateOtherCards = function(card, out, state) {
    const { cards, nCards } = state;
    var delay = 100;
    for (var i = 0; i < nCards; i++) {
      // animate cards on a stagger, 1 each 100ms
      if (cards[i] === card) continue;
      if (out) this.animateOutCard(cards[i], delay);
      else this.animateInCard(cards[i], delay);
      delay += 100;
    }
  };

  /* When a card is clicked */
  onCardClick = (state, e) => {
    let { currentCard, openContent } = state;
    // set the current card
    currentCard = e.currentTarget;
    // add the 'clicked' class to the card, so it animates out
    currentCard.className += " clicked";
    // animate the card 'cover' after a 500ms delay
    setTimeout(() => {
      this.animateCoverUp(currentCard, state);
    }, 500);
    // animate out the other cards
    this.animateOtherCards(currentCard, true, state);
    // add the open class to the page content
    //openContent = document.getElementById("open-content");
    openContent.className += " open";
    this.props.updateState({ currentCard, openContent });
  };

  generateCards = (colNum, state) => {
    let card = [];
    /**
     * Iterate over each of the items (cards) and match
     * their "colNum" property with the argument (colNum)
     * passed. If matched, it means current card belongs
     * to column number passed as argument. Then, card is
     * wrapped into its wrapper class and pushed as an
     * element into an array, which is returned from arrow
     * function to parent function.
     */
    data.cards.map((item, index) => {
      if (item.colNum === colNum) {
        let cardClass = `card card-color-${index}`;
        card.push(
          <div
            key={index}
            className={cardClass}
            onClick={e => this.onCardClick(state, e)}
          >
            <div className="border" />
            <img src={item.imgSrc} alt="" />
            <h1>{item.heading}</h1>
          </div>
        );
      }
      /**
       * Returning from arrow function
       */
      return card;
    });
    /**
     * Returning from parent function
     */
    return card;
  };

  generateCols = state => {
    let cols = [];
    /**
     * Call generateCards methods for each
     * of the columns.
     */
    for (let i = 0; i < data.totalColumns; i++) {
      let columnClass = `card-column column-${i}`;
      cols.push(
        <div key={i} className={columnClass}>
          {this.generateCards(i, state)}
        </div>
      );
    }
    return cols;
  };
  render() {
    return <>{this.generateCols(this.props.state)}</>;
  }
}

export default Cards;
