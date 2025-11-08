import React from 'react';
import { View, Text, Modal, Pressable, ScrollView } from 'react-native';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';

type SharePreviewModalProps = {
  isPreviewVisible: boolean;
  onClose: () => void;
  onShareText: () => void;
  onSharePDF: () => void;
  previewContent: string;
};

export const StyledSharePreviewModal = ({
  isPreviewVisible,
  onClose,
  onShareText,
  onSharePDF,
  previewContent,
}: SharePreviewModalProps) => {
  const { styles } = useStyles(stylesheet);

  return (
    <Modal
      visible={isPreviewVisible}
      transparent={true}
      animationType={'slide'}
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalContents}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Share Preview</Text>
            <Text style={styles.headerSubtitle}>Review your tip summary before sharing</Text>
          </View>

          {/* Preview Content */}
          <ScrollView style={styles.previewContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.previewText}>{previewContent}</Text>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <Pressable style={styles.textButton} onPress={onShareText}>
              <Text style={styles.buttonText}>📱 Share as Text</Text>
            </Pressable>
            <Pressable style={styles.pdfButton} onPress={onSharePDF}>
              <Text style={styles.buttonText}>📄 Share as PDF</Text>
            </Pressable>
          </View>

          {/* Close Button */}
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const stylesheet = createStyleSheet(({ colors, fonts, utils }) => ({
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
    fontSize: 20,
    color: colors.accent,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 11,
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
    fontSize: 14,
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
  textButton: {
    flex: 1,
    height: (UnistylesRuntime.screen.height * 5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1.2) / 100,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdfButton: {
    flex: 1,
    height: (UnistylesRuntime.screen.height * 5) / 100,
    borderRadius: (UnistylesRuntime.screen.height * 1.2) / 100,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card,
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
    fontSize: 14,
    fontFamily: fonts.Montserrat_Bold,
    color: colors.card_typography,
  },
}));
