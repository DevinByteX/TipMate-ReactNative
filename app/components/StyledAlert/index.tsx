import React from 'react';
import { View, Text, Modal, Pressable } from 'react-native';
import { StyleSheet, useUnistyles } from 'react-native-unistyles';
import { StyledIcons, StyledIconTypesKey } from '@components';

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
}: StyledAlertProps) => {
  const { theme } = useUnistyles();

  const iconInfo = showIcon ? customIcon || getAlertIcon(type) : null;

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
    <Modal visible={visible} transparent={true} animationType={'fade'} onRequestClose={onDismiss}>
      <View style={styles.overlay}>
        <View style={styles.modalContents}>
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create(({ colors, fonts, utils }, rt) => ({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: utils.hexToRGBA(colors.backgroundColor, 0.85),
  },
  modalContents: {
    backgroundColor: colors.card,
    width: (rt.screen.width * 85) / 100,
    paddingVertical: (rt.screen.height * 2.5) / 100,
    paddingHorizontal: (rt.screen.width * 5) / 100,
    borderRadius: (rt.screen.width * 3) / 100,
    borderColor: colors.backgroundColor,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: (rt.screen.height * 1.5) / 100,
  },
  iconCircle: {
    width: (rt.screen.width * 12) / 100,
    height: (rt.screen.width * 12) / 100,
    borderRadius: (rt.screen.width * 12) / 100,
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
    marginTop: (rt.screen.height * 1) / 100,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: (rt.screen.height * 2) / 100,
    width: '100%',
    columnGap: (rt.screen.width * 3) / 100,
  },
  lineButton: {
    flex: 1,
    height: (rt.screen.height * 5) / 100,
    borderRadius: (rt.screen.height * 1) / 100,
    borderColor: colors.card_typography,
    borderWidth: StyleSheet.hairlineWidth * 2,
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
    height: (rt.screen.height * 5) / 100,
    borderRadius: (rt.screen.height * 1) / 100,
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
    height: (rt.screen.height * 5) / 100,
    borderRadius: (rt.screen.height * 1) / 100,
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
