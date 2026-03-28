# DeepDetect AI Project Report

## 1. Project Title
**DeepDetect AI: A Multi-Modal Deepfake and Synthetic Media Detection Platform**

## 2. Executive Summary
DeepDetect AI is a full-stack web application designed to analyze digital media and help users distinguish authentic content from potentially AI-generated or manipulated content. The platform combines a modern React frontend, a Node.js and Express backend, optional Google Gemini-powered media analysis, and a Python microservice for web-image forensics. It supports image, video, audio, ID-verification, and live-camera scan modes through a single dashboard-oriented user experience.

From the current codebase, the project is positioned as a practical forensic analysis platform rather than a research benchmark system. Its strongest implementation areas are:

- multi-modal upload and scanning workflows
- live in-browser facial feature analysis using face detection models
- server-side orchestration of file analysis requests
- optional generative-AI-assisted forensic interpretation
- web-source tracing for uploaded images using Google Cloud Vision
- report-style result presentation with charts and downloadable PDF output

The system is suitable for demonstrations, academic project work, prototype validation, and lightweight digital-forensics screening workflows. It is especially relevant in an era where misinformation, identity fraud, AI-generated impersonation, and manipulated media are becoming more common across social media, journalism, law enforcement, education, and enterprise security.

## 3. Introduction
The rapid growth of generative AI has made it easier to create convincing fake media, including fabricated images, manipulated video, synthetic voice clips, and forged identity documents. These developments create serious risks for trust, security, privacy, and public communication. DeepDetect AI addresses this challenge by offering an interactive platform that helps inspect media for possible manipulation signals.

The application provides a unified environment in which users can:

- upload media files for AI-assisted analysis
- perform live camera scans with face landmark detection
- review comparative forensic signals and confidence scores
- trace whether an uploaded image appears elsewhere on the web
- export a forensic-style PDF summary of the results

## 4. Problem Statement
Modern digital ecosystems face a major authenticity problem. Individuals and organizations increasingly need tools that can help identify whether media is genuine or synthetically generated. Manual inspection is often slow, subjective, and unreliable. DeepDetect AI attempts to solve this by offering an accessible web platform that centralizes media intake, AI-assisted analysis, visualization, and reporting.

## 5. Project Objectives
The main objectives of the project are:

1. To build an accessible browser-based platform for deepfake and synthetic media screening.
2. To support multiple input formats such as images, video, audio, live camera capture, and ID verification.
3. To integrate AI-based reasoning for forensic-style decision support.
4. To provide image source-tracing through web detection.
5. To display analysis results in a user-friendly dashboard with charts and structured metrics.
6. To enable export of results as a PDF forensic report.
7. To keep the system easy to run locally and easy to deploy.

## 6. Scope of the System
DeepDetect AI currently covers the following functional scope:

- image upload analysis
- video upload analysis
- audio upload analysis
- ID verification mode
- live camera capture and biometric-style visualization
- user session-based scan history
- comparative forensic result tables
- chart-based authenticity and metric visualization
- PDF report generation
- optional web forensics for images

The current implementation does **not** provide:

- permanent user accounts in the active runtime path
- long-term database persistence for scans
- a validated benchmark dataset pipeline
- model training workflows inside the repository
- automated testing coverage
- production-grade evidence handling or chain-of-custody controls

## 7. Existing System and Proposed Solution
### Existing Challenge
Traditional content verification often depends on manual review, fragmented tools, or expensive enterprise forensic suites. Many users lack a single interface where they can upload media, inspect AI-related anomalies, and generate a shareable report.

### Proposed Solution
DeepDetect AI provides a browser-based, modular solution that combines:

- frontend media intake and visualization
- backend request processing and AI orchestration
- optional multimodal inference using Google Gemini
- live face analysis in the browser
- image web-detection through Google Cloud Vision
- session history and exportable reports

## 8. System Architecture
The current codebase follows a three-part architecture:

1. **Client Application**
   Built with React, TypeScript, Vite, Tailwind CSS, and chart/animation libraries.

2. **Node.js API Server**
   Built with Express and TypeScript. Handles scan submission, file uploads, scan history, and Gemini-based analysis orchestration.

