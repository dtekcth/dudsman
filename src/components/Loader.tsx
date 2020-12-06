import _ from 'lodash';
import React, { Component, useEffect, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import 'twin.macro';
import { css, keyframes } from '@emotion/react';
import { useTimeout } from '../utils';

export const spin = keyframes`
  from { transform: rotate(0); }
  to { transform: rotate(360deg); }
`;

export const spinnerStyle = css`
  animation: ${spin} 500ms infinite linear;
  border: 0.15em solid #dbdbdb;
  border-bottom-color: currentcolor;
  border-left-color: currentcolor;
  border-radius: 290486px;
  border-right-color: transparent;
  border-top-color: transparent;
  content: '';

  display: block;
  height: 1em;
  width: 1em;
`;

export interface LoaderProps {
  className?: string;
  size?: string | number;
  thickness?: string | number;
  color?: string;
  delay?: number;
}

const Loader: React.FC<LoaderProps> = ({
  className,
  size = '1em',
  thickness = '0.15em',
  color = 'white',
  delay
}) => {
  const [visible, setVisible] = useState(!delay);

  const timeout = useTimeout();

  useEffect(() => {
    timeout(() => {
      setVisible(true);
    }, delay);
  });

  if (!visible) {
    return null;
  }

  return (
    <div
      {...{ className }}
      css={css`
        ::after {
          ${spinnerStyle}
          width: ${size};
          height: ${size};
          border-left-color: ${color};
          border-bottom-color: ${color};
          border-width: ${thickness};
        }
      `}
    />
  );
};

export default Loader;
