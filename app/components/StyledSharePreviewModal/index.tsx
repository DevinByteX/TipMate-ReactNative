import React from 'react';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Modal
      visible={isPreviewVisible}
      transparent={true}
      animationType={'slide'}
      onRequestClose={onClose}
      onDismiss={onDismiss}
      statusBarTranslucent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalContents}>
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create(({ colors, fonts, utils }, rt) => ({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: utils.hexToRGBA(colors.backgroundColor, 0.5),
  },
  modalContents: {
    backgroundColor: utils.hexToRGBA(colors.card, 0.9),
    width: (rt.screen.width * 90) / 100,
    maxHeight: (rt.screen.height * 80) / 100,
    borderRadius: (rt.screen.width * 3) / 100,
    borderColor: colors.accent,
    borderWidth: StyleSheet.hairlineWidth * 4,
    overflow: 'hidden',
  },
  header: {
    paddingVertical: (rt.screen.height * 2) / 100,
    paddingHorizontal: (rt.screen.width * 5) / 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.devider,
  },
  headerTitle: {
    fontFamily: fonts.Nunito_Black,
    fontSize: 20,
    color: colors.accent,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 11,
    color: colors.card_typography,
    fontFamily: fonts.Montserrat_Medium,
    textAlign: 'center',
    marginTop: (rt.screen.height * 0.5) / 100,
  },
  previewContainer: {
    maxHeight: (rt.screen.height * 45) / 100,
    paddingHorizontal: (rt.screen.width * 5) / 100,
    paddingVertical: (rt.screen.height * 2) / 100,
  },
  previewText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Regular,
    color: colors.card_typography,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    paddingHorizontal: (rt.screen.width * 5) / 100,
    paddingTop: (rt.screen.height * 1.5) / 100,
    columnGap: (rt.screen.width * 3) / 100,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.accent,
    minHeight: (rt.screen.height * 5) / 100,
    marginTop: (rt.screen.height * 1) / 100,
    marginBottom: (rt.screen.height * 2) / 100,
    borderRadius: (rt.screen.height * 1.2) / 100,
    paddingHorizontal: (rt.screen.width * 2) / 100,
  },
  shareButtonText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card,
    textAlign: 'center',
  },
  closeButton: {
    height: (rt.screen.height * 5) / 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: (rt.screen.width * 5) / 100,
    marginTop: (rt.screen.height * 1) / 100,
    marginBottom: (rt.screen.height * 2) / 100,
    borderRadius: (rt.screen.height * 1.2) / 100,
    borderWidth: StyleSheet.hairlineWidth * 3,
    borderColor: colors.card_typography,
  },
  closeButtonText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card_typography,
  },
}));
