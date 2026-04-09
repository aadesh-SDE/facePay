# FacePay

A face-authentication-based payment system. Pay money without typing a password — verify your identity with your face and a 2-blink liveness check.

## What is FacePay?

FacePay is a mobile-first web app that replaces password-based payment authorization with real-time face verification. Users sign up, register their face, and authorize transactions by looking at the camera and blinking twice.

## MVP Features

- **Signup / Login** with name, mobile, email, password
- **Face enrollment** during onboarding
- **Send money** by mobile number or QR code
- **Face verification + blink liveness** before every payment
- **Demo wallet** with virtual balance (no real money)
- **Transaction history** with filters
- **QR code** for receiving payments
- **Profile & security** settings

## Tech Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **State:** Redux Toolkit (MVVM architecture)
- **Face Auth:** face-api.js (browser-based detection + recognition)
- **CI:** GitHub Actions
- **Deployment:** NGINX + Docker + SSL

## Project Structure

```
facepay-project/
  designs/        # Stitch UI design exports (HTML + PNG)
  docs/           # Project documentation and plans
  frontend/       # React app (coming soon)
```

## Status

Currently in **planning phase**. Frontend development starting soon.

## License

Private project. All rights reserved.
