import React from 'react';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';
import { useBottomSheetEntrance } from '@hooks';

type SharePreviewModalProps = {
  isPreviewVisible: boolean;
  onClose: () => void;
  onShareText: () => void;
  onSharePDF: () => void;
  previewContent: string;
  onDismiss?: () => void;
};

export const StyledSharePreviewModal = ({
  isPreviewVisible,
  onClose,
  onShareText,
  onSharePDF,
  previewContent,
  onDismiss,
}: SharePreviewModalProps) => {
  const { styles } = useStyles(stylesheet);
  const { t } = useTranslation();
  const { animatedStyle: sheetStyle, backdropStyle } = useBottomSheetEntrance(isPreviewVisible);

  return (
    <Modal
      visible={isPreviewVisible}
      transparent={true}
      animationType={'none'}
      onRequestClose={onClose}
      onDismiss={onDismiss}
      statusBarTranslucent={true}
    >
      <Animated.View style={[styles.centeredView, backdropStyle]}>
        <Animated.View style={[styles.modalContents, sheetStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{t('components.sharePreview.title')}</Text>
            <Text style={styles.headerSubtitle}>{t('components.sharePreview.subtitle')}</Text>
          </View>

          {/* Preview Content */}
          <ScrollView style={styles.previewContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.previewText}>{previewContent}</Text>
          </ScrollView>

          {/* Action Buttons */}
          {/* onShareText and onSharePDF */}
          <View style={styles.buttonContainer}>
            <Pressable onPress={onShareText} style={styles.shareButton}>
              <Text style={styles.shareButtonText}>{t('components.sharePreview.shareAsText')}</Text>
            </Pressable>
            <Pressable onPress={onSharePDF} style={styles.shareButton}>
              <Text style={styles.shareButtonText}>{t('components.sharePreview.shareAsPDF')}</Text>
            </Pressable>
          </View>

          {/* Close Button */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>{t('components.sharePreview.cancel')}</Text>
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts, typography, utils }) => ({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: utils.hexToRGBA(colors.backgroundColor, 0.5),
  },
  modalContents: {
    backgroundColor: utils.hexToRGBA(colors.card, 0.9),
    width: (UnistylesRuntime.screen.width * 90) / 100,
    maxHeight: (UnistylesRuntime.screen.height * 80) / 100,
    borderRadius: (UnistylesRuntime.screen.width * 3) / 100,
    borderColor: colors.accent,
    borderWidth: UnistylesRuntime.hairlineWidth * 4,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    borderBottomWidth: UnistylesRuntime.hairlineWidth,
    borderBottomColor: colors.devider,
  },
  headerTitle: {
    fontFamily: fonts.Nunito_Black,
    fontSize: typography.fontSize.xl,
    lineHeight: typography.lineHeight.xl,
    color: colors.accent,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: typography.fontSize.xs,
    lineHeight: typography.lineHeight.xs,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    textAlign: 'center',
    marginTop: (UnistylesRuntime.screen.height * 0.5) / 100,
  },
  previewContainer: {
    maxHeight: (UnistylesRuntime.screen.height * 45) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingVertical: (UnistylesRuntime.screen.height * 2) / 100,
  },
  previewText: {
    fontSize: typography.fontSize.md,
    fontFamily: fonts.Montserrat_Regular,
    color: colors.card_typography,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    paddingTop: (UnistylesRuntime.screen.height * 1.5) / 100,
    columnGap: (UnistylesRuntime.screen.width * 3) / 100,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent,
    minHeight: (UnistylesRuntime.screen.height * 5) / 100,
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
    marginBottom: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1.2) / 100,
    paddingHorizontal: (UnistylesRuntime.screen.width * 2) / 100,
  },
  shareButtonText: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card,
    textAlign: 'center',
  },
  closeButton: {
    height: (UnistylesRuntime.screen.height * 5) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: (UnistylesRuntime.screen.width * 5) / 100,
    marginTop: (UnistylesRuntime.screen.height * 1) / 100,
    marginBottom: (UnistylesRuntime.screen.height * 2) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1.2) / 100,
    borderWidth: UnistylesRuntime.hairlineWidth * 3,
    borderColor: colors.card_typography,
  },
  closeButtonText: {
    fontSize: typography.fontSize.md,
    lineHeight: typography.lineHeight.md,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card_typography,
  },
}));
