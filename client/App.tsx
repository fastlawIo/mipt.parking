import React, {Component} from 'react';
import {Container, Content} from 'native-base';
import {Constants, Font, Location, Permissions} from 'expo';
import {Platform, StyleSheet, View, ViewStyle, Text, SafeAreaView, Dimensions} from "react-native";
import MapView, {Region} from 'react-native-maps';
import Carousel from 'react-native-snap-carousel';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

function wp (percentage: number) {
    const value = (percentage * viewportWidth) / 100;
    return Math.round(value);
}

function hp (percentage: number) {
    const value = (percentage * viewportHeight) / 100;
    return Math.round(value);
}

interface Camera {
    url: string,
    location: Region,
    name: string,
    places: number
}

interface SlideStyle {
    root: ViewStyle,
    slideInnerContainer: ViewStyle,
    shadow: ViewStyle,
    imageContainer: ViewStyle
}

const slideStyles = StyleSheet.create<SlideStyle>({
    root: {
        height: hp(33),
        width: wp(66),
    },
    slideInnerContainer: {
        width: itemWidth,
        height: slideHeight,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: colors.black,
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: entryBorderRadius
    },
    imageContainer: {
        flex: 1,
        marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    imageContainerEven: {
        backgroundColor: colors.black
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        resizeMode: 'cover',
        borderRadius: IS_IOS ? entryBorderRadius : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
    // image's border radius is buggy on iOS; let's hack it!
    radiusMask: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: entryBorderRadius,
        backgroundColor: 'white'
    },
    radiusMaskEven: {
        backgroundColor: colors.black
    },
    textContainer: {
        justifyContent: 'center',
        paddingTop: 20 - entryBorderRadius,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    textContainerEven: {
        backgroundColor: colors.black
    },
    title: {
        color: colors.black,
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: colors.gray,
        fontSize: 12,
        fontStyle: 'italic'
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    }
});

const Slide = ( camera: Camera ) =>
    <View style={slideStyles.root}>
        <Text>"sdsfdsfdsfdsf"</Text>
    </View>;



interface ParkingAppProps {
    fontLoaded: boolean,
    location: Region,
    errorMessage: string,
}

export default class App extends Component<ParkingAppProps> {
    state = {
        fontLoaded: false,
        location: {
            latitude: 59.809170,
            longitude: 30.381670,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        },
        errorMessage: null,
    };

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            return null;
        }

        return await Location.getCurrentPositionAsync({accuracy: 1});
    };

    async componentWillMount() {
        await Font.loadAsync({
            'Roboto': require('native-base/Fonts/Roboto.ttf'),
            'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
            'Ionicons': require('@expo/vector-icons/fonts/Ionicons.ttf'),
        });

        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
                fontLoaded: true,
            });
        } else {
            const location: Region | null = null;//await this._getLocationAsync();
            if (location == null) {
                this.setState({
                    errorMessage: 'No permissions for GPS',
                    fontLoaded: true,
                });
            } else {
                const region: Region = {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: location.coords.accuracy,
                    longitudeDelta: location.coords.accuracy,
                };
                this.setState({
                    location: region,
                    fontLoaded: true,
                });
            }
        }
    }

    render() {
        return (
            this.state.fontLoaded ? (
                    <SafeAreaView style={styles.container}>
                        <MapView
                            style={styles.map}
                            initialRegion={this.state.location}
                        >

                        </MapView>
                        <View style={styles.cameraContainer}>
                            <Carousel
                                data={[{},{},{}]}
                                renderItem={Slide}
                                sliderWidth={320}
                                itemWidth={240}
                                hasParallaxImages={true}
                                inactiveSlideScale={0.94}
                                inactiveSlideOpacity={0.7}
                                // inactiveSlideShift={20}
                                loop={true}
                                loopClonesPerSide={2}
                                autoplay={true}
                                autoplayDelay={500}
                                autoplayInterval={3000}
                                onSnapToItem={(index) => this.setState({ slider1ActiveSlide: index }) }
                            />
                        </View>
                    </SafeAreaView>
            ) : null
        );
    }
}

interface Style {
    header: ViewStyle,
    footer: ViewStyle,
    container: ViewStyle,
    map: ViewStyle,
    slide: ViewStyle,
    root: ViewStyle,
    cameraContainer: ViewStyle,
}

const styles = StyleSheet.create<Style>({
    header: {
        marginTop: 27
    },
    footer: {

    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    map: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    slide: {
        height: hp(33),
        width: wp(66),
        backgroundColor: 'black',
    },
    root: {

    },
    cameraContainer: {
        position: "absolute",
        bottom: 50,
        margin: 'auto',
    }
});
