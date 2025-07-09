
import { useThemeColor } from '@/hooks/color/useThemeColor';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

export const MenuOption = ({
  onSelect,
  children,
}: {
  onSelect: () => void;
  children: ReactNode;
}) => {
  return <Pressable onPress={onSelect} style={styles.menuOption}>
    {children}
  </Pressable>
};

interface DropdownMenuProps {
  visible: boolean;
  handleClose: () => void;
  handleOpen: () => void;
  trigger: React.ReactNode;
  children: React.ReactNode;
  dropdownWidth?: number;
}

export const DropdownMenu: React.FC<DropdownMenuProps> = ({
  visible,
  handleOpen,
  handleClose,
  trigger,
  children,
  dropdownWidth = 150,
}) => {
  const triggerRef = useRef<View>(null);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0 });

  useEffect(() => {
    if (triggerRef.current && visible) {
      triggerRef.current.measure((fx, fy, width, height, px, py) => {
        setPosition({
          x: px,
          y: py + height,
          width: width,
        });
      });
    }
  }, [visible]);
  
  const colors = useThemeColor()
  return <View>
    <TouchableWithoutFeedback onPress={handleOpen}>
      <View ref={triggerRef}>{trigger}</View>
    </TouchableWithoutFeedback>
    {visible && (
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={handleClose}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.menu,
                {
                  top: position.y,
                  left: position.x + position.width / 2 - dropdownWidth / 2,
                  width: dropdownWidth,
                  backgroundColor: colors.gray200
                },
              ]}>
              {children}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )}
  </View>
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  menu: {
    position: 'absolute',
    width: 80,
    borderRadius: 5,
    padding: 10,
    elevation: 4
  },
  menuOption: {
    padding: 5,
  },
});