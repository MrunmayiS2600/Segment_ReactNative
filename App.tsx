/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
// //  */

import React, { useEffect, useState } from 'react';
import analytics from '@segment/analytics-react-native';
import CleverTap from '@segment/analytics-react-native-clevertap';
const cleverTap = require('clevertap-react-native');

import { 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Alert,
  Image
} from 'react-native';

// Your Segment Write Key
const SEGMENT_WRITE_KEY = 'LVCt56XHQ0d1KxnX80EIAx2BVcsBzVES';

const App = () => {
  const [initialized, setInitialized] = useState(false);

  // Function to handle CleverTap events
  const _handleCleverTapEvent = (eventName:any, event:any) => {
    console.log('CleverTap Event called - ', eventName, event);
  };

  // Function to handle CleverTap Inbox events
  const _handleCleverTapInbox = (eventName:any, event:any) => {
    console.log('CleverTap Inbox Event - ', eventName, event);
    
    if (eventName === cleverTap.CleverTapInboxDidInitialize) {
      // Show inbox when initialized
      cleverTap.showInbox({
        tabs: ['Offers', 'Promotions'],
        navBarTitle: 'My App Inbox',
        navBarTitleColor: '#FF0000',
        navBarColor: '#FFFFFF',
        inboxBackgroundColor: '#AED6F1',
        backButtonColor: '#00FF00',
        unselectedTabColor: '#0000FF',
        selectedTabColor: '#FF0000',
        selectedTabIndicatorColor: '#000000',
        noMessageText: 'No message(s)',
        noMessageTextColor: '#FF0000'
      });
    }
  };

  // Initialize Segment when the app starts
  useEffect(() => {
    const initializeSegment = async () => {
      try {
        await analytics.setup(SEGMENT_WRITE_KEY, {
          using: [CleverTap],
          debug: true,
          recordScreenViews: false,
          trackAppLifecycleEvents: true,
          trackAttributionData: true
        });
        
        console.log('Analytics is ready');
        setInitialized(true);
        
        //Alert.alert('Success', 'Segment analytics initialized successfully');
      } catch (error) {
        console.error('Failed to initialize analytics:', error);
        Alert.alert('Error', 'Failed to initialize Segment analytics');
      }
    };

    // Set CleverTap debug level
    cleverTap.setDebugLevel(3);

    cleverTap.addListener(cleverTap.CleverTapDisplayUnitsLoaded, (data: any) => {
      /* consume the event data */
    });
    cleverTap.getAllDisplayUnits((err:any, res:any) => {
      console.log('All Display Units: ', res, err);
  });
    cleverTap.pushDisplayUnitViewedEventForID('Display Unit Id');
    cleverTap.pushDisplayUnitClickedEventForID('Display Unit Id');

    
    // Initialize in-app notifications - Uncomment this
    //cleverTap.initializeInAppNotifications();
  
    // Create notification channel for Android
    cleverTap.createNotificationChannel(
      "HI", 
      "Clever Tap React Native Testing", 
      "CT React Native Testing",
      5,  // Importance (1-5)
      true // Sound enabled
    );

    // Add event listeners for CleverTap Inbox
    cleverTap.addListener(
      cleverTap.CleverTapInboxDidInitialize, 
      (event:any) => _handleCleverTapInbox(cleverTap.CleverTapInboxDidInitialize, event)
    );
    
    cleverTap.addListener(
      cleverTap.CleverTapInboxMessagesDidUpdate, 
      (event:any) => _handleCleverTapInbox(cleverTap.CleverTapInboxMessagesDidUpdate, event)
    );

    // Add event listeners for in-app notifications
    cleverTap.addListener(
      cleverTap.CleverTapInAppNotificationDismissed,
      (event:any) => _handleCleverTapEvent(cleverTap.CleverTapInAppNotificationDismissed, event)
    );

    cleverTap.addListener(
      cleverTap.CleverTapInAppNotificationShowed,
      (event:any) => _handleCleverTapEvent(cleverTap.CleverTapInAppNotificationShowed, event)
    );

    cleverTap.addListener(
      cleverTap.CleverTapInAppNotificationButtonTapped,
      (event:any) => _handleCleverTapEvent(cleverTap.CleverTapInAppNotificationButtonTapped, event)
    );

    // Initialize Segment
    initializeSegment();

    // Clean up event listeners on component unmount
    return () => {
      cleverTap.removeListener(cleverTap.CleverTapInboxDidInitialize);
      cleverTap.removeListener(cleverTap.CleverTapInboxMessagesDidUpdate);
      cleverTap.removeListener(cleverTap.CleverTapInAppNotificationDismissed);
      cleverTap.removeListener(cleverTap.CleverTapInAppNotificationShowed);
      cleverTap.removeListener(cleverTap.CleverTapInAppNotificationButtonTapped);
    };
  }, []);

  // Function to identify user with predefined data
  const identifyUser = () => {
    try {
      analytics.identify("1122233", {
        name: "John Doe",
        email: "parth@clevertap.com",
        phone: "+919869357572",
        gender: "M",
        avatar: "link to image",
        title: "Owner",
        organization: "Company",
        city: "Tokyo",
        region: "ABC",
        country: "JP",
        zip: "100-0001",
        Flagged: false,
        Residence: "Shibuya",
        "MSG-email": true
      });
      
      Alert.alert('Success', 'User identified successfully');
    } catch (error) {
      console.error('Error identifying user:', error);
      Alert.alert('Error', 'Failed to identify user');
    }
  };



  // Function to track a basic event
  const trackBasicEvent = () => {
    try {
      analytics.track("Checked Out", {
        Clicked_Rush_delivery_Button: true,
        total_value: 2000,
        revenue: 2000,
      });
      Alert.alert('Success', 'Basic event tracked: Checked Out');
    } catch (error) {
      console.error('Error tracking event:', error);
      Alert.alert('Error', 'Failed to track basic event');
    }
  };

  // Function to track an order completed event
  const trackOrderEvent = () => {
    try {
      analytics.track("Order Completed", {
        checkout_id: "12345",
        order_id: "1234",
        affiliation: "App Store",
        'Payment mode': "Credit Card",
        total: 20,
        revenue: 15.0,
        shipping: 22,
        tax: 1,
        discount: 1.5,
        coupon: "Games",
        currency: "USD",
        products: [
          {
            product_id: "123",
            sku: "G-32",
            name: "Monopoly",
            price: 14,
            quantity: 1,
            category: "Games",
            url: "https://www.website.com/product/path",
            image_url: "https://www.website.com/product/path.jpg",
          },
          {
            product_id: "345",
            sku: "F-32",
            name: "UNO",
            price: 3.45,
            quantity: 2,
            category: "Games",
          }
        ],
      });
      Alert.alert('Success', 'Order Completed event tracked');
    } catch (error) {
      console.error('Error tracking order event:', error);
      Alert.alert('Error', 'Failed to track order event');
    }
  };

  // Function to track a custom event
  const trackCustomEvent = () => {
    try {
      analytics.track("Product Viewed", {
        product_name: "Smart Watch",
        product_id: "SW-1001",
        price: 199.99,
        currency: "USD",
        category: "Electronics",
        brand: "TechBrand",
        variant: "Black",
        in_stock: true,
        viewed_at: new Date().toISOString()
      });
      Alert.alert('Success', 'Custom event tracked: Product Viewed');
    } catch (error) {
      console.error('Error tracking custom event:', error);
      Alert.alert('Error', 'Failed to track custom event');
    }
  };

  // Function to trigger in-app notification
  // const triggerInAppNotification = () => {
  //   try {
  //     // Record event to trigger in-app notification
  //     cleverTap.recordEvent('In-app Notification Triggered', {
  //       'product': 'example-product',
  //       'timestamp': new Date().toISOString()
  //     });
  //     console.log('Triggered in-app notification');
  //   } catch (error) {
  //     console.error('Error triggering in-app notification:', error);
  //     Alert.alert('Error', 'Failed to trigger in-app notification');
  //   }
  // };

  // Modified openInbox function
  const openInbox = () => {
    try {
      // Initialize the inbox - this triggers the CleverTapInboxDidInitialize event
      cleverTap.initializeInbox();
      console.log('Initialized CleverTap inbox');
      analytics.track("Inbox Event")
      
      // We'll also manually show the inbox in case the event handler doesn't work
      setTimeout(() => {
        cleverTap.showInbox({
          tabs: ['Offers', 'Promotions'],
          navBarTitle: 'My App Inbox',
          navBarTitleColor: '#FF0000',
          navBarColor: '#FFFFFF',
          inboxBackgroundColor: '#AED6F1',
          backButtonColor: '#00FF00',
          unselectedTabColor: '#0000FF',
          selectedTabColor: '#FF0000',
          selectedTabIndicatorColor: '#000000',
          noMessageText: 'No message(s)',
          noMessageTextColor: '#FF0000'
        });
      }, 1000); // Adding a short delay to ensure initialization completes
    } catch (error) {
      console.error('Error opening inbox:', error);
      Alert.alert('Error', 'Failed to open inbox');
    }
  };

  const nativedisplay = () => {
    cleverTap.recordEvent('Native Display', { 'Product name': 'CleverTap React Native' });
    // Fetch the display units explicitly when the button is clicked
    cleverTap.getAllDisplayUnits((err:any, res:any) => {
      if (err) {
        console.error('Error fetching display units:', err);
      } else {
        console.log('Fetched Display Units:', res);
        setDisplayUnits(Array.isArray(res) ? res : []);
      }
    });
  };
  // CleverTap.addListener(CleverTap.CleverTapDisplayUnitsLoaded, (data: any) => {
  //   /* consume the event data */
  //   CON
  // });
  //   CleverTap.getAllDisplayUnits((err, res) => {
  //     console.log('All Display Units: ', res, err);
  // });
  // CleverTap.pushDisplayUnitViewedEventForID('Display Unit Id');
  // CleverTap.pushDisplayUnitClickedEventForID('Display Unit Id');
  const [displayUnits, setDisplayUnits] = useState<any[]>([]); // :white_check_mark: Ensures it's always an array
  useEffect(() => {
  cleverTap.addListener('CleverTapDisplayUnitsLoaded', (data:any) => {
    console.log('Native Display Units Loaded:', data);
    if (Array.isArray(data) && data.length > 0) {
      setDisplayUnits(data);
    }
  });
  cleverTap.getAllDisplayUnits((err:any, res:any) => {
    if (err) {
      console.error('Error fetching display units:', err);
    } else {
      console.log('Fetched Display Units:', res);
      setDisplayUnits(Array.isArray(res) ? res : []);
    }
  });
  return () => {
    cleverTap.removeListener('CleverTapDisplayUnitsLoaded');
  };
}, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Segment-CleverTap Integration</Text>
        
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>
            Status: {initialized ? '✅ Initialized' : '⏳ Initializing...'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>User Identification</Text>
          <TouchableOpacity
            style={[styles.button, !initialized && styles.disabledButton]}
            onPress={identifyUser}
            disabled={!initialized}
          >
            <Text style={styles.buttonText}>Identify User</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Track Events</Text>
          <TouchableOpacity
            style={[styles.button, !initialized && styles.disabledButton]}
            onPress={trackBasicEvent}
            disabled={!initialized}
          >
            <Text style={styles.buttonText}>Track Checkout Event</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, !initialized && styles.disabledButton]}
            onPress={trackOrderEvent}
            disabled={!initialized}
          >
            <Text style={styles.buttonText}>Track Order Completed</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, !initialized && styles.disabledButton]}
            onPress={trackCustomEvent}
            disabled={!initialized}
          >
            <Text style={styles.buttonText}>Track Product Viewed</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CleverTap Features</Text>
          <TouchableOpacity
            style={[styles.inappButton, !initialized && styles.disabledButton]}
            onPress={() => cleverTap.recordEvent('In-app Notification Triggered',{'produca':'adfahdv'})}
            
            disabled={!initialized}
          >
            <Text style={styles.buttonText}>Show In-App Notification</Text>
            
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.inboxButton, !initialized && styles.disabledButton]}
            onPress={openInbox}
            disabled={!initialized}
          >
            <Text style={styles.buttonText}>Open App Inbox</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity style={styles.button} onPress={nativedisplay}>
              <Text style={styles.buttonText}>Native Display</Text>
            </TouchableOpacity>
            {displayUnits.length === 0 ? (
              <Text style={{ textAlign: 'center', margin: 10 }}>No Native Display Units Available</Text>
            ) : (
              displayUnits.map((unit, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => cleverTap.pushDisplayUnitClickedEventForID(unit.unitID)}
                  style={styles.nativeDisplayContainer}
                >
                  {unit.content?.[0] ? (
                    <>
                      <Image source={{ uri: unit.content[0].media?.url }} style={styles.nativeImage} />
                      <Text style={styles.nativeTitle}>{unit.content[0].title?.text}</Text>
                      <Text style={styles.nativeMessage}>{unit.content[0].message?.text}</Text>
                    </>
                  ) : (
                    <Text style={styles.nativeMessage}>No Content Available</Text>
                  )}
                </TouchableOpacity>
                ))
              )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statusText: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  inappButton: {
    backgroundColor: '#e24a90',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  inboxButton: {
    backgroundColor: '#4ae290',
    padding: 15,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10,
  },
  disabledButton: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  nativeDisplayContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 10,
  },
  nativeImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  nativeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  nativeMessage: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default App;


