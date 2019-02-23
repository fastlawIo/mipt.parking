import {Action, AnyAction, applyMiddleware, createStore} from 'redux';
import {Region} from "react-native-maps";
import thunk from "redux-thunk";

export interface Grid {
    freePlaces: number
}

export interface CameraLocation {
    img: string,
    location: Region,
    name: string,
    places: Grid,
}

export class AppState {
    cameras: CameraLocation[] = [];
    currentCamera: CameraLocation | null = null;

    isDetailsOpen: boolean = false;

    loaded: boolean = false;
}

export interface LocationLoaded extends Action<string> {
    type: 'LocationLoaded';
    payload: CameraLocation;
}

export interface LocationSelected extends Action<string> {
    type: 'LocationSelected';
    payload: CameraLocation;
}

export interface LocationClicked extends Action<string> {
    type: 'LocationClicked';
}

export interface DetailsClosed extends Action<string> {
    type: 'DetailsClosed';
}

const rootReducer = (state: AppState = new AppState(), action: AnyAction): AppState => {
    switch (action.type) {
        case 'AppLoaded':
            return { ...state, loaded: true };

        case 'LocationLoaded':
            const newCam: CameraLocation = (action as LocationLoaded).payload;
            const cameras = state.cameras;
            cameras.push(newCam);
            return { ...state, cameras: cameras, currentCamera: cameras[0] };
        case 'LocationSelected':
            const selected: CameraLocation = (action as LocationSelected).payload;
            return { ...state, currentCamera: selected };
        case 'LocationClicked':
            return { ...state, isDetailsOpen: true };
        case 'DetailsClosed':
            return { ...state, isDetailsOpen: false };
        default:
            return state
    }
};

export default createStore(rootReducer, applyMiddleware(thunk));

