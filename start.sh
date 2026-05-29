#!/bin/bash

npm run dev -- --host --port 4321 &
cloudflared tunnel --url http://localhost:4321