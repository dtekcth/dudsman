import React from 'react';
import Die, { DieElement, DieProps } from './Die';
import 'twin.macro';

export type TwoDiceProps = {
  className?: string;
  num1: number;
  num2: number;
  ref1?: React.RefObject<DieElement>;
  ref2?: React.RefObject<DieElement>;
  width?: string;
} & Omit<DieProps, 'number'>;

const TwoDice: React.FC<TwoDiceProps> = ({ className, num1, num2, ref1, ref2, width, ...rest }) => (
  <div {...{ className }} tw="flex justify-center -mx-2">
    <div tw="p-2" css={width && { width }}>
      <Die tw="mx-auto" ref={ref1} number={num1} {...rest} />
    </div>

    <div tw="p-2" css={width && { width }}>
      <Die tw="mx-auto" ref={ref2} right number={num2} delay={0.25} {...rest} />
    </div>
  </div>
);

export default TwoDice;
