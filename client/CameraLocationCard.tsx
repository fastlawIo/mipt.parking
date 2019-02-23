import {ImageStyle, Platform, StyleSheet, Text, TextStyle, TouchableOpacity, View, ViewStyle} from "react-native";
import React from "react";
import {CameraLocation} from "./store";
import SvgUri from "react-native-svg-uri";
import {hp, wp} from "./utils";

export default (props: {item: CameraLocation, clickHandler: () => void }) =>
    <TouchableOpacity
        activeOpacity={1}
        style={slideStyles.slideInnerContainer}
        onPress={props.clickHandler}
    >
        <View style={slideStyles.shadow} />
        <View style={slideStyles.imageContainer}>
            <SvgUri
                width={100}
                height={100}
                source={require('./assets/img/parking.svg')}
            />
        </View>
        <View style={slideStyles.textContainer}>
            <Text
                style={slideStyles.title}
                numberOfLines={2}
            >
                { props.item.name }
            </Text>
            <Text
                style={{...slideStyles.subtitle, color: props.item.places.freePlaces > 3 ? 'green' : 'red' }}
                numberOfLines={2}
            >
                Свободно мест: { props.item.places.freePlaces }.
            </Text>
        </View>
    </TouchableOpacity>;

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