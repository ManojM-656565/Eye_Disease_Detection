# import streamlit as st
# import tensorflow as tf
# from tensorflow.keras.applications.mobilenet_v3 import preprocess_input
# import numpy as np
# from recommendation import cnv,dme,drusen,normal
# import tempfile


# #Tensorflow Model Prediction
# def model_prediction(test_image_path):
#     model = tf.keras.models.load_model("Trained_Model.keras")
#     img = tf.keras.utils.load_img(test_image_path, target_size=(224, 224))
#     x = tf.keras.utils.img_to_array(img)
#     x = np.expand_dims(x, axis=0)
#     x = preprocess_input(x)
#     predictions = model.predict(x)
#     return np.argmax(predictions) #return index of max element

# #Sidebar
# st.sidebar.title("Dashboard")
# app_mode = st.sidebar.selectbox("Select Page",["Home","About","Disease Identification"])

# #Main Page
# if(app_mode=="Home"):
#     # image_path = "home_page.jpeg"
#     # st.image(image_path,use_column_width=True)
#     st.markdown("""
#     ## **OCT Retinal Analysis Platform**

# #### **Welcome to the Retinal OCT Analysis Platform**

# **Optical Coherence Tomography (OCT)** is a powerful imaging technique that provides high-resolution cross-sectional images of the retina, allowing for early detection and monitoring of various retinal diseases. Each year, over 30 million OCT scans are performed, aiding in the diagnosis and management of eye conditions that can lead to vision loss, such as choroidal neovascularization (CNV), diabetic macular edema (DME), and age-related macular degeneration (AMD).

# ##### **Why OCT Matters**
# OCT is a crucial tool in ophthalmology, offering non-invasive imaging to detect retinal abnormalities. On this platform, we aim to streamline the analysis and interpretation of these scans, reducing the time burden on medical professionals and increasing diagnostic accuracy through advanced automated analysis.

# ---

# #### **Key Features of the Platform**

# - **Automated Image Analysis**: Our platform uses state-of-the-art machine learning models to classify OCT images into distinct categories: **Normal**, **CNV**, **DME**, and **Drusen**.
# - **Cross-Sectional Retinal Imaging**: Examine high-quality images showcasing both normal retinas and various pathologies, helping doctors make informed clinical decisions.
# - **Streamlined Workflow**: Upload, analyze, and review OCT scans in a few easy steps.

# ---

# #### **Understanding Retinal Diseases through OCT**

# 1. **Choroidal Neovascularization (CNV)**
#    - Neovascular membrane with subretinal fluid
   
# 2. **Diabetic Macular Edema (DME)**
#    - Retinal thickening with intraretinal fluid
   
# 3. **Drusen (Early AMD)**
#    - Presence of multiple drusen deposits

# 4. **Normal Retina**
#    - Preserved foveal contour, absence of fluid or edema

# ---

# #### **About the Dataset**

# Our dataset consists of **84,495 high-resolution OCT images** (JPEG format) organized into **train, test, and validation** sets, split into four primary categories:
# - **Normal**
# - **CNV**
# - **DME**
# - **Drusen**

# Each image has undergone multiple layers of expert verification to ensure accuracy in disease classification. The images were obtained from various renowned medical centers worldwide and span across a diverse patient population, ensuring comprehensive coverage of different retinal conditions.

# ---

# #### **Get Started**

# - **Upload OCT Images**: Begin by uploading your OCT scans for analysis.
# - **Explore Results**: View categorized scans and detailed diagnostic insights.
# - **Learn More**: Dive deeper into the different retinal diseases and how OCT helps diagnose them.

# ---

# #### **Contact Us**

# Have questions or need assistance? [Contact our support team](#) for more information on how to use the platform or integrate it into your clinical practice.

#     """)

