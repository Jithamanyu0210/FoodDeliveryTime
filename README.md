# Food Delivery Time Prediction — Full-Stack ML Web Application

A full-stack Machine Learning web application designed to predict food delivery time in minutes (`Time_taken (min)`) using operational parameters, environmental weather conditions, road traffic density, courier experience, and geodesic delivery distance.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Machine Learning & Pipeline** | **Python 3.13**, **Scikit-Learn**, **Pandas**, **NumPy**, **Joblib** |
| **Backend API** | **Flask 3.1**, **Flask-CORS**, **Gunicorn** |
| **Frontend Web Interface** | **React 18**, **Vite 6**, **Tailwind CSS**, **Lucide Icons** |
| **Data Source** | **Kaggle Zomato Delivery Analytics Dataset** (45,584 records) |
| **Deployment Support** | **Vercel** (`vercel.json`), **Render** (`Procfile`) |

---

## 🌟 Key Application Features

1. **Direct Delivery Distance Parameter**:
   - Accepts real-world delivery distance between the restaurant and customer home in kilometers (`distance_km`).
   - Supports direct distance input with real-time numeric validation.

2. **Machine Learning Model Inference**:
   - Powered by a trained **Gradient Boosting Regressor** pipeline (100 estimators, learning rate = 0.1).
   - Achieves **80.55% $R^2$ Score** and **3.30 min MAE** on 9,117 holdout test samples.

3. **Real Evaluation Metrics Display**:
   - Displays actual test set metrics directly below prediction results in exact sequence:
     1. **Predicted Delivery Time**
     2. **RMSE (Root Mean Squared Error)**: `4.14 min`
     3. **R² Score (R-squared)**: `80.55%`
     4. **MAE (Mean Absolute Error)**: `3.30 min`

4. **Prediction Factor Explanations**:
   - Displays feature impact breakdown bar charts detailing how distance, traffic, weather, courier rating, and vehicle condition influenced the estimated delivery duration.

5. **Prediction History & CSV Export**:
   - Log past predictions with timestamps and inputs.
   - Delete individual records or export prediction history as a `.csv` file.

6. **Exploratory Data Analysis (EDA) & System Info**:
   - Visual distribution graphs for traffic vs time, weather vs time, distance vs time, and vehicle type.
   - System info page providing live API diagnostics and model file status.

---

## 📊 Model Evaluation Results

| Model Algorithm | MAE (min) | RMSE (min) | R² Score | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Gradient Boosting Regressor** | **`3.30`** | **`4.14`** | **`80.55%`** | **Deployed Pipeline** |
| **Decision Tree Regressor** | `3.30` | `4.21` | `79.86%` | Trained |
| **KNN Regressor** | `3.87` | `4.95` | `72.24%` | Trained |
| **Linear Regression** | `4.81` | `6.06` | `58.35%` | Baseline |

---

## 🚀 How to Run the Application Locally

### 1. Prerequisites
Ensure **Python 3.10+** and **Node.js 18+** are installed on your machine.

### 2. Start Flask Backend REST API
```bash
cd backend
python app.py
```
*(Backend server will start on `http://127.0.0.1:5000`)*

### 3. Start React Frontend Web Application
```bash
cd frontend
cmd /c "npx vite"
```
*(Frontend application will open on `http://localhost:3000`)*

---

## 🌐 How to Deploy Online (Free)

### 🥇 Option 1: Render (Recommended — Full-Stack in 1 Web Service)
This is the easiest method because Render serves both the React Frontend and Flask Machine Learning API from a single free URL.

1. Go to [render.com](https://render.com) and log in with GitHub.
2. Click **New +** → **Web Service**.
3. Select and connect your repository: `Jithamanyu0210/FoodDeliveryTime`.
4. Fill in the following settings:
   - **Name**: `food-delivery-time-prediction`
   - **Language / Runtime**: `Python 3`
   - **Build Command**: `bash build.sh`
   - **Start Command**: `gunicorn --chdir backend app:app`
5. Click **Create Web Service**.
6. Render will automatically build the React frontend, install dependencies, load the ML models, and give you a live URL (e.g., `https://food-delivery-time-prediction.onrender.com`).

---

### 🥈 Option 2: Deploy Frontend to Vercel (Separated Architecture)

If you wish to host the React UI on Vercel:
1. First, deploy your backend on Render (see Option 1) or Railway to get your live API URL (e.g. `https://food-delivery-time-prediction.onrender.com`).
2. Go to [vercel.com](https://vercel.com) and click **Add New...** → **Project**.
3. Import your GitHub repository `FoodDeliveryTime`.
4. In the **Environment Variables** section, add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://<your-render-backend-url>.onrender.com` *(your live backend URL)*
5. Click **Deploy**. Vercel will automatically run `cd frontend && npm install && npm run build` and launch your UI.

---

## 📁 Repository Structure

```
foodpredict/
├── vercel.json                      # Vercel deployment configuration
├── README.md                        # Project documentation & tech stack
├── backend/
│   ├── app.py                       # Flask REST API server (/api/predict, /api/models, /api/system)
│   ├── Procfile                     # Gunicorn web service runner for cloud platforms
│   ├── requirements.txt             # Python backend dependencies
│   ├── model/
│   │   ├── models.joblib            # Trained ML pipelines
│   │   ├── delivery_model.joblib    # Deployed model pipeline
│   │   └── evaluation_results.json  # Real model metrics & EDA chart JSON
│   └── utils/
│       ├── feature_engineering.py   # Haversine distance calculator & feature prep
│       ├── generate_insights.py     # Real dataset EDA insights generator
│       └── train_model.py           # Multi-model training script
└── frontend/
    ├── package.json                 # Node dependencies
    ├── vite.config.js               # Vite config with backend proxy
    └── src/
        ├── App.jsx                  # Navigation state manager
        ├── components/
        │   ├── Header.jsx           # Clean header navigation bar
        │   ├── DeliveryForm.jsx     # Distance between restaurant & home + order input form
        │   └── PredictionCard.jsx   # Results card displaying time, RMSE, R², MAE & explanations
        └── pages/
            ├── HomePage.jsx         # Hero landing page
            ├── DashboardPage.jsx    # Real dataset stats dashboard
            ├── PredictionPage.jsx   # Live prediction interface
            ├── PredictionHistoryPage.jsx # History table & CSV exporter
            ├── ModelInsightsPage.jsx# Algorithm comparison table & EDA distribution charts
            └── SystemInfoPage.jsx   # System metadata & API health status
```
