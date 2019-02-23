import React, {Component} from 'react';
import {
    getTheme, MKButton, MKColor
} from 'react-native-material-kit';
import {View, Image, Text, ViewStyle, ImageStyle, TextStyle, StyleSheet, Button, Animated} from "react-native";
import {hp, wp} from "./utils";
import {CameraLocation} from "./store";

const theme = getTheme();

interface Props {
    item: CameraLocation,
    closeHandler: () => void
}

interface State {
    fadeAnim: Animated.Value,
}

class ParkingInfo extends Component<Props, State> {
    state = {
        fadeAnim: new Animated.Value(0),
    };

    componentDidMount() {
        Animated.timing(this.state.fadeAnim, {
            toValue: 1,
            duration: 300,
        }).start();
    };

    render() {
        let { fadeAnim } = this.state;
        return (
            <Animated.View
                style={
                    {
                        ...styles.root,
                        opacity: fadeAnim,
                    }}
            >
                <View style={styles.overlay} />
                <View style={theme.cardStyle}>
                    <Image source={{ uri : this.props.item.img }} resizeMode={'contain'} style={styles.map} />
                    <Text style={[theme.cardContentStyle, styles.header]}>Название: {this.props.item.name}</Text>
                    <Text style={{...theme.cardContentStyle, color: this.props.item.places.freePlaces > 3 ? 'green' : 'red'}}>Свободно мест: { this.props.item.places.freePlaces }.</Text>
                    <View style={theme.cardActionStyle}>
                        <Button
                            onPress={this.props.closeHandler}
                            title="Понятно"
                            accessibilityLabel="Закрыть это окно"
                        />
                    </View>
                </View>
            </Animated.View>
        );
    }
}

interface Style {
    root: ViewStyle,
    card: ViewStyle,
    overlay: ViewStyle,
    map: ImageStyle,
    imgContainer: ViewStyle,
    header: TextStyle,
}

const styles = StyleSheet.create<Style>({
   root: {
       position: 'absolute',
       width: '100%',
       height: '100%',
       flex: 1,
       justifyContent: 'center',
       top: 0,
       left: 0,
       right: 0,
       bottom: 0,
       zIndex: 2,

   },

    overlay: {
        backgroundColor: 'gray',
        opacity: 0.7,
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },

   card: {
       opacity: 0,
   },

    map: {
        width: wp(100),
        ...(theme.cardImageStyle && {height: theme.cardImageStyle.height}),
    },

    imgContainer: {
        overflow: 'scroll',
        width: wp(100),
        maxHeight: hp(90),
    },

    header: {
        fontStyle: 'normal',
        fontSize: 24,
    },
});

export default ParkingInfo;