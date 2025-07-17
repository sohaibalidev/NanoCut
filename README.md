# **Nanocut - Precision URL Shortener**  

**Nanocut** is a high-performance URL shortening service built for **speed, analytics, and control**. Create, manage, and track short links with surgical precision.  

---

## **Features**  
 **Ultra-Short URLs** – Compact, shareable links  
 **Link Expiration** – Set auto-expiry dates  
 **Click Analytics** – Track visits in real-time  
 **Toggle Activation** – Disable links anytime  
 **Light/Dark Mode** – Eye-friendly UI  
 **Secure Auth** – JWT-protected access  

---

## **Tech Stack**  

### **Frontend**  
- **HTML5, CSS3, JavaScript**  
- **Boxicons** for sleek UI icons  

### **Backend**  
- **Node.js + Express** (Blazing-fast routing)  
- **MongoDB** (Scalable database)  
- **JWT** (Secure authentication)  

### **Deployment**  
- **Hosted on Render** – Reliable & scalable  

---

## **API Endpoints**  

| Endpoint | Method | Description |  
|----------|--------|-------------|  
| `/api/auth/register` | POST | Register a new user |  
| `/api/auth/login` | POST | User login |  
| `/api/urls` | POST | Create short URL |  
| `/api/urls` | GET | Fetch user’s URLs |  
| `/api/urls/:id` | PUT | Toggle URL status |  
| `/api/urls/:id` | DELETE | Remove a URL |  
| `/u/:shortId` | GET | Redirect to original URL |  

---
