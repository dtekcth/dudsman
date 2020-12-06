import React from 'react';
import Die, { DieElement, DieProps } from './Die';
import 'twin.macro';

export type TwoDiceProps = {
  className?: string;
  num1: number;
  num2: number;
  ref1?: React.RefObject<DieElement>;
  ref2?: React.RefObject<DieElement>;
} & Omit<DieProps, 'number'>;

const TwoDice: React.FC<TwoDiceProps> = ({ className, num1, num2, ref1, ref2, ...rest }) => (
  <div {...{ className }} tw="flex justify-center -mx-2">
    <div tw="w-1/3 p-2">
      <Die ref={ref1} number={num1} {...rest} />
    </div>

    <div tw="w-1/3 p-2">
      <Die ref={ref2} right number={num2} delay={0.25} {...rest} />
    </div>
  </div>
);

export default TwoDice;
