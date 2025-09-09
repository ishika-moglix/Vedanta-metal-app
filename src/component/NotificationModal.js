import {Dimension} from 'mog-react-native-form-fields';
import React from 'react';
import {Modal, View, Text, TouchableOpacity, StyleSheet} from 'react-native';

const NotificationModal = ({visible, title, message, onClose, onNavigate}) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.openButton} onPress={onNavigate}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>{title || 'Notification'}</Text>
            <Text style={styles.message}>
              {message || 'You have a new notification!'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    // justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  modalContent: {
    width: '98%',
    backgroundColor: '#fff',
    padding: Dimension.padding10,
    alignSelf: 'center',
    borderRadius: 3,
    elevation: 5,
    position: 'absolute',
    top: 0, // 🟢 Top Se 30px Gap
  },
  title: {
    fontSize: Dimension.font16,
    fontWeight: 'bold',
    marginBottom: Dimension.margin5,
    color: '#333',
  },
  message: {
    fontSize: Dimension.font14,
    color: '#666',
    // marginBottom: 10,
  },
  openButton: {
    width: '100%',
  },
});

export default NotificationModal;