// import React, { useEffect, useState } from 'react';
// import analytics from '@segment/analytics-react-native';
// import CleverTap from '@segment/analytics-react-native-clevertap';
// const cleverTap = require('clevertap-react-native');
// import { AppState } from 'react-native';
// AppState.addEventListener('change', (state) => {
//   console.log('AppState:', state);
// });
// import { 
//   SafeAreaView, 
//   ScrollView, 
//   StyleSheet, 
//   Text, 
//   TouchableOpacity, 
//   View, 
//   Alert
// } from 'react-native';

// // Your Segment Write Key
// const SEGMENT_WRITE_KEY = 'LVCt56XHQ0d1KxnX80EIAx2BVcsBzVES';

// const App = () => {
//   const [initialized, setInitialized] = useState(false);

//   // Initialize Segment when the app starts
//   useEffect(() => {
//     const initializeSegment = async () => {
//       try {
//         await analytics.setup(SEGMENT_WRITE_KEY, {
//           using: [CleverTap],
//           debug: true,
//           recordScreenViews: false,
//           trackAppLifecycleEvents: true,
//           trackAttributionData: true
//         });
        
//         console.log('Analytics is ready');
//         setInitialized(true);
        
//         //Alert.alert('Success', 'Segment analytics initialized successfully');
//       } catch (error) {
//         console.error('Failed to initialize analytics:', error);
//         //Alert.alert('Error', 'Failed to initialize Segment analytics');
//       }
//     };
//     cleverTap.setDebugLevel(3);
//     // for iOS only: register for push notifications
   
