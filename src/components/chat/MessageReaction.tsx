import React, { ReactNode, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { scale as s, vs } from 'react-native-size-matters';
import AppText from '../AppText';
import { AppColors } from '../../styles/colors';

export type MessageReactionsMap = Record<string, string | null | undefined>;

type MessageReactionProps = {
  children: ReactNode;
  currentUserId: string;
  isMine: boolean;
  reactions?: MessageReactionsMap;
  onSelectReaction: (reaction: string | null) => void;
};

const REACTION_OPTIONS = ['👍', '❤️', '😂', '😮', '😢', '😡'];
const PICKER_WIDTH = s(260);
const PICKER_HEIGHT = vs(48);

const MessageReaction = ({
  children,
  currentUserId,
  isMine,
  reactions,
  onSelectReaction,
}: MessageReactionProps) => {
  const anchorRef = useRef<View>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerPosition, setPickerPosition] = useState({ top: vs(120), left: s(12) });

  const currentReaction = reactions?.[currentUserId] || null;

  const reactionSummary = useMemo(() => {
    const counts = new Map<string, number>();

    Object.values(reactions || {}).forEach(reaction => {
      if (!reaction) return;
      counts.set(reaction, (counts.get(reaction) || 0) + 1);
    });

    return Array.from(counts.entries());
  }, [reactions]);

  const showPicker = () => {
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      const screenWidth = Dimensions.get('window').width;
      const left = isMine
        ? Math.max(s(8), Math.min(screenWidth - PICKER_WIDTH - s(8), x + width - PICKER_WIDTH))
        : Math.max(s(8), Math.min(screenWidth - PICKER_WIDTH - s(8), x));
      const top = y > PICKER_HEIGHT + vs(24)
        ? y - PICKER_HEIGHT - vs(8)
        : y + height + vs(8);

      setPickerPosition({ top, left });
      setPickerVisible(true);
    });
  };

  const handleSelectReaction = (reaction: string) => {
    setPickerVisible(false);
    onSelectReaction(reaction === currentReaction ? null : reaction);
  };

  return (
    <View
      ref={anchorRef}
      collapsable={false}
      style={[styles.container, isMine ? styles.mineContainer : styles.theirContainer]}
    >
      <TouchableOpacity
        activeOpacity={1}
        delayLongPress={250}
        onLongPress={showPicker}
      >
        {children}
      </TouchableOpacity>

      {reactionSummary.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={showPicker}
          style={[
            styles.reactionBadge,
            isMine ? styles.mineReactionBadge : styles.theirReactionBadge,
          ]}
        >
          {reactionSummary.map(([reaction, count]) => (
            <AppText key={reaction} style={styles.reactionText}>
              {reaction}{count > 1 ? count : ''}
            </AppText>
          ))}
        </TouchableOpacity>
      )}

      <Modal
        animationType="fade"
        transparent
        visible={pickerVisible}
        onRequestClose={() => setPickerVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPickerVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={[styles.picker, pickerPosition]}>
                {REACTION_OPTIONS.map(reaction => (
                  <TouchableOpacity
                    key={reaction}
                    activeOpacity={0.75}
                    onPress={() => handleSelectReaction(reaction)}
                    style={[
                      styles.reactionButton,
                      reaction === currentReaction && styles.selectedReactionButton,
                    ]}
                  >
                    <AppText style={styles.pickerEmoji}>{reaction}</AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default MessageReaction;

const styles = StyleSheet.create({
  container: {
    maxWidth: '78%',
  },
  mineContainer: {
    alignItems: 'flex-end',
  },
  theirContainer: {
    alignItems: 'flex-start',
  },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
    minHeight: vs(20),
    paddingHorizontal: s(7),
    paddingVertical: vs(2),
    borderRadius: s(10),
    backgroundColor: AppColors.inputColor,
    borderWidth: 1,
    borderColor: AppColors.cardColor,
    marginTop: vs(-4),
  },
  mineReactionBadge: {
    marginRight: s(6),
  },
  theirReactionBadge: {
    alignSelf: 'flex-end',
    marginRight: s(6),
  },
  reactionText: {
    fontSize: s(12),
    lineHeight: s(16),
    color: AppColors.textColor,
  },
  modalOverlay: {
    flex: 1,
  },
  picker: {
    position: 'absolute',
    width: PICKER_WIDTH,
    minHeight: PICKER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(8),
    paddingVertical: vs(5),
    borderRadius: s(24),
    backgroundColor: AppColors.cardColor,
    borderWidth: 1,
    borderColor: AppColors.inputColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: s(10),
    elevation: 10,
  },
  reactionButton: {
    width: s(36),
    height: s(36),
    borderRadius: s(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedReactionButton: {
    backgroundColor: AppColors.secondaryColor,
  },
  pickerEmoji: {
    fontSize: s(22),
    lineHeight: s(28),
  },
});
