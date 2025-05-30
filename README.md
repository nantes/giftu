# GiftU - Mobile Gift Assistant

GiftU is a native mobile application (developed with React Native) designed to help you select and remember gifts for people in your contacts. It allows you to keep track of gift ideas and important dates, and sends you reminders so you don't forget any special occasion.

## Key Features

- **Contact Integration:** Browse your device's contacts directly from the application.
    - `[Screenshot: Main contact list displaying several contacts with avatars and names]`
- **Contact Detail Screen:** View your contacts' information and manage gift ideas and important dates specific to each one.
    - `[Screenshot: Contact detail screen showing a contact's name, avatar, phone/email, a section for Gift Ideas, and a list of Important Dates. A Floating Action Button for adding dates should be visible.]`
- **Important Date Management:**
    - Add, view, and delete key dates such as birthdays, anniversaries, etc.
    - Dates are stored locally on the device.
    - `[Screenshot: Modal dialog for adding/editing an important date, showing input fields for a label (e.g., 'Birthday') and the date picker component.]`
- **Gift Ideas:**
    - Write down gift ideas for each contact.
    - These notes are saved locally.
    - `[Screenshot: Close-up of the 'Gift Ideas' text input field within the Contact Detail Screen, perhaps with some example text.]`
- **Local Notifications:**
    - Receive reminders for the important dates you've saved.
    - **Note:** Notifications are currently fully functional on Android. On iOS, the native setup requires an additional step (`pod install`) that could not be completed in the current development environment, so notifications may not work as expected on iOS until this setup is complete.
    - `[Screenshot: Example of a local notification appearing on a device, reminding about an upcoming event like 'Ana's Birthday is today!']`
- **User-Friendly Interface:** Design inspired by a modern mockup, with clear and simple navigation.

## Getting Started (General)

This is a React Native project. To run it in a local development environment, you would typically follow these steps:

1.  **Clone the repository.**
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```
3.  **Platform-specific setup:**
    *   **iOS:** Navigate to the `ios` folder and run `pod install`.
    *   **Android:** Ensure you have the Android development environment set up.
4.  **Run the application:**
    ```bash
    npm run ios
    # or
    npm run android
    ```

## Potential Next Steps

- AI integration for automatic gift suggestions.
- Cloud synchronization of gift and date data.
- More advanced notification options (e.g., multi-day advance reminders).

---

This README provides an overview of the GiftU project in its current state.