//     cleverTap.createNotificationChannel("HI", "Clever Tap React Native Testing", "CT React Native Testing", 5, true) // The notification channel importance can have any value from 1 to 5. A higher value means a more interruptive notification.
//     initializeSegment();
    
    
//   }, []);

//   // Function to identify user with predefined data
//   const identifyUser = () => {
//     try {
//       analytics.identify("1122233", {
//         name: "Name Surname",
//         email: "parth@clevertap.com",
//         phone: "+919869357572",
//         gender: "M",
//         avatar: "link to image",
//         title: "Owner",
//         organization: "Company",
//         city: "Tokyo",
//         region: "ABC",
//         country: "JP",
//         zip: "100-0001",
//         Flagged: false,
//         Residence: "Shibuya",
//         "MSG-email": true
//       });
//       //Alert.alert('Success', 'User identified successfully');
//     } catch (error) {
//       console.error('Error identifying user:', error);
//       //Alert.alert('Error', 'Failed to identify user');
//     }
//   };

//   // Function to track a basic event
//   const trackBasicEvent = () => {
//     try {
//       analytics.track("Checked Out", {
//         Clicked_Rush_delivery_Button: true,
//         total_value: 2000,
//         revenue: 2000,
//       });
//       //Alert.alert('Success', 'Basic event tracked: Checked Out');
//     } catch (error) {
//       console.error('Error tracking event:', error);
//       //Alert.alert('Error', 'Failed to track basic event');
//     }
//   };