# #About Project
# elif(app_mode=="About"):
#     st.header("About")
#     st.markdown("""
#                 #### About Dataset
#                 Retinal optical coherence tomography (OCT) is an imaging technique used to capture high-resolution cross sections of the retinas of living patients. 
#                 Approximately 30 million OCT scans are performed each year, and the analysis and interpretation of these images takes up a significant amount of time.
#                 (A) (Far left) choroidal neovascularization (CNV) with neovascular membrane (white arrowheads) and associated subretinal fluid (arrows). 
#                 (Middle left) Diabetic macular edema (DME) with retinal-thickening-associated intraretinal fluid (arrows). 
#                 (Middle right) Multiple drusen (arrowheads) present in early AMD. 
#                 (Far right) Normal retina with preserved foveal contour and absence of any retinal fluid/edema.

#                 ---

#                 #### Content
#                 The dataset is organized into 3 folders (train, test, val) and contains subfolders for each image category (NORMAL,CNV,DME,DRUSEN). 
#                 There are 84,495 X-Ray images (JPEG) and 4 categories (NORMAL,CNV,DME,DRUSEN).

#                 Images are labeled as (disease)-(randomized patient ID)-(image number by this patient) and split into 4 directories: CNV, DME, DRUSEN, and NORMAL.

#                 Optical coherence tomography (OCT) images (Spectralis OCT, Heidelberg Engineering, Germany) were selected from retrospective cohorts of adult patients from the Shiley Eye Institute of the University of California San Diego, the California Retinal Research Foundation, Medical Center Ophthalmology Associates, the Shanghai First People’s Hospital, and Beijing Tongren Eye Center between July 1, 2013 and March 1, 2017.

#                 Before training, each image went through a tiered grading system consisting of multiple layers of trained graders of increasing exper- tise for verification and correction of image labels. Each image imported into the database started with a label matching the most recent diagnosis of the patient. The first tier of graders consisted of undergraduate and medical students who had taken and passed an OCT interpretation course review. This first tier of graders conducted initial quality control and excluded OCT images containing severe artifacts or significant image resolution reductions. The second tier of graders consisted of four ophthalmologists who independently graded each image that had passed the first tier. The presence or absence of choroidal neovascularization (active or in the form of subretinal fibrosis), macular edema, drusen, and other pathologies visible on the OCT scan were recorded. Finally, a third tier of two senior independent retinal specialists, each with over 20 years of clinical retina experience, verified the true labels for each image. The dataset selection and stratification process is displayed in a CONSORT-style diagram in Figure 2B. To account for human error in grading, a validation subset of 993 scans was graded separately by two ophthalmologist graders, with disagreement in clinical labels arbitrated by a senior retinal specialist.

#                 """)

# #Prediction Page
# elif(app_mode=="Disease Identification"):
#     st.header("Welcome to the Retinal OCT Analysis Platform")
#     test_image = st.file_uploader("Upload your Image:")
#     if test_image is not None:
#         # Save to a temporary file and get its path
#         with tempfile.NamedTemporaryFile(delete=False, suffix=test_image.name) as tmp_file:
#             tmp_file.write(test_image.read())
#             temp_file_path = tmp_file.name
#     #Predict button
#     if(st.button("Predict")) and test_image is not None:
#         with st.spinner("Please Wait.."):
#             result_index = model_prediction(temp_file_path)
#             #Reading Labels
#             class_name = ['CNV', 'DME', 'DRUSEN', 'NORMAL']
#         st.success("Model is Predicting it's a {}".format(class_name[result_index]))

#         #Recommendation
#         with st.expander("Learn More"):
#             #CNV
#             if(result_index==0):
#                 st.write('''
#                     OCT scan showing *CNV with subretinal fluid.*
#                 ''')
#                 st.image(test_image)
#                 st.markdown(cnv)
        
#             #DME
#             elif(result_index==1):
#                 st.write('''
#                     OCT scan showing *DME with retinal thickening and intraretinal fluid.*
#                 ''')
#                 st.image(test_image)
#                 st.markdown(dme)

#             #DRUSEN
#             elif(result_index==2):
#                 st.write('''
#                     OCT scan showing *drusen deposits in early AMD.*
#                 ''')
#                 st.image(test_image)
#                 st.markdown(drusen)
                
