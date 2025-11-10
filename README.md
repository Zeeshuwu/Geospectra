
#  GEOSPECTRA - Advanced Geospatial Analysis Platform

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![MapLibre GL JS](https://img.shields.io/badge/MapLibre_GL_JS-396CB2?style=flat&logo=maplibre&logoColor=white)](https://maplibre.org/)

**GEOSPECTRA** is a cutting-edge web-based platform for advanced geospatial analysis, specializing in AI-powered roof segmentation, building classification, and 3D solar potential analysis. Built for the ASEAN Geospatial Challenge, this platform combines satellite imagery processing with machine learning to deliver precise spatial intelligence.

##  Features

###  **Building Segmentation Tool**
- **AI-Powered Detection**: Advanced U-Net architecture for precise building segmentation
- **Interactive ROI Selection**: Draw rectangles, polygons, or circles on satellite imagery
- **Multi-Source Imagery**: Support for Google Satellite, Landsat 8, and custom uploads
- **Real-time Processing**: Live progress tracking with step-by-step analysis

###  **Roof Classification**
- **Material Analysis**: Utilizing U-Net for Roof material detection and classification
- **Statistical Insights**: Comprehensive building analytics and metrics
- **Export Capabilities**: Download results in multiple formats

### ☀️ **3D Solar Analysis**
- **Solar Potential Mapping**: Advanced 3D analysis for solar panel placement
- **Shadow Analysis**: Comprehensive shadow modeling throughout the year
- **Energy Estimation**: Accurate solar energy potential calculations
- **Interactive 3D Visualization**: Immersive 3D building models

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: TailwindCSS for responsive design
- **Mapping**: MapLibre GL JS for interactive maps
- **Icons**: Feather Icons for consistent UI elements
- **Fonts**: Inter font family for modern typography
- **AI Models**: U-Net architecture for segmentation
- **Data Sources**: Google Satellite, OpenStreetMap, Landsat 8

## 📁 Project Structure
GEOSPECTRA/
├── components/          # Reusable UI components
├── images/              # Images and assets
├── .gitattributes       # Git LFS configuration
├── 3d-viewer.html       # 3D viewer interface
├── 3d-viewer2.html      # 3D viewer interface (v2)
├── 3d-viewer3.html      # 3D viewer interface (v3)
├── LICENSE              # Project license file
├── README.md            # Project documentation
├── about.html           # About page
├── bandung_buildings_3d_fixed.json   # 3D building data (Bandung)
├── index.html           # Main landing page
├── malang_buildings_3d_fixed.json    # 3D building data (Malang)
├── segmentation.html    # Legacy segmentation page
├── semarang_reproject_3d_fixed.json  # 3D building data (Semarang)
├── style.css            # Custom styles
├── team.html            # Team information page
├── tool1-segmentation.html   # Main segmentation tool
├── tool2-classification.html # Building classification tool
└── tools.html           # Tools overview page

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for map tiles and external resources

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/geospectra.git
   cd geospectra
   ```

2. **Open in browser**
   ```bash
   # Option 1: Direct file opening
   open index.html
   
   # Option 2: Local server (recommended)
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Start analyzing!**
   - Navigate to the Tools section
   - Select your analysis type
   - Draw your region of interest
   - Run the analysis

## 📖 Usage Guide

### 🎯 **Roof Segmentation Workflow**

1. **Select Analysis Area**
   - Choose your preferred basemap (Satellite/OSM/Terrain)
   - Use drawing tools to define your Region of Interest (ROI)
   - Configure analysis parameters

2. **Configure Parameters**
   - Set date range for imagery
   - Adjust cloud coverage threshold
   - Select AI segmentation model

3. **Run Analysis**
   - Click "Run GEOSPECTRA Segmentation"
   - Monitor real-time processing status
   - View results in interactive gallery

4. **Export Results**
   - Download segmented imagery
   - Export statistical data
   - Continue to classification workflow

### 🏗️ **Building Classification**

1. Import segmentation results or upload new imagery
2. Configure classification parameters
3. Run AI-powered building type detection
4. Review and export classification results

### ☀️ **3D Solar Analysis**

1. Load 3D building models
2. Configure solar analysis parameters
3. Run comprehensive solar potential analysis
4. Explore interactive 3D visualizations

## 🌟 Key Capabilities

- **🎯 Precision**: Sub-meter accuracy in building detection
- **⚡ Speed**: Real-time processing with optimized algorithms
- **🌐 Scalability**: Handle large-scale urban analysis
- **📊 Analytics**: Comprehensive statistical insights
- **🔄 Integration**: Seamless workflow between analysis tools
- **📱 Responsive**: Works on desktop, tablet, and mobile devices

## 🏆 ASEAN Geospatial Challenge

This platform was developed for the **ASEAN Geospatial Challenge**, focusing on:
- Advanced spatial intelligence solutions
- AI-powered geospatial analysis
- Sustainable urban development
- Solar energy potential mapping
- Smart city applications

## 👥 Team

**GEOSPECTRA Team**
- Mohammad Zulfi Rahadi Putra
- Raffi Satya Nugraha
- Najieda Azka
- Salzabilla Enzal Putri
- Department of Geodetic Engineering
- Universitas Gadjah Mada
- Yogyakarta, Indonesia

## 📊 Performance Metrics


- **Processing Speed**: < 10 seconds for typical ROI
- **Resolution Support**: 0.5m/pixel to 30m/pixel
