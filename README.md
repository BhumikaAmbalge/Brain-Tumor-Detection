# Brain Tumor Detection Using Deep Learning

A medical imaging application that automatically detects the presence of brain tumors from MRI images using deep learning techniques. The system helps doctors and medical professionals in early diagnosis and treatment planning.

---

## Features

- **Automatic Brain Tumor Detection:** Detects whether a given MRI scan contains a tumor.  
- **Deep Learning Model:** Uses Convolutional Neural Networks (CNN) trained on labeled MRI datasets.  
- **High Accuracy:** Optimized for maximum prediction accuracy.  
- **User-Friendly Interface:** Simple interface to upload MRI images and get results.  
- **Visualization:** Highlights areas suspected to have tumors (optional, using Grad-CAM).  

---

## Dataset

- Publicly available brain MRI datasets (e.g., [Kaggle Brain Tumor Dataset](https://www.kaggle.com/datasets/))  
- Labeled MRI scans for multiple classes:
  - Glioma Tumor
  - Meningioma Tumor
  - Pituitary Tumor
  - No Tumor
- Preprocessing includes resizing, normalization, and augmentation.

---

## Technologies Used

- Python  
- TensorFlow / Keras  
- OpenCV / PIL  
- NumPy / Pandas  
- Matplotlib / Seaborn  

---

## How It Works

1. **Data Preprocessing:** Resize, normalize, and augment MRI images.  
2. **Model Training:** CNN architecture with convolution, pooling, dropout, and dense layers.  
3. **Prediction:** Input MRI images and output tumor classification with confidence score.  
4. **Evaluation:** Accuracy, Precision, Recall, and F1-score metrics.

---

## Installation & Usage

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/brain-tumor-detection.git
