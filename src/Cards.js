import React, { Component } from "react";
import { animateCoverUp, animateOtherCards } from "./CommonFunctions";
import data from "./data";

class Cards extends Component {
  constructor(props) {
    super(props);
    this.animateCoverUp = animateCoverUp.bind(this);
    this.animateOtherCards = animateOtherCards.bind(this);
  }

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
      // Returning from arrow function
      return card;
    });
    // Returning from parent function
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
