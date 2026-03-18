import streamlit as st
import requests
import json

st.set_page_config(page_title="SevaSetu - Rural Services Platform", page_icon="🌾")

API_URL = st.secrets.get("API_URL", "https://your-backend.onrender.com/api")


def get_dashboard():
    try:
        response = requests.get(f"{API_URL}/dashboard/", timeout=5)
        if response.ok:
            return response.json()
    except:
        return None


def get_users():
    try:
        response = requests.get(f"{API_URL}/users/", timeout=5)
        if response.ok:
            return response.json()
    except:
        return None


def get_providers():
    try:
        response = requests.get(f"{API_URL}/providers/", timeout=5)
        if response.ok:
            return response.json()
    except:
        return None


st.markdown("""
# 🌾 SevaSetu
### Rural Services Platform
*Connecting rural communities with local services, medicines, and farm supplies.*
---
""")

tab1, tab2, tab3, tab4, tab5 = st.tabs(
    ["📊 Dashboard", "👥 Users", "🔧 Providers", "👤 Customer", "🔧 Provider"]
)

with tab1:
    st.markdown("### Platform Statistics")
    if st.button("🔄 Refresh Dashboard"):
        st.rerun()

    data = get_dashboard()
    if data:
        col1, col2, col3, col4 = st.columns(4)
        col1.metric("Open Requests", data.get("open_requests", 0))
        col2.metric("Active Providers", data.get("active_providers", 0))
        col3.metric("Accepted Offers", data.get("accepted_offers", 0))
        col4.metric("Completed", data.get("completed_requests", 0))
    else:
        st.warning(
            "⚠️ Backend not connected. Deploy Django backend and add API_URL to secrets."
        )

with tab2:
    st.markdown("### Registered Users")
    if st.button("🔄 Load Users"):
        st.rerun()

    users = get_users()
    if users:
        st.json(users)
    else:
        st.warning("⚠️ Backend not connected")

with tab3:
    st.markdown("### Service Providers")
    if st.button("🔄 Load Providers"):
        st.rerun()

    providers = get_providers()
    if providers:
        for p in providers[:20]:
            with st.container():
                col1, col2 = st.columns([3, 1])
                col1.markdown(
                    f"**{p.get('user_name', 'N/A')}** - {p.get('service_type', 'N/A')}"
                )
                status = "🟢 Active" if p.get("is_active") else "🔴 Inactive"
                col2.markdown(status)
                st.divider()
    else:
        st.warning("⚠️ Backend not connected")

with tab4:
    st.markdown("### Customer Login")
    phone = st.text_input("Phone", placeholder="9000000001")
    pin = st.text_input("PIN", type="password", placeholder="123456")
    if st.button("🔐 Login", type="primary"):
        try:
            response = requests.post(
                f"{API_URL}/auth/login/", data={"phone": phone, "pin": pin}, timeout=5
            )
            if response.ok:
                st.success(f"✅ Login successful! Welcome {phone}")
            else:
                st.error(
                    f"❌ Login failed: {response.json().get('error', 'Unknown error')}"
                )
        except:
            st.error("❌ Cannot connect to backend")

    st.markdown("---")
    st.markdown("### Register New Customer")
    c1, c2 = st.columns(2)
    with c1:
        c_name = st.text_input("Full Name", placeholder="John Doe")
        c_phone = st.text_input("Phone", placeholder="9000000001")
    with c2:
        c_pin = st.text_input("PIN", type="password", placeholder="123456")
        c_location = st.text_input("Location", placeholder="Chilakaluripet")

    if st.button("📝 Register Customer", type="primary"):
        try:
            response = requests.post(
                f"{API_URL}/auth/register/",
                json={
                    "name": c_name,
                    "phone": c_phone,
                    "pin": c_pin,
                    "role": "customer",
                    "location": c_location,
                },
                timeout=5,
            )
            if response.ok:
                st.success(f"✅ Registration successful for {c_name}!")
            else:
                st.error(f"❌ {response.json().get('error', 'Registration failed')}")
        except:
            st.error("❌ Cannot connect to backend")

with tab5:
    st.markdown("### Provider Login")
    p_phone = st.text_input("Phone", placeholder="9100000001", key="p_phone")
    p_pin = st.text_input("PIN", type="password", placeholder="123456", key="p_pin")
    if st.button("🔐 Login", type="secondary", key="p_login"):
        try:
            response = requests.post(
                f"{API_URL}/auth/login/",
                data={"phone": p_phone, "pin": p_pin},
                timeout=5,
            )
            if response.ok:
                st.success(f"✅ Login successful! Welcome {p_phone}")
            else:
                st.error(
                    f"❌ Login failed: {response.json().get('error', 'Unknown error')}"
                )
        except:
            st.error("❌ Cannot connect to backend")

    st.markdown("---")
    st.markdown("### Register New Provider")
    pr1, pr2 = st.columns(2)
    with pr1:
        pr_name = st.text_input("Business Name", placeholder="Suresh Electric Works")
        pr_phone = st.text_input("Phone", placeholder="9100000001")
    with pr2:
        pr_pin = st.text_input("PIN", type="password", placeholder="123456")
        pr_location = st.text_input("Location", placeholder="Chilakaluripet")

    pr_service = st.selectbox(
        "Service Type",
        [
            "electrician",
            "plumber",
            "mechanic",
            "tractor_rental",
            "pump_repair",
            "medicines",
            "fertilizers",
            "seeds",
            "pesticides",
            "tools",
        ],
    )

    if st.button("📝 Register Provider", type="secondary"):
        try:
            response = requests.post(
                f"{API_URL}/auth/register/",
                json={
                    "name": pr_name,
                    "phone": pr_phone,
                    "pin": pr_pin,
                    "role": "provider",
                    "location": pr_location,
                    "service_type": pr_service,
                },
                timeout=5,
            )
            if response.ok:
                st.success(f"✅ Registration successful for {pr_name}!")
            else:
                st.error(f"❌ {response.json().get('error', 'Registration failed')}")
        except:
            st.error("❌ Cannot connect to backend")

st.markdown("""
---
### ℹ️ Demo Credentials
| Role | Phone | PIN |
|------|-------|-----|
| Customer | 9000000001 | 123456 |
| Provider | 9100000001 | 123456 |
| Admin | admin | 123456 |

> **Note**: Deploy your Django backend and add `API_URL` to Space secrets for login functionality.
""")
