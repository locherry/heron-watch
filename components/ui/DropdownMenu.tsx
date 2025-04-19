import { TouchableOpacity } from 'react-native';

import React, { useRef, useEffect, useState, ReactNode } from 'react';
import { View, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { useThemeColor } from '@/hooks/color/useThemeColor';
import { Shadows } from '@/constants/Shadows';

export const MenuOption = ({
  onSelect,
  children,
}: {
  onSelect: () => void;
  children: ReactNode;
}) => {
  return <TouchableOpacity onPress={onSelect} style={styles.menuOption}>
    {children}
  </TouchableOpacity>
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
    elevation: 4,
    ...Shadows.dp2
  },
  menuOption: {
    padding: 5,
  },
});