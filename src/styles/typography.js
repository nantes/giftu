import { StyleSheet, Platform } from 'react-native';
import COLORS from './colors';

export const FONT_FAMILY = Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto'; // Common sans-serif fonts

export const TYPOGRAPHY = StyleSheet.create({
  h1: {
    fontFamily: FONT_FAMILY,
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  h2: {
    fontFamily: FONT_FAMILY,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  h3: {
    fontFamily: FONT_FAMILY,
    fontSize: 20,
    fontWeight: '600', // Semi-bold
    color: COLORS.textPrimary,
    marginBottom: 6,
  },
  bodyRegular: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  label: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: '500', // Medium
    color: COLORS.textPrimary,
  },
  buttonText: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.buttonPrimaryText,
  },
  // Specific style for Contact Detail Name, inspired by "Ana" in mockup
  contactDetailName: {
    fontFamily: FONT_FAMILY,
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary, // Using primary color for prominence
    textAlign: 'center',
    marginVertical: 10, // Reduced margin
  },
  sectionTitle: { // For "Gift Ideas", "Important Dates"
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: COLORS.sectionHeaderBackground,
    marginTop: 10,
    marginBottom: 5,
  },
});

export default TYPOGRAPHY;
