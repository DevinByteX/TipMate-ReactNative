import React from 'react';
import Svg, { SvgProps } from 'react-native-svg';

export interface IconBaseProps {
  height?: number | string;
  width?: number | string;
  colour?: string; // For icon fill
  backgroundColour?: string; // For background
  [key: string]: any;
}

interface StyledSVGIconWrapperProps extends SvgProps, IconBaseProps {
  children: React.ReactElement | React.ReactElement[];
}

export const StyledSVGIconWrapper: React.FC<StyledSVGIconWrapperProps> = ({
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
