Automation & Workflow Integration Layer

This project is an AI-powered application built with Google AI Studio and deployed on Vercel.
It acts as an intelligent interface layer connected to your automation ecosystem (n8n, Supabase, CRM, APIs).

🚀 Purpose

This application serves as:

AI interaction interface (Gemini-based)

Automation trigger layer

Workflow orchestration connector

API bridge to external services

Media handling endpoint (Blob storage)

It is designed to integrate with your broader infrastructure including:

n8n automation pipelines

Supabase database

CRM dashboards

Meta lead ingestion APIs

Image processing APIs (Nanobanana / Sora workflows)

🏗 Architecture Overview
User
 ↓
AI Studio App (Frontend - Vite / React)
 ↓
Vercel Serverless Functions
 ↓
External Services:
   - n8n
   - Supabase
   - Media Blob Storage
   - Third-party APIs
🔐 Environment Variables

Configured in Vercel → Project → Environment Variables

Required
GEMINI_API_KEY=
N8N_API_KEY=
BLOB_READ_WRITE_TOKEN=
Description

GEMINI_API_KEY → Google Gemini access key

N8N_API_KEY → Used to authenticate automation requests

BLOB_READ_WRITE_TOKEN → Used for file storage operations (Vercel Blob)

⚠ Never expose these keys in the frontend unless explicitly prefixed with VITE_.

🧠 Integrations
🔹 n8n

This app can:

Trigger workflows

Send structured payloads

Receive automation results

Act as AI decision layer before executing flows

🔹 Media / Blob Storage

Used to:

Store generated content

Handle uploaded images

Prepare assets for external AI services

🔹 AI Capabilities

Powered by:

Google Gemini API

Prompt-based orchestration

Contextual request handling

Structured JSON output for automation

🧪 Run Locally
Prerequisites

Node.js 18+

Installation
npm install
Configure Environment

Create .env.local:

GEMINI_API_KEY=your_key_here
N8N_API_KEY=your_key_here
BLOB_READ_WRITE_TOKEN=your_token_here
Run Development Server
npm run dev
🌐 Deployment

Push to GitHub

Import project into Vercel

Add environment variables

Deploy

🔄 Role Within Automation Ecosystem

This app functions as:

AI Decision Layer + Workflow Trigger Interface

It can:

Pre-process user input

Classify or structure data

Trigger external workflows

Return AI-enhanced responses

Serve as experimental AI lab inside your automation stack

📦 Tech Stack

Google AI Studio

Gemini API

React + Vite

Vercel

Serverless Functions

Blob Storage

n8n Integration