//   // Function to track an order completed event
//   const trackOrderEvent = () => {
//     try {
//       analytics.track("Order Completed", {
//         checkout_id: "12345",
//         order_id: "1234",
//         affiliation: "App Store",
//         'Payment mode': "Credit Card",
//         total: 20,
//         revenue: 15.0,
//         shipping: 22,
//         tax: 1,
//         discount: 1.5,
//         coupon: "Games",
//         currency: "USD",
//         products: [
//           {
//             product_id: "123",
//             sku: "G-32",
//             name: "Monopoly",
//             price: 14,
//             quantity: 1,
//             category: "Games",
//             url: "https://www.website.com/product/path",
//             image_url: "https://www.website.com/product/path.jpg",
//           },
//           {
//             product_id: "345",
//             sku: "F-32",
//             name: "UNO",
//             price: 3.45,
//             quantity: 2,
//             category: "Games",
//           }
//         ],
//       });
//       //Alert.alert('Success', 'Order Completed event tracked');
//     } catch (error) {
//       console.error('Error tracking order event:', error);
//       //Alert.alert('Error', 'Failed to track order event');
//     }
//   };

//   // Function to track a custom event
//   const trackCustomEvent = () => {
//     try {
//       analytics.track("Product Viewed", {
//         product_name: "Smart Watch",
//         product_id: "SW-1001",
//         price: 199.99,
//         currency: "USD",
//         category: "Electronics",
//         brand: "TechBrand",
//         variant: "Black",
//         in_stock: true,
//         viewed_at: new Date().toISOString()
//       });
//       //Alert.alert('Success', 'Custom event tracked: Product Viewed');
//     } catch (error) {
//       console.error('Error tracking custom event:', error);
//       //Alert.alert('Error', 'Failed to track custom event');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.title}>Segment-CleverTap Integration</Text>
        