3. **Python Microservice**
   Built with Flask. Handles optional web-image detection through Google Cloud Vision.

### High-Level Architecture Flow
```text
User
  |
  v
React Frontend (Vite + TypeScript)
  |
  +--> Live camera analysis in browser using @vladmandic/face-api
  |
  v
Node.js + Express API
  |
  +--> Google Gemini API for media interpretation
  |
  +--> In-memory fallback store for session scan history
  |
  v
Python Flask Microservice
  |
  v
Google Cloud Vision Web Detection
```

## 9. Module-Wise Description
### 9.1 Frontend Module
The frontend is implemented in the `client` folder and provides the user-facing application. It uses React Router for navigation across the Home, Dashboard, and About pages. The Dashboard is the core working interface where users select scan types, upload content, start analysis, inspect results, and download PDF reports.

Key frontend responsibilities:

- rendering the application UI
- handling scan mode selection
- collecting media files and metadata
- managing live camera access with `getUserMedia`
- loading face detection models from local assets
- invoking backend APIs
- visualizing results with charts and tables
- exporting the final report as PDF

### 9.2 Backend Module
The backend is implemented in the `server` folder. It exposes REST endpoints under `/api/scan`. The main route accepts uploaded content and metadata, validates the request, optionally calls Gemini for inference, optionally calls the Python service for web-image matching, stores the result in an in-memory fallback store, and returns a structured JSON response.

Key backend responsibilities:

- CORS and request parsing
- file upload handling through Multer
- request validation
- AI prompt construction for Gemini
- result normalization
- session-level scan history management
- health endpoints

### 9.3 Python Microservice Module
The Python service is implemented in the `python_service` folder. It exposes an `/analyze_image` endpoint. When the backend uploads an image to this service, the microservice calls Google Cloud Vision web detection and returns best guess labels, exact matches, partial matches, visually similar images, and matching pages.

Key Python service responsibilities:

- image request intake
- validation of uploaded files
- Google Cloud Vision web detection requests
- structured JSON response generation

### 9.4 Storage Module
The active runtime path uses an in-memory fallback store instead of a persistent database. A Prisma schema and database helper file exist in the repository, but they are not currently wired into the active scan flow. This means scan history lasts only while the backend process remains alive and is grouped by a browser-generated guest ID.

## 10. Actual Technology Stack Used
The following table reflects the stack present in the current repository.

### 10.1 Frontend Stack
| Technology | Role in Project |
| --- | --- |
| React | Component-based frontend UI |
| TypeScript | Type safety across the frontend |
| Vite | Development server and production build tooling |
| React Router DOM | Client-side routing |
| Tailwind CSS | Utility-first styling |
| Framer Motion | Page and component animations |
| Axios | HTTP communication with backend APIs |
| Recharts | Pie chart and bar chart visualization |
| jsPDF | PDF report creation |
| jspdf-autotable | Structured forensic tables in exported PDFs |
| Lucide React | Icons in navigation and dashboard |
| `@vladmandic/face-api` | In-browser face detection, landmarks, expression, age, and gender estimation |
| Vite Plugin PWA | Progressive Web App support and manifest generation |
| Web APIs (`getUserMedia`, `FormData`, `Blob`, `Canvas`) | Camera capture and file transfer workflows |

### 10.2 Backend Stack
| Technology | Role in Project |
| --- | --- |
| Node.js | JavaScript runtime for the backend |
| Express | REST API framework |
| TypeScript | Strong typing in backend code |
| Multer | Multipart file upload handling |
| CORS | Cross-origin API access control |
| dotenv | Environment variable loading |
| `@google/generative-ai` | Google Gemini API client |
| ts-node | TypeScript execution in development |
| nodemon | Auto-restart development workflow |

### 10.3 Python Microservice Stack
| Technology | Role in Project |
| --- | --- |
| Python | Runtime for the auxiliary analysis service |
| Flask | Lightweight HTTP service |
| flask-cors | CORS for the Python service |
| google-cloud-vision | Web detection for reverse image intelligence |
| python-dotenv | Environment variable loading in Python service |

