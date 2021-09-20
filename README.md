# Spotify with lyrics

This Angular+Node Express application shows user's playlists once he logs into his spotify account. When user selects a track from left-pane list, the track starts to play, and track details and lyrics are shown in the righ-side pane.

## Installation

1) git clone
2) Go to your spotify dashboard page to register the application(and you will get client id and client secret after registration)
3) In your local repo, go to 'server' direcory and create '.env' file with this contents
```
REDIRECT_URI=[your_redirect_url]
CLIENT_ID=[your client id]
CLIENT_SECRET=[your client secret]
```
4) Run 'npm innstall'
```
cd client && npm install
cd server && npm install
```
5) Start the application
```
cd client && npm run start
cd server && npm run devStart 
```
You can now access the UI on <http://localhost:4300>. which connects to backend server on <http://localhost:4001>

