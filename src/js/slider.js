import { ScrollSnapSlider } from "scroll-snap-slider";

const sliderSimpleElement = document.querySelector(
  ".scroll-snap-slider.-simple"
);
const slides = sliderSimpleElement.getElementsByClassName("scroll-snap-slide");
const sliderSimple = new ScrollSnapSlider({ element: sliderSimpleElement });

sliderSimple.name = "simple";

const buttons = document.querySelectorAll(".indicators.-simple .indicator");
const currentIndicator = document.querySelector(
  ".indicators.-simple .current-indicator"
);

const setSelected = function (event) {
  const slideElementIndex = event.detail;
  const slideElement = slides[slideElementIndex];

  for (const button of buttons) {
    const isActive = button.classList.toggle(
      "-active",
      button.dataset.index === slideElement.dataset.index
    );
    if (isActive) {
      button.appendChild(currentIndicator);
    }
  }
};

for (const button of buttons) {
  button.addEventListener("click", function (event) {
    event.preventDefault();

    const slideElementIndex = Array.prototype.slice
      .call(slides)
      .findIndex((item) => item.dataset.index === button.dataset.index);

    sliderSimple.slideTo(slideElementIndex);
  });
}

sliderSimple.addEventListener("slide-pass", setSelected);
sliderSimple.addEventListener("slide-stop", setSelected);
