// imaging.js - the dataset: 24 medical imaging techniques in 5 families.
//
// Fields
//   radiationMsv    typical effective dose for an average adult, in millisieverts.
//                   0 = no ionising radiation (magnets, sound, light).
//                   null = no single typical value (shown as "Varies").
//   likeBackground  how long natural background radiation (about 3 mSv a year)
//                   takes to give the same dose.
//   doseSource      key into DOSE_SOURCES below, for every non-zero dose.
//   minutes         rough typical scan time (no single source; varies by site).
//   file            image file name on Wikimedia Commons.
//   author, license who made the image and its licence, as listed on Commons.
//   focus           (optional) which part of the image to keep when it's cropped
//                   to fill the card, as "x% y%" (default is the centre).
//   zoom            (optional) scale the image up from its focus point, to
//                   show a tighter crop (e.g. 1.35).
//   invert          (optional) true for scans drawn dark-on-white, so they show
//                   white-on-black like the rest.

export const imaging = [
  // X-ray family
  { id: 1,  name: "X-ray",                type: "X-ray",    shows: "Bones and lungs",            radiationMsv: 0.1,   likeBackground: "10 days",    doseSource: "radiologyinfo", minutes: 5,   file: "X-ray of healthy lungs taken at the Institute of Tropical Medicine in Antwerp, on 9 December 2016 (2).tif", author: "Johan Verbeken and Vincent Mia Edie Verheyen", license: "Public domain" },
  { id: 2,  name: "Mammography",          type: "X-ray",    shows: "Tissue",                     radiationMsv: 0.28,  likeBackground: "34 days",    doseSource: "radiologyinfo", minutes: 20,  file: "Normal mammography of left breast in MLO view showing the nipple location.jpg", author: "Cerevisae", license: "CC BY-SA 4.0", focus: "50% 30%" },
  { id: 3,  name: "DEXA",                 type: "X-ray",    shows: "Bone strength",              radiationMsv: 0.001, likeBackground: "3 hours",    doseSource: "radiologyinfo", minutes: 15,  file: "GanzkörperDEXAscan2.jpg", author: "rrawer", license: "Free use", focus: "50% 0%", zoom: 1.35 },
  { id: 4,  name: "Fluoroscopy",          type: "X-ray",    shows: "Swallowing in real time",    radiationMsv: 6,     likeBackground: "2 years",    doseSource: "radiologyinfo", minutes: 30,  file: "Eosinophilic esophagitis-barium swallow.jpg", author: "Runder", license: "CC BY 2.0", focus: "80% 50%" },
  { id: 5,  name: "Angiography",          type: "X-ray",    shows: "Blocked arteries",           radiationMsv: 7,     likeBackground: "~2 years",   doseSource: "mettler",       minutes: 45,  file: "Angiography coronary stenosis 01.jpg", author: "Pantaleo et al., BMC Cancer 2012", license: "CC BY 2.0", invert: true },
  { id: 6,  name: "CT",                   type: "X-ray",    shows: "3D slices of the body",      radiationMsv: 1.6,   likeBackground: "7 months",   doseSource: "radiologyinfo", minutes: 10,  file: "Head CT scan.jpg", author: "Andrew Ciscel", license: "CC BY-SA 2.0" },
  { id: 7,  name: "CT angiography",       type: "X-ray",    shows: "Blood vessels in 3D",        radiationMsv: 5.1,   likeBackground: "<2 years",   doseSource: "radiologyinfo", minutes: 15,  file: "Anterior coronal CTA 3D volume reconstruction.png", author: "Ramos, Dreyer and Buthelezi", license: "CC BY 4.0" },
  { id: 8,  name: "Photon-counting CT",   type: "X-ray",    shows: "Sharper CT, less dose",      radiationMsv: null,  likeBackground: "varies",     doseSource: "pcct",          minutes: 10,  file: "KneeScannedWithPhotoncountingCt.jpg", author: "Hg6996", license: "CC0", focus: "85% 50%" },

  // Magnetic family
  { id: 9,  name: "MRI",                  type: "Magnetic", shows: "Soft tissue detail",         radiationMsv: 0,     likeBackground: "none",       minutes: 45,  file: "MRI brain sagittal section.jpg", author: "everyone's idle", license: "CC BY-SA 2.0" },
  { id: 10, name: "Functional MRI",       type: "Magnetic", shows: "Brain activity",             radiationMsv: 0,     likeBackground: "none",       minutes: 60,  file: "FMRI Brain Scan.jpg", author: "DrOONeil", license: "CC BY-SA 3.0" },
  { id: 11, name: "Diffusion tensor MRI", type: "Magnetic", shows: "Brain wiring",               radiationMsv: 0,     likeBackground: "none",       minutes: 45,  file: "DTI-sagittal-fibers.jpg", author: "Thomas Schultz", license: "CC BY-SA 3.0" },
  { id: 12, name: "MR angiography",       type: "Magnetic", shows: "Blood vessels, no dye",      radiationMsv: 0,     likeBackground: "none",       minutes: 30,  file: "Mra-mip.jpg", author: "SBarnes", license: "CC BY-SA 3.0" },
  { id: 13, name: "Cardiac MRI",          type: "Magnetic", shows: "Heart pumping and scarring", radiationMsv: 0,     likeBackground: "none",       minutes: 60,  file: "4CH IR infarct.jpg", author: "Doregan", license: "CC BY-SA 4.0" },

  // Sound family
  { id: 14, name: "Ultrasound",           type: "Sound",    shows: "Babies and organs",          radiationMsv: 0,     likeBackground: "none",       minutes: 30,  file: "CRL Crown rump length 12 weeks ecografia Dr. Wolfgang Moroder.jpg", author: "Wolfgang Moroder", license: "CC BY-SA 3.0" },
  { id: 15, name: "Doppler ultrasound",   type: "Sound",    shows: "Blood flow",                 radiationMsv: 0,     likeBackground: "none",       minutes: 30,  file: "US CAROTID DOPPLER 0001.jpg", author: "Mme Mim", license: "CC BY-SA 4.0" },
  { id: 16, name: "Echocardiography",     type: "Sound",    shows: "Beating heart",              radiationMsv: 0,     likeBackground: "none",       minutes: 45,  file: "Echocardiogram 4chambers.jpg", author: "Kjetil Lenes", license: "Public domain" },
  { id: 17, name: "Elastography",         type: "Sound",    shows: "Tissue stiffness",           radiationMsv: 0,     likeBackground: "none",       minutes: 15,  file: "Shear Wave Elastography.jpg", author: "Sigrist et al., Theranostics 2017", license: "CC BY 4.0", focus: "68% 50%" },

  // Nuclear family
  { id: 18, name: "PET",                  type: "Nuclear",  shows: "Cancer and metabolism",      radiationMsv: 22.7,  likeBackground: "7.6 years",  doseSource: "radiologyinfo", minutes: 30,  file: "Nl petct.jpg", author: "Myohan", license: "CC BY 3.0" },
  { id: 19, name: "Amyloid PET",          type: "Nuclear",  shows: "Alzheimer's plaques",        radiationMsv: 7,     likeBackground: "~2.3 years", doseSource: "amyvid",        minutes: 30,  file: "PiB PET Images AD.jpg", author: "Klunkwe", license: "CC BY-SA 3.0" },
  { id: 20, name: "SPECT",                type: "Nuclear",  shows: "Heart blood supply",         radiationMsv: 9.4,   likeBackground: "~3 years",   doseSource: "mettler",       minutes: 45,  file: "SPECT Slice of Heart.jpg", author: "Kieran Maher", license: "Free use" },
  { id: 21, name: "Bone scan",            type: "Nuclear",  shows: "Bone damage or spread",      radiationMsv: 6.3,   likeBackground: "~2 years",   doseSource: "mettler",       minutes: 45,  file: "RenalCancer-700MBq-HDP-BoneScinti-3hpi.jpg", author: "Hg6996", license: "CC BY-SA 3.0", focus: "50% 22%", invert: true },

  // Light family
  { id: 22, name: "OCT",                  type: "Light",    shows: "Retina layers",              radiationMsv: 0,     likeBackground: "none",       minutes: 5,   file: "Retina-OCT800.png", author: "medOCT group, Medical University of Vienna", license: "CC BY 2.0" },
  { id: 23, name: "Fundus photography",   type: "Light",    shows: "Back of the eye",            radiationMsv: 0,     likeBackground: "none",       minutes: 5,   file: "Fundus photograph-normal retina EDA06.JPG", author: "National Eye Institute, NIH", license: "Public domain" },
  { id: 24, name: "Capsule endoscopy",    type: "Light",    shows: "Inside the gut",             radiationMsv: 0,     likeBackground: "none",       minutes: 480, file: "Dünndarm.PNG", author: "H. H. Krause", license: "CC BY-SA 3.0" },
];

