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
//   firstUsed       year the technique was first used to image a living person
//                   (not when the physics was discovered, and not the first
//                   commercial machine). Some are the first reported use.
//   firstUsedSource URL backing that year.
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
  { id: 1,  name: "X-ray",                type: "X-ray",    shows: "Bones and lungs",            radiationMsv: 0.1,   likeBackground: "10 days",    doseSource: "radiologyinfo", minutes: 5,   firstUsed: 1895, firstUsedSource: "https://en.wikipedia.org/wiki/X-ray", file: "X-ray of healthy lungs taken at the Institute of Tropical Medicine in Antwerp, on 9 December 2016 (2).tif", author: "Johan Verbeken and Vincent Mia Edie Verheyen", license: "Public domain" },
  { id: 2,  name: "Mammography",          type: "X-ray",    shows: "Tissue",                     radiationMsv: 0.28,  likeBackground: "34 days",    doseSource: "radiologyinfo", minutes: 20,  firstUsed: 1930, firstUsedSource: "https://en.wikipedia.org/wiki/Mammography", file: "Normal mammography of left breast in MLO view showing the nipple location.jpg", author: "Cerevisae", license: "CC BY-SA 4.0", focus: "50% 30%" },
  { id: 3,  name: "DEXA",                 type: "X-ray",    shows: "Bone strength",              radiationMsv: 0.001, likeBackground: "3 hours",    doseSource: "radiologyinfo", minutes: 15,  firstUsed: 1987, firstUsedSource: "https://nap.nationalacademies.org/read/5827/chapter/151.html", file: "GanzkörperDEXAscan2.jpg", author: "rrawer", license: "Free use", focus: "50% 0%", zoom: 1.35 },
  { id: 4,  name: "Fluoroscopy",          type: "X-ray",    shows: "Swallowing in real time",    radiationMsv: 6,     likeBackground: "2 years",    doseSource: "radiologyinfo", minutes: 30,  firstUsed: 1896, firstUsedSource: "https://en.wikipedia.org/wiki/Fluoroscopy", file: "Eosinophilic esophagitis-barium swallow.jpg", author: "Runder", license: "CC BY 2.0", focus: "80% 50%" },
  { id: 5,  name: "Angiography",          type: "X-ray",    shows: "Blocked arteries",           radiationMsv: 7,     likeBackground: "~2 years",   doseSource: "mettler",       minutes: 45,  firstUsed: 1927, firstUsedSource: "https://en.wikipedia.org/wiki/Angiography", file: "Angiography coronary stenosis 01.jpg", author: "Pantaleo et al., BMC Cancer 2012", license: "CC BY 2.0", invert: true },
  { id: 6,  name: "CT",                   type: "X-ray",    shows: "3D slices of the body",      radiationMsv: 1.6,   likeBackground: "7 months",   doseSource: "radiologyinfo", minutes: 10,  firstUsed: 1971, firstUsedSource: "https://www.stgeorges.nhs.uk/?p=5091", file: "Head CT scan.jpg", author: "Andrew Ciscel", license: "CC BY-SA 2.0" },
  { id: 7,  name: "CT angiography",       type: "X-ray",    shows: "Blood vessels in 3D",        radiationMsv: 5.1,   likeBackground: "<2 years",   doseSource: "radiologyinfo", minutes: 15,  firstUsed: 1991, firstUsedSource: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4669887/", file: "Anterior coronal CTA 3D volume reconstruction.png", author: "Ramos, Dreyer and Buthelezi", license: "CC BY 4.0" },
  { id: 8,  name: "Photon-counting CT",   type: "X-ray",    shows: "Sharper CT, less dose",      radiationMsv: null,  likeBackground: "varies",     doseSource: "pcct",          minutes: 10,  firstUsed: 2015, firstUsedSource: "https://newsnetwork.mayoclinic.org/discussion/with-photon-counting-detector-ct-mayo-clinic-at-forefront-of-ct-imaging-technology/", file: "KneeScannedWithPhotoncountingCt.jpg", author: "Hg6996", license: "CC0", focus: "85% 50%" },

  // Magnetic family
  { id: 9,  name: "MRI",                  type: "Magnetic", shows: "Soft tissue detail",         radiationMsv: 0,     likeBackground: "none",       minutes: 45,  firstUsed: 1977, firstUsedSource: "https://www.smithsonianmag.com/science-nature/the-indomitable-mri-29126670/", file: "MRI brain sagittal section.jpg", author: "everyone's idle", license: "CC BY-SA 2.0" },
  { id: 10, name: "Functional MRI",       type: "Magnetic", shows: "Brain activity",             radiationMsv: 0,     likeBackground: "none",       minutes: 60,  firstUsed: 1991, firstUsedSource: "https://pubmed.ncbi.nlm.nih.gov/1948051/", file: "FMRI Brain Scan.jpg", author: "DrOONeil", license: "CC BY-SA 3.0" },
  { id: 11, name: "Diffusion tensor MRI", type: "Magnetic", shows: "Brain wiring",               radiationMsv: 0,     likeBackground: "none",       minutes: 45,  firstUsed: 1996, firstUsedSource: "https://pubmed.ncbi.nlm.nih.gov/8939209/", file: "DTI-sagittal-fibers.jpg", author: "Thomas Schultz", license: "CC BY-SA 3.0" },
  { id: 12, name: "MR angiography",       type: "Magnetic", shows: "Blood vessels, no dye",      radiationMsv: 0,     likeBackground: "none",       minutes: 30,  firstUsed: 1985, firstUsedSource: "https://pubmed.ncbi.nlm.nih.gov/4059917/", file: "Mra-mip.jpg", author: "SBarnes", license: "CC BY-SA 3.0" },
  { id: 13, name: "Cardiac MRI",          type: "Magnetic", shows: "Heart pumping and scarring", radiationMsv: 0,     likeBackground: "none",       minutes: 60,  firstUsed: 1981, firstUsedSource: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11066259/", file: "4CH IR infarct.jpg", author: "Doregan", license: "CC BY-SA 4.0" },

  // Sound family
  { id: 14, name: "Ultrasound",           type: "Sound",    shows: "Babies and organs",          radiationMsv: 0,     likeBackground: "none",       minutes: 30,  firstUsed: 1942, firstUsedSource: "https://www.bmus.org/for-patients/history-of-ultrasound/", file: "CRL Crown rump length 12 weeks ecografia Dr. Wolfgang Moroder.jpg", author: "Wolfgang Moroder", license: "CC BY-SA 3.0" },
  { id: 15, name: "Doppler ultrasound",   type: "Sound",    shows: "Blood flow",                 radiationMsv: 0,     likeBackground: "none",       minutes: 30,  firstUsed: 1955, firstUsedSource: "https://en.wikipedia.org/wiki/Shigeo_Satomura", file: "US CAROTID DOPPLER 0001.jpg", author: "Mme Mim", license: "CC BY-SA 4.0" },
  { id: 16, name: "Echocardiography",     type: "Sound",    shows: "Beating heart",              radiationMsv: 0,     likeBackground: "none",       minutes: 45,  firstUsed: 1953, firstUsedSource: "https://www.medicine.lu.se/faculty-medicine-lund-university/history-faculty/inge-edler-and-hellmuth-hertz", file: "Echocardiogram 4chambers.jpg", author: "Kjetil Lenes", license: "Public domain" },
  { id: 17, name: "Elastography",         type: "Sound",    shows: "Tissue stiffness",           radiationMsv: 0,     likeBackground: "none",       minutes: 15,  firstUsed: 1991, firstUsedSource: "https://www.hajim.rochester.edu/ece/sites/parker/assets/pdf/240-elastography-imaging--the-30-year-perspective.pdf", file: "Shear Wave Elastography.jpg", author: "Sigrist et al., Theranostics 2017", license: "CC BY 4.0", focus: "68% 50%" },

  // Nuclear family
  { id: 18, name: "PET",                  type: "Nuclear",  shows: "Cancer and metabolism",      radiationMsv: 22.7,  likeBackground: "7.6 years",  doseSource: "radiologyinfo", minutes: 30,  firstUsed: 1975, firstUsedSource: "https://jnm.snmjournals.org/content/jnumed/61/Supplement_2/42S.full.pdf", file: "Nl petct.jpg", author: "Myohan", license: "CC BY 3.0" },
  { id: 19, name: "Amyloid PET",          type: "Nuclear",  shows: "Alzheimer's plaques",        radiationMsv: 7,     likeBackground: "~2.3 years", doseSource: "amyvid",        minutes: 30,  firstUsed: 2002, firstUsedSource: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3542972/", file: "PiB PET Images AD.jpg", author: "Klunkwe", license: "CC BY-SA 3.0" },
  { id: 20, name: "SPECT",                type: "Nuclear",  shows: "Heart blood supply",         radiationMsv: 9.4,   likeBackground: "~3 years",   doseSource: "mettler",       minutes: 45,  firstUsed: 1963, firstUsedSource: "https://ethw.org/Kuhl_%26_Edwards_Produce_CT_Scan", file: "SPECT Slice of Heart.jpg", author: "Kieran Maher", license: "Free use" },
  { id: 21, name: "Bone scan",            type: "Nuclear",  shows: "Bone damage or spread",      radiationMsv: 6.3,   likeBackground: "~2 years",   doseSource: "mettler",       minutes: 45,  firstUsed: 1961, firstUsedSource: "https://en.wikipedia.org/wiki/Bone_scintigraphy", file: "RenalCancer-700MBq-HDP-BoneScinti-3hpi.jpg", author: "Hg6996", license: "CC BY-SA 3.0", focus: "50% 22%", invert: true },

  // Light family
  { id: 22, name: "OCT",                  type: "Light",    shows: "Retina layers",              radiationMsv: 0,     likeBackground: "none",       minutes: 5,   firstUsed: 1993, firstUsedSource: "https://doi.org/10.1364/OL.18.001864", file: "Retina-OCT800.png", author: "medOCT group, Medical University of Vienna", license: "CC BY 2.0" },
  { id: 23, name: "Fundus photography",   type: "Light",    shows: "Back of the eye",            radiationMsv: 0,     likeBackground: "none",       minutes: 5,   firstUsed: 1886, firstUsedSource: "https://en.wikipedia.org/wiki/Fundus_photography", file: "Fundus photograph-normal retina EDA06.JPG", author: "National Eye Institute, NIH", license: "Public domain" },
  { id: 24, name: "Capsule endoscopy",    type: "Light",    shows: "Inside the gut",             radiationMsv: 0,     likeBackground: "none",       minutes: 480, firstUsed: 1997, firstUsedSource: "https://en.wikipedia.org/wiki/Capsule_endoscopy", file: "Dünndarm.PNG", author: "H. H. Krause", license: "CC BY-SA 3.0" },
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
