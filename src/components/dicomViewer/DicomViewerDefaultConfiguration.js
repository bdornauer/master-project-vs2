import Colors from '../Colors'

const defaultViewport = {
    invert: false,
    pixelReplication: false,
    voi: {
        windowWidth: 400,
        windowCenter: 200
    },
    scale: 1,
    translation: {
        x: 0,
        y: 0
    },
};

const dicomSettings = {
    width: "512px",
    height: "512px",
    backgroundColors: Colors.darkblue,
}

const config = {
    maxWebWorkers: navigator.hardwareConcurrency || 1,
    startWebWorkersOnDemand: true,
    taskConfiguration: {
        'decodeTask': { //Important
            initializeCodecsOnStartup: false,
            usePDFJS: false
        }
    }
};

const DICOM_brain = 'wadouri:http://localhost:3000/sampleFiles/DICOM_brain.DCM';
const DICOM_spine = 'wadouri:http://localhost:3000/sampleFiles/DICOM_spine.DCM';
const DICOM_spine_section = 'wadouri:http://localhost:3000/sampleFiles/DICOM_spine_section.DCM';
const JPG_Renal_Cell_Carcinoma = 'http://localhost:3000/sampleFiles/JPG_Renal_Cell_Carcinoma.jpeg';
const PNG_brain = 'http://localhost:3000/sampleFiles/PNG_brain.png';


export default {
    config,
    defaultViewport,
    dicomSettings,
    DICOM_brain,
    DICOM_spine,
    DICOM_spine_section,
    JPG_Renal_Cell_Carcinoma,
    PNG_brain
}