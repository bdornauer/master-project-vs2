import Colors from '../Colors'

const defaultViewport = {
    invert: false,
    pixelReplication: false,
    scale: 1,
    translation: {
        x: 0,
        y: 0
    },
};

const dicomSettings = {
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

/*
const DICOM_brain = 'wadouri:https://master-project-vs2.herokuapp.com/sampleMedicalImages/DICOM_brain.DCM';
const DICOM_spine = 'wadouri:https://master-project-vs2.herokuapp.com/sampleMedicalImages/DICOM_spine.DCM';
const DICOM_spine_section = 'wadouri:https://master-project-vs2.herokuapp.com/DICOM_spine_section.DCM';
const JPG_Renal_Cell_Carcinoma = 'https://master-project-vs2.herokuapp.com/sampleMedicalImages/JPG_Renal_Cell_Carcinoma.jpeg';
const PNG_brain = 'http://localhost:3000/sampleMedicalImages/PNG_brain.png';
*/

const DICOM_brain = 'wadouri:./sampleMedicalImages/DICOM_brain.DCM';
const DICOM_spine = 'wadouri:./sampleMedicalImages/DICOM_spine.DCM';
const DICOM_spine_section = 'wadouri:./sampleMedicalImages/DICOM_spine_section.DCM';
const JPG_Renal_Cell_Carcinoma = './sampleMedicalImages/JPG_Renal_Cell_Carcinoma.jpeg';
const PNG_brain = './sampleMedicalImages/PNG_brain.png';

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