### 10.4 Data and Storage Stack
| Technology | Role in Project |
| --- | --- |
| In-memory JavaScript store | Active scan history persistence during runtime |
| Prisma schema | Present in repository but not actively used in current scan path |
| SQLite schema definition | Present as part of Prisma configuration but not active in runtime flow |

### 10.5 Deployment and Tooling Stack
| Technology | Role in Project |
| --- | --- |
| Vercel | Hosting and deployment configuration |
| npm | Package management and scripts |
| ESLint | Static code quality tooling on the frontend |
| PostCSS | CSS processing pipeline |
| Git and GitHub | Version control and collaboration |

### 10.6 Additional Declared Dependencies
The Python requirements also declare `transformers`, `torch`, and `nltk`. These packages are not currently imported in the visible `app.py` implementation, so they should be treated as declared or future-facing dependencies rather than confirmed active runtime dependencies in the present code path.

## 11. Functional Workflow
The application workflow can be summarized as follows:

1. The user opens the frontend application.
2. The user navigates to the dashboard.
3. The user selects a scan type such as upload, live camera, video, audio, or ID verification.
4. The frontend collects metadata such as title, author, and language.
5. For non-live modes, the user uploads a file.
6. For live mode, the browser captures webcam frames and extracts face-related HUD data.
7. The frontend sends a multipart request to the Node.js backend.
8. The backend validates the request and prepares analysis defaults.
9. If a valid Gemini API key is configured, the backend sends the content and prompt to Gemini.
10. If the uploaded file is an image and the Python service is available, the backend calls the Flask service for web detection.
11. The backend stores the final result in the fallback in-memory store.
12. The frontend displays verdicts, confidence, charts, comparative analysis, and web matches.
13. The user can export the report as a PDF.

## 12. Core Features
### 12.1 Multi-Modal Scan Support
The dashboard allows different scan modes:

- `upload`
- `video`
- `audio`
- `id_verify`
- `live_camera`

This broadens the system’s practical value and gives the project a stronger forensic and security narrative.

### 12.2 Live Camera Scanner
The live camera scanner uses `@vladmandic/face-api` models loaded from the local `public/models` directory. It captures facial landmarks, expression probabilities, age estimation, gender estimation, and detection coordinates. The UI overlays a biometric-style HUD and can submit a captured frame plus detection metadata to the backend.

### 12.3 AI-Assisted Forensic Interpretation
When configured, the backend uses Google Gemini 1.5 Flash to produce:

- a verdict (`Real` or `Fake`)
- a confidence score
- analysis metrics
- comparative analysis rows
- a textual summary

If the API key is not configured, the system falls back to simulation logic so the overall experience remains usable.

### 12.4 Web Forensics
For uploaded images, the backend can call the Python microservice, which in turn uses Google Cloud Vision web detection. This helps identify:

- exact matches
- partial matches
- visually similar images
- pages containing matching images

This feature is valuable for tracing whether an image may already exist elsewhere online or has likely been reused.

### 12.5 Interactive Visualization
The frontend presents:

- an authenticity split pie chart
- a signal metrics bar chart
- a comparative forensics table
- recent scan history
- a forensic conclusion panel

These elements improve interpretability and user engagement.

### 12.6 PDF Report Generation
Users can export a forensic summary as a PDF with:

- executive summary
- verdict and confidence
- timestamp
- details section
- comparative analysis table

This is useful for sharing or documenting findings.

## 13. Key Algorithms and Techniques
Although the project is not a full custom model training repository, it uses or orchestrates several important technical techniques:

- browser-based face detection
- face landmark detection
- expression classification
- age and gender estimation
- multimodal prompt-based inference
- web image matching
- comparative anomaly presentation
- confidence-based verdict reporting

## 14. Advantages of the Project
Major strengths of the project include:

- modern and appealing user interface
- modular client-server-service architecture
- support for multiple media types
- optional AI enhancement through external APIs
- low setup complexity for demonstrations
- no mandatory login barrier
- PDF report export capability
- browser-local live camera intelligence

## 15. Limitations and Technical Observations
The current implementation also has important limitations:

