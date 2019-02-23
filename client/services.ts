import {Store} from "redux";
import {CameraLocation} from "./store";
import {Permissions} from "expo";
import {Location} from "expo";
import {LatLng} from "react-native-maps";

interface LocationSummary {
    location: LatLng,
    name: string,
    address: string,
    url?: string,
    active: boolean,
    status?: {
        img: string,
        n_total: number,
        n_free: number,
    }
}

export async function getLocationAsync() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
        return null;
    }

    return await Location.getCurrentPositionAsync({accuracy: 0.1});
}

function distance(l1: LatLng, l2: LatLng): number {
    return Math.sqrt(Math.pow(l1.latitude - l2.latitude, 2) + Math.pow(l1.longitude - l2.longitude, 2));
}

function refrashCamerasList(store: Store, currentLocation: LatLng) {
    fetch(
        'http://94.45.205.95:8083/api/parking/get_all_parkings_status', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            }
        })
        .then((result: Response) => result.json())
        .then((json) => {
            const data = json.map((o: LocationSummary): CameraLocation => {

                return {
                    //TODO
                    img: o.status ? ('http://94.45.205.95:8083/' + o.status.img) : 'http://placekitten.com/200/300',
                    location: {
                        latitude: o.location.latitude,
                        longitude: o.location.longitude,
                        latitudeDelta: 0.02,
                        longitudeDelta: 0.02,
                    },
                    name: o.address,
                    places: {
                        freePlaces: o.status ? o.status.n_free : 0
                    },
                };
            });

            data.sort((o1: CameraLocation, o2: CameraLocation) => distance(o1.location, o2.location));
            data.reverse();

            data.forEach((cl: CameraLocation) =>
                store.dispatch(
                    {
                        type: 'LocationLoaded',
                        payload: cl
                    }
                )
            );
        })
        .catch((reason => console.error(reason)));
}

export { refrashCamerasList };