// Where each dose figure comes from (shown in the page footer)
export const DOSE_SOURCES = {
  radiologyinfo: {
    label: "RadiologyInfo.org (ACR and RSNA), Radiation Dose from X-Ray and CT Exams, reviewed April 2025",
    url: "https://www.radiologyinfo.org/en/info/safety-xray",
  },
  mettler: {
    label: "Mettler et al., Effective doses in radiology and diagnostic nuclear medicine, Radiology 2008",
    url: "https://doi.org/10.1148/radiol.2481071451",
  },
  amyvid: {
    label: "Amyvid (florbetapir F 18) US prescribing information: about 7 mSv for the tracer at 370 MBq",
    url: "https://pi.lilly.com/us/amyvid-uspi.pdf",
  },
  pcct: {
    label: "Photon-counting CT: no single typical dose. In one 2024 study it used about 42% less than conventional CT for the same chest scan",
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11413257",
  },
};

// Licence deeds, so each credit can link to its licence
const LICENSE_URLS = {
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
  "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
  "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/",
  "CC0": "https://creativecommons.org/publicdomain/zero/1.0/",
};
export const licenseUrl = (license) => LICENSE_URLS[license];

// Image URL (resized thumbnail from Wikimedia Commons)
export const imageUrl = (file) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=400`;

// Credit/license page for each image
export const creditUrl = (file) =>
  `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(file.replace(/ /g, "_"))}`;
