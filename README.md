---
title: SevaSetu
emoji: 🌾
colorFrom: green
colorTo: orange
sdk: streamlit
sdk_version: "1.40.0"
app_file: app.py
pinned: false
---

# 🌾 SevaSetu - Rural Services Platform

A platform connecting rural communities with local services, medicines, and farm supplies.

## Features

- **Local Services** - Electricians, Plumbers, Mechanics
- **Medicine Delivery** - Pharmacy services  
- **Farm Supplies** - Fertilizers, Seeds, Pesticides, Tools

## Demo Credentials

| Role | Phone | PIN |
|------|-------|-----|
| Customer | 9000000001 | 123456 |
| Provider | 9100000001 | 123456 |
| Admin | admin | 123456 |

## Deployment

1. Create a Hugging Face Space with **Streamlit** SDK
2. Upload `app.py` and `requirements.txt`
3. Deploy your Django backend to Render/Replit
4. Add `API_URL` to Space secrets pointing to your backend

For full app deployment, see the main repository.