#             #NORMAL
#             elif(result_index==3):
#                 st.write('''
#                     OCT scan showing a *normal retina with preserved foveal contour.*
#                 ''')
#                 st.image(test_image)
#                 st.markdown(normal)

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import tensorflow as tf
# from tensorflow.keras.applications.mobilenet_v3 import preprocess_input
# import numpy as np
# import tempfile
# import os

# # Initialize Flask app
# app = Flask(__name__)
# CORS(app)  # Enable CORS for frontend communication

# # Load model once during startup
# MODEL_PATH = "Trained_Model.keras"
# model = tf.keras.models.load_model(MODEL_PATH)

# # Disease class names
# CLASS_NAMES = ['CNV', 'DME', 'DRUSEN', 'NORMAL']


# # Prediction function
# def model_prediction(image_path):
#     img = tf.keras.utils.load_img(image_path, target_size=(224, 224))
#     x = tf.keras.utils.img_to_array(img)
#     x = np.expand_dims(x, axis=0)
#     x = preprocess_input(x)
#     predictions = model.predict(x)
#     result_index = np.argmax(predictions)
#     confidence = float(np.max(predictions))
#     return CLASS_NAMES[result_index], confidence


# # Root route
# @app.route("/", methods=["GET"])
# def home():
#     return jsonify({
#         "message": "Welcome to the Retinal OCT Disease Prediction API",
#         "usage": "Send a POST request to /predict with an image file."
#     })


# # Prediction endpoint
# @app.route("/predict", methods=["POST"])
# def predict():
#     if "image" not in request.files:
#         return jsonify({"error": "No image file provided"}), 400

#     image_file = request.files["image"]
#     if image_file.filename == "":
#         return jsonify({"error": "Empty filename"}), 400

#     # Save image temporarily
#     with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
#         image_file.save(temp_file.name)
#         temp_path = temp_file.name

#     # Make prediction
#     try:
#         predicted_class, confidence = model_prediction(temp_path)
#         response = {
#             "prediction": predicted_class,
#             "confidence": round(confidence * 100, 2)
#         }
#     except Exception as e:
#         response = {"error": str(e)}
#     finally:
#         os.remove(temp_path)  # Clean up temporary file

#     return jsonify(response)


# if __name__ == "__main__":
#     app.run(host="0.0.0.0", port=5000, debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.applications import MobileNetV3Large, MobileNetV3Small
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v3 import preprocess_input
import numpy as np
import io
from PIL import Image

# ------------------ Flask Setup ------------------
app = Flask(__name__)
CORS(app)

# ------------------ Model Loading ------------------
print("🔹 Loading model...")

try:
    model = tf.keras.models.load_model("Trained_Model.keras")
    print("✅ Model loaded successfully from Trained_Model.keras")
except Exception as e1:
    print("⚠️ Keras file failed to load:", e1)
    print("🔄 Trying to load Trained_Model.h5 ...")
    try:
        model = tf.keras.models.load_model("Trained_Model.h5")
        print("✅ Model loaded successfully from Trained_Model.h5")
    except Exception as e2:
        print("❌ Failed to load both model files.")
        print("Error:", e2)
        model = None

# ------------------ Helper Function ------------------
def prepare_image(img, target_size=(224, 224)):
    if img.mode != "RGB":
        img = img.convert("RGB")
    img = img.resize(target_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array

# ------------------ Prediction Endpoint ------------------
@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({"error": "Model not loaded properly"}), 500

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']

    try:
        img = Image.open(io.BytesIO(file.read()))
        processed_img = prepare_image(img)
        prediction = model.predict(processed_img)

        # If binary classification (e.g., Pneumonia vs Normal)
        pred_label = "PNEUMONIA" if prediction[0][0] > 0.5 else "NORMAL"

        return jsonify({
            "prediction": pred_label,
            "confidence": float(prediction[0][0])
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ------------------ Root Endpoint ------------------
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "message": "✅ Flask model prediction API is running.",
        "usage": "Send POST request to /predict with an image file."
    })


# ------------------ Main ------------------
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