//         {/* <View style={styles.statusContainer}>
//           <Text style={styles.statusText}>
//             Status: {initialized ? '✅ Initialized' : '⏳ Initializing...'}
//           </Text>
//         </View> */}

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>User Identification</Text>
//           <TouchableOpacity
//             style={[styles.button, !initialized && styles.disabledButton]}
//             onPress={identifyUser}
//             disabled={!initialized}
//           >
//             <Text style={styles.buttonText}>Identify User</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Track Events</Text>
//           <TouchableOpacity
//             style={[styles.button, !initialized && styles.disabledButton]}
//             onPress={trackBasicEvent}
//             disabled={!initialized}
//           >
//             <Text style={styles.buttonText}>Track Checkout Event</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[styles.button, !initialized && styles.disabledButton]}
//             onPress={trackOrderEvent}
//             disabled={!initialized}
//           >
//             <Text style={styles.buttonText}>Track Order Completed</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[styles.button, !initialized && styles.disabledButton]}
//             onPress={trackCustomEvent}
//             disabled={!initialized}
//           >
//             <Text style={styles.buttonText}>Track Product Viewed</Text>
//           </TouchableOpacity>
//         </View>
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>In-app</Text>
//           <TouchableOpacity
//             style={[styles.button, !initialized && styles.disabledButton]}
//             onPress={() => cleverTap.recordEvent('In-app Notification Triggered')}
//             //onPress={() => cleverTap.recordEvent('In-app Notification Triggered',{'produca':'adfahdv'})}
//             disabled={!initialized}
//           >
//             <Text style={styles.buttonText}>In-app Notification</Text>
//           </TouchableOpacity>
//         </View>

//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollContainer: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#333',
//   },
//   statusContainer: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   statusText: {
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   section: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 8,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#333',
//   },
//   button: {
//     backgroundColor: '#4a90e2',
//     padding: 15,
//     borderRadius: 6,
//     alignItems: 'center',
//     marginTop: 5,
//     marginBottom: 10,
//   },
//   disabledButton: {
//     backgroundColor: '#a0a0a0',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default App;


// import React, { useEffect, useState } from 'react';
// import analytics from '@segment/analytics-react-native';
// import CleverTap from '@segment/analytics-react-native-clevertap';
// import { 
//   SafeAreaView, 
//   ScrollView, 
//   StyleSheet, 
//   Text, 
//   TextInput, 
//   TouchableOpacity, 
//   View, 
//   Alert
// } from 'react-native';
// import CleverTapIntegration from '@segment/analytics-react-native-clevertap';


// // Your Segment Write Key - replace this with your actual key
// const SEGMENT_WRITE_KEY = 'LVCt56XHQ0d1KxnX80EIAx2BVcsBzVES';

// const App = () => {
//   const [userId, setUserId] = useState('');
//   const [userName, setUserName] = useState('');
//   const [userEmail, setUserEmail] = useState('');
//   const [userPhone, setUserPhone] = useState('');
//   const [initialized, setInitialized] = useState(false);

//   // Initialize Segment when the app starts
//   useEffect(() => {
//     const initializeSegment = async () => {
//       try {
//         await analytics.setup(SEGMENT_WRITE_KEY, {
//           using: [CleverTap],
//           debug: true,
//           recordScreenViews: false,
//           trackAppLifecycleEvents: true,
//           trackAttributionData: true
//         });
        
//         console.log('Analytics is ready');
//         setInitialized(true);
//         Alert.alert('Success', 'Segment analytics initialized successfully');
//       } catch (error) {
//         console.error('Failed to initialize analytics:', error);
//         Alert.alert('Error', 'Failed to initialize Segment analytics');
//       }
//     };
    
    

//     initializeSegment();
    
//   }, []);

//   // Function to identify user
//   const identifyUser = () => {
//     if (!userId) {
//       Alert.alert('Error', 'User ID is required');
//       return;
//     }

//     try {
//       analytics.identify(userId, {
//         name: userName,
//         email: userEmail,
//         phone: userPhone,
//         gender: "M",
//         avatar: "https://example.com/avatar.jpg",
//         title: "User",
//         organization: "Company",
//         city: "New York",
//         region: "NY",
//         country: "US",
//         zip: "10001",
//         Flagged: false,
//         Residence: "Manhattan",
//         "MSG-email": true
//       });
//       Alert.alert('Success', `User identified: ${userId}`);
//     } catch (error) {
//       console.error('Error identifying user:', error);
//       Alert.alert('Error', 'Failed to identify user');
//     }
//   };

//   // Function to track a basic event
//   const trackBasicEvent = () => {
//     try {
//       analytics.track("Checked Out", {
//         Clicked_Rush_delivery_Button: true,
//         total_value: 2000,
//         revenue: 2000,
//       });
//       Alert.alert('Success', 'Basic event tracked: Checked Out');
//     } catch (error) {
//       console.error('Error tracking event:', error);
//       Alert.alert('Error', 'Failed to track basic event');
//     }
//   };

//   // Function to track an order completed event
//   const trackOrderEvent = () => {
//     try {
//       analytics.track("Order Completed", {
//         checkout_id: "12345",
//         order_id: "1234",
//         affiliation: "App Store",
//         'Payment mode': "Credit Card",
//         total: 20,
//         revenue: 15.0,
//         shipping: 22,
//         tax: 1,
//         discount: 1.5,
//         coupon: "Games",
//         currency: "USD",
//         products: [
//           {
//             product_id: "123",
//             sku: "G-32",
//             name: "Monopoly",
//             price: 14,
//             quantity: 1,
//             category: "Games",
//             url: "https://www.website.com/product/path",
//             image_url: "https://www.website.com/product/path.jpg",
//           },
//           {
//             product_id: "345",
//             sku: "F-32",
//             name: "UNO",
//             price: 3.45,
//             quantity: 2,
//             category: "Games",
//           }
//         ],
//       });
//       Alert.alert('Success', 'Order Completed event tracked');
//     } catch (error) {
//       console.error('Error tracking order event:', error);
//       Alert.alert('Error', 'Failed to track order event');
//     }
//   };

//   // Function to track a custom event
//   const trackCustomEvent = () => {
//     try {
//       analytics.track("Product Viewed", {
//         product_name: "Smart Watch",
//         product_id: "SW-1001",
//         price: 199.99,
//         currency: "USD",
//         category: "Electronics",
//         brand: "TechBrand",
//         variant: "Black",
//         in_stock: true,
//         viewed_at: new Date().toISOString()
//       });
//       Alert.alert('Success', 'Custom event tracked: Product Viewed');
//     } catch (error) {
//       console.error('Error tracking custom event:', error);
//       Alert.alert('Error', 'Failed to track custom event');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.title}>Segment-CleverTap Integration</Text>
        
