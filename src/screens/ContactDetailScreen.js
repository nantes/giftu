import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Modal,
  TextInput,
  Button,
  Platform,
  FlatList,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import COLORS from '../styles/colors';
import TYPOGRAPHY from '../styles/typography';
import NotificationService from '../services/NotificationService'; // Adjusted path

// Debounce function
const debounce = (func, delay) => {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), delay);
  };
};

let notificationConfigured = false; // Ensure configure is called only once

const ContactDetailScreen = ({ route }) => {
  const { contact } = route.params;

  const [importantDates, setImportantDates] = useState([]);
  const [isAddDateModalVisible, setIsAddDateModalVisible] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentLabel, setCurrentLabel] = useState('');
  const [giftIdeasText, setGiftIdeasText] = useState('');

  const DATES_STORAGE_KEY = `@contact_${contact.recordID}_dates`;
  const GIFT_IDEAS_STORAGE_KEY = `@contact_${contact.recordID}_gift_ideas`;

  // Configure Notifications (run once)
  useEffect(() => {
    if (!notificationConfigured) {
      NotificationService.configure((notification) => {
        console.log('Notification opened or received:', notification);
        // Potentially navigate or show in-app message if app is open
        // notification.finish(PushNotificationIOS.FetchResult.NoData); // If using iOS specific finish
      });
      NotificationService.requestPermissions();
      notificationConfigured = true;
    }
  }, []);


  // Load data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const storedDates = await AsyncStorage.getItem(DATES_STORAGE_KEY);
        if (storedDates !== null) {
          setImportantDates(JSON.parse(storedDates));
        }
        const storedGiftIdeas = await AsyncStorage.getItem(GIFT_IDEAS_STORAGE_KEY);
        if (storedGiftIdeas !== null) {
          setGiftIdeasText(storedGiftIdeas);
        }
      } catch (error) {
        console.error('Failed to load data.', error);
        Alert.alert('Error', 'Failed to load data.');
      }
    };
    loadData();
  }, [contact.recordID, DATES_STORAGE_KEY, GIFT_IDEAS_STORAGE_KEY]);

  // Save dates to AsyncStorage
  const saveDates = async (datesToSave) => {
    try {
      await AsyncStorage.setItem(DATES_STORAGE_KEY, JSON.stringify(datesToSave));
    } catch (error) {
      console.error('Failed to save dates.', error);
      Alert.alert('Error', 'Failed to save dates.');
    }
  };

  // Save gift ideas to AsyncStorage (debounced)
  const saveGiftIdeas = useCallback(
    debounce(async (text) => {
      try {
        await AsyncStorage.setItem(GIFT_IDEAS_STORAGE_KEY, text);
      } catch (error) {
        console.error('Failed to save gift ideas.', error);
        Alert.alert('Error', 'Failed to save gift ideas.');
      }
    }, 500), 
    [GIFT_IDEAS_STORAGE_KEY]
  );

  const handleGiftIdeasChange = (text) => {
    setGiftIdeasText(text);
    saveGiftIdeas(text);
  };

  const getDisplayName = () => {
    if (contact.displayName) return contact.displayName;
    const name = `${contact.givenName || ''} ${contact.familyName || ''}`.trim();
    return name || 'N/A';
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const openDialer = (phoneNumber) => Linking.openURL(`tel:${phoneNumber}`);
  const openEmail = (emailAddress) => Linking.openURL(`mailto:${emailAddress}`);

  const handleFabPress = () => {
    setCurrentDate(new Date()); // Reset to today for new date entry
    setCurrentLabel('');
    setIsAddDateModalVisible(true);
  };

  const handleDateChange = (event, selectedDate) => {
    setIsDatePickerVisible(Platform.OS === 'ios');
    if (selectedDate) {
      setCurrentDate(selectedDate);
    }
  };

  const handleSaveDate = () => {
    if (!currentLabel.trim()) {
      Alert.alert('Validation Error', 'Please enter a label for the date.');
      return;
    }
    const newDateEntry = {
      id: Date.now().toString(), // Unique ID for the date entry and notification
      date: currentDate.toISOString(), // Store as ISO string
      label: currentLabel.trim(),
    };
    const updatedDates = [...importantDates, newDateEntry];
    setImportantDates(updatedDates);
    saveDates(updatedDates);

    // Schedule notification
    const eventDate = new Date(newDateEntry.date);
    // Set notification to trigger at a specific time, e.g., 9 AM on the event day
    eventDate.setHours(9, 0, 0, 0); 

    // Ensure the date is in the future for testing/actual use
    if (eventDate.getTime() > new Date().getTime()) {
        NotificationService.scheduleNotification(
            newDateEntry.id, // Use date entry's ID as notification ID
            `${getDisplayName()}'s ${newDateEntry.label}`,
            `Reminder: ${newDateEntry.label} for ${getDisplayName()} is today!`,
            eventDate,
            { contactId: contact.recordID, dateId: newDateEntry.id } // userInfo
        );
    } else {
        // Optionally, notify user if scheduling for a past date (or handle differently)
        console.log("Attempted to schedule notification for a past date.");
    }


    setIsAddDateModalVisible(false);
    setCurrentLabel('');
  };

  const handleDeleteDate = (dateId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this date?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            const updatedDates = importantDates.filter(date => date.id !== dateId);
            setImportantDates(updatedDates);
            saveDates(updatedDates);
            // Cancel the corresponding notification
            NotificationService.cancelNotification(dateId);
          },
          style: "destructive",
        },
      ]
    );
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderDateItem = ({ item }) => (
    <View style={styles.dateItemContainer}>
      <View style={styles.dateInfo}>
        <Text style={TYPOGRAPHY.bodyRegular}>{item.label}</Text>
        <Text style={TYPOGRAPHY.bodySmall}>{formatDate(item.date)}</Text>
      </View>
      <TouchableOpacity 
        onPress={() => handleDeleteDate(item.id)} 
        style={styles.deleteButton}
        activeOpacity={0.7} 
      >
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderImportantDatesSection = () => (
    <View style={styles.customSection}>
      <Text style={TYPOGRAPHY.sectionTitle}>Important Dates</Text>
      {importantDates.length === 0 ? (
        <View style={styles.placeholderContent}>
          <Text style={TYPOGRAPHY.bodyRegular}>No important dates recorded. Tap '+' to add.</Text>
        </View>
      ) : (
        <FlatList
          data={importantDates}
          renderItem={renderDateItem}
          keyExtractor={item => item.id}
          style={styles.dateList}
        />
      )}
    </View>
  );
  
   const renderGiftIdeasSection = () => (
    <View style={styles.customSection}>
      <Text style={TYPOGRAPHY.sectionTitle}>Gift Ideas</Text>
      <View style={styles.giftIdeasContent}>
        <TextInput
          style={styles.giftIdeasInput}
          multiline
          placeholder="Jot down gift ideas, preferences, sizes, etc."
          value={giftIdeasText}
          onChangeText={handleGiftIdeasChange}
          placeholderTextColor={COLORS.textSecondary}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(getDisplayName())}</Text>
          </View>
          <Text style={TYPOGRAPHY.contactDetailName}>{getDisplayName()}</Text>
        </View>

        { (contact.phoneNumbers && contact.phoneNumbers.length > 0) || 
          (contact.emailAddresses && contact.emailAddresses.length > 0) ||
          contact.company ? (
          <View style={styles.detailsCard}>
            {contact.phoneNumbers && contact.phoneNumbers.length > 0 && (
              <>
                <Text style={styles.cardSectionTitle}>Phone Numbers:</Text>
                {contact.phoneNumbers.map((phone, index) => (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => openDialer(phone.number)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.infoItem}>
                      <Text style={styles.label}>{phone.label || 'Phone'}: </Text>
                      <Text style={[TYPOGRAPHY.bodyRegular, styles.linkText]}>{phone.number}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
            {contact.emailAddresses && contact.emailAddresses.length > 0 && (
              <>
                <Text style={styles.cardSectionTitle}>Email Addresses:</Text>
                {contact.emailAddresses.map((email, index) => (
                  <TouchableOpacity 
                    key={index} 
                    onPress={() => openEmail(email.email)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.infoItem}>
                      <Text style={styles.label}>{email.label || 'Email'}: </Text>
                      <Text style={[TYPOGRAPHY.bodyRegular, styles.linkText]}>{email.email}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
            {contact.company ? (
              <>
                <Text style={styles.cardSectionTitle}>Company:</Text>
                <Text style={[TYPOGRAPHY.bodyRegular, styles.infoItem]}>{contact.company}</Text>
              </>
            ) : null}
          </View>
        ) : null}
        
        {renderGiftIdeasSection()}
        {renderImportantDatesSection()}

      </ScrollView>

      <TouchableOpacity style={styles.fab} onPress={handleFabPress} activeOpacity={0.8}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddDateModalVisible}
        onRequestClose={() => setIsAddDateModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Important Date</Text>
            <TextInput
              style={styles.input}
              placeholder="Label (e.g., Birthday)"
              value={currentLabel}
              onChangeText={setCurrentLabel}
              placeholderTextColor={COLORS.textSecondary}
            />
            <TouchableOpacity 
              style={styles.dateDisplayButton} 
              onPress={() => setIsDatePickerVisible(true)}
              activeOpacity={0.7}
            >
                <Text style={TYPOGRAPHY.bodyRegular}>
                    Selected Date: {formatDate(currentDate.toISOString())}
                </Text>
            </TouchableOpacity>

            {isDatePickerVisible && (
              <DateTimePicker
                value={currentDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
              />
            )}
            {Platform.OS === 'ios' && isDatePickerVisible && (
                 <Button title="Done" onPress={() => setIsDatePickerVisible(false)} color={COLORS.primary}/>
            )}

            <View style={styles.modalActions}>
              <Button title="Cancel" onPress={() => setIsAddDateModalVisible(false)} color={COLORS.accent} />
              <Button title="Save" onPress={handleSaveDate} color={COLORS.primary}/>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundMain,
  },
  scrollContainer: {
    paddingBottom: 80, 
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: COLORS.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.avatarBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    ...TYPOGRAPHY.h1,
    fontSize: 40,
    color: COLORS.avatarText,
  },
  detailsCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardSectionTitle: {
    ...TYPOGRAPHY.h3,
    color: COLORS.primary,
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    ...TYPOGRAPHY.label,
    color: COLORS.textSecondary,
    marginRight: 5,
  },
  linkText: {
    color: COLORS.accent,
    textDecorationLine: 'underline',
  },
  customSection: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 10,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  placeholderContent: { 
    padding: 20,
    alignItems: 'center',
  },
  giftIdeasContent: {
    padding: 15,
  },
  giftIdeasInput: {
    ...TYPOGRAPHY.bodyRegular,
    minHeight: 100, // Changed to minHeight
    textAlignVertical: 'top', 
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 8,
    padding: 10,
    color: COLORS.textPrimary,
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  fabText: {
    ...TYPOGRAPHY.h1,
    fontSize: 30,
    color: COLORS.white,
    lineHeight: Platform.OS === 'ios' ? 32 : 38,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 20,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    ...TYPOGRAPHY.h2,
    marginBottom: 15,
    textAlign: 'center',
  },
  input: { 
    ...TYPOGRAPHY.bodyRegular,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: COLORS.textPrimary,
  },
  dateDisplayButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderColor,
    alignItems: 'center',
    marginBottom: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  dateList: {
    paddingHorizontal: 15, 
    paddingBottom: 10,
  },
  dateItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderColor,
  },
  dateInfo: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 10,
  },
  deleteButtonText: {
    ...TYPOGRAPHY.bodyRegular,
    color: COLORS.accent,
    fontSize: 18, 
  },
});

export default ContactDetailScreen;
