# Use the official Nginx image
FROM nginx:alpine

# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy all portfolio files to the nginx html directory
COPY . /usr/share/nginx/html/

# Exclude Dockerfile and other unnecessary files (if needed)
# But keep all web assets