1. The active scan history is stored in memory, so data is not persistent across backend restarts.
2. Some repository artifacts suggest earlier or future database-backed designs, but they are not active in the runtime flow.
3. The accuracy claims shown in UI copy are not backed by benchmark scripts, evaluation reports, or test datasets in the repository.
4. The About page mentions technologies such as EfficientNet-B7 and Voting Classifier, but these are not reflected in the active code path.
5. Video and audio modes currently rely more on metadata/context flow than on dedicated media decoding and model-based forensic processing.
6. No automated tests are currently configured.
7. The system depends on external APIs for advanced analysis and web forensics.
8. Privacy, evidentiary rigor, and adversarial robustness would need more work before high-stakes deployment.

## 16. Security and Privacy Considerations
Deepfake detection systems deal with sensitive media and potentially personal data. For such a platform, the following concerns are important:

- secure storage and transfer of uploaded media
- explicit user consent for live camera access
- limited retention of uploaded files
- audit logging for forensic workflows
- protection against malicious uploads
- careful handling of false positives and false negatives
- transparency about AI assistance and confidence limitations

The current codebase keeps retention lightweight by relying on in-memory storage, but stronger production controls would be needed for institutional deployment.

## 17. Real-Time and Real-World Uses of DeepDetect AI
This project has several meaningful real-time applications:

### 17.1 Social Media Misinformation Screening
Newsrooms, moderators, and fact-checking teams can use it to quickly review suspicious images, videos, and AI-generated impersonation attempts before content is amplified.

### 17.2 Digital Journalism and Verification
Reporters can upload media received from unknown sources and use image web-detection plus AI-assisted interpretation to support verification workflows.

### 17.3 Identity Verification and KYC Support
The ID verification mode and live camera mode can help in early-stage fraud-screening scenarios such as onboarding checks, spoof detection, or suspicious profile verification.

### 17.4 Cybersecurity and Fraud Prevention
Security teams can use the platform to inspect fake executive messages, impersonation media, synthetic voice content, or forged visual assets used in phishing and social engineering.

### 17.5 Law Enforcement and Digital Forensics Education
The project can be used as a demonstration or educational tool to explain forensic indicators, web-source matching, and the risks associated with manipulated media.

### 17.6 Academic Research Demonstrations
Students and faculty can use it as a practical case study in AI ethics, computer vision, digital forensics, human-computer interaction, and full-stack software engineering.

### 17.7 Enterprise Brand Protection
Organizations can screen suspicious brand-related visuals, fabricated promotional media, or identity misuse affecting executives or public figures.

### 17.8 Election and Public Communication Integrity
Public institutions and monitoring teams can use platforms like this to review suspicious political media, campaign misinformation, or viral fabricated visual content.

### 17.9 Insurance and Claims Review
Investigators can use image verification and web-source matching to detect reused or manipulated images in fraudulent claims.

### 17.10 Content Provenance Awareness
Creative platforms, digital marketplaces, and moderation teams can use such a system as a first-pass authenticity screen before publication or approval.

## 18. Future Enhancements
The following improvements would significantly strengthen the project:

1. Replace in-memory storage with a production database and authenticated user system.
2. Add benchmark datasets and measurable evaluation pipelines.
3. Implement dedicated audio and video forensic models instead of metadata-only fallback behavior.
4. Add background job processing for larger files.
5. Introduce test coverage for frontend and backend modules.
6. Add persistent report history and case management.
7. Implement role-based access control for institutional use.
8. Add file hashing, provenance metadata, and stronger audit trails.
9. Improve explainability with richer evidence maps and source citations.
10. Add deployment hardening, rate limiting, and observability dashboards.

## 19. Conclusion
DeepDetect AI is a compelling full-stack project that addresses an important modern problem: identifying manipulated and AI-generated digital media. The system combines interactive frontend design, practical backend orchestration, browser-based face analysis, optional multimodal AI inference, and image source tracing. Its current implementation is best understood as a prototype or academic-grade forensic platform with strong demonstration value and a clear path toward future expansion.

The project stands out because it is not limited to a single upload form. Instead, it delivers a richer end-to-end experience including live scanning, historical results, charts, and downloadable reports. With stronger persistence, validation, testing, and domain-specific forensic models, it could evolve into a more reliable production-oriented authenticity screening system.

## 20. References
The following references were used to support this report and to identify the technologies, standards, and application context relevant to the project.

