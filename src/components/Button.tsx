import React from 'react';
import tw, { css } from 'twin.macro';
import { spinnerStyle } from './Loader';

export interface ButtonProps {
  className?: string;
  onClick?: () => void;
  outline?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, React.PropsWithChildren<ButtonProps>>(
  function Button({ children, className, outline, loading, onClick, disabled }, ref) {
    return (
      <button
        css={[
          disabled
            ? tw`bg-gray-300`
            : outline
            ? tw`border-2 border-white rounded-full`
            : tw`bg-dtek rounded`,
          loading
            ? css`
                pointer-events: none;
                color: transparent !important;

                ::after {
                  ${spinnerStyle};
                  color: white;
                  left: calc(50% - (1.5em / 2));
                  top: calc(50% - (1.5em / 2));

                  width: 1.5em;
                  height: 1.5em;

                  position: absolute !important;
                }
              `
            : !disabled && tw`hover:bg-dtek-dark`
        ]}
        tw="block px-5 py-3 text-white transition duration-200 uppercase tracking-widest font-bold focus:outline-none relative"
        {...{ ref, className, disabled }}
        onClick={() => !disabled && !loading && onClick?.()}>
        {children}
      </button>
    );
  }
);

export default Button;
