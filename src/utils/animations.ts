import { keyframes } from '@emotion/react';

const hostStar = keyframes`
  from {
    transform: rotate(0);
  }

  to {
    transform: rotate(360deg);
  }
`;

const bounce = keyframes`
  0% {
    transform: translateY(0px) rotate(0deg);
    transform-origin: right bottom;
  }

  25% {
    transform: translateY(-10px) rotate(-10deg);
    transform-origin: right bottom;
  }

  50% {
    transform: translateY(0px) rotate(0deg);
    transform-origin: left bottom;
  }

  75% {
    transform: translateY(-10px) rotate(10deg);
    transform-origin: left bottom;
  }

  100% {
    transform: translateY(0px) rotate(0deg);
    transform-origin: right bottom;
  }
`;

const hover = (offset: number = 5) => keyframes`
  from {
    transform: translateY(0px);
  }

  to {
    transform: translateY(${offset}px);
  }
`;

const animations = {
  hostStar,
  bounce,
  hover
};

export default animations;