1. DeepDetect AI repository README. https://github.com/akshat2805p/Deepdetect-AI
2. React Documentation. https://react.dev/
3. Vite Documentation. https://vite.dev/
4. TypeScript Documentation. https://www.typescriptlang.org/docs/
5. Tailwind CSS Documentation. https://tailwindcss.com/docs
6. React Router Documentation. https://reactrouter.com/
7. Framer Motion Documentation. https://motion.dev/
8. Axios Documentation. https://axios-http.com/docs/intro
9. Recharts Documentation. https://recharts.org/
10. jsPDF Documentation. https://github.com/parallax/jsPDF
11. jspdf-autotable Documentation. https://github.com/simonbengtsson/jsPDF-AutoTable
12. Lucide Documentation. https://lucide.dev/
13. `@vladmandic/face-api` repository. https://github.com/vladmandic/face-api
14. Node.js Documentation. https://nodejs.org/en/docs
15. Express Documentation. https://expressjs.com/
16. Multer Documentation. https://github.com/expressjs/multer
17. CORS middleware package. https://github.com/expressjs/cors
18. dotenv package documentation. https://github.com/motdotla/dotenv
19. Google AI for Developers: Gemini API Documentation. https://ai.google.dev/gemini-api/docs
20. Google Generative AI JavaScript SDK. https://github.com/google-gemini/generative-ai-js
21. Flask Documentation. https://flask.palletsprojects.com/
22. Flask-CORS Documentation. https://flask-cors.readthedocs.io/
23. Python Documentation. https://docs.python.org/3/
24. Google Cloud Vision Documentation. https://cloud.google.com/vision/docs
25. Google Cloud Vision Web Detection Documentation. https://cloud.google.com/vision/docs/detecting-web
26. Google Cloud Vision Python Client Library. https://cloud.google.com/python/docs/reference/vision/latest
27. Prisma Documentation. https://www.prisma.io/docs
28. SQLite Documentation. https://www.sqlite.org/docs.html
29. Vercel Documentation. https://vercel.com/docs
30. ESLint Documentation. https://eslint.org/docs/latest/
31. PostCSS Documentation. https://postcss.org/
32. npm Documentation. https://docs.npmjs.com/
33. MDN Web Docs: MediaDevices.getUserMedia(). https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
34. MDN Web Docs: FormData. https://developer.mozilla.org/en-US/docs/Web/API/FormData
35. MDN Web Docs: Blob. https://developer.mozilla.org/en-US/docs/Web/API/Blob
36. MDN Web Docs: HTMLCanvasElement.toBlob(). https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
37. Hugging Face Transformers Documentation. https://huggingface.co/docs/transformers/index
38. PyTorch Documentation. https://pytorch.org/docs/stable/index.html
39. NLTK Documentation. https://www.nltk.org/
40. Vite Plugin PWA Documentation. https://vite-pwa-org.netlify.app/
41. ts-node Documentation. https://typestrong.org/ts-node/
42. nodemon Documentation. https://nodemon.io/
43. Google Research publication archive. https://research.google/pubs/
44. Chesney, R., & Citron, D. (2019). Deepfakes and the New Disinformation War. *Foreign Affairs*. https://www.foreignaffairs.com/articles/world/2018-12-11/deepfakes-and-new-disinformation-war
45. Tolosana, R., Vera-Rodriguez, R., Fierrez, J., Morales, A., & Ortega-Garcia, J. (2020). Deepfakes and Beyond: A Survey of Face Manipulation and Fake Detection. https://arxiv.org/abs/2001.00179
46. Verdoliva, L. (2020). Media Forensics and DeepFakes: An Overview. https://ieeexplore.ieee.org/document/9093367
47. Mirsky, Y., & Lee, W. (2021). The Creation and Detection of Deepfakes: A Survey. https://dl.acm.org/doi/10.1145/3425780
48. NIST AI Risk Management Framework. https://www.nist.gov/itl/ai-risk-management-framework

## 21. Report Basis
This report was prepared by analyzing the current repository structure and implementation files, especially the client dashboard, backend scan routes, in-memory storage utilities, Python image-analysis service, package manifests, and deployment configuration. Where UI copy and active implementation differed, the implementation was treated as the primary source of truth.
