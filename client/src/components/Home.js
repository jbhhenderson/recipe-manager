import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
} from 'reactstrap';
import "./Home.css"
import { getTopRecipes } from '../managers/recipeManager';
import { useNavigate } from 'react-router-dom';

export default function Home(args) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getTopRecipes().then(setItems)
  }, [])

  const next = () => {
    if (animating) return;
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
    setActiveIndex(nextIndex);
  };

  const previous = () => {
    if (animating) return;
    const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
    setActiveIndex(nextIndex);
  };

  const goToIndex = (newIndex) => {
    if (animating) return;
    setActiveIndex(newIndex);
  };

  const slides = items.map((item) => {
    return (
      <CarouselItem
        onExiting={() => setAnimating(true)}
        onExited={() => setAnimating(false)}
        key={item.id}
      >
        <img src={item.image}
            style={{
                height: "25rem",
                width: "20rem",
            }}
            onClick={() => navigate(`recipes/${item.id}`)}
        />
        <CarouselCaption
          captionText={item.tagline}
          captionHeader={item.name}
          />          
      </CarouselItem>
    );
  });

  return (
  <div>
    <h2 style={{margin: "auto", width: "30%"}}>Welcome to your Recipe Manager</h2>
    <h5 style={{margin: "auto", width: "25%"}}>Check out some of our best recipes below</h5>
  <div style={{borderStyle: "solid", marginLeft: "20rem", marginRight: "20rem", marginTop: "5rem"}}>
    <Carousel
      dark
      className='.carousel'
      activeIndex={activeIndex}
      next={next}
      previous={previous}
      {...args}
    >
      <CarouselIndicators
        items={items}
        activeIndex={activeIndex}
        onClickHandler={goToIndex}
      />
      {slides}
      <CarouselControl
        direction="prev"
        directionText="Previous"
        onClickHandler={previous}
      />
      <CarouselControl
        direction="next"
        directionText="Next"
        onClickHandler={next}
      />
    </Carousel>
    </div>
    </div>
  );
}