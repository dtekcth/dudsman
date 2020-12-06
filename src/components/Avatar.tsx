import { css } from '@emotion/react';
import React, { useEffect } from 'react';
import 'twin.macro';
import animations from '../utils/animations';
import { motion } from 'framer-motion';
import { useTimeout } from '../utils';
import { AvatarType } from '../../common/models/common';
import { useDebounce } from '../utils/hooks';

export interface AvatarProps {
  name?: string;
  className?: string;
  type: AvatarType;
  size?: number;
  score?: number;
  animated?: boolean;
  onKick?: () => void;
  onGiveTurn?: () => void;
}

const AvatarAction: React.FC<{ onClick?: () => void; delay?: number }> = ({
  children,
  onClick,
  delay = 0
}) => (
  <div
    css={css`
      padding: 0.1rem 0.5rem;

      animation: ${animations.hover()} 1.5s alternate infinite ease-in-out;
      animation-delay: ${delay}s;
    `}
    tw="text-center uppercase font-bold mt-1 text-white tracking-widest rounded bg-black bg-opacity-50 hover:bg-opacity-60 transition duration-200 cursor-pointer"
    onClick={() => onClick?.()}>
    <span
      css={css`
        line-height: 22px;
      `}>
      <span
        css={css`
          line-height: 0;
          vertical-align: -0.125em;
          display: inline-block;
        `}>
        {children}
      </span>
    </span>
  </div>
);

