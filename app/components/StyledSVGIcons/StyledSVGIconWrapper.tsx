import React from 'react';
import Svg, { Rect, SvgProps } from 'react-native-svg';

export interface IconBaseProps {
  height?: number | string;
  width?: number | string;
  colour?: string; // For icon fill
  backgroundColour?: string; // For background
  showBackground?: boolean;
  [key: string]: any;
}

interface Props extends SvgProps, IconBaseProps {
  children: React.ReactElement | React.ReactElement[];
}

export const StyledSVGIconWrapper: React.FC<Props> = ({
  width = 64,
  height = 64,
  style,
  children,
  ...rest
}) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 512 512" fill="none" style={style} {...rest}>
      {children}
    </Svg>
  );
};
