# ClinicalNexus AI — Training Scripts

These files contain the full Python training code for all 8 AI models powering the platform.

> ⚠️ **These are `.txt` files** — rename each one to `.py` before running.
> The platform only allows `.txt` uploads, so just rename on your machine.

---

## Files

| File | Rename to | Platform | GPU |
|---|---|---|---|
| `kaggle_train.txt` | `kaggle_train.py` | Kaggle Notebooks | T4 (free) |
| `aws_train.txt` | `aws_train.py` | AWS SageMaker / Studio Lab | T4 / V100 |
| `huggingface_train.txt` | `huggingface_train.py` | HF Spaces / AutoTrain / ZeroGPU | T4 (free hours) |

---

## Models Trained (all 8)

| # | Model | Dataset | Algorithm | Target AUC |
|---|---|---|---|---|
| 1 | Trial Matching | UCI Heart / Framingham | XGBoost + Optuna | 0.914 |
| 2 | Early Warning | MIMIC-III / NEWS2 vitals | Bi-LSTM + Isolation Forest | 0.951 |
| 3 | Diabetes Risk | UCI Pima Indians (n=768) | VotingClassifier (LGBM+RF+LR) | 0.942 |
| 4 | Mortality Risk | SEER / Charlson (n=10,000) | GradientBoosting | 0.887 |
| 5 | Digital Twin | NHANES 2017-2020 (n=11,966) | PyTorch MLP Regressor | R²=0.91 |
| 6 | Federated Learning | Synthetic 3-node (n=15,000) | FedAvg (LGBM nodes) | 0.924 |
| 7 | XAI / SHAP | Diabetes (LightGBM) | TreeExplainer | fidelity 0.97 |
| 8 | Protocol Risk | Synthetic clinical trials | LightGBM | 0.906 |

---

## Quickest Path — Kaggle (5 minutes to start)

```
1. Go to https://www.kaggle.com → Create account
2. Click "Create" → "New Notebook"
3. Settings → Accelerator → GPU T4 x2
4. Settings → Internet → ON
5. Rename kaggle_train.txt → kaggle_train.py
6. Upload the .py file into the notebook
7. Click "Run All"
8. Download trained .pkl and .pth files from Output panel
```

## Hugging Face — Free ZeroGPU (5 hrs/day)

```
1. Go to https://huggingface.co → Create account
2. Spaces → New Space → SDK: Gradio → Hardware: ZeroGPU
3. Rename huggingface_train.txt → app.py
4. Upload as app.py
5. Add HF_TOKEN in Space Settings → Repository Secrets
6. Space auto-runs and uploads models to your HF Hub repo
```

## AWS SageMaker Studio Lab (Free, no credit card)

```
1. Go to https://studiolab.sagemaker.aws → Request account
2. Start Runtime → GPU → Open Project
3. Rename aws_train.txt → aws_train.py
4. Upload via file browser (drag & drop)
5. Open Terminal → python aws_train.py
6. Models saved to ./models/ and ./output/
```

---

## Output Files (produced after training)

```
models/
  trial_matching.pkl         ← Model 1
  early_warning_lstm.pth     ← Model 2 (PyTorch weights)
  early_warning_iso.pkl      ← Model 2 (Isolation Forest)
  diabetes_risk.pkl          ← Model 3
  mortality_risk.pkl         ← Model 4
  digital_twin.pth           ← Model 5 (PyTorch weights)
  digital_twin_meta.pkl      ← Model 5 (scaler + feature names)
  federated_model.pkl        ← Model 6
  xai_shap.pkl               ← Model 7
  protocol_risk.pkl          ← Model 8

output/
  training_summary.json      ← All final metrics
  *_cm.png                   ← Confusion matrix plots
  *_loss.png                 ← Loss curve plots
  federated_convergence.png  ← FedAvg convergence chart
  shap_waterfall.png         ← SHAP feature attribution chart
  model.tar.gz               ← (AWS only) packaged for SageMaker deploy
  pima_diabetes_for_autotrain.csv  ← (HF only) for HF AutoTrain
```
