FROM node:18.17.0-bullseye-slim

# Install Python 3, pip, and clean apt cache
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy server package definitions and install Node.js dependencies
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy AI services folder and set up python virtual environment
COPY ai-services ./ai-services/
RUN python3 -m venv /app/ai-services/venv
RUN /app/ai-services/venv/bin/pip install --upgrade pip
RUN /app/ai-services/venv/bin/pip install pandas scikit-learn

# Copy the remaining server codebase
COPY server ./server/

# Ensure uploads directory exists
RUN mkdir -p /app/server/uploads

WORKDIR /app/server

# Expose port and run the app
EXPOSE 5000
CMD ["node", "app.js"]
