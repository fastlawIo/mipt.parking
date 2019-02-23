import {SafeAreaView, ScrollView, StyleSheet, TextStyle, ViewStyle} from "react-native";
import React from "react";
import Carousel from "react-native-snap-carousel";
import {hp, wp} from "./utils";
import {AppState, CameraLocation, Grid, LocationSelected} from "./store";
import MapView, {Marker} from "react-native-maps";
import CameraLocationCard from "./CameraLocationCard";
import {connect} from "react-redux";
import {ThunkDispatch} from "redux-thunk";
import {Action} from "redux";
import ParkingInfo from "./ParkingInfo";

interface Props {
    cameras: CameraLocation[],
    currentCamera: CameraLocation,

    isDetailsOpen: boolean,
}

interface DispatchProps {
    itemSelectedHandler: (item: CameraLocation) => void
    itemDetailsRequested: () => void
    itemDetailsClosed: () => void
}

type MainWindowProps = Props | DispatchProps;

const MainWindow = (props: MainWindowProps) =>
    <SafeAreaView style={styles.container}>
        <MapView
            style={styles.map}
            region={props.currentCamera.location}
        >
            {props.cameras.map((c: CameraLocation, index: number) => {
                return <Marker
                    key={index}
                    coordinate={c.location}
                    title={c.name}
                    description={'Свободно мест: ' + c.places.freePlaces}
                />
            })}
        </MapView>
        <ScrollView style={styles.scrollview}>
            <Carousel
                data={props.cameras}
                renderItem={
                    ({item, index}: {item: CameraLocation, index: number}) =>
                        <CameraLocationCard item={item} clickHandler={props.itemDetailsRequested} />
                }
                sliderWidth={wp(100)}
                itemWidth={240}
                inactiveSlideScale={0.9}
                inactiveSlideOpacity={0.7}
                containerCustomStyle={styles.slider}
                inactiveSlideShift={10}
                enableMomentum={true}
                onSnapToItem={
                    (index) => props.itemSelectedHandler(props.cameras[index])
                }
            />
        </ScrollView>
        {props.isDetailsOpen && <ParkingInfo item={props.currentCamera} closeHandler={props.itemDetailsClosed}/>}
    </SafeAreaView>;

const mapStateToProps = (state: AppState): Props => {
    return {
        cameras: state.cameras,
        currentCamera: state.currentCamera ? state.currentCamera : {
            url: '',
            location: {
                latitude: 44.400110,
                longitude: -79.666340,
                latitudeDelta: 0.02,
                longitudeDelta: 0.02,
            },
            name: 'Ontario, Barrie',
            places: {
                freePlaces: 10
            },
        },
        isDetailsOpen: state.isDetailsOpen,
    }
};

const mapDispatchToProps = (dispatch: ThunkDispatch<{}, {}, Action>): DispatchProps => {
    return {
        itemSelectedHandler: (item: CameraLocation) => {
            const event = {
                type: 'LocationSelected',
                payload: item,
            };
            dispatch(event);
        },
        itemDetailsRequested: () => {
          dispatch({type: 'LocationClicked'})
        },
        itemDetailsClosed: () => {
            dispatch({type: 'DetailsClosed'})
        }
    }
};

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

export default connect(mapStateToProps, mapDispatchToProps)(MainWindow)