//         <View style={styles.statusContainer}>
//           <Text style={styles.statusText}>
//             Status: {initialized ? '✅ Initialized' : '⏳ Initializing...'}
//           </Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Identify User</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="User ID (required)"
//             value={userId}
//             onChangeText={setUserId}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Name"
//             value={userName}
//             onChangeText={setUserName}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             value={userEmail}
//             onChangeText={setUserEmail}
//             keyboardType="email-address"
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Phone"
//             value={userPhone}
//             onChangeText={setUserPhone}
//             keyboardType="phone-pad"
//           />
//           <TouchableOpacity
//             style={[styles.button, !initialized && styles.disabledButton]}
//             onPress={identifyUser}
//             disabled={!initialized}
//           >
//             <Text style={styles.buttonText}>Identify User</Text>
//           </TouchableOpacity>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Track Events</Text>
//           <TouchableOpacity
//             style={[styles.button, !initialized && styles.disabledButton]}
//             onPress={trackBasicEvent}
//             disabled={!initialized}
//           >
//             <Text style={styles.buttonText}>Track Checkout Event</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[styles.button, !initialized && styles.disabledButton]}
//             onPress={trackOrderEvent}
//             disabled={!initialized}
//           >
//             <Text style={styles.buttonText}>Track Order Completed</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={[styles.button, !initialized && styles.disabledButton]}
//             onPress={trackCustomEvent}
//             disabled={!initialized}
//           >
//             <Text style={styles.buttonText}>Track Product Viewed</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollContainer: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 20,
//     color: '#333',
//   },
//   statusContainer: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   statusText: {
//     fontSize: 16,
//     textAlign: 'center',
//   },
//   section: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderRadius: 8,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     color: '#333',
//   },
//   input: {
//     backgroundColor: '#f9f9f9',
//     padding: 12,
//     borderRadius: 6,
//     marginBottom: 12,
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//   },
//   button: {
//     backgroundColor: '#4a90e2',
//     padding: 15,
//     borderRadius: 6,
//     alignItems: 'center',
//     marginTop: 5,
//     marginBottom: 10,
//   },
//   disabledButton: {
//     backgroundColor: '#a0a0a0',
//   },
//   buttonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
// });

// export default App;




// import React from 'react';
// import type {PropsWithChildren} from 'react';
// import {
//   ScrollView,
//   StatusBar,
//   StyleSheet,
//   Text,
//   useColorScheme,
//   View,
// } from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';

// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

// function App(): React.JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';

//   const backgroundStyle = {
//     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
//   };

//   /*
//    * To keep the template simple and small we're adding padding to prevent view
//    * from rendering under the System UI.
//    * For bigger apps the reccomendation is to use `react-native-safe-area-context`:
//    * https://github.com/AppAndFlow/react-native-safe-area-context
//    *
//    * You can read more about it here:
//    * https://github.com/react-native-community/discussions-and-proposals/discussions/827
//    */
//   const safePadding = '5%';

//   return (
//     <View style={backgroundStyle}>
//       <StatusBar
//         barStyle={isDarkMode ? 'light-content' : 'dark-content'}
//         backgroundColor={backgroundStyle.backgroundColor}
//       />
//       <ScrollView
//         style={backgroundStyle}>
//         <View style={{paddingRight: safePadding}}>
//           <Header/>
//         </View>
//         <View
//           style={{
//             backgroundColor: isDarkMode ? Colors.black : Colors.white,
//             paddingHorizontal: safePadding,
//             paddingBottom: safePadding,
//           }}>
//           <Section title="Step One">
//             Edit <Text style={styles.highlight}>App.tsx</Text> to change this
//             screen and then come back to see your edits.
//           </Section>
//           <Section title="See Your Changes">
//             <ReloadInstructions />
//           </Section>
//           <Section title="Debug">
//             <DebugInstructions />
//           </Section>
//           <Section title="Learn More">
//             Read the docs to discover what to do next:
//           </Section>
//           <LearnMoreLinks />
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   sectionContainer: {
//     marginTop: 32,
//     paddingHorizontal: 24,
//   },
//   sectionTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//   },
//   sectionDescription: {
//     marginTop: 8,
//     fontSize: 18,
//     fontWeight: '400',
//   },
//   highlight: {
//     fontWeight: '700',
//   },
// });

// export default App;
