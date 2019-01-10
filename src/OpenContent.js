import React, { Component } from "react";
import { animateCoverBack, animateOtherCards } from "./CommonFunctions";

class OpenContent extends Component {
  constructor(props) {
    super(props);
    this.animateCoverBack = animateCoverBack.bind(this);
    this.animateOtherCards = animateOtherCards.bind(this);
  }

  onCloseClick = () => {
    const { openContent, currentCard } = this.props.state;
    // remove the open class so the page content animates out
    openContent.className = openContent.className.replace(" open", "");
    // animate the cover back to the original position card and size
    this.animateCoverBack(currentCard, this.props.state);
    // animate in other cards
    this.animateOtherCards(currentCard, false, this.props.state);
  };

  render() {
    return (
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
    );
  }
}

export default OpenContent;
