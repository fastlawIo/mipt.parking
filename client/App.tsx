import React, {Component} from 'react';
import {Container, Content} from 'native-base';
import {Constants, Font, Location, Permissions, Svg} from 'expo';
import {
    Platform,
    StyleSheet,
    View,
    ViewStyle,
    Text,
    SafeAreaView,
    Dimensions,
    TextStyle,
    TouchableOpacity, ImageStyle, ScrollView, Image
} from "react-native";
import MapView, {Region} from 'react-native-maps';
import Carousel, {ParallaxImage} from 'react-native-snap-carousel';
import SvgUri from 'react-native-svg-uri';

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
    preview: string | null,
    location: Region,
    name: string,
    places: number,

    isActive: boolean
}

const cameras: Camera[] = [
    {
        url: 'http://192.75.71.26/mjpg/video.mjpg',
        preview: null,
        location: {
            latitude: 44.400110,
            longitude: -79.666340,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        },
        name: 'Ontario, Barrie',
        places: 10,
        isActive: true
    },

    {
        url: 'http://94.72.19.56:80/mjpg/video.mjpg',
        preview: null,
        location: {
            latitude: 59.809170,
            longitude: 30.381670,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        },
        name: 'Санкт Петербург, Сушары',
        places: 1,
        isActive: false
    },

    {
        url: 'http://192.75.71.26/mjpg/video.mjpg',
        preview: null,
        location: {
            latitude: 59.809170,
            longitude: 30.381670,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
        },
        name: 'SOK Арена Парк, Ленинградский проспект',
        places: 4,
        isActive: false
    }
];

const Slide = ( {item, index}: {item: Camera, index: number } ) =>
    <TouchableOpacity
        activeOpacity={1}
        style={slideStyles.slideInnerContainer}
        onPress={() => { alert(`You've clicked'`); }}
    >
        <View style={slideStyles.shadow} />
        <View style={slideStyles.imageContainer}>
            <SvgUri
                width={100}
                height={100}
                source={require('./assets/img/parking.svg')}
                //containerStyle={[slideStyles.imageContainer, slideStyles.imageContainerEven]}
                //style={slideStyles.image}
                //parallaxFactor={0.35}
                //showSpinner={true}
               // spinnerColor={'rgba(255, 255, 255, 0.4)'}
                //{...parallaxProps}
            />
        </View>
        <View style={slideStyles.textContainer}>
            <Text
                style={slideStyles.title}
                numberOfLines={2}
            >
                { item.name }
            </Text>
            <Text
                style={{...slideStyles.subtitle, color: item.places > 3 ? 'green' : 'red' }}
                numberOfLines={2}
            >
                Свободно мест: { item.places }.
            </Text>
        </View>
    </TouchableOpacity>;

interface ParkingAppProps {
    fontLoaded: boolean,
    location: Region,
    errorMessage: string,
    activeSlide: number
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
        activeSlide: 0
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
                        <ScrollView style={styles.scrollview}>
                            <Carousel
                                data={cameras}
                                renderItem={Slide}
                                sliderWidth={wp(100)}
                                itemWidth={240}
                                inactiveSlideScale={0.9}
                                inactiveSlideOpacity={0.7}
                                containerCustomStyle={styles.slider}
                                inactiveSlideShift={10}
                                loop
                                enableMomentum={true}
                                onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                            />
                        </ScrollView>
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
    safeArea: ViewStyle,
    gradient: ViewStyle,
    scrollview: ViewStyle,
    exampleContainer: ViewStyle,
    exampleContainerDark: ViewStyle,
    exampleContainerLight: ViewStyle,
    title: TextStyle,
    titleDark: TextStyle,
    subtitle: TextStyle,
    slider: ViewStyle,
    sliderContentContainer: ViewStyle,
    paginationContainer: ViewStyle,
    paginationDot: ViewStyle,
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
    safeArea: {
        flex: 1,
        backgroundColor: 'black'
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
        flex: 1,
        position: 'absolute',
        bottom: 20
    },
    exampleContainer: {
        paddingVertical: 30
    },
    exampleContainerDark: {
        backgroundColor: 'black'
    },
    exampleContainerLight: {
        backgroundColor: 'white'
    },
    title: {
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    titleDark: {
        color: 'black'
    },
    subtitle: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: 'rgba(255, 255, 255, 0.75)',
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'center'
    },
    slider: {
        marginTop: 15,
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },
    paginationContainer: {
        paddingVertical: 8
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 8
    }
});

const itemHorizontalMargin = 5;
const entryBorderRadius = 10;

interface SlideStyle {
    root: ViewStyle,
    slideInnerContainer: ViewStyle,
    shadow: ViewStyle,
    imageContainer: ViewStyle,
    imageContainerEven: ViewStyle,
    image: ImageStyle,
    radiusMask: ViewStyle,
    radiusMaskEven: ViewStyle,
    textContainer: ViewStyle,
    textContainerEven: ViewStyle,
    title: TextStyle,
    titleEven: TextStyle,
    subtitle: TextStyle,
    subtitleEven: TextStyle,
}

const slideStyles = StyleSheet.create<SlideStyle>({
    root: {
        height: hp(33),
        width: wp(66),
    },
    slideInnerContainer: {
        width: wp(60),
        height: hp(27),
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow
    },
    shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 10,
        borderRadius: 10
    },
    imageContainer: {
        flex: 1,
        marginBottom: Platform.OS === 'ios' ? 0 : -1, // Prevent a random Android rendering issue
        backgroundColor: 'white',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
        alignItems: 'center',
        paddingTop: 10,
    },
    imageContainerEven: {
        backgroundColor: 'black'
    },
    image: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: Platform.OS === 'ios' ? 10 : 0,
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
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
        backgroundColor: 'black'
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
        backgroundColor: 'black'
    },
    title: {
        color: 'black',
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5
    },
    titleEven: {
        color: 'white'
    },
    subtitle: {
        marginTop: 6,
        color: 'green',
        fontSize: 12,
        fontStyle: 'italic'
    },
    subtitleEven: {
        color: 'rgba(255, 255, 255, 0.7)'
    }
});
