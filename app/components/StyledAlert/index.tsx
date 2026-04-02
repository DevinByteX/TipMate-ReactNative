import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { StyledIcons, StyledIconTypesKey } from '@components';
import { useModalEntrance } from '@hooks';

export type AlertType = 'info' | 'success' | 'error' | 'warning' | 'confirm';

export type StyledAlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type StyledAlertProps = {
  visible: boolean;
  title: string;
  message?: string;
  buttons?: StyledAlertButton[];
  type?: AlertType;
  onDismiss?: () => void;
  showIcon?: boolean;
  customIcon?: { iconType: StyledIconTypesKey; iconName: string };
  customIconColor?: string;
  children?: React.ReactNode;
};

const getAlertIcon = (
  type: AlertType,
): { iconType: StyledIconTypesKey; iconName: string } | null => {
  switch (type) {
    case 'success':
      return { iconType: 'Ionicons', iconName: 'checkmark' };
    case 'error':
      return { iconType: 'Ionicons', iconName: 'close' };
    case 'warning':
      return { iconType: 'Ionicons', iconName: 'warning' };
    case 'info':
      return { iconType: 'Ionicons', iconName: 'information' };
    case 'confirm':
      return { iconType: 'Ionicons', iconName: 'help' };
    default:
      return null;
  }
};

export const StyledAlert = ({
  visible,
  title,
  message,
  buttons = [{ text: 'OK', style: 'default' }],
  type = 'info',
  onDismiss,
  showIcon = true,
  customIcon,
  customIconColor,
  children,
}: StyledAlertProps) => {
  const { styles, theme } = useStyles(stylesheet);

  const iconInfo = showIcon ? customIcon || getAlertIcon(type) : null;

  const { animatedStyle: modalAnimStyle, backdropStyle } = useModalEntrance(visible);

  // Determine button layout based on count
  const cancelButton = buttons.find(b => b.style === 'cancel');
  const otherButtons = buttons.filter(b => b.style !== 'cancel');

  const handleButtonPress = (button: StyledAlertButton) => {
    button.onPress?.();
  };

  const getIconColor = () => {
    if (customIconColor) {
      return customIconColor;
    }
    switch (type) {
      case 'success':
        return theme.colors.accent;
      case 'error':
        return theme.colors.error_toast;
      case 'warning':
        return theme.colors.accent_second;
      default:
        return theme.colors.accent;
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType={'none'} onRequestClose={onDismiss}>
      <Animated.View style={[styles.overlay, backdropStyle]}>
        <Animated.View style={[styles.modalContents, modalAnimStyle]}>
          {/* Icon */}
          {iconInfo && (
            <View style={styles.iconContainer}>
              <View style={[styles.iconCircle, { backgroundColor: getIconColor() }]}>
                <StyledIcons
                  type={iconInfo.iconType}
                  name={iconInfo.iconName as any}
                  size={30}
                  color={theme.colors.card}
                />
              </View>
            </View>
          )}

          {/* Title */}
          <Text style={styles.modalTitle}>{title}</Text>

          {/* Message */}
          {message && <Text style={styles.modalMessage}>{message}</Text>}

          {/* Custom Content */}
          {children}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {cancelButton && (
              <Pressable
                style={({ pressed }) => [styles.lineButton, pressed && styles.buttonPressed]}
                onPress={() => handleButtonPress(cancelButton)}
              >
                <Text style={styles.lineButtonText}>{cancelButton.text}</Text>
              </Pressable>
            )}
            {otherButtons.map((button, index) => (
              <Pressable
                key={index}
                style={({ pressed }) => [
                  button.style === 'destructive' ? styles.destructiveButton : styles.solidButton,
                  pressed && styles.buttonPressed,
                ]}
                onPress={() => handleButtonPress(button)}
              >
                <Text
                  style={
                    button.style === 'destructive'
                      ? styles.destructiveButtonText
                      : styles.solidButtonText
                  }
                >
                  {button.text}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts, utils }) => ({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: utils.hexToRGBA(colors.backgroundColor, 0.85),
  },
  modalContents: {
    backgroundColor: colors.card,
    width: (UnistylesRuntime.screen.width * 85) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 2.5) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    borderRadius: (UnistylesRuntime.screen.width * 3) / 100,
    borderColor: colors.backgroundColor,
    borderWidth: UnistylesRuntime.hairlineWidth,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: (UnistylesRuntime.screen.height * 1.5) / 100,
  },
  iconCircle: {
    width: (UnistylesRuntime.screen.width * 12) / 100,
    height: (UnistylesRuntime.screen.width * 12) / 100,
    borderRadius: (UnistylesRuntime.screen.width * 12) / 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: fonts.Nunito_Black,
    fontSize: 18,
    color: colors.accent,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 13,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    textAlign: 'center',
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: (UnistylesRuntime.screen.height * 2) / 100,
    width: '100%',
    columnGap: (UnistylesRuntime.screen.width * 3) / 100,
  },
  lineButton: {
    flex: 1,
    height: (UnistylesRuntime.screen.height * 5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    borderColor: colors.card_typography,
    borderWidth: UnistylesRuntime.hairlineWidth * 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineButtonText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card_typography,
  },
  solidButton: {
    flex: 1,
    height: (UnistylesRuntime.screen.height * 5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  solidButtonText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card,
  },
  destructiveButton: {
    flex: 1,
    height: (UnistylesRuntime.screen.height * 5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1) / 100,
    backgroundColor: colors.error_toast,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destructiveButtonText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card,
  },
  buttonPressed: {
    opacity: 0.7,
  },
}));
