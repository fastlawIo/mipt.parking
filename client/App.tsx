import React from 'react';
import { Provider } from 'react-redux'
import store from './store'
import MainWindow from "./MainWindow";
import {refrashCamerasList, getLocationAsync} from "./services";
import {LatLng} from "react-native-maps";
import {Location} from "expo";

class App extends React.Component {
    render() {
        return (
            <Provider store={store}>
                <MainWindow />
            </Provider>
        );
    }
}

getLocationAsync().then((r: (Location.LocationData | null)) => {
    if (r) {
        return {
            latitude: r.coords.latitude,
            longitude: r.coords.longitude,
        }
    } else {
        return {
            latitude: 55.78824,
            longitude: 37.56762,
        }
    }
}).then((location: LatLng) => refrashCamerasList(store, location));


export default App;
