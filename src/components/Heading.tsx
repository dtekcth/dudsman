import React from 'react';
import tw from 'twin.macro';

export interface HeadingProps {
  className?: string;
  size: 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
}

const Heading: React.FC<HeadingProps> = ({ size, className, children }) => {
  const common = tw`font-semibold`;

  switch (size) {
    case '5xl':
      return (
        <h1 {...{ className }} css={[common, tw`text-5xl`]}>
          {children}
        </h1>
      );
    case '4xl':
      return (
        <h2 {...{ className }} css={[common, tw`text-4xl`]}>
          {children}
        </h2>
      );
    case '3xl':
      return (
        <h3 {...{ className }} css={[common, tw`text-3xl`]}>
          {children}
        </h3>
      );
    case '2xl':
      return (
        <h4 {...{ className }} css={[common, tw`text-2xl`]}>
          {children}
        </h4>
      );
    case 'xl':
      return (
        <h5 {...{ className }} css={[common, tw`text-xl`]}>
          {children}
        </h5>
      );
    case 'lg':
      return (
        <h6 {...{ className }} css={[common, tw`text-lg`]}>
          {children}
        </h6>
      );
  }
};

export default Heading;
