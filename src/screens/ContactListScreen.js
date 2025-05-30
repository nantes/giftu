import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Contacts from 'react-native-contacts';
import COLORS from '../styles/colors';
import TYPOGRAPHY from '../styles/typography';

const ContactListScreen = ({ navigation }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [permissionError, setPermissionError] = useState(null);

  useEffect(() => {
    const loadContacts = async () => {
      setLoading(true);
      setPermissionError(null);

      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              title: 'Contacts Access Permission',
              message: 'This app needs access to your contacts.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            fetchContacts();
          } else {
            setPermissionError('Contacts permission denied. Please grant permission in settings.');
            setLoading(false);
          }
        } catch (err) {
          console.warn(err);
          setPermissionError('Error requesting contacts permission.');
          setLoading(false);
        }
      } else if (Platform.OS === 'ios') {
        Contacts.checkPermission().then(permission => {
          if (permission === 'undefined') {
            Contacts.requestPermission().then(requestedPermission => {
              if (requestedPermission === 'authorized') {
                fetchContacts();
              } else {
                setPermissionError('Contacts permission denied. Please grant permission in settings.');
                setLoading(false);
              }
            });
          } else if (permission === 'authorized') {
            fetchContacts();
          } else {
            setPermissionError('Contacts permission denied. Please grant permission in settings.');
            setLoading(false);
          }
        }).catch(e => {
            console.error('iOS permission check error:', e);
            setPermissionError('Error checking iOS contacts permission.');
            setLoading(false);
        });
      }
    };

    loadContacts();
  }, []);

  const fetchContacts = () => {
    Contacts.getAll()
      .then(fetchedContacts => {
        const sortedContacts = fetchedContacts
          .map(contact => ({
            ...contact,
            // Ensure displayName is present, construct if not
            displayName: contact.displayName || `${contact.givenName || ''} ${contact.familyName || ''}`.trim() || 'N/A'
          }))
          .sort((a, b) => a.displayName.localeCompare(b.displayName));
        setContacts(sortedContacts);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
        setPermissionError('Error fetching contacts.');
        setLoading(false);
      });
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '?';
    const parts = name.split(' ').filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => navigation.navigate('ContactDetail', { contact: item })}
      activeOpacity={0.7} // Added activeOpacity for visual feedback
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(item.displayName)}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.itemTextName}>{item.displayName}</Text>
        {item.phoneNumbers && item.phoneNumbers.length > 0 && (
          <Text style={styles.itemTextDetail}>{item.phoneNumbers[0].number}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={TYPOGRAPHY.bodyRegular}>Loading contacts...</Text>
      </View>
    );
  }

  if (permissionError) {
    return (
      <View style={styles.centered}>
        <Text style={[TYPOGRAPHY.bodyRegular, styles.errorText]}>{permissionError}</Text>
      </View>
    );
  }
  
  if (contacts.length === 0 && !loading) {
    return (
      <View style={styles.centered}>
        <Text style={TYPOGRAPHY.bodyRegular}>No contacts found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={item => item.recordID}
        contentContainerStyle={styles.listContentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundMain,
  },
  listContentContainer: {
    paddingVertical: 8,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.backgroundMain,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    padding: 15,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.avatarBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    ...TYPOGRAPHY.h3,
    color: COLORS.avatarText,
  },
  contactInfo: {
    flex: 1,
  },
  itemTextName: {
    ...TYPOGRAPHY.label, // Using label style for name
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  itemTextDetail: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.textSecondary,
  },
  errorText: {
    color: COLORS.accent, // Using accent for error text color
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default ContactListScreen;
