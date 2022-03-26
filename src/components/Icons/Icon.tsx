import React, { FC, Fragment, ReactNode, SVGAttributes } from 'react';

interface IconProps {
  type: 'segment' | 'margin' | 'palette' | 'loading';
}

const Icon: FC<SVGAttributes<SVGSVGElement> & IconProps> = (props) => {
  const { type, viewBox, ...otherProps } = props;

  let content: IconContent;

  switch (type) {
    case 'segment':
      content = Segment;
      break;
    case 'margin':
      content = Margin;
      break;
    case 'palette':
      content = Palette;
      break;
    case 'loading':
      content = Palette;
      break;
  }

  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox={content[0]} {...otherProps}>
      {content[1]}
    </svg>
  );
};

export default Icon;

type IconContent = [string, ReactNode];

const Segment: IconContent = [
  '0 0 24 24',
  <Fragment>
    <g>
      <rect fill='none' height='24' width='24' />
    </g>
    <g>
      <path d='M9,18h12v-2H9V18z M3,6v2h18V6H3z M9,13h12v-2H9V13z' />
    </g>
  </Fragment>,
];

const Margin: IconContent = [
  '0 0 24 24',
  <Fragment>
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M3 3v18h18V3H3zm16 16H5V5h14v14zM11 7h2v2h-2zM7 7h2v2H7zm8 0h2v2h-2zm-8 4h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z' />
  </Fragment>,
];

const Palette: IconContent = [
  '0 0 20 20',
  <Fragment>
    <g>
      <rect fill='none' height='20' width='20' />
    </g>
    <g>
      <g>
        <path d='M10,2c-4.41,0-8,3.59-8,8s3.59,8,8,8c1.1,0,2-0.9,2-2c0-0.49-0.18-0.96-0.51-1.34c-0.24-0.3-0.02-0.66,0.3-0.66h1.42 c2.65,0,4.8-2.15,4.8-4.8C18,5.23,14.41,2,10,2z M13.2,12.5h-1.42c-1.05,0-1.9,0.85-1.9,1.9c0,0.47,0.19,0.92,0.47,1.25 c0.34,0.39,0.02,0.85-0.36,0.85c-3.58,0-6.5-2.92-6.5-6.5S6.42,3.5,10,3.5s6.5,2.56,6.5,5.7C16.5,11.02,15.02,12.5,13.2,12.5z' />
        <circle cx='14.5' cy='9.5' r='1.25' />
        <circle cx='12' cy='6.5' r='1.25' />
        <circle cx='5.5' cy='9.5' r='1.25' />
        <circle cx='8' cy='6.5' r='1.25' />
      </g>
    </g>
  </Fragment>,
];

const Loading: IconContent = [
  '0 0 50 50',
  <Fragment>
    <path d='M25,5A20.14,20.14,0,0,1,45,22.88a2.51,2.51,0,0,0,2.49,2.26h0A2.52,2.52,0,0,0,50,22.33a25.14,25.14,0,0,0-50,0,2.52,2.52,0,0,0,2.5,2.81h0A2.51,2.51,0,0,0,5,22.88,20.14,20.14,0,0,1,25,5Z'>
      <animateTransform
        attributeName='transform'
        type='rotate'
        from='0 25 25'
        to='360 25 25'
        dur='0.5s'
        repeatCount='indefinite'
      />
    </path>
  </Fragment>,
];
