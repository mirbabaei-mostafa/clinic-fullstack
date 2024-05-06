import React from 'react';

interface Props {
  message: string;
  hpos: 'left' | 'right';
  vpos: 'top' | 'bottom';
}

const ErrorTooltip = ({ message, hpos, vpos }: Props) => {
  const hpostion: string = hpos === 'left' ? 'left-5' : 'right-5';
  const vposition: string = vpos === 'top' ? '-top-5' : '-bottom-5';
  return (
    <div
      className={
        'absolute bg-myred rounded-md px-3 py-1 font-info font-normal text-mygray-light text-[14px] ' +
        hpostion +
        ' ' +
        vposition
      }
    >
      {message}
    </div>
  );
};

export default ErrorTooltip;
