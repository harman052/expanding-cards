import React, { Component } from "react";
import Cards from "./Cards";
import OpenContent from "./OpenContent";
import {
  setCoverPosition,
  setCoverColor,
  scaleCoverToFillWindow,
  animateCoverUp,
  animateCoverBack,
  animateOutCard,
  animateInCard,
  animateOtherCards
} from "./CommonFunctions";
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
    this.setCoverPosition = setCoverPosition.bind(this);
    this.setCoverColor = setCoverColor.bind(this);
    this.scaleCoverToFillWindow = scaleCoverToFillWindow.bind(this);
    this.animateCoverUp = animateCoverUp.bind(this);
    this.animateCoverBack = animateCoverBack.bind(this);
    this.animateOutCard = animateOutCard.bind(this);
    this.animateInCard = animateInCard.bind(this);
    this.animateOtherCards = animateOtherCards.bind(this);
  }

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

    this.updateState({
      cards,
      nCards,
      cover,
      openContent,
      openContentText,
      openContentImage,
      closeContent
    });
  }

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

        <OpenContent state={this.state} />
      </div>
    );
  }
}

export default App;