const Avatar: React.FC<AvatarProps> = ({
  className,
  type,
  size = 80,
  score,
  name,
  animated = true,
  onKick,
  onGiveTurn
}) => {
  const scoreDebounced = useDebounce(score, 2500);

  const [bubble, setBubble] = React.useState(false);
  const timeout = useTimeout();

  useEffect(() => {
    setBubble(true);
    const timer = timeout(() => {
      setBubble(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [scoreDebounced]);

  let avatarElem: React.ReactNode;
  const svgStyle =
    animated &&
    css`
      animation: ${animations.bounce} 1.5s infinite;
    `;

  switch (type) {
    case 'cocktail':
      avatarElem = (
        <svg width={size} height={size} viewBox="206 -206 512 512" css={svgStyle}>
          <g>
            <g transform="translate(38)">
              <path
                fill="#FDFEFE"
                d="M602.7-100.8c-15.7 6.5-63.2 15.1-142.1 15.1s-126.4-8.6-142.1-15.1c15.7-6.4 63.2-15.1 142.1-15.1s126.4 8.7 142.1 15.1z"
              />
              <path
                fill="#2e2e30"
                d="M626.5-103.5c-2.2-11.6-18.6-19-53.8-24.6-30-4.8-69.8-7.4-112.1-7.4-42.2 0-82 2.6-112.1 7.4-35.2 5.6-51.7 13.1-53.8 24.7-.2.9-.3 1.8-.3 2.7 0 13.1 16.2 21.3 54.1 27.4 30 4.8 69.8 7.4 112.1 7.4s82-2.6 112.1-7.4c37.9-6 54.1-14.2 54.1-27.4 0-1-.1-1.9-.3-2.8zm-165.9-12.4c78.9 0 126.4 8.7 142.1 15.1-15.7 6.5-63.2 15.1-142.1 15.1s-126.4-8.6-142.1-15.1c15.7-6.4 63.2-15.1 142.1-15.1z"
              />
              <path
                fill="#FDFEFE"
                d="M460.6-82.1c-72.7 0-134.8-7.3-158.8-17.6L459.4 39.8 614.9-97.9c-26.8 9.3-85.8 15.8-154.3 15.8"
              />
              <path fill="#F5903D" d="M548.3-53.3l-88.9 78.8-89.1-78.8z" />
              <path
                fill="#010201"
                fillOpacity="0.3"
                d="M576.9-78.6L459.4 25.5 438.8 7.3l91.5-81.1c17.1-1.1 32.8-2.8 46.6-4.8z"
              />
              <path
                fill="#2e2e30"
                d="M341.1-79.1L459.4 25.5 576.9-78.6c-31.2 4.6-72.1 7.2-116.3 7.2-45.7 0-87.9-2.8-119.5-7.7M459.4 50.5c-2.5 0-5.1-.9-7.1-2.7L294.6-91.7c-3.9-3.5-4.8-9.3-1.9-13.7 2.8-4.4 8.5-6.2 13.3-4.1 19.5 8.3 74.9 16.7 154.6 16.7 65.1 0 124.3-6 150.7-15.2 4.9-1.7 10.2.3 12.8 4.7 2.6 4.4 1.7 10-2.1 13.4L466.5 47.8c-2 1.8-4.6 2.7-7.1 2.7"
              />
              <path
                fill="#FDFEFE"
                d="M552.2 270.2c0 12.6-41 22.8-91.6 22.8-50.6 0-91.6-10.2-91.6-22.8s41-22.8 91.6-22.8c50.6-.1 91.6 10.2 91.6 22.8"
              />
              <path
                fill="#2e2e30"
                d="M382 270.2c8.9 5 36 12.1 78.6 12.1 42.6 0 69.7-7.1 78.6-12.1-8.9-5.1-36-12.2-78.6-12.2s-69.7 7.1-78.6 12.2m78.6 33.5c-17.1 0-102.3-1.6-102.3-33.5s85.3-33.5 102.3-33.5c17.1 0 102.3 1.6 102.3 33.5s-85.2 33.5-102.3 33.5"
              />
              <path
                fill="#2e2e30"
                d="M459.4 258c-5.9 0-10.7-4.8-10.7-10.7V39.8c0-5.9 4.8-10.7 10.7-10.7 5.9 0 10.7 4.8 10.7 10.7v207.5c0 6-4.8 10.7-10.7 10.7"
              />
              <path
                fill="#fbae3a"
                d="M282.3-192.4c-44.8 9.6-73.3 53.7-63.6 98.3L381-129c-9.7-44.6-53.9-73-98.7-63.4"
              />
              <path
                fill="#2E2E30"
                d="M300-183.6c-5.1 0-10.3.5-15.4 1.6-18.9 4.1-35.1 15.2-45.5 31.4-8.5 13.1-12.4 28.3-11.4 43.6l139.8-30c-5.4-14.4-15.3-26.6-28.5-35.1-11.8-7.5-25.3-11.5-39-11.5M218.6-83.3c-5 0-9.4-3.4-10.5-8.4-5.3-24.4-.7-49.4 12.8-70.4 13.6-21 34.5-35.4 59-40.7 24.5-5.3 49.6-.7 70.6 12.8 21 13.5 35.6 34.4 40.8 58.8.6 2.8.1 5.7-1.5 8.1-1.5 2.4-4 4.1-6.8 4.7L220.9-83.6c-.8.2-1.5.3-2.3.3"
              />
              <path fill="#FBAE3A" d="M299.8-111.5l-63.4-53.4" />
              <path
                fill="#2E2E30"
                d="M299.8-100.8c-2.4 0-4.9-.8-6.9-2.5l-63.4-53.4c-4.5-3.8-5.1-10.6-1.3-15.1s10.6-5.1 15.1-1.3l63.4 53.4c4.5 3.8 5.1 10.6 1.3 15.1-2.1 2.5-5.1 3.8-8.2 3.8"
              />
              <path fill="#FBAE3A" d="M299.8-111.5l35.6-74.7" />
              <path
                fill="#2E2E30"
                d="M299.8-100.8c-1.5 0-3.1-.3-4.6-1-5.4-2.5-7.6-8.9-5.1-14.2l35.6-74.7c2.5-5.3 8.9-7.6 14.3-5.1s7.6 8.9 5.1 14.2l-35.6 74.7c-1.8 3.8-5.7 6.1-9.7 6.1"
              />
              <path
                fill="#FFF"
                stroke="#2E2E30"
                strokeWidth="22"
                strokeMiterlimit="10"
                d="M562.3-55.9c0 25.7-20.9 46.6-46.6 46.6-25.7 0-46.6-20.9-46.6-46.6 0-4 .5-7.9 1.4-11.6L537-97.3c15 7.8 25.3 23.4 25.3 41.4z"
              />
              <circle fill="#2E2E30" cx="503.8" cy="-64.4" r="11.5" />
              <g>
                <path
                  fill="#FFF"
                  stroke="#2E2E30"
                  strokeWidth="22"
                  strokeMiterlimit="10"
                  d="M354.9-55.9c0 25.7 20.9 46.6 46.6 46.6 25.7 0 46.6-20.9 46.6-46.6 0-4-.5-7.9-1.4-11.6l-66.5-29.9c-15.1 7.9-25.3 23.5-25.3 41.5z"
                />
                <circle fill="#2E2E30" cx="413.4" cy="-64.4" r="11.5" />
              </g>
            </g>
          </g>
        </svg>
      );
      break;

    case 'wine':
      avatarElem = (
        <svg width={size} height={size} viewBox="-248.5 -205.5 512 512" css={svgStyle}>
          <path
            fill="#FFF"
            d="M95.9 275c-8 7.4-38.2 18.8-88.4 18.8s-80.4-11.4-88.4-18.8c7.5-7 34.6-17.4 79.4-18.7h18c44.8 1.3 71.9 11.7 79.4 18.7z"
          />
          <path
            d="M7.2-6C-61.5-6-95.6-16.1-105.3-22.7c10.7-9.2 52.2-23 112.5-23S109-32 119.7-22.7C110-16.1 76-6 7.2-6z"
            fill="#7f0a18"
          />
          <path
            d="M93.1 72.8c-21.5 25-52.7 39.3-85.6 39.3s-64.1-14.3-85.6-39.3c-19.6-22.8-29.1-52.3-26.8-82C-80.5 1.3-34 4 7.2 4 48.7 4 95.7 1.2 119.9-9.5c2.3 29.9-7.1 59.5-26.8 82.3z"
            fill="#a8162f"
          />
          <path
            fill="#FFF"
            d="M-80.8-176c-.1 0-.1-.1-.2-.1 13.1-7.9 44.8-17.3 88.5-17.3 43.6 0 75.4 9.5 88.5 17.3-.1 0-.2.1-.3.1-1.4.6-3 1.3-4.8 1.9-.2.1-.3.1-.5.2-1.9.7-3.9 1.3-6.3 2-.1 0-.2 0-.2.1-2.3.7-4.9 1.3-7.7 1.9-.4.1-.8.2-1.3.3-2.8.6-5.8 1.2-9 1.7-.4.1-.9.1-1.4.2-3.3.5-6.8 1-10.6 1.5-.1 0-.3 0-.4.1-3.8.4-7.9.8-12.1 1.2-.8 0-1.5.1-2.3.2-4.3.3-8.7.6-13.4.7-.8 0-1.7.1-2.6.1-5 .2-10.2.3-15.7.3s-10.7-.1-15.6-.3c-.9 0-1.8-.1-2.7-.1-4.7-.2-9.2-.4-13.4-.7-.8 0-1.6-.1-2.3-.2-4.2-.3-8.2-.7-11.9-1.2h-.3c-3.8-.4-7.3-1-10.7-1.5l-1.8-.3c-3.2-.5-6.1-1.1-8.8-1.7-.4-.1-.8-.2-1.3-.3-2.7-.6-5.2-1.2-7.5-1.9h-.2c-2.3-.6-4.4-1.3-6.2-2-.3-.1-.6-.2-.8-.3-1.8-.6-3.4-1.2-4.7-1.9z"
          />
          <path
            fill="#FFF"
            d="M7.2-51.3c-25.2 0-77.9 3.3-108.3 15.7l19-129.3c.1 0 .2.1.4.1 1.7.6 3.5 1.3 5.5 1.9.1 0 .1 0 .2.1 2 .6 4.3 1.2 6.7 1.7.2 0 .3.1.4.1 2.4.5 5 1 7.8 1.5.4.1.7.1 1.1.2 2.7.5 5.7.9 8.9 1.3.5.1 1 .1 1.5.2 3.2.4 6.6.7 10.2 1.1.6.1 1.2.1 1.8.2 3.7.3 7.6.6 11.8.8.6 0 1.2.1 1.8.1 4.4.2 8.9.4 13.8.5h1.5c5.2.1 10.6.2 16.3.2s11.2-.1 16.4-.2h1.5c4.9-.1 9.4-.3 13.8-.5.6 0 1.2-.1 1.8-.1 4.2-.2 8.1-.5 11.8-.8.6-.1 1.2-.1 1.8-.1 3.6-.3 7-.7 10.2-1.1.5-.1 1-.1 1.5-.2 3.1-.4 6.1-.8 8.9-1.3.4-.1.7-.1 1.1-.2 2.8-.5 5.4-1 7.8-1.5.2 0 .3-.1.4-.1 2.4-.6 4.7-1.1 6.7-1.7.1 0 .1 0 .2-.1 2-.6 3.8-1.2 5.5-1.9.1 0 .2-.1.4-.1l19 129.6C85.9-48 32.5-51.3 7.2-51.3z"
          />
          {/* <circle fill="#2E2E30" cx="-10.5" cy="41.5" r="9"/>
                <circle fill="#2E2E30" cx="-79.2" cy="17.4" r="9"/>
                <circle fill="#2E2E30" cx="7.5" cy="86.4" r="9"/>
                <circle fill="#2E2E30" cx="77.7" cy="37.6" r="9"/>
                <circle fill="#2E2E30" cx="-56.8" cy="55.6" r="9"/>
                <circle fill="#2E2E30" cx="25.5" cy="32.5" r="9"/> */}
          <path
            fill="#2E2E30"
            d="M16.5 243.7V126.4c33.1-2.4 63.9-17.6 85.7-43 23.7-27.6 34.2-64.1 28.8-100.1l-24.6-162c-.2-1.3-.8-2.5-1.5-3.6-11.9-22.9-93.7-23.2-97.4-23.2-3.7 0-84.8.3-97.2 22.9-.9 1.2-1.5 2.6-1.7 4.1l-22.9 151c-.4 1.4-.7 2.8-.7 4.2 0 .1 0 .2.1.3l-1 6.3c-5.5 36 5 72.5 28.8 100.1 21.8 25.3 52.6 40.6 85.7 43v117.4c-28.7.6-98.8 4.9-98.8 31.3 0 29.9 89.8 31.4 107.8 31.4s107.8-1.5 107.8-31.4c-.1-26.5-70.2-30.7-98.9-31.4zM83.9-177c-.1 0-.2.1-.3.1-1.2.4-2.6.8-4.1 1.2-.1 0-.3.1-.4.1-1.6.4-3.4.8-5.4 1.2h-.2c-2 .4-4.2.8-6.6 1.1-.4.1-.7.1-1.1.2-2.4.4-5 .7-7.8 1-.4 0-.8.1-1.2.1-2.9.3-5.9.6-9.1.9h-.4c-3.3.3-6.8.5-10.5.7-.7 0-1.3.1-2 .1-3.7.2-7.5.3-11.6.4H21c-4.3.1-8.8.2-13.6.2-4.8 0-9.2-.1-13.5-.2-.8 0-1.6 0-2.4-.1-4.1-.1-7.9-.3-11.6-.4-.7 0-1.3-.1-2-.1-3.6-.2-7.1-.4-10.3-.7h-.2c-3.3-.3-6.3-.6-9.2-.9-.5-.1-1-.1-1.5-.2-2.7-.3-5.3-.7-7.6-1-.4-.1-.7-.1-1.1-.2-2.3-.4-4.5-.7-6.5-1.1h-.1c-2-.4-3.8-.8-5.4-1.2-.2-.1-.5-.1-.7-.2-1.5-.4-2.9-.8-4-1.1-.1 0-.1 0-.2-.1 11.3-4.8 38.7-10.5 76.4-10.5 37.7.2 65.1 5.9 76.4 10.7zM-76-160.6c.1 0 .2.1.3.1 1.6.6 3.2 1.1 5.1 1.7.1 0 .1 0 .2.1 1.9.5 4 1.1 6.3 1.6.1 0 .3.1.4.1 2.2.5 4.7.9 7.2 1.4.3.1.6.1 1 .2 2.6.4 5.3.8 8.2 1.2.5.1.9.1 1.4.2 3 .4 6.1.7 9.5 1 .6 0 1.1.1 1.7.1 3.4.3 7.1.5 11 .7.6 0 1.1.1 1.7.1 4.1.2 8.3.4 12.8.5h1.4c4.8.1 9.8.2 15.2.2s10.4-.1 15.2-.2H24c4.5-.1 8.8-.3 12.8-.5.6 0 1.1-.1 1.7-.1 3.9-.2 7.5-.4 11-.7.6 0 1.1-.1 1.7-.1 3.4-.3 6.5-.6 9.5-1 .5-.1.9-.1 1.4-.2 2.9-.4 5.7-.7 8.2-1.2.3-.1.6-.1 1-.2 2.6-.4 5-.9 7.3-1.4.1 0 .3-.1.4-.1 2.3-.5 4.4-1 6.3-1.6h.2c1.9-.5 3.6-1.1 5.1-1.7.1 0 .2-.1.3-.1l17.7 116.8C80.4-55.2 30.8-58.2 7.2-58.2c-23.4 0-72.5 3-100.8 14.2L-76-160.6zm185.8 137C101-18.8 69.9-11.5 7.2-11.5s-93.8-7.3-102.6-12.1c9.8-6.7 47.6-16.7 102.6-16.7 55 .1 92.8 10 102.6 16.7zM-73.5 71.7C-92.1 50.1-101.1 22.2-98.9-6-75.8 3.9-31.7 6.5 7.2 6.5 46.5 6.5 91 3.9 113.9-6.2c2.2 28.2-6.8 56.3-25.4 77.9-20.3 23.6-49.9 37.2-81 37.2s-60.7-13.6-81-37.2zm81 216.8c-50.2 0-80.4-8.1-88.4-13.5 7.5-5 34.6-12.5 79.4-13.4h18c44.8.9 71.9 8.4 79.4 13.4-8 5.4-38.2 13.5-88.4 13.5z"
          />
          <circle
            fill="#FFF"
            stroke="#2E2E30"
            strokeWidth="22"
            strokeMiterlimit="10"
            cx="-65.8"
            cy="-117.8"
            r="48.3"
          />
          <circle fill="#2E2E30" cx="-79.2" cy="-90.1" r="12" />
          <path
            fill="#FFF"
            stroke="#2E2E30"
            strokeWidth="22"
            strokeMiterlimit="10"
            d="M127-117.8c0 26.7-21.6 48.3-48.3 48.3-26.7 0-48.3-21.6-48.3-48.3 0-12 4.4-23.1 11.7-31.5 10.2 2.5 22.9 4 36.6 4s26.3-1.5 36.6-4c7.3 8.5 11.7 19.5 11.7 31.5z"
          />
          <circle fill="#2E2E30" cx="83.9" cy="-127.8" r="12" />
        </svg>
      );
      break;

    case 'keg':
      avatarElem = (
        <svg width={size * 0.8} height={size * 0.8} viewBox="148 -147.7 395.7 395.7" css={svgStyle}>
          <g>
            <path
              d="M296 45.1c10.1 0 18.3 8.2 18.3 18.4 0 10.1-8.2 18.3-18.3 18.3-10.1 0-18.4-8.2-18.4-18.3 0-10.2 8.3-18.4 18.4-18.4z"
              fill="#666"
            />
            <path
              fill="#B3B3B3"
              d="M501 172.7l-8.9 21.7H199.5l-8.8-21.7zM492.1-94.1l8.9 21.7H190.7l8.8-21.7z"
            />
            <path
              fill="#E0974F"
              d="M253.2 232.8h-12c-6.7-7.1-13-15-18.8-23.4h18.4c3.8 8.3 8 16.1 12.4 23.4zM304 232.8h-33c-4.8-7.1-9.4-15-13.6-23.4h41.4c1.7 8.3 3.4 16.1 5.2 23.4zM314.1 209.4h63.4c-1.7 8.4-3.5 16.2-5.4 23.4h-52.6c-1.9-7.2-3.7-15-5.4-23.4zM392.8 209.4h41.4c-4.2 8.4-8.8 16.2-13.6 23.4h-33c1.9-7.3 3.6-15.1 5.2-23.4zM450.9 209.4h18.4c-5.8 8.4-12.1 16.2-18.8 23.4h-12c4.4-7.3 8.5-15.1 12.4-23.4zM469.3-109.1h-18.4c-3.9-8.3-8-16.1-12.5-23.4h12c6.8 7.2 13 15 18.9 23.4zM434.2-109.1h-41.4c-1.6-8.3-3.3-16.1-5.2-23.4h33c4.9 7.2 9.4 15 13.6 23.4zM377.5-109.1h-63.4c1.7-8.4 3.5-16.2 5.4-23.4h52.6c2 7.3 3.8 15.1 5.4 23.4zM271-132.4h33c-1.8 7.3-3.6 15.1-5.2 23.4h-41.4c4.3-8.5 8.8-16.3 13.6-23.4zM241.2-132.4h12c-4.4 7.3-8.6 15.1-12.4 23.4h-18.4c5.8-8.5 12.1-16.3 18.8-23.4zM496.4-57.4c12.7 33 19.5 70.1 19.5 107.6s-6.7 74.6-19.5 107.6h-27c8.9-33.3 13.6-70.2 13.6-107.6s-4.7-74.3-13.6-107.6h27zM453.9-57.4c9.2 33 14.1 70.1 14.1 107.6s-4.9 74.5-14.1 107.6h-53.4c3.6-33.2 5.6-70.1 5.6-107.6s-1.9-74.4-5.6-107.6h53.4zM385.4-57.4c3.7 33 5.7 70.1 5.7 107.6s-1.9 74.5-5.7 107.6h-79.1c-2.2-19.4-3.8-40-4.7-61.4 15.7-2.7 27.7-16.4 27.7-32.9 0-16.8-12.4-30.6-28.5-33 .6-30.9 2.4-60.4 5.5-87.8h79.1zM237.8-57.4h53.4c-3.1 27.9-4.9 57.8-5.4 89.1-13.4 4.3-23.2 16.9-23.2 31.8 0 15.1 10.1 27.9 23.9 32 .9 21.7 2.5 42.6 4.6 62.3h-53.4c-9.2-33-14.1-70.1-14.1-107.6.1-37.5 4.9-74.6 14.2-107.6zM195.2-57.4h27c-8.9 33.3-13.6 70.2-13.6 107.6s4.7 74.3 13.6 107.6h-27c-12.7-33-19.5-70.1-19.5-107.6s6.8-74.6 19.5-107.6z"
            />
            <path
              fill="#2E2E30"
              d="M512.5-57.4C524.6-24.1 531 12.9 531 50.2s-6.4 74.2-18.5 107.6c2.4.1 4.6 1.3 6 3.3 1.4 2.1 1.7 4.7.7 7l-15 36.7c-1.2 2.8-3.9 4.6-6.9 4.6h-9.9c-8.4 13.3-17.9 25.5-28.2 36.1-1.4 1.5-3.4 2.3-5.4 2.3H238c-2 0-4-.8-5.4-2.3-10.3-10.6-19.8-22.8-28.2-36.1h-9.9c-3 0-5.8-1.8-6.9-4.6l-15-36.7c-.9-2.3-.7-4.9.7-7 1.4-2 3.6-3.2 6-3.3-12.1-33.3-18.5-70.3-18.5-107.6s6.4-74.2 18.5-107.6c-2.4-.1-4.6-1.3-6-3.3-1.4-2.1-1.7-4.7-.7-7l15-36.7c1.1-2.8 3.9-4.7 6.9-4.7h9.9c8.4-13.3 17.9-25.4 28.2-36.1 1.4-1.5 3.4-2.3 5.4-2.3h215.7c2 0 4 .8 5.4 2.3 10.3 10.6 19.8 22.8 28.2 36.1h9.9c3 0 5.8 1.8 6.9 4.7l15 36.7c1 2.3.7 4.9-.7 7-1.3 2-3.6 3.2-5.9 3.3zm3.4 107.6c0-37.5-6.7-74.6-19.5-107.6h-27C478.3-24.1 483 12.8 483 50.2s-4.7 74.3-13.6 107.6h27c12.8-33.1 19.5-70.1 19.5-107.6zM501-72.4l-8.9-21.7H199.5l-8.9 21.7H501zm-8.9 266.8l8.9-21.7H190.7l8.9 21.7h292.5zm-41.2-303.5h18.4c-5.8-8.4-12.1-16.2-18.8-23.4h-12c4.4 7.4 8.5 15.2 12.4 23.4zm18.4 318.5h-18.4c-3.9 8.3-8 16.1-12.5 23.4h12c6.8-7.2 13-15 18.9-23.4zM468 50.2c0-37.5-4.9-74.5-14.1-107.6h-53.4c3.6 33.2 5.6 70.1 5.6 107.6s-1.9 74.4-5.6 107.6h53.4c9.2-33.1 14.1-70.2 14.1-107.6zm-75.2-159.3h41.4c-4.2-8.4-8.8-16.2-13.6-23.4h-33c1.9 7.3 3.6 15.1 5.2 23.4zm41.4 318.5h-41.4c-1.6 8.3-3.3 16.1-5.2 23.4h33c4.9-7.2 9.4-15 13.6-23.4zM391 50.2c0-37.5-1.9-74.5-5.7-107.6h-79.1c-3.1 27.4-4.9 56.9-5.5 87.8 16.1 2.4 28.5 16.2 28.5 33 0 16.5-12 30.2-27.7 32.9.9 21.4 2.5 42 4.7 61.4h79.1c3.8-33 5.7-70.1 5.7-107.5zm-76.9-159.3h63.4c-1.7-8.4-3.5-16.2-5.4-23.4h-52.6c-1.9 7.3-3.7 15.1-5.4 23.4zm63.4 318.5h-63.4c1.7 8.4 3.5 16.2 5.4 23.4h52.6c2-7.2 3.8-15 5.4-23.4zm-63.2-146c0-10.1-8.2-18.4-18.3-18.4-10.1 0-18.4 8.2-18.4 18.4 0 10.1 8.2 18.3 18.4 18.3 10.1.1 18.3-8.2 18.3-18.3zM304-132.4h-33c-4.8 7.1-9.4 14.9-13.6 23.4h41.4c1.7-8.4 3.4-16.2 5.2-23.4zm-33 365.2h33c-1.8-7.3-3.6-15.1-5.2-23.4h-41.4c4.3 8.4 8.8 16.2 13.6 23.4zm20.2-290.2h-53.4c-9.2 33-14.1 70.1-14.1 107.6s4.9 74.5 14.1 107.6h53.4c-2.2-19.7-3.7-40.6-4.6-62.3-13.8-4.1-23.9-16.9-23.9-32 0-14.8 9.7-27.4 23.2-31.8.4-31.3 2.2-61.2 5.3-89.1zm-38-75h-12c-6.7 7.1-13 14.9-18.8 23.4h18.4c3.8-8.3 8-16.1 12.4-23.4zm-12 365.2h12c-4.4-7.3-8.6-15.1-12.4-23.4h-18.4c5.8 8.4 12.1 16.2 18.8 23.4zm-19-290.2h-27c-12.7 33-19.5 70.1-19.5 107.6s6.7 74.6 19.5 107.6h27c-8.9-33.3-13.6-70.2-13.6-107.6s4.7-74.3 13.6-107.6z"
            />
          </g>
          <circle
            fill="#FFF"
            stroke="#2E2e30"
            strokeWidth="22"
            strokeMiterlimit="10"
            cx="266.3"
            cy="-48.1"
            r="61.8"
          />
          <circle fill="#2E2E30" cx="266.3" cy="-48.1" r="13" />
          <g>
            <circle
              fill="#FFF"
              stroke="#2E2E30"
              strokeWidth="22"
              strokeMiterlimit="10"
              cx="422.8"
              cy="-48.1"
              r="61.8"
            />
            <circle fill="#2E2E30" cx="422.8" cy="-48.1" r="13" />
          </g>
        </svg>
      );
      break;

    case 'whiskey':
      avatarElem = (
        <svg width={size * 0.8} height={size * 0.8} viewBox="-263 -205 512 512" css={svgStyle}>
          <g>
            <path
              d="M159.5 35.6l-13.1 157.1C116.3 200.7 50.7 207-7 207s-123.3-6.2-153.4-14.3l-9.8-118-3.3-39.2c5.3 1.4 321.9 3.1 333 .1z"
              fill="#cc6329"
            />
            <path
              fill="#8C3C18"
              d="M-138.3 25.7c-9.1-2-16.7-3.9-22.9-5.8 11.1-3.3 26-6.8 45.2-9.9l-8 11.7-4.2 6.1h-.1c-3.1-.6-6-1.2-8.8-1.8-.5-.2-.9-.2-1.2-.3zM-25.7 26.6L-45.6 8.1c8.9-.2 18-.3 27-.4-.4.6-.5 1.2-.9 1.9-.7 1.3-1.2 2.6-1.9 3.9-1 2.2-1.9 4.4-2.6 6.7-.4 1.5-.9 2.9-1.2 4.4-.1.6-.4 1.3-.5 2zM104.6 9.1c-.1-.2-.1-.5-.1-.8 18.3 3.6 32.3 7.5 42.9 11.2-9.5 3.4-22.5 7.1-39.8 10.6 0-.2-.1-.3-.1-.5-.5-7-1.5-13.8-2.9-20.5z"
            />
            <path
              fill="#FFF"
              d="M-129.3 40.7V68L-8.1 180.3 53 121.2 30.7 89.7l72-60.7-56.3-63.9-70.7 68.2-50.9-38.6z"
            />
            <path
              fill="#FFF"
              d="M-193-147.3c37.5-21.2 322-34.7 369-2.2C176-97 171-26 165 19.7c-34-15.2-296-34.1-341-.9-12.5-43.3-17-166.1-17-166.1zM-165 201.3s-2.6 40.4 6 53.3c13.1 19.8 290.1 27.1 305.7-2 2.3-24.7 2.3-24.7 3-53-66 22.7-218.4 24.1-314.7 1.7z"
            />
            <path
              fill="#2E2E30"
              d="M126.7-173.8C90.9-178 43.4-180.3-7-180.3s-97.9 2.3-133.7 6.5c-54 6.3-64.6 14.5-64.6 26.5 0 .8.1 1.6.2 2.4 0 .3 0 .6.1.9l11.9 142.4 2 24.2v.1l14.8 176.9v.2l3.8 45.2.4 4.4c0 11.6 10.1 19.7 61.6 26.5 31 4.1 69.8 6.6 103.7 6.6s72.6-2.5 103.7-6.6c51.5-6.8 61.6-14.9 61.6-25.6l2.4-28.8L177.5 22c.1-.5.1-1.1.1-1.6l2.7-31.9 11-132.4c.1-.3 0-.5.1-.8.1-.8.2-1.6.2-2.4-.3-12.2-10.8-20.4-64.9-26.7zM-7-158.3c77.3 0 134.4 5.4 161.6 11-27.2 5.6-84.3 11-161.6 11s-134.4-5.4-161.6-11c27.2-5.6 84.3-11 161.6-11zM86.2 19.9c.9 1 1.5 2.1 2 3.2.2.4.3.9.4 1.3.1.3.1.7.2 1.1-25.1 2-56.5 3.3-94 3.4 0-.1-.1-.1-.1-.2v-.3c-1.3-4-.4-8.5 2.9-11.5L8.4 6.8 23.7-7.5l11.7-10.9c2.1-2 4.8-3 7.5-3 2.9 0 5.9 1.2 8 3.5l8.8 9.4 26.5 28.4zm-116 30.9c1.6 4.1.8 8.9-2.7 12.1l-37.8 35.3c-2.1 2-4.9 3-7.9 2.9-3-.1-5.7-1.3-7.7-3.5l-35.3-37.8c-3.7-4-3.7-9.8-.6-14 32.1 3.3 68.3 4.5 92 5zm-70.8-25.2l6-5.6 11.7-11c2.1-2 4.8-3 7.5-3 3 0 5.9 1.2 8 3.5l17.5 18.8c-18.7-.6-35.8-1.5-50.7-2.7zm64-15.6c4.1-.1 8.2-.2 12.3-.2-.2.3-.2.6-.4 1-.3.7-.6 1.4-.9 2-.5 1.1-.8 2.3-1.2 3.5-.2.8-.4 1.5-.5 2.3-.1.4-.2.7-.3 1.1l-9-9.7zm-15.6 102.7l37.8-35.3c2-1.9 4.7-2.9 7.5-2.9h.4c3 .1 5.7 1.3 7.7 3.5l35.3 37.8c4.1 4.4 3.9 11.4-.5 15.6l-37.8 35.3c-2.1 2-5 3-7.9 2.9-3-.1-5.7-1.3-7.7-3.5l-35.3-37.8c-4.2-4.5-3.9-11.4.5-15.6zm84.5-42.4L14.1 50.8c14.8-.2 35.6-.8 57.4-2.1L47.9 70.8c-4.5 4.2-11.5 3.9-15.6-.5zm-153.8-55.4L-127 20l-2.9 2.7h-.1c-2.1-.3-4.1-.5-6-.8-.3 0-.5-.1-.8-.1-6.3-.9-11.4-1.7-15.7-2.5 7.7-1.5 17.9-3 31-4.4zM-149 42.3c.5.1.9.2 1.4.2 1 .1 1.9.3 3 .5-3.2 10.9-.9 23.1 7.4 31.9l35.3 37.8c6 6.4 14.2 10.2 23 10.5h1.5c.5 7.5 3.4 14.6 8.6 20.2l35.3 37.8c6.5 7 15.3 10.5 24.2 10.5 8.1 0 16.2-3 22.5-8.9L51 147.4c6.4-6 10.1-14.2 10.4-23 .3-8.8-2.8-17.2-8.8-23.7L47.3 95c5.8-1.2 11.2-4 15.6-8.1l37.8-35.3c1.8-1.7 3.3-3.5 4.6-5.4 22.3-2.2 37.8-4.8 48.4-7.6l-12.6 151.6C112.1 198 48.8 204-7 204s-119.1-6-148.1-13.8l-9.5-113.9-3.2-37.9c5.1 1.4 11.3 2.7 18.8 3.9zM108.7 15c12.9 1.4 22.9 2.9 30.4 4.4-6.8 1.3-15.9 2.8-28.2 4.1v-.2c-.3-2.7-1-5.4-2.1-8 0-.1 0-.2-.1-.3zm27.9 230c-14.4 7-81.1 15.4-143.6 15.4-62.4 0-129.1-8.3-143.6-15.4l-.1-1.6-2.5-30.1c36.1 8 98.5 12.7 146.2 12.7 47.8 0 110.2-4.7 146.2-12.7l-.8 9.7-1.8 22zM156.9.9C144-2.9 123.1-6.3 89.4-8.9l-.3-.3L67-32.9c-12.5-13.3-33.4-14-46.7-1.6L-3.5-12.3h-2.6c-17.9 0-35.5.3-52.6 1-11.2-6.6-25.4-6-36.1 1.9-26.2 1.7-45.3 4.1-59.2 6.6-6.8 1.3-12.4 2.6-16.9 3.9l-.3-3.5-10.2-122.9c25.7 7.4 76.7 10.9 174.4 10.9s148.7-3.6 174.4-10.9L157.9-11l-1 11.9z"
            />
            <path
              fill="#FFF"
              stroke="#2E2E30"
              strokeWidth="22"
              strokeMiterlimit="10"
              d="M14.1-82.7c-.5 19.8 4.9 38.3 14.7 53.9 21.4-8.9 49.7-13.9 80.6-13.1 30.9.8 58.9 7.4 79.7 17.4 10.6-15 17.1-33.2 17.6-52.9 1.4-53.2-40.5-97.5-93.7-98.9-53.1-1.5-97.4 40.5-98.9 93.6z"
            />
            <circle fill="#2E2E30" cx="93" cy="-66.1" r="21.3" />
            <g>
              <path
                fill="#FFF"
                stroke="#2E2E30"
                strokeWidth="22"
                strokeMiterlimit="10"
                d="M-26.7-82.7c.5 19.7-4.9 38.3-14.7 53.8C-62.8-37.8-91.1-42.8-122-42c-30.9.8-58.9 7.4-79.7 17.4-10.6-15-17.1-33.2-17.6-52.9-1.4-53.2 40.5-97.5 93.7-98.9 53.1-1.4 97.4 40.6 98.9 93.7z"
              />
              <circle fill="#2E2E30" cx="-105.6" cy="-66.1" r="21.3" />
            </g>
          </g>
        </svg>
      );
      break;
  }

  return (
    <div
      css={css`
        width: ${size}px;
        height: ${size}px;
      `}
      {...{ className }}
      tw={'relative inline-block flex flex-col items-center'}>
      {avatarElem}

      <div tw="flex space-x-2">
        {name && (
          <span
            css={css`
              padding: 0.1rem 0.5rem;
              line-height: 22px;

              animation: ${animations.hover()} 1.5s alternate infinite ease-in-out;
            `}
            tw="text-center uppercase font-bold mt-1 text-white tracking-widest rounded bg-black bg-opacity-50">
            {name}
          </span>
        )}

        {onGiveTurn && (
          <AvatarAction onClick={onGiveTurn} delay={0.25}>
            <svg
              width="1em"
              height="1em"
              fill="currentColor"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M18 12L6 6V18L18 12Z" strokeLinejoin="round" />
            </svg>
          </AvatarAction>
        )}

        {onKick && (
          <AvatarAction onClick={onKick} delay={0.5}>
            <svg
              width="1em"
              height="1em"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </AvatarAction>
        )}
      </div>

      {scoreDebounced ? (
        <div
          css={css`
            animation: ${animations.hover()} 1.5s alternate infinite ease-in-out;
            animation-delay: 1.25s;
          `}>
          <motion.div
            initial={{
              scale: 0
            }}
            animate={{
              scale: bubble ? 1.5 : 1
            }}
            transition={{
              duration: 1,
              ease: (x: number) => {
                const c4 = (2 * Math.PI) / 3;

                return x === 0
                  ? 0
                  : x === 1
                  ? 1
                  : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
              }
            }}
            tw="rounded-full w-6 h-6 mr-1 absolute top-0 right-0 flex justify-center items-center bg-black bg-opacity-50">
            <span tw="text-white font-bold">{scoreDebounced}</span>
          </motion.div>
        </div>
      ) : null}
    </div>
  );
};

export default Avatar